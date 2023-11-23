import chalk from 'chalk';
import { createWriteStream, readFile, readFileSync, writeFile } from 'fs';
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
/**
 *
 * @param {string} url
 */
function generate(url) {
	// const decoded = decodeURIComponent(
	// 	new URL(url).hash.replaceAll('#entity_params=', '').replaceAll('+', ' ')
	// );
	// const cars = Object.keys(JSON.parse(decoded));
	const imgs = [];
	// cars.forEach((car) => {
	// 	try {
	// 		readFileSync(`./static/assets/img/${car}.webp`);
	// 	} catch (e) {
	// 		imgs.push(car);
	// 		// warn(chalk.yellow(`Do not forget to add '${car}.webp' image!`));
	// 	}
	// });
	const cards = "[{\"title\":\"Toyota Camry Engine\",},{\"title\":\"Honda Accord Engine\",}]";// JSON.stringify(cars.map((title) => ({ title })));
	// const query = cars.join(' vs ');
	const poster = 'reliability_of_toyota_camry_and_honda_accord_engines';// `${query}`.replaceAll(' ', '_').toLowerCase();
	try {
		readFileSync(`./static/assets/img/${poster}.webp`);
	} catch (e) {
		imgs.push(poster);
	}
	const prompt = `
	catchy article with higher CTR for analytics website about "Reliability of Toyota Camry and Honda Accord engines"
	explain why cars are reliable or not, 
	describe key technologies in details,
	Add a benefit-focused intro,
	get deep in car technical details
	be car expert,
	use SEO keywords: car,defects,reliability,comparison,statistics,
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
	// info(`Wait for ChatGPT images generation: ${imgs}`);
	// imgs.reduce(
	// 	(chain, name) =>
	// 		chain
	// 			.then(
	// 				() =>
	// 					new Promise((r) => {
	// 						setTimeout(r, 60000);
	// 					})
	// 			)
	// 			.then(() => generateImg(name)),
	// 	Promise.resolve()
	// );

	info('Wait for ChatGPT articles generation ....');
	queries
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
	// Promise.all(
	// 	queries.map(([locale, content]) => generateArticle(locale,query, content, poster, url, cards))
	// )
	// 	.then(() => {
	// 		info('Articles are done!');
	// 	})
	// 	.catch(error);
}

const readline = createInterface({
	input: process.stdin,
	output: process.stdout
});

readline.question('Enter car defects URL: ', (url) => {
	readline.close();
	generate(url);
});

// function generateImg(name) {
// 	return openai.images
// 		.generate({
// 			model: 'dall-e-3',
// 			prompt: `${name.replaceAll('_', ' ')}, realistic, high-quality photos, UHD`,
// 			quality: 'hd',
// 			style: 'natural',
// 			n: 1,
// 			size: `1792x1024`
// 		})
// 		.then((res) => downloadImage(res.data[0].url, `./static/assets/img/${name}.webp`))
// 		.then(() => {
// 			info(`ChatGPT has generated the ${name} image`);
// 		})
// 		.catch(error);
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

function generateArticle(locale, content, poster, url, cards) {
	return openai.chat.completions
		.create({
			model: 'gpt-4-1106-preview',
			messages: [{ role: 'user', content }],
			temperature: 1,
			max_tokens: 4000
		})
		.then((v) => {
			const filename = `src/lib/i18n/${locale}.json`;
			readFile(filename, 'utf8', (err, data) => {
				if (err) {
					return error(chalk.red(err));
				}
				const text = v.choices[0].message.content;
				if (!text) {
					warn(v.choices[0].message);
					return;
				}
				const json = JSON.parse(data);
				json.text.article[poster] = {
					title:text.split('\n\n')[0],
					text: text.replace(/\w+:/gi, ''),
					url: new URL(url).hash,
					cards
				};
				writeFile(filename, JSON.stringify(json, null, 2), (err) => {
					err && error(chalk.red(err));
				});
			});
		})
		.catch(error);
}
