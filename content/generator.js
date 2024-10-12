import markdown from '@wcj/markdown-to-html';
import chalk from 'chalk';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';
import { get } from 'https';
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
	generateTopics(topics);
} catch (e) {
	error(e);
}
function saveTopic(topics = []) {
	try {
		const file = './content/topics.txt';
		writeFileSync(file, topics.join('\n'));
	} catch (e) {
		error(e);
	}
}

function log(filename, article_name, query) {
	openai.chat.completions
		.create({
			model: 'gpt-4o',
			messages: [{ role: 'user', content: query }],
			temperature: 1
		})
		// .then((v) => humanize(v.choices[0].message.content?.replaceAll('"', '').trim()))
		.then((v) => v.choices[0].message.content?.replaceAll('"', '').trim())
		.then((data) => {
			try {
				const file = './content/' + filename + '.txt';
				const content = readFileSync(file).toString();
				writeFileSync(
					file,
					`${content}\n\n\n-------------------------\n\n${article_name}\n${data}`
				);
			} catch (e) {
				error(e);
			}
		});
}
function generateTopics(topics) {
	const unposted = topics.find((t) => !t.includes(':generated'));
	if (!unposted) {
		return Promise.resolve(topics);
	}
	return generateByTopic(unposted)
		.catch(error)
		.then(() => {
			const unpostedIndex = topics.findIndex((t) => t == unposted);
			topics[unpostedIndex] = `${topics[unpostedIndex]}:generated`;
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
							const car_name_parts = car_name.split(/\s|\-/);
							const matches = Object.keys(data.models || {}).map((id) => {
								const parts = data.models[id].split(/\s|\-/);
								const match_amount = car_name_parts.reduce((match_amount, car_name_part) => {
									return match_amount + (parts.includes(car_name_part) ? 1 : 0);
								}, 0);
								return [id, match_amount];
							});
							const modelID = matches.sort((a, b) => b[1] - a[1])[0];
							if (modelID) {
								return { [car_name]: { modelID: modelID[0] } };
							}
							return null;
						});
				});
			return Promise.all(entities_fetching);
		})
		.then(dedub_entities)
		.then((entities) =>
			get_defects_for_entities_norm(entities).catch(() => get_defects_for_entities_total(entities))
		)
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
				url: `https://car-defects.com/#entity_params=${JSON.stringify(entities)}&${new URLSearchParams(
					{
						data_params: JSON.stringify(results[0].params)
					}
				)}`
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

function get_defects_for_entities_norm(entities = {}) {
	return get_defects_for_entities(
		{
			by_age: true,
			norm: true
		},
		entities
	);
}
function get_defects_for_entities_total(entities = {}) {
	return get_defects_for_entities(
		{
			by_age: true,
			total: true
		},
		entities
	);
}
/**
 *
 * @param {Record<string, Object>} entities
 * @returns {Promise<{car_name:string, data: Record<number, number>, entity:object, params:object}[]>}
 */
function get_defects_for_entities(params, entities = {}) {
	const ORIGIN = 'https://car-defects.com/data/defect/age';
	const fetching = Object.entries(entities).map(([car_name, entity]) => {
		const query = `${ORIGIN}?${new URLSearchParams({ ...entity, ...params })}`;
		return fetch(query)
			.then((res) => res.json())
			.then((data) => {
				if (Object.keys(data).length === 0) {
					throw new Error('no defects for ' + car_name);
				}
				return data;
			})
			.then((data) => ({ car_name, data, entity, params }));
	});
	return Promise.all(fetching);
}

function generateContent(topic, imgs = [], defects = [], url = '') {
	// const cards = JSON.stringify(imgs.map(({ name }) => ({ title: name })));
	const article_name = `${topic}`.replace(/\?|\.|\!|\s/gi, '-').toLowerCase();
	imgs.push({
		prompt: `${defects.map(([car_name, _]) => car_name).join(' vs ')}, comic style, without text, fullscreen –ar 2:1 `,
		name: article_name
	});

	info(`Wait for ChatGPT images generation: ${imgs.map((i) => i.name)}`);
	const image_generation = imgs.reduce(
		(chain, img_data, i) =>
			chain.then(() => generateImg(img_data)).then(() => waitMin(i === 0 ? 0 : 1)),
		Promise.resolve()
	);

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

	const article_query = `${prompt}, formalize everything in the form of  article "${topic}" of 10000 characters.
		Don’t Use Repetitive Sentences.
		use markdown markup.`;

	log(
		'video',
		`https://car-defects.com/articles/en/${article_name}`,
		`${prompt}, Generate prompt for the ai video maker to create a short video about "${topic}", add instructions: need to use north male voice, Limit video up to 59 sec, place subtitles at the bottom `
	);

	const queries = Object.entries({
		en: `${article_query}`,
		ru: `Write in Russian ${article_query}`,
		de: `Write in German ${article_query}`,
		es: `Write in Spanish ${article_query}`
	});
	const articles_generation = queries.reduce(
		(chain, [locale, content], i, arr) =>
			chain.then(() => generateArticle(article_name, locale, content, topic, url)),
		Promise.resolve()
	);

	// return articles_generation;
	return Promise.all([image_generation, articles_generation]);
}

function waitMin(delay = 1) {
	return new Promise((r) => {
		setTimeout(r, delay * 60 * 1000);
	});
}

function generateImg({ prompt, name }) {
	try {
		readFileSync(`./static/assets/img/${name}.png`);
		return Promise.resolve();
	} catch (e) {
		return openai.images
			.generate({
				model: 'dall-e-3',
				prompt,
				size: '1792x1024',
				quality: 'standard',
				n: 1
			})
			.then((res) => downloadImage(res.data[0].url, `./static/assets/img/${name}.png`))
			.then(() => {
				info(`ChatGPT has generated the ${name} image`);
			});
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

function generateArticle(article_name, locale, query, topic, url) {
	const filename = `src/lib/i18n/article_${locale}.json`;
	return readFile(filename, 'utf8').then((data) => {
		const json = JSON.parse(data);
		if (json.text.article[article_name]) {
			return;
		}
		const lang = {
			en: `generate`,
			ru: `generate in Russian `,
			de: `generate in German `,
			es: `generate in Spanish `
		};
		return waitMin()
			.then(() =>
				Promise.all(
					[
						query,
						`generate in ${lang[locale]} seo clickbait title for a technical article on the topic "${topic}"`,
						`generate in ${lang[locale]} seo description for a technical article on the topic "${topic}"`,
						`generate in ${lang[locale]} only list of seo keywords, less than 5, separated by comma, for a technical article on the topic "${topic}"`
					].map((query) =>
						openai.chat.completions
							.create({
								model: 'gpt-4o',
								messages: [{ role: 'user', content: query }],
								temperature: 1
							})
							// .then((v) => humanize(v.choices[0].message.content?.replaceAll('"', '').trim()))
							.then((v) => v.choices[0].message.content?.replaceAll('"', '').trim())
					)
				)
			)
			.then(([text, title, description, keywords]) => {
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

function getCars(topic) {
	return openai.chat.completions
		.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'user',
					content: `get list of car model names in article "${topic}" to compare, select only cars of the same class and price segment`
				}
			],
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
