import chalk from 'chalk';
import { createWriteStream, readFile, readFileSync, writeFile, writeFileSync } from 'fs';
import { get } from 'https';
import { OpenAI } from 'openai';
import { createInterface } from 'readline';

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
	return generate(topic);
}

function generateByUrl(url) {
	const decoded = decodeURIComponent(
		new URL(url).hash.replaceAll('#entity_params=', '').replaceAll('+', ' ')
	);
	const cars = Object.keys(JSON.parse(decoded));
	const imgs = [];
	cars.forEach((car) => {
		try {
			readFileSync(`./static/assets/img/${car}.webp`);
		} catch (e) {
			imgs.push(car);
			// warn(chalk.yellow(`Do not forget to add '${car}.webp' image!`));
		}
	});
	return generate(
		`Reliability Comparison of ${cars.join(' vs ')} based on Statistics`,
		imgs,
		cars.map((title) => ({ title }))
	);
}

function generate(query, imgs = [], cars = [], url = '') {
	const cards = JSON.stringify(cars);
	const poster = `${query}`.replaceAll(' ', '-').toLowerCase();
	try {
		readFileSync(`./static/assets/img/${poster}.webp`);
	} catch (e) {
		imgs.push(poster);
	}
	const prompt = `
	catchy professional article with higher CTR for analytics website about "${query} "
	describe technical details, use sarcastic tone, 
	Add a benefit-focused intro, refer on car-defects.com website,
	`;
	const queries = Object.entries({
		en: `Write ${prompt}`,
		ru: `Write in Russian ${prompt}`,
		de: `Write in German ${prompt}`,
		es: `Write in Spanish ${prompt}`,
		fr: `Write in French ${prompt}`,
		pt: `Write in Portuguese ${prompt}`,
		jp: `Write in Japanese ${prompt}`,
		zh: `Write in Chinese ${prompt}`
	});
	warn(`Need images:\n ${imgs.join('\n')}`);
	info(`Wait for ChatGPT images generation: ${imgs}`);
	const image_generation = imgs.reduce(
		(chain, name) =>
			chain
				.then(
					() =>
						new Promise((r) => {
							setTimeout(r, 60000);
						})
				)
				.then(() => generateImg(name)),
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
					.then(() => generateArticle(locale, content, poster, url, cards)),
			Promise.resolve()
		)
		.catch(error);

	return Promise.all([image_generation, articles_generation]);
}

// const readline = createInterface({
// 	input: process.stdin,
// 	output: process.stdout
// });

// readline.question('Enter car defects URL: ', (url) => {
// 	readline.close();
// 	generateByUrl(url);
// });

function generateImg(name) {
	return openai.images
		.generate({
			model: 'dall-e-3',
			prompt: `real car toy, photorealistic, poster for article "${name.replaceAll('-', ' ')}, 
			, close-up,  –ar 2:1"`,
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

function generateArticle(locale, content, poster, url, cards) {
	return openai.chat.completions
		.create({
			model: 'gpt-3.5-turbo-1106',
			messages: [{ role: 'user', content }],
			temperature: 0.9
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
				const title = text.includes('\n\n') && text.split('\n\n')[0].length < 60
					? text.split('\n\n')[0]
					: text.slice(0, /\?|\.|\!/.exec(text.slice(0, 50))?.index || text.lastIndexOf(' ', 50));
				json.text.article[poster] = {
					title: `${title}...`,
					text,
					url: url ? new URL(url).hash : '',
					cards
				};
				writeFile(filename, JSON.stringify(json, null, 2), (err) => {
					err && error(chalk.red(err));
				});
			});
		})
		.catch(error);
}
