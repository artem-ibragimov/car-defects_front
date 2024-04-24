import { DEFAUL_LOCALE } from '$lib/store/locale.store.js';
import { appInit } from '$lib/store/main.store.js';

export const prerender = true;

export const load = async (e) => {
	await appInit({ fetch: e.fetch, locale: DEFAUL_LOCALE });
};