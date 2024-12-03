export const store = (key: string, val: string) => {
	if (typeof location === 'undefined') {
		return;
	}
	const params = new URLSearchParams(location.hash.slice(1));
	params.set(key, val);
	location.hash = params.toString();
};

export const restore = (key: string): string => {
	if (typeof location === 'undefined') {
		return '';
	}
	const params = new URLSearchParams(location.hash.slice(1));
	return Object.fromEntries(params.entries())[key] || '';
};
