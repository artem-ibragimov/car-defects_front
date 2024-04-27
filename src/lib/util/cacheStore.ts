export const createCacheStore = <T>() => {
	let cache: Record<string, T> = {};

	return {
		get(key: string) {
			return cache[key];
		},
		set(key: string, value: T) {
			cache[key] = value;
		},
		serialize() {
			return JSON.stringify(cache);
		},
		deserialize(s?: string) {
			if (!s) {
				return;
			}
			try {
				cache = JSON.parse(s) as Record<string, T>;
			} catch (e) {
				console.error(e);
			}
		}
	};
};
