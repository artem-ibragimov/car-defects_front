import chalk from 'chalk';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';
import { readFile, writeFile } from 'node:fs/promises';

import { get } from 'https';
import { OpenAI } from 'openai';
import { URL } from 'url';

const error = (e) => console.error(chalk.red(e));
const warn = (w) => console.warn(chalk.yellow(w));
const info = (i) => console.log(chalk.green(i));

const PUBLIC_CHAT_GPT_API_KEY = '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';
const PUBLIC_CHAT_GPT_ORG_ID = 'org-0tXr3nALnhu8yFaZg68mwWcN';

const configuration = {
	apiKey: PUBLIC_CHAT_GPT_API_KEY,
	organization: PUBLIC_CHAT_GPT_ORG_ID,
	dangerouslyAllowBrowser: true
};
const openai = new OpenAI(configuration);

try {
	const file = './content/topics.txt';
	const topics = readFileSync(file).toString().split('\n').sort();
	generateTopics(topics)
		.then((topics) => {
			writeFileSync(file, topics.join('\n'));
		})
		.catch(console.error);
} catch (error) {
	console.error(error);
}

function generateTopics(topics) {
	const unposted = topics.find((t) => !t.includes(':generated'));
	const unpostedIndex = topics.findIndex((t) => t == unposted);
	topics[unpostedIndex] = `${topics[unpostedIndex]}:generated`;
	return generateByTopic(unposted)
		.catch((e) => {
			console.error(e);
			return generateTopics(topics);
		})
		.then(() => topics);
}

function generateByTopic(topic) {
	return getCars(topic)
		.then((cars = []) => {
			info(`Select ${cars} for topic ${topic}`);
			const fetching = cars
				.map((car_name) => car_name.toLowerCase())
				.map((car_name) => {
					const query = `https://car-defects.com/data/search/?query=${car_name}`;
					return fetch(query)
						.then((res) => res.json())
						.then((data) => {
							const genID = Object.keys(data.gens || {}).find((id) =>
								car_name.includes(data.gens[id])
							);
							if (genID) {
								return { [car_name]: { genID } };
							}
							const modelID = Object.keys(data.models || {}).find((id) =>
								car_name.includes(data.models[id])
							);
							if (modelID) {
								return { [car_name]: { modelID } };
							}
							const brandID = Object.keys(data.brands || {}).find((id) =>
								car_name.includes(data.brands[id])
							);
							if (brandID) {
								return { [car_name]: { brandID } };
							}
							return null;
						})
						.catch(error);
				});
			return Promise.all(fetching).then((results) => {
				const entity_params = results
					.filter(Boolean)
					.slice(0, 3)
					.reduce((acc, cur) => Object.assign(acc, cur), {});

				const params_reversed = Object.fromEntries(
					Object.entries(entity_params).map(([title, params]) => [JSON.stringify(params), title])
				);
				const params = Object.fromEntries(
					Object.entries(params_reversed).map(([params, title]) => [title, JSON.parse(params)])
				);
				if (Object.keys(params).length < 2) {
					throw new Error('no original cars');
				}
				return {
					// imgs: cars.map((name) => ({
					// 	prompt: ` realistic ${name} photo, , ultra detailed,  the car plate text ["car-defects.com"], illustration for article, –ar 2:1`,
					// 	name: name.toLowerCase(),
					// })),
					imgs: [],
					cars,
					url: `https://car-defects.com/#entity_params=${encodeURI(
						JSON.stringify(params)
					)}&data_params=${encodeURI(JSON.stringify({ total: true, by_age: true }))}`
				};
			});
		})
		.then(({ cars, url, imgs }) => generateContent(topic, imgs, cars, url));
}

