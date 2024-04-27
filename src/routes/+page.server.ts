import { DEFAUL_LOCALE } from '$lib/store/locale.store.js';
import { appSsr } from '$lib/store/main.store.js';

export const trailingSlash = 'always';
export const prerender = true;
export const ssr = true;
export const csr = true;

export const load = async (e) => {
	const states = await appSsr({ fetch: e.fetch, locale: DEFAUL_LOCALE });
	return {
		states
	};
};
