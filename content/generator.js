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
	const topics = readFileSync(file).toString().split('\n');
	generateTopics(topics)
		.then((topics) => {
			writeFileSync(file, topics.join('\n'));
		})
		.catch(console.error);
} catch (error) {
	console.error(error);
}

function log(filename, data) {
	try {
		const file = './content/' + filename + '.txt';
		const content = readFileSync(file).toString();
		writeFileSync(file, `${content}\n\n${data}`);
	} catch (error) {
		console.error(error);
	}
}
function generateTopics(topics) {
	const unposted = topics.find((t) => !t.includes(':generated'));
	if (!unposted) {
		return Promise.resolve(topics);
	}
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
			const entities_fetching = cars
				.map((car_name) => car_name.toLowerCase())
				.map((car_name) => {
					const query = `https://car-defects.com/data/search/?query=${car_name}`;
					return fetch(query)
						.then((res) => res.json())
						.then((data) => {
							const modelID = Object.keys(data.models || {}).find((id) =>
								car_name.includes(data.models[id])
							);
							if (modelID) {
								return { [car_name]: { modelID } };
							}
							return null;
						})
						.catch(error);
				});
			return Promise.all(entities_fetching)
				.then(dedub_entities)
				.then(get_defects_for_entities)
				.then((results) => {
					const defects = results.map(({ car_name, data }) => [car_name, data]);
					if (defects.length === 0 || results.length == 0) {
						throw new Error('no data');
					}
					const entities = results.reduce(
						(acc, { car_name, entity }) => Object.assign(acc, { [car_name]: entity }),
						{}
					);
					return {
						// imgs: cars.map((name) => ({
						// 	prompt: ` realistic ${name} photo, , ultra detailed,  the car plate text ["car-defects.com"], illustration for article, –ar 2:1`,
						// 	name: name.toLowerCase(),
						// })),
						imgs: [],
						defects,
						url: `https://car-defects.com/#entity_params=${encodeURI(
							JSON.stringify(entities)
						)}&data_params=${encodeURI(JSON.stringify({ norm: true, by_age: true }))}`
					};
				});
		})
		.then(({ url, imgs, defects }) => generateContent(topic, imgs, defects, url));
}

function dedub_entities(entities) {
	const entity_params = entities.filter(Boolean).reduce((acc, cur) => Object.assign(acc, cur), {});

	const params_reversed = Object.fromEntries(
		Object.entries(entity_params).map(([title, params]) => [JSON.stringify(params), title])
	);
	const params = Object.fromEntries(
		Object.entries(params_reversed).map(([params, title]) => [title, JSON.parse(params)])
	);
	return Object.fromEntries(Object.entries(params));
}

/**
 *
 * @param {Record<string, Object>} entities
 * @returns {Promise< Object[]>}
 */
function get_defects_for_entities(entities = {}) {
	const fetching = Object.entries(entities).map(([car_name, entity]) => {
		const query = `https://car-defects.com/data/defect/age?${new URLSearchParams(
			entity
		)}&by_age=true&norm=true`;
		return fetch(query)
			.then((res) => res.json())
			.then((data) => {
				if (Object.keys(data).length === 0) {
					return null;
				}
				return { car_name, data, entity };
			})
			.catch(error);
	});
	return Promise.all(fetching).then((defects) => defects.filter(Boolean).slice(0, 4));
}
function generateContent(topic, imgs = [], defects = [], url = '') {
	const cards = JSON.stringify(imgs.map(({ name }) => ({ title: name })));
	// const article_name = `${topic}`.replace(/\?|\.|\!|\s/gi, '-').toLowerCase();
	// imgs.push({
	// 	prompt: `photorealistic poster for article "${topic}", add label ["car-defects.com"], use all width, no other text, –ar 2:1`,
	// 	name: article_name
	// });

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
	const prompt = `According to the car service calls statistics: 
	${defects.map(([car, data]) => `${car}: ${JSON.stringify(data, null, 2)}`).join('\n')}, 
where the key is the age of the car at the time of contacting the car service, 
and the value is  number of service calls per 10000 cars sold. 
Analyze the data in the graph, compare the cars in terms of reliability,
draw conclusions, explain the results from the technical point of view, describe the design features of the cars, use maximum technical details,`;

	// log('video', `generate a short 60 sec video about "${topic}", use north male voice. ${prompt}`);

	const queries = Object.entries({
		en: `${prompt} formalize everything in the form of a technical article of 10000 characters for the specialists of the automobile website.
		Don’t Use Repetitive Sentences.`
		// ru: `Write in Russian ${prompt}`,
		// de: `Write in German ${prompt}`,
		// es: `Write in Spanish ${prompt}`
		// fr: `Write in French ${prompt}`,
		// pt: `Write in Portuguese ${prompt}`,
		// jp: `Write in Japanese ${prompt}`,
		// zh: `Write in Chinese ${prompt}`
	});
	const articles_generation = queries
		.reduce(
			(chain, [locale, content], i, arr) =>
				chain
					.then(() => generateArticle(locale, content, topic, url, cards))
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

function generateArticle(locale, query, topic, url, cards) {
	const article_name = `${topic}`.replace(/\?|\.|\!|\s/gi, '-').toLowerCase();
	const filename = `src/lib/i18n/${locale}.json`;
	return readFile(filename, 'utf8')
		.then((data) => {
			const json = JSON.parse(data);
			if (json.text.article[article_name]) {
				return;
			}
			return openai.chat.completions
				.create({
					model: 'gpt-4o',
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
					// const title =
					// 	text.includes('\n\n') && text.split('\n\n')[0].length < 200
					// 		? text.split('\n\n')[0]
					// 		: `${text.slice(
					// 				0,
					// 				/\?|\.|\!/.exec(text.slice(0, 70))?.index || text.lastIndexOf(' ', 200)
					// 			)}...`;
					json.text.article[article_name] = {
						title: topic,
						text,
						// text: text.replace(title, ''),
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
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: `what are car model names of "${topic}"?` }],
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
