export const createSearchAPI = (http: {
	get: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	post: <T>(path: string, params?: Record<string, string> | string | string) => Promise<T>;
	patch: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	delete: <T>(path: string, params?: Record<string, string>) => Promise<T>;
}): ISearchAPI => {
	return {
		search(query) {
			return http.get<IResult>('/data/search', { query });
		}
	};
};
export interface ISearchAPI {
	search(query: string): Promise<IResult>;
}

type IResult = {
	brands: Record<string, string>;
	models: Record<string, string>;
	gens: Record<string, string>;
};
