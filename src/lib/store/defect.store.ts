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
import { debounce, filterNullable } from '$lib/util/tools';
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
const DETAILS_LIMIT = 10;

export const createDefectStore = (api: {
	getDefectsCategories(): Promise<IDefectData>;
	getDefectsByAge(params: IEntity & IDataParams): Promise<IDefectData>;
	getDefectsByMileage(params: IEntity & IDataParams): Promise<IDefectData>;
	getDefectsDetails(params: IEntity & IMeta & { categories: string }): Promise<IDefectDetails[]>;
	postDefect(defect: IDefect): Promise<void>;
}) => {
	const onerror = (e: Error) => {
		console.error(e);
		setState({ error: LOAD_ERROR });
	};
	const state = writable<IState>({ ...DEFAULT_STATE });
	const chartData = writable<IData>({});
	const details = writable<Record<string, IDefectDetails[]>>({});
	const detailsLoadOffset = writable<Record<string, number>>({});
	const selectedDetails = writable<Record<string, boolean>>({});

	function serialize() {
		return JSON.stringify({
			chartData: get(chartData),
			details: get(details),
			detailsLoadOffset: get(detailsLoadOffset),
			selectedDetails: get(selectedDetails),
			cacheStore: cacheStore.serialize()
		});
	}
	function deserialize(s: string) {
		try {
			const deserialized = JSON.parse(s);
			chartData.set(deserialized.chartData);
			details.set(deserialized.details);
			detailsLoadOffset.set(deserialized.detailsLoadOffset);
			selectedDetails.set(deserialized.selectedDetails);
			cacheStore.deserialize(deserialized.cacheStore);
		} catch (e) {
			onerror(e as Error);
		}
	}

	const selectedDetailEntityName = derived(
		selectedDetails,
		(details) => (Object.entries(details).find(([_, v]) => v) || [])[0]
	);
	const filter = createDefectFilterStore(api, onerror);

	filter.selector.subscribe(debounce(onFilterChange));

	function onFilterChange() {
		setState({ loading: true });
		return Promise.all(filter.entityParams.getEntities().map(([name, p]) => reqChartData(name, p)))
			.then((results) => {
				chartData.update((prev) => Object.assign(prev, ...results));
			})
			.catch(onerror)
			.then(() => {
				setState({ loading: false });
			});
	}

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

	filter.entityParams.entities.subscribe((entries) => {
		selectedDetails.update((details) => {
			return Object.fromEntries(Object.entries(details).filter(([k, _]) => !!entries[k]));
		});
	});

	function selectDetails(cfg: Record<string, boolean>): Promise<void> {
		selectedDetails.set(cfg);
		return updateEntityDetails(get(selectedDetailEntityName)).catch(console.error);
	}

	function updateEntityDetails(entityName: string | undefined): Promise<void> {
		if (!entityName) {
			return Promise.resolve();
		}
		const entity = get(filter.entityParams.entities)[entityName];
		return loadEntityDetails(
			entity,
			filter.categoryParams.getCategories(),
			get(detailsLoadOffset)[entityName] || 0
		).then((res) => {
			detailsLoadOffset.update((prev) => {
				prev[entityName] = (prev[entityName] || 0) + DETAILS_LIMIT;
				return prev;
			});
			details.update((prev) => {
				prev[entityName] = res;
				return prev;
			});
		});
	}
	function loadEntityDetails(
		entity: IEntity,
		categories: string,
		offset: number = 0
	): Promise<IDefectDetails[]> {
		setState({ loadingDetails: true });
		return api
			.getDefectsDetails({
				...entity,
				limit: `${DETAILS_LIMIT}`,
				offset: `${offset}`,
				categories
			})
			.catch(onerror)
			.then((res) => {
				setState({ loadingDetails: false });
				return res as IDefectDetails[];
			});
	}
	function clear() {
		return Promise.all([
			filter.entityParams.resetEntities(),
			chartData.set({}),
			details.set({}),
			detailsLoadOffset.set({}),
			selectedDetails.set({}),
			cacheStore.clear()
		]);
	}
	return {
		ssr(cfg: {
			entities?: Record<string, IEntity>;
			categories?: string[];
		}): Promise<IDefectsStoreStates> {
			const selectedEntities = Object.fromEntries(
				Object.keys(cfg.entities || {}).map((name) => [name, true])
			);
			return clear()
				.then(() => {
					const filterSsr = filter.ssr(cfg);
					if (!cfg.entities && !cfg.categories) {
						return Promise.all([filterSsr, serialize()]);
					}
					return Promise.all([
						filterSsr,
						Promise.all([filterSsr.then(onFilterChange), selectDetails(selectedEntities)]).then(
							serialize
						)
					]);
				})
				.then(([filterStates, defectStoreState]) => ({
					defectStoreState,
					...filterStates
				}));
		},
		csr(states: IDefectsStoreStates) {
			deserialize(states.defectStoreState);
			return filter.csr({ ...states });
		},
		clear,
		state,
		selectedChartData,
		filter,
		details,
		addEntity(name: string, entity: IEntity) {
			return filter.entityParams.addEntity(name, entity);
		},
		selectedDetails,
		selectDetails,
		selectedDetailEntityName,
		postDefect(defect: IDefect) {
			return api.postDefect(defect).catch(onerror);
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

export interface IDefectsStoreStates {
	defectStoreState: string;
	entityParamsState: string;
	categoryParamsState: string;
}
