export const createCacheStore = <T>() => {
	const cache: Record<string, T> = {};

	return {
		get(key: string) {
			return cache[key];
		},
		set(key: string, value: T) {
			cache[key] = value;
		}
	};
};
