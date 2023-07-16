export const createModelAPI = (http: {
	get: <T>(path: string, params?: Record<string, string>) => Promise<T>;
}) => {
	return {
		genModelNamesByBrandID(brandID: string) {
			return http.get<Record<string, string>>('/data/model', { brandID });
		}
	};
};
