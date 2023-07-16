export const store = (key: string, data: string) => {
	if (typeof location === 'undefined') {
		return;
	}
	const params = new URLSearchParams(location.hash.slice(1));
	params.set(key, data);
	location.hash = params.toString();
};

export const restore = (key: string): string => {
	if (typeof location === 'undefined') {
		return '';
	}
	const params = new URLSearchParams(location.hash.slice(1));
	return Object.fromEntries(params.entries())[key] || '';
};
