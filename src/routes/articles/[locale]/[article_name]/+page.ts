import type { PageLoad } from './$types';
export const trailingSlash = 'always';
export const prerender = true;
export const csr = false;
export const ssr = true;

export const load: PageLoad = (e) => {
	return e.params;
};
