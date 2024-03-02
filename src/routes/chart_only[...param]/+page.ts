import { appInit } from '$lib/store/main.store.js';

export const trailingSlash = 'always';
export const prerender = true;
export const ssr = true;
export const csr = true;

export const load = async (e) => {
	await appInit({ url: e.url, fetch: e.fetch });
	return {
		url: e.url
	};
};
