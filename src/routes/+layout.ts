export const trailingSlash = 'always';
export const prerender = true;
export const ssr = true;
export const csr = true;

export const load = async (e) => {
	return {
		url: e.url
	};
};
