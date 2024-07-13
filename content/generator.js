import markdown from '@wcj/markdown-to-html';
import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import { readFile, writeFile } from 'node:fs/promises';

import { OpenAI } from 'openai';
import { URL } from 'url';

const error = (e) => console.error(chalk.red(e.stack));
const warn = (w) => console.warn(chalk.yellow(w));
const info = (i) => console.log(chalk.green(i));

const UNDETECTABLE_TOKEN = '1752d5b0831fba23bb342338c68fc57e';
const UNDETECTEBLE_HEADERS = new Headers();
UNDETECTEBLE_HEADERS.append('x-humanizer-api-key', UNDETECTABLE_TOKEN);
UNDETECTEBLE_HEADERS.append('Content-Type', 'application/json');

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
	generateTopics(topics).then(saveTopic).catch(error);
} catch (error) {
	error(error);
}
function saveTopic(topics = []) {
	try {
		const file = './content/topics.txt';
		writeFileSync(file, topics.join('\n'));
	} catch (e) {
		error(e);
	}
}

function log(filename, query) {
	openai.chat.completions
		.create({
			model: 'gpt-4',
			messages: [{ role: 'user', content: query }],
			temperature: 1
		})
		// .then((v) => humanize(v.choices[0].message.content?.replaceAll('"', '').trim()))
		.then((v) => v.choices[0].message.content?.replaceAll('"', '').trim())
		.then((data) => {
			try {
				const file = './content/' + filename + '.txt';
				const content = readFileSync(file).toString();
				writeFileSync(file, `${content}\n\n\n-------------------------\n\n\n${data}`);
			} catch (error) {
				error(error);
			}
		});

}
function generateTopics(topics) {
	const unposted = topics.find((t) => !t.includes(':generated'));
	if (!unposted) {
		return Promise.resolve(topics);
	}
	const unpostedIndex = topics.findIndex((t) => t == unposted);
	topics[unpostedIndex] = `${topics[unpostedIndex]}:generated`;
	return generateByTopic(unposted)
		.catch(error)
		.then(() => {
			info(`${unposted} done`);
			saveTopic(topics);
			return generateTopics(topics);
		});
}

