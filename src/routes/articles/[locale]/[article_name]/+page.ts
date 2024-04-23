import { appInit, localeStore } from '$lib/store/main.store';
import type { PageLoad } from './$types';
export const trailingSlash = 'always';
export const prerender = true;
export const csr = false;
export const ssr = true;

export const load: PageLoad = async (e) => {
	await appInit({ fetch: e.fetch, locale: e.params.locale });
	return e.params;
};
