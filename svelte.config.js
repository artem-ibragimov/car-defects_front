import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import https from 'https';

import { readFileSync, writeFileSync } from 'fs';
// import { vitePreprocess } from '@sveltejs/kit/vite';
const loadJSON = (path) => JSON.parse(readFileSync(path));

const en = loadJSON('./src/lib/i18n/article_en.json');
export const ARTICLES = Object.keys(en.text.article);
export const AVAILABLE_LOCALES = ['en', 'ru' /* 'de', 'ru', 'es''fr','jp', 'pt',  'zh' */];

/**
"1": "transmission",
"2": "safety",
"3": "other",
"4": "engine",
"5": "equipment",
"6": "electronics",
"7": "brake",
"8": "light",
"9": "suspension"
 */
const categories = [
	'transmission',
	'safety',
	'other',
	'engine',
	'equipment',
	'electronics',
	'brake',
	'light',
	'suspension'
];
// writeFileSync('./google.txt', ARTICLES.map((article_name) => `https://car-defects.com//articles/en/${article_name}/`).join('\n'))
// const models = await getTopReliableModels();
const models = [] || (await getTopReliableModels());
const entries = AVAILABLE_LOCALES.map((locale) =>
	ARTICLES.map((article_name) => `/articles/${locale}/${article_name}/`)
)
	.reduce((acc, cur) => acc.concat(cur), [])
	.concat(
		models
			.map(({ id, name }) => categories.map((cat) => `/defects/${id}/${name}/${cat}`))
			.reduce((acc, cur) => acc.concat(cur), [])
	);
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	// preprocess: vitePreprocess(),
	preprocess: preprocess({
		preserve: ['ld+json']
	}),

	kit: {
		inlineStyleThreshold: 4096,
		prerender: {
			concurrency: 1,
			crawl: false,
			handleHttpError: (details) => {
				console.warn(details);
			},
			origin: 'https://car-defects.com',
			handleMissingId: (details) => {
				console.warn(details);
			},
			entries: ['*', '/chart_only', ...entries],
			handleEntryGeneratorMismatch: (details) => {
				console.warn(details);
			}
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		alias: {
			$lib: 'src/lib'
		}
	}
};

export default config;

function getTopReliableModels() {
	return new Promise((resolve, reject) => {
		https
			.get(`https://car-defects.com/data/stat/top/reliable/model`, (res) => {
				let data = [];

				res.on('data', (chunk) => {
					data.push(chunk);
				});

				res.on('end', () => {
					const models = JSON.parse(Buffer.concat(data).toString());
					resolve(
						models.map((v) => {
							const [id, name, ...rest] = v.split('|');
							return { id, name: name.replaceAll(' ', '_') };
						})
					);
				});
			})
			.on('error', reject);
	});
}
