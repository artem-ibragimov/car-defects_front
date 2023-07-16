export const createEngineAPI = (http: {
	get: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	post: <T>(path: string, params?: Record<string, string> | string | string) => Promise<T>;
	patch: <T>(path: string, params?: Record<string, string>) => Promise<T>;
	delete: <T>(path: string, params?: Record<string, string>) => Promise<T>;
}) => {
	return {
		getEngineNames() {
			return http.get<Record<string, string>>('/data/engine');
		},
		getEngine(engineID: string) {
			return http.get<IEngineData>(`/data/engine/${engineID}`);
		},
		postEngine(data: IEngineData) {
			return http.post<string>(`/data/engine/`, data);
		},
		patchEngine(id: string, data: IEngineData) {
			return http.post<void>(`/data/engine/${id}`, data);
		}
	};
};

export interface IEngineData extends Record<string, string> {
	Name: string;
	Displacement: string;
	Cylinders: string;
	Valves: string;
	Fuel_type: string;
	Power_hp: string;
	Torque: string;
	Img: string;
}
