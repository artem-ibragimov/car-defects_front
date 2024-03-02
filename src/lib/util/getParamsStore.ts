export const store = (key: string, val: string) => {
	if (typeof location === 'undefined') {
		return;
	}
	const params = new URLSearchParams(location.search);
	params.set(key, val);
	location.search = params.toString();
};

export const restore = (key: string, url: URL): string => {
	const params = new URLSearchParams(url.search);
	return Object.fromEntries(params.entries())[key] || '';
};
