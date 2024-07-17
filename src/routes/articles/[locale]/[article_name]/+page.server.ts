import { appSsr } from '$lib/store/main.store';
import type { PageServerLoad } from './$types';
export const trailingSlash = 'always';
export const prerender = true;
export const csr = false;
export const ssr = true;

export const load: PageServerLoad = async (e) => {
	const locale = `article_${e.params.locale}`;
	const states = await appSsr({ fetch: e.fetch, locale });
	return {
		article_name: e.params.article_name,
		locale,
		states
	};
};
