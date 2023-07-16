export const createBrandAPI = (http: IHttp) => {
	return {
		getBrandNames() {
			return http.get<Record<string, string>>('/data/brand');
		}
	};
};

type IHttp = {
	get: <T>(path: string) => Promise<T>;
};
