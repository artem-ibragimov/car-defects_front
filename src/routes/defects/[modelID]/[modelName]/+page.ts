import { appInit } from '$lib/store/main.store.js';

export const trailingSlash = 'always';
export const prerender = true;
export const ssr = true;
export const csr = true;

export const load = async (e) => {
	const name = e.params.modelName.replaceAll('_', ' ');
	await appInit({ fetch: e.fetch, entities: { [name]: { modelID: e.params.modelID } } });
	return {
		name
	};
};
