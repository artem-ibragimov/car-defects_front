export const createDefectAPI = (http: {
	get: <T>(path: string, params?: Record<string, string | boolean>) => Promise<T>;
	post: <T>(path: string, params?: Record<string, string> | string) => Promise<T>;
}) => {
	return {
		getDefectsCategories(): Promise<IDefectData> {
			return http.get('/data/defect/categories');
		},
		getDefectsDetails(params: IEntity & IMeta & ILocale & ICategories) {
			return http.get<IDefectDetails[]>('/data/defect/details', params);
		},
		getDefectsByAge(params: IEntity & IDataParams) {
			return http.get<IDefectData>('/data/defect/age', params);
		},
		getDefectsByMileage(params: IEntity & IDataParams) {
			return http.get<IDefectData>('/data/defect/mileage', params);
		},
		postDefect(defect: IDefect) {
			return http.post<void>('/data/defect/', defect);
		}
	};
};

export type IDefectData = Record<string, string>;
export type IEntity = Partial<{
	brandID: string;
	modelID: string;
	genID: string;
	versionID: string;
}>;

export type IDataParams = Partial<{
	by_age?: boolean;
	by_mileage?: boolean;
	/** ненормализованные */
	total?: boolean;
	/** Нормализованные */
	norm?: boolean;
	/** список разделенный запятыми */
	categories: string;
}>;

export interface IMeta {
	offset: string;
	limit: string;
}
export interface ILocale {
	locale: string;
}
export interface ICategories {
	categories: string;
}

export interface IDefectDetails {
	age: string;
	brand: string;
	category: string;
	cost: string;
	country: string;
	description: string;
	freq: string;
	gen: string;
	mileage: string;
	model: string;
	rating: string;
	version: string;
	year: string;
}

export type IDefect = {
	AuthorID: number;
	BrandID: number;
	ModelID: number;
	GenID: number;
	VersionID: number;
	CountryID: number;
	CategoryID: number;
	Age: number;
	Year: number;
	Cost: number;
	Rating: number;
	Mileage: number;
	Freq: number;
	Desc: string;
	Locale: string;
};
