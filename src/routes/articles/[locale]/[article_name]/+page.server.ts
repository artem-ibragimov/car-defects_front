import { appSsr } from '$lib/store/main.store';
import type { PageServerLoad } from './$types';
export const trailingSlash = 'always';
export const prerender = true;
export const csr = true;
export const ssr = true;

export const load: PageServerLoad = async (e) => {
	const states = await appSsr({ fetch: e.fetch, locale: e.params.locale });
	return {
		locale: e.params.locale,
		article_name: e.params.article_name,
		states
	};
};