function generateByTopic(topic) {
	return getCars(topic)
		.then((cars = []) => {
			info(`Select ${cars} for topic ${topic}`);
			const entities_fetching = cars
				.map((car_name) => car_name.toLowerCase())
				.map((car_name) => {
					const query = `https://car-defects.com/data/search/?query=${encodeURI(car_name)}`;
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
			return Promise.all(entities_fetching);
		})
		.then(dedub_entities)
		.then(get_defects_for_entities)
		.then((results) => {
			const defects = results.map(({ car_name, data }) => [car_name, data]);
			if (defects.length < 2 || results.length < 2) {
				throw new Error(results.map(({ car_name }) => car_name).join() + ': no data');
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
	// const cards = JSON.stringify(imgs.map(({ name }) => ({ title: name })));
	// const article_name = `${topic}`.replace(/\?|\.|\!|\s/gi, '-').toLowerCase();
	// imgs.push({
	// 	prompt: `photorealistic poster for article "${topic}", add label ["car-defects.com"], use all width, no other text, –ar 2:1`,
	// 	name: article_name
	// });

	// info(`Wait for ChatGPT images generation: ${imgs.map((i) => i.name)}`);
	// const image_generation = imgs.reduce(
	// 	(chain, img_data, i, arr) =>
	// 		chain

	// 			.then(() => generateImg(img_data))
	// 			.then(() =>
	// 				i !== arr.length - 1
	// 					? new Promise((r) => {
	// 						setTimeout(r, 60000);
	// 					})
	// 					: Promise.resolve()
	// 			),
	// 	Promise.resolve()
	// );

	info('Wait for ChatGPT articles generation ....');

	// const articles_generation = Promise.resolve()
	// generateTableContentArticle(topic).then((content) => {
	// 	debugger;
	// });
	const prompt = `According to the car service calls statistics: 
	${defects.map(([car, data]) => `${car}: ${JSON.stringify(data)}`).join('\n')}, 
where the key is the age of the car at the time of contacting the car service, 
and the value is  number of service calls per 10000 cars sold. 
Do not add this data to the result.
Analyze the data in the graph, compare the cars in terms of reliability,
draw conclusions, explain the results from the technical point of view, 
describe the design features of the cars, use maximum technical details,
`;

	const article_query = `${prompt}, formalize everything in the form of a technical article on the topic "${topic}" of 10000 characters of the automobile website.
		Don’t Use Repetitive Sentences.
		use markdown markup.`;

	log('video', `${prompt}, generate a prompt for ai video generator  to create a short 60 sec video about "${topic}", need to use north male voice. `);

	const queries = Object.entries({
		en: `${article_query}`,
		ru: `Write in Russian ${article_query}`,
		// de: `Write in German ${prompt}`,
		// es: `Write in Spanish ${prompt}`
		// fr: `Write in French ${prompt}`,
		// pt: `Write in Portuguese ${prompt}`,
		// jp: `Write in Japanese ${prompt}`,
		// zh: `Write in Chinese ${prompt}`
	});
	const articles_generation = queries.reduce(
		(chain, [locale, content], i, arr) =>
			chain
				.then(() => generateArticle(locale, content, topic, url))
				.then(() =>
					i === arr.length - 1
						? Promise.resolve()
						: new Promise((r) => {
							setTimeout(r, 60000);
						})
				),
		Promise.resolve()
	);

	return articles_generation;
	// return Promise.all([image_generation, articles_generation]);
}

// function generateImg({ prompt, name, cfg }) {
// 	try {
// 		readFileSync(`./static/assets/img/${name}.png`);
// 		return Promise.resolve();
// 	} catch (e) {
// 		return openai.images
// 			.generate({
// 				model: 'dall-e-3',
// 				prompt,
// 				size: '1792x1024',
// 				quality: 'hd',
// 				style: 'vivid',
// 				n: 1
// 			})
// 			.then((res) => downloadImage(res.data[0].url, `./static/assets/img/${name}.png`))
// 			.then(() => {
// 				info(`ChatGPT has generated the ${name} image`);
// 			})
// 			.catch(error);
// 	}
// }

// function downloadImage(url, filename) {
// 	return new Promise((resolve, reject) => {
// 		get(url, (res) => {
// 			res
// 				.pipe(createWriteStream(filename))
// 				.on('error', reject)
// 				.once('close', () => resolve(filename));
// 		});
// 	});
// }

function generateArticle(locale, query, topic, url) {
	const article_name = `${topic}`.replace(/\?|\.|\!|\s/gi, '-').toLowerCase();
	const filename = `src/lib/i18n/${locale}.json`;
	return readFile(filename, 'utf8').then((data) => {
		const json = JSON.parse(data);
		if (json.text.article[article_name]) {
			return;
		}
		return Promise.all(
			[
				query,
				`generate in ${locale} seo clickbait title for a technical article on the topic "${topic}" for the specialists of the automobile website`,
				`generate in ${locale} seo description for a technical article on the topic "${topic}" for the specialists of the automobile website`,
				`generate in ${locale} only list of seo keywords, less than 5, separated by comma, for a technical article on the topic "${topic}" for the specialists of the automobile website`
			].map((query) =>
				openai.chat.completions
					.create({
						model: 'gpt-4',
						messages: [{ role: 'user', content: query }],
						temperature: 1
					})
					// .then((v) => humanize(v.choices[0].message.content?.replaceAll('"', '').trim()))
					.then((v) => v.choices[0].message.content?.replaceAll('"', '').trim())
			)
		).then(([text, title, description, keywords]) => {
			json.text.article[article_name] = {
				title,
				text: markdown(text),
				url: url ? new URL(url).hash : '-',
				// cards,
				keywords,
				description
			};
			return writeFile(filename, JSON.stringify(json, null, 2));
		});
	});
}

// function getTableContentArticle(topic) {
// 	return openai.chat.completions
// 		.create({
// 			model: 'gpt-3.5-turbo-16k-0613',
// 			messages: [
// 				{
// 					role: 'user',
// 					content: `create a table of contents for a comprehensive article "${topic}"`
// 				}
// 			],
// 			temperature: 0.4
// 		})
// 		.then((v) =>
// 			v.choices[0].message.content
// 				?.split('\n')
// 				.filter((line) => /\d+\.\s*/.test(line))
// 				.filter(Boolean)
// 		)
// 		.catch(error);
// }

function getCars(topic) {
	return openai.chat.completions
		.create({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: `get list of car  model names of "${topic}"` }],
			temperature: 0.1
		})
		.then((v) =>
			v.choices[0].message.content
				?.split('\n')
				.filter((line) => /\d+\.\s*/.test(line))
				.map((c) => c.replace(/\d+\.\s*/, '').trim())
				.filter(Boolean)
		);
}

// function humanize(text) {
// 	return Promise.resolve(text);
// 	return new Promise((resolve, reject) => {
// 		if (!text) {
// 			return reject('no content');
// 		}
// 		let document_id;
// 		// fetch("https://damp-badlands-45642.herokuapp.com/humanizer", {
// 		// 	"headers": {
// 		// 	  "accept": "application/json",
// 		// 	  "accept-language": "en-US,en;q=0.9,ru;q=0.8",
// 		// 	  "content-type": "application/json",
// 		// 	  "sec-ch-ua": "\"Chromium\";v=\"124\", \"Opera\";v=\"110\", \"Not-A.Brand\";v=\"99\"",
// 		// 	  "sec-ch-ua-mobile": "?0",
// 		// 	  "sec-ch-ua-platform": "\"macOS\"",
// 		// 	  "sec-fetch-dest": "empty",
// 		// 	  "sec-fetch-mode": "cors",
// 		// 	  "sec-fetch-site": "same-origin",
// 		// 	  "x-humanizer-api-key": "1752d5b0831fba23bb342338c68fc57e",
// 		// 	  "Referer": "https://damp-badlands-45642.herokuapp.com/docs",
// 		// 	  "Referrer-Policy": "strict-origin-when-cross-origin"
// 		// 	},
// 		// 	"body": "{\n  \"text\": \"Example text to humanize\"\n}",
// 		// 	"method": "POST"
// 		//  });
// 		fetch("https://damp-badlands-45642.herokuapp.com/humanizer", {
// 			method: 'POST',
// 			headers: UNDETECTEBLE_HEADERS,
// 			body: JSON.stringify({
// 				text,
// 			}),
// 			redirect: 'follow'
// 		})
// 			.then(response => response.json())
// 			.catch(reject)
// 			.then((response) => {
// 				document_id = response.shareToken;
// 				if (!document_id) {
// 					throw new Error(JSON.stringify(response, null, 2));
// 				}
// 				setTimeout(check, 30000);
// 			});

// 		function check() {
// 			return fetch(`https://damp-badlands-45642.herokuapp.com/humanizer/check-status/${document_id}`, {
// 				method: 'GET',
// 				headers: UNDETECTEBLE_HEADERS,
// 				redirect: 'follow'
// 			})
// 				.then(response => response.json())
// 				.then(result => {
// 					if (result.status === "COMPLETED") {
// 						return resolve(result.humanizedContent);
// 					}
// 					if (result.status === "IN-PROGRESS") {
// 						return setTimeout(check, 30000);
// 					}
// 					throw new Error(result.error);
// 				})
// 				.catch(reject);
// 		}
// 	});
// }
