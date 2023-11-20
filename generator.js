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
	const cards = JSON.stringify(cars.map((title) => ({ title })));
	const query = cars.join(' vs ');
	const poster = `${query}`.replaceAll(' ', '_').toLowerCase();
	try {
		readFileSync(`./static/assets/img/${poster}.webp`);
	} catch (e) {
		imgs.push(poster);
	}
	const queries = Object.entries({
		en: `Write an article for the website: Reliability Comparison of ${query} based on statistics.`,
		ru: `Напиши статью для сайта: Сравнение надежности ${query} на основе статистики.`,
		de: `Schreiben Sie einen Artikel für die Website: Zuverlässigkeit Vergleich von ${query} anhand von Statistiken.`,
		es: `Escribe un artículo para el sitio web: Fiabilidad Comparación de ${query} basada en estadísticas.`,
		fr: `Rédigez un article pour le site web : Comparaison de la fiabilité de ${query} sur la base de statistiques.`,
		pt: `Escrever um artigo para o sítio Web: Comparação da fiabilidade de ${query} com base em estatísticas.`,
		jp: `ウェブサイトに記事を書く 統計に基づく${query} の信頼性比較。`,
		zh: `为网站撰写一篇文章： 根据统计数据比较 ${query} 的可靠性。`
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
	Promise.all(
		queries.map(([locale, content]) => generateArticle(locale, content, poster, url, cards))
	)
		.then(() => {
			info('Articles are done!');
		})
		.catch(error);
}

const readline = createInterface({
	input: process.stdin,
	output: process.stdout
});

readline.question('Enter car defects URL: ', (url) => {
	readline.close();
	generate(url);
});

function generateImg(name) {
	return openai.images
		.generate({
			model: 'dall-e-3',
			prompt: `${name.replaceAll('_', ' ')}, realistic, high-quality photos, UHD`,
			quality: 'hd',
			style: 'natural',
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
			model: 'gpt-4',
			messages: [{ role: 'user', content }],
			temperature: 1,
			max_tokens: 1024
		})
		.then((v) => {
			const filename = `src/lib/i18n/${locale}.json`;
			readFile(filename, 'utf8', (err, data) => {
				if (err) {
					return error(chalk.red(err));
				}
				if (!v.choices[0].message.content) {
					warn(v.choices[0].message);
					return;
				}
				const json = JSON.parse(data);
				json.text.article[poster] = {
					title: v.choices[0].message.content.slice(0, v.choices[0].message.content.indexOf('\n')),
					text: v.choices[0].message.content,
					url: decodeURIComponent(url),
					cards
				};
				writeFile(filename, JSON.stringify(json, null, 2), (err) => {
					err && error(chalk.red(err));
				});
			});
		})
		.catch(error);
}
