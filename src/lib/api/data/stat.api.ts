export const createStatAPI = (http: {
	get: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	post: <T>(path: string, params?: Record<string, string> | string) => Promise<T>;
	patch: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	delete: <T>(path: string, params?: Record<string, string>) => Promise<T>;
}) => {
	return {
		getTopReliableModels() {
			return http.get<string[]>('/data/stat/top/reliable/model');
		}
	};
};
