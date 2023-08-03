import type {
	IDefectData,
	IDefectDetails,
	IDataParams,
	IEntity,
	IMeta,
	IDefect
} from '$lib/api/data/defect.api';
import { LOAD_ERROR } from '$lib/api/error';
import { createCacheStore } from '$lib/util/cacheStore';
import { filterNullable } from '$lib/util/tools';
import { derived, get, writable } from 'svelte/store';
import { createDefectFilterStore } from '$lib/store/defectFilter/filter.store';

const DEFAULT_STATE: IState = {
	error: null,
	warn: '',
	lastRequest: '',
	loading: false,
	loadingDetails: false
};

const cacheStore = createCacheStore<Record<string, IDefectData>>();
const DETAILS_LIMIT = '5';

export const createDefectStore = (api: {
	getDefectsCategories(): Promise<IDefectData>;
	getDefectsByAge(params: IEntity & IDataParams): Promise<IDefectData>;
	getDefectsByMileage(params: IEntity & IDataParams): Promise<IDefectData>;
	getDefectsDetails(
		params: IEntity & IMeta & { locale: string; categories: string }
	): Promise<IDefectDetails[]>;
	postDefect(defect: IDefect): Promise<void>;
}) => {
	const onerror = () => {
		setState({ error: LOAD_ERROR });
	};
	const state = writable<IState>({ ...DEFAULT_STATE });
	const chartData = writable<IData>({});
	const filter = createDefectFilterStore(api, onerror);

	filter.selector.subscribe((selector) => {
		if (selector.categories.length === 0) {
			return;
		}
		setState({ loading: true });
		Promise.all(filter.entityParams.getEntities().map(([name, p]) => reqChartData(name, p)))
			.then((results) => {
				chartData.update((prev) => Object.assign(prev, ...results));
			})
			.catch(onerror)
			.then(() => {
				setState({ loading: false });
			});
	});

	const selectedChartData = derived([chartData, filter.selector], ([d, f]) => {
		return Object.fromEntries(Object.entries(d).filter(([k, _]) => f.selectedEntities[k]));
	});

	function reqChartData(
		name: string,
		entity: IEntity
	): Promise<Record<string, IDefectData> | void> {
		const params = {
			...filterNullable(entity),
			...filter.dataParams.getDataParams(),
			categories: filter.categoryParams.getCategories()
		};

		const cacheKey = JSON.stringify(params);
		const cachedChartData = cacheStore.get(cacheKey);
		if (cachedChartData) {
			return Promise.resolve(cachedChartData);
		}

		return (params.by_mileage ? api.getDefectsByMileage(params) : api.getDefectsByAge(params))
			.then((data) => {
				if (Object.keys(data).length === 0) {
					setState({ warn: 'warn.NO_DATA', lastRequest: name });
					setTimeout(() => {
						setState({ warn: '' });
					}, 3000);
					filter.entityParams.deleteEntity(name);
					return;
				}
				return { [name]: data };
			})
			.catch((e) => {
				setState({ lastRequest: name });
				filter.entityParams.deleteEntity(name);
				throw e;
			})
			.then((result) => {
				result && cacheStore.set(cacheKey, result);
				return result;
			});
	}

	function setState(values: Partial<IState>) {
		state.update((s) => ({ ...s, ...values }));
	}

	const details = writable<Record<string, IDefectDetails[]>>({});
	const detailsLoadOffset = writable<string>('0');
	const selectedDetails = writable<Record<string, boolean>>({});
	const selectedDetailEntity = derived(
		selectedDetails,
		(details) => (Object.entries(details).find(([_, v]) => v) || [])[0]
	);
	filter.entityParams.entities.subscribe((entries) => {
		selectedDetails.update((details) => {
			return Object.fromEntries(Object.entries(details).filter(([k, _]) => !!entries[k]));
		});
	});

	function selectDetails(cfg: Record<string, boolean>) {
		selectedDetails.set(cfg);
	}
	return {
		state,
		selectedChartData,
		filter,
		details,
		addEntity(name: string, entity: IEntity) {
			setState({ loading: true });
			filter.entityParams.addEntity(name, entity);
		},
		selectedDetails,
		selectedDetailEntity,
		loadDetails(selected: Record<string, boolean>, locale: string) {
			const entityName = (Object.entries(selected).find(([_, v]) => v) || [])[0];
			if (!entityName) {
				return;
			}

			const entity = filter.entityParams.getEntity(entityName);
			if (!entity) {
				return;
			}
			setState({ loadingDetails: true });
			api
				.getDefectsDetails({
					...entity,
					limit: DETAILS_LIMIT,
					offset: get(detailsLoadOffset),
					categories: filter.categoryParams.getCategories(),
					locale
				})
				.then((res) => {
					console.warn(res);
					detailsLoadOffset.update((prev) => prev + DETAILS_LIMIT);
					details.update((prev) => {
						if (!prev[entityName]) {
							prev[entityName] = [];
						}
						Object.assign(prev[entityName], prev[entityName].concat(res));
						return prev;
					});
					selectDetails(selected);
					setState({ loadingDetails: false });
				});
		},
		postDefect(defect: IDefect) {
			return api.postDefect(defect);
		}
	};
};

type IData = Record<string, IDefectData>;
interface IState {
	lastRequest: string; // additional info for warn & error
	error: Error | null;
	warn: string;
	loading: boolean;
	loadingDetails: boolean;
}
