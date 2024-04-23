import { DEFAUL_LOCALE } from '$lib/store/locale.store.js';
import { appInit } from '$lib/store/main.store.js';

export const trailingSlash = 'always';
export const prerender = true;
export const ssr = true;
export const csr = true;

export const load = async (e) => {
	await appInit({ fetch: e.fetch, locale: DEFAUL_LOCALE });
	return {
		url: e.url
	};
};
