export const createTransAPI = (http: {
	get: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	post: <T>(path: string, params?: Record<string, string> | string | string) => Promise<T>;
	patch: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	delete: <T>(path: string, params?: Record<string, string>) => Promise<T>;
}) => {
	return {
		getTransNames(brandID: string) {
			return http.get<Record<string, string>>('/data/transmission', { brandID });
		},
		getTrans(transID: string) {
			return http.get<ITransData>(`/data/transmission/${transID}`);
		},
		postTrans(data: ITransData) {
			return http.post<string>(`/data/transmission/`, data);
		},
		patchTrans(id: string, data: ITransData) {
			return http.patch<void>(`/data/transmission/${id}`, data);
		}
	};
};

export interface ITransData extends Record<string, string> {
	Name: string;
	Gears: string;
	Consumtion: string;
	Acceleration: string;
}
