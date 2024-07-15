import { appSsr } from '$lib/store/main.store.js';

export const prerender = true;

export const load = async (e) => {
	await appSsr({ fetch: e.fetch });
};
