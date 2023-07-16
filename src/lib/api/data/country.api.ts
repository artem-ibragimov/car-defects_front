export const createCountryAPI = (http: {
	get: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	post: <T>(path: string, params?: Record<string, string> | string | string) => Promise<T>;
	patch: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	delete: <T>(path: string, params?: Record<string, string>) => Promise<T>;
}) => {
	return {
		postCounrty(name: string) {
			return http.post<string>(`/data/country/`, name);
		}
	};
};
