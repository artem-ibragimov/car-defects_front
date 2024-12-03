import { appSsr } from '$lib/store/main.store.js';

export const trailingSlash = 'always';
export const prerender = 'auto';
export const ssr = true;
export const csr = true;

export const load = async (e) => {
	const name = e.params.modelName.replaceAll('_', ' ');
	const states = await appSsr({
		fetch: e.fetch,
		entities: { [name]: { modelID: e.params.modelID } },
		...(e.params.categories && { categories: [e.params.categories] })
	});
	return {
		categories: e.params.categories,
		name,
		states
	};
};
