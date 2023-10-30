import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { readFileSync } from 'fs';
const loadJSON = (path) => JSON.parse(readFileSync(path));

const en = loadJSON('./src/lib/i18n/en.json');
export const ARTICLES = Object.keys(en.text.article);
export const AVAILABLE_LOCALES = ['en', 'ru'];

const entries = AVAILABLE_LOCALES.map((locale) =>
	ARTICLES.map((article_name) => `/articles/${locale}/${article_name}/`))
	.reduce((acc, cur) => acc.concat(cur));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		prerender: {
			handleMissingId: (details) => {
				console.warn(details);
			},
			entries: ['*', ...entries,],
			handleEntryGeneratorMismatch: (details) => {
				console.warn(details);
			},
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		alias: {
			$lib: 'src/lib'
		}
	}
};

export default config;
