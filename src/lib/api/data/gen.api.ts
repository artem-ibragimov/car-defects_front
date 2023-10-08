export const createGenAPI = (http: {
	get: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	post: <T>(path: string, params?: Record<string, string> | string) => Promise<T>;
	patch: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	delete: <T>(path: string, params?: Record<string, string>) => Promise<T>;
}) => {
	return {
		genGenNamesByModelID(modelID: string) {
			return http.get<Record<string, string>>('/data/gen', { modelID });
		},
		getGen(genID: string) {
			return http.get<IGenData>(`/data/gen/${genID}`);
		},
		postGen(data: IGenData) {
			return http.post<string>(`/data/gen/`, data);
		},
		patchGen(genID: string, data: IGenData) {
			return http.patch<void>(`/data/gen/${genID}`, data);
		}
	};
};

export interface IGenData extends Record<string, string | number> {
	Name: string;
	Img: string;
	Start: string;
	Finish: string;
	ModelID: number;
}
