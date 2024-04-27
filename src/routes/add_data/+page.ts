import { DEFAUL_LOCALE } from '$lib/store/locale.store.js';
import { appSsr } from '$lib/store/main.store.js';

export const prerender = true;

export const load = async (e) => {
	await appSsr({ fetch: e.fetch, locale: DEFAUL_LOCALE });
};
