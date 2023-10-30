import type { PageLoad } from './$types';
export const prerender = true;
export const ssr = true;
export const trailingSlash = 'always';

export const load: PageLoad = (e) => {
   return e.params;
};