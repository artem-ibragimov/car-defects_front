import type { IEngineData } from '$lib/api/data/engine.api';
import { LOAD_ERROR } from '$lib/api/error';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
	selected: null,
	map: {},
	error: null
};

export const createEngineStore = (api: {
	getEngineNames(): Promise<Record<string, string>>;
	getEngine(engineID: string): Promise<IEngineData>;
	postEngine(data: IEngineData): Promise<string>;
	patchEngine(id: string, data: IEngineData): Promise<void>;
}) => {
	const state = writable<IState>({ ...DEFAULT_STATE });

	const setState = (values: Partial<IState>) => {
		state.update((s) => ({ ...s, ...values }));
	};

	const loadNames = () => {
		api
			.getEngineNames()
			.then((data) => {
				setState({ map: data });
			})
			.catch(onError);
	};

	const onError = (error: Error) => {
		setState({ error: LOAD_ERROR });
	};

	const getData = (engineID: string): Promise<void> => {
		return api
			.getEngine(engineID)
			.then((data) => {
				setState({ selected: data });
			})
			.catch(onError);
	};

	const postData = (data: IEngineData) => {
		return api.postEngine(data).catch(onError);
	};

	const patchData = (id: EngineID, data: IEngineData) => {
		return api.patchEngine(id, data).catch(onError);
	};

	return {
		state,
		loadNames,
		getData,
		postData,
		patchData
	};
};

interface IState {
	selected: IEngineData | null;
	map: Record<EngineID, EngineName>;
	error: Error | null;
}
type EngineID = string;
type EngineName = string;
