export const createVersionAPI = (http: {
	get: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	post: <T>(path: string, params?: Record<string, string> | string | string) => Promise<T>;
	patch: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	delete: <T>(path: string, params?: Record<string, string>) => Promise<T>;
}) => {
	return {
		getVersionNamesByGenID(genID: string) {
			return http.get<Record<string, string>>('/data/version', { genID });
		},
		getVersion(versionID: string) {
			return http.get<IVersionData>(`/data/version/${versionID}`);
		},
		postVersion(data: IVersionData) {
			return http.post<string>(`/data/version/`, data);
		},
		patchVersion(id: string, data: IVersionData) {
			return http.post<void>(`/data/version/${id}`, data);
		}
	};
};

export interface IVersionData extends Record<string, string | number> {
	Name: string;
	GenID: number;
	TransID: number;
	EngineID: number;
}