function generateContent(topic, imgs = [], cars = [], url = '') {
	const cards = JSON.stringify(imgs.map(({ name }) => ({ title: name })));
	const article_name = `${topic}`.replace(/\?|\.|\!|\s/gi, '-').toLowerCase();
	imgs.push({
		prompt: ` photorealistic ${cars.join(
			' and '
		)}, add label ["car-defects.com"], use all width, no other text, –ar 2:1`,
		// poster for article "${topic}",
		name: article_name
	});

	info(`Wait for ChatGPT images generation: ${imgs.map((i) => i.name)}`);
	const image_generation = imgs.reduce(
		(chain, img_data, i, arr) =>
			chain

				.then(() => generateImg(img_data))
				.then(() =>
					i !== arr.length - 1
						? new Promise((r) => {
								setTimeout(r, 60000);
							})
						: Promise.resolve()
				),
		Promise.resolve()
	);

	info('Wait for ChatGPT articles generation ....');

	// const articles_generation = Promise.resolve()
	// generateTableContentArticle(topic).then((content) => {
	// 	debugger;
	// });
	const prompt = `
	catchy professional article for analytics website about "${topic}",
	compare cars by service call statistics,
	describe technical details,
	Add Personal Experience
	Don’t Use Repetitive Sentences,
	`;
	const queries = Object.entries({
		en: `Write ${prompt}`,
		ru: `Write in Russian ${prompt}`,
		de: `Write in German ${prompt}`
		// es: `Write in Spanish ${prompt}`,
		// fr: `Write in French ${prompt}`,
		// pt: `Write in Portuguese ${prompt}`,
		// jp: `Write in Japanese ${prompt}`,
		// zh: `Write in Chinese ${prompt}`
	});
	const articles_generation = queries
		.reduce(
			(chain, [locale, content], i, arr) =>
				chain
					.then(() => generateArticle(locale, content, article_name, url, cards))
					.then(() =>
						i === arr.length - 1
							? Promise.resolve()
							: new Promise((r) => {
									setTimeout(r, 60000);
								})
					),
			Promise.resolve()
		)
		.catch(error);

	return Promise.all([image_generation, articles_generation]);
}

function generateImg({ prompt, name, cfg }) {
	try {
		readFileSync(`./static/assets/img/${name}.png`);
		return Promise.resolve();
	} catch (e) {
		return openai.images
			.generate({
				model: 'dall-e-3',
				prompt,
				size: '1792x1024',
				quality: 'hd',
				style: 'vivid',
				n: 1
			})
			.then((res) => downloadImage(res.data[0].url, `./static/assets/img/${name}.png`))
			.then(() => {
				info(`ChatGPT has generated the ${name} image`);
			})
			.catch(error);
	}
}

function downloadImage(url, filename) {
	return new Promise((resolve, reject) => {
		get(url, (res) => {
			res
				.pipe(createWriteStream(filename))
				.on('error', reject)
				.once('close', () => resolve(filename));
		});
	});
}

function generateArticle(locale, query, article_name, url, cards) {
	const filename = `src/lib/i18n/${locale}.json`;
	return readFile(filename, 'utf8')
		.then((data) => {
			const json = JSON.parse(data);
			if (json.text.article[article_name]) {
				return;
			}
			return openai.chat.completions
				.create({
					model: 'gpt-3.5-turbo-16k-0613',
					messages: [{ role: 'user', content: query }],
					temperature: 0.4
				})
				.then((v) => {
					let text = v.choices[0].message.content?.replaceAll('"', '');
					if (!text) {
						warn(v.choices[0].message);
						return;
					}

					text = text
						.replace('Title:', '')
						.replace('Introduction:', '')
						.replace('Titel:', '')
						.replace('Einleitung:', '')
						.replace('Заголовок:', '')
						.replace('Вступление:', '')
						.replace('Вступительный абзац:', '')
						.trim();
					const title =
						text.includes('\n\n') && text.split('\n\n')[0].length < 100
							? text.split('\n\n')[0]
							: `${text.slice(
									0,
									/\?|\.|\!/.exec(text.slice(0, 70))?.index || text.lastIndexOf(' ', 100)
								)}...`;
					json.text.article[article_name] = {
						title: title,
						text: text.replace(title, ''),
						url: url ? new URL(url).hash : '-',
						cards
					};
					return writeFile(filename, JSON.stringify(json, null, 2));
				});
		})
		.catch(error);
}

function getTableContentArticle(topic) {
	return openai.chat.completions
		.create({
			model: 'gpt-3.5-turbo-16k-0613',
			messages: [
				{
					role: 'user',
					content: `create a table of contents for a comprehensive article "${topic}"`
				}
			],
			temperature: 0.4
		})
		.then((v) =>
			v.choices[0].message.content
				?.split('\n')
				.filter((line) => /\d+\.\s*/.test(line))
				.filter(Boolean)
		)
		.catch(error);
}

function getCars(topic) {
	return openai.chat.completions
		.create({
			model: 'gpt-3.5-turbo-1106',
			messages: [{ role: 'user', content: `what is top 3 car model names of "${topic}"?` }],
			temperature: 0.1
		})
		.then((v) =>
			v.choices[0].message.content
				?.split('\n')
				.filter((line) => /\d+\.\s*/.test(line))
				.map((c) => c.replace(/\d+\.\s*/, '').trim())
				.filter(Boolean)
		)
		.catch(error);
}
