import chalk from 'chalk';
import { createWriteStream, readFile, readFileSync, writeFile, writeFileSync } from 'fs';
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
	const unposted = topics.filter((t) => !t.includes(':generated'))[0];
	generateByTopic(unposted)
		.then(() => {
			const unpostedIndex = topics.findIndex((t) => t == unposted);
			topics[unpostedIndex] = `${topics[unpostedIndex]}:generated`;
			writeFileSync(file, topics.join('\n'));
		})
		.catch(console.error);
} catch (error) {
	console.error(error);
}

function generateByTopic(topic) {
	return getCars(topic)
		.then((cars = []) => {
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
							throw new Error('no data');
						});
				});
			return Promise.all(fetching)
				.then((results) => {
					const entity_params = results.reduce((acc, cur) => Object.assign(acc, cur), {});
					return {
						imgs: cars.map((name) => ({
							prompt: `hyper realistic ${name} car toy is moving on table, close-up, article illustration, the car plate text ["car-defects.com"], –ar 2:1`,
							name: name.toLowerCase()
						})),
						cars: cars.map((title) => ({ title: title.toLowerCase() })),
						url: `https://car-defects.com/#entity_params=${encodeURI(
							JSON.stringify(entity_params)
						)}&data_params=${encodeURI(JSON.stringify({ total: true, by_age: true }))}`
					};
				})
				.catch(() => {
					return {
						imgs: [],
						cars: [],
						url: `https://car-defects.com/#entity_params=${encodeURI(
							JSON.stringify({})
						)}&data_params=${encodeURI(JSON.stringify({}))}`
					};
				});
		})
		.then(({ cars, url, imgs }) => generate(topic, imgs, cars, url));
}

// function generateByUrl(url) {
// 	const decoded = decodeURIComponent(
// 		new URL(url).hash.replaceAll('#entity_params=', '').replaceAll('+', ' ')
// 	);
// 	const cars = Object.keys(JSON.parse(decoded));
// 	const imgs = [];
// 	cars.forEach((car) => {
// 		try {
// 			readFileSync(`./static/assets/img/${car}.webp`);
// 		} catch (e) {
// 			imgs.push(car);
// 			// warn(chalk.yellow(`Do not forget to add '${car}.webp' image!`));
// 		}
// 	});
// 	return generate(
// 		`Reliability Comparison of ${cars.join(' vs ')} based on Statistics`,
// 		imgs,
// 		cars.map((title) => ({ title }))
// 	);
// }

function generate(topic, imgs = [], cars = [], url = '') {
	const cards = JSON.stringify(cars);
	const poster = `${topic}`.replaceAll(' ', '-').toLowerCase();
	imgs.push({
		prompt: `hyper realistic poster for article "${topic}", the text ["${topic}"], ${cars.map((c)=>c.title).join(', ')} fullscreen –ar 2:1`,
		name: poster
	});
	const prompt = `
	catchy professional article with higher CTR for analytics website about "${topic} "
	describe technical details, use sarcastic tone, 
	Add a benefit-focused intro, refer on car-defects.com website,
	`;
	const queries = Object.entries({
		// en: `Write ${prompt}`,
		// ru: `Write in Russian ${prompt}`,
		// de: `Write in German ${prompt}`,
		// es: `Write in Spanish ${prompt}`,
		// fr: `Write in French ${prompt}`,
		// pt: `Write in Portuguese ${prompt}`,
		// jp: `Write in Japanese ${prompt}`,
		// zh: `Write in Chinese ${prompt}`
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
	const articles_generation = queries
		.reduce(
			(chain, [locale, content]) =>
				chain
					.then(
						() =>
							new Promise((r) => {
								setTimeout(r, 60000);
							})
					)
					.then(() => generateArticle(locale, topic, content, poster, url, cards)),
			Promise.resolve()
		)
		.catch(error);

	return Promise.all([image_generation, articles_generation]);
}

function generateImg({ prompt, name }) {
	try {
		readFileSync(`./static/assets/img/${name}.webp`);
		return Promise.resolve();
	} catch (e) {
		return openai.images
			.generate({
				model: 'dall-e-3',
				prompt,
				quality: 'standard',
				style: 'vivid',
				n: 1,
				size: `1792x1024`
			})
			.then((res) => downloadImage(res.data[0].url, `./static/assets/img/${name}.webp`))
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

function generateArticle(locale, topic, content, poster, url, cards) {
	return openai.chat.completions
		.create({
			model: 'gpt-3.5-turbo-1106',
			messages: [{ role: 'user', content }],
			temperature: 1
		})
		.then((v) => {
			const filename = `src/lib/i18n/${locale}.json`;
			readFile(filename, 'utf8', (err, data) => {
				if (err) {
					return error(chalk.red(err));
				}
				const text = v.choices[0].message.content?.replace('"', '');
				if (!text) {
					warn(v.choices[0].message);
					return;
				}
				const json = JSON.parse(data);
				const title =
					locale == 'en'
						? topic
						: text.includes('\n\n') && text.split('\n\n')[0].length < 70
						? text.split('\n\n')[0]
						: text.slice(0, /\?|\.|\!/.exec(text.slice(0, 70))?.index || text.lastIndexOf(' ', 70));
				json.text.article[poster] = {
					title: `${title}...`,
					text,
					url: url ? new URL(url).hash : '-',
					cards
				};
				writeFile(filename, JSON.stringify(json, null, 2), (err) => {
					err && error(chalk.red(err));
				});
			});
		})
		.catch(error);
}

function getCars(topic) {
	return openai.chat.completions
		.create({
			model: 'gpt-3.5-turbo-1106',
			messages: [{ role: 'user', content: `what are top 4 car model name of "${topic}"?` }],
			temperature: 1
		})
		.then((v) => v.choices[0].message.content?.split('\n').map((c) => c.replace(/\d+\.\s*/, '')))
		.catch(error);
}
