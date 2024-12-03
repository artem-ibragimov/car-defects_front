import { appSsr } from '$lib/store/main.store.js';
import type { PageServerLoad } from './$types';

export const trailingSlash = 'always';
export const prerender = 'auto';
export const ssr = true;
export const csr = true;

export const load: PageServerLoad = async (e) => {
	const states = await appSsr({ fetch: e.fetch });
	return {
		states
	};
};
