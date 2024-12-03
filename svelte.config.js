import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import https from 'https';

import { readFileSync, writeFileSync, readdirSync } from 'fs';
// import { vitePreprocess } from '@sveltejs/kit/vite';
const loadJSON = (path) => JSON.parse(readFileSync(path, 'utf-8'));

const ARTICLES = loadJSON('./src/lib/i18n/articles.json');
export const AVAILABLE_LOCALES = Object.keys(ARTICLES);
const ARTICLES_NAMES = Object.entries(ARTICLES).map(([locale, articles]) =>
	Object.keys(articles).map((article) => `/articles/${locale}/${article}/`)
);

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
const entries = ARTICLES_NAMES.reduce((acc, cur) => acc.concat(cur), []).concat(
	models
		.map(({ id, name }) =>
			[`/defects/${id}/${name}/`].concat(categories.map((cat) => `/defects/${id}/${name}/${cat}`))
		)
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
