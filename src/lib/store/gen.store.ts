import { LOAD_ERROR } from '$lib/api/error';
import type { IGenData } from '$lib/api/data/gen.api';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
	selected: null,
	map: {},
	error: null
};

export const createGenlStore = (api: {
	genGenNamesByModelID(modelID: string): Promise<Record<GenID, GenName>>;
	getGen(genID: GenID): Promise<IGenData>;
	postGen(data: IGenData): Promise<string>;
	patchGen(id: GenID, data: IGenData): Promise<void>;
}) => {
	const state = writable<IState>({ ...DEFAULT_STATE });

	const setState = (values: Partial<IState>) => {
		state.update((s) => ({ ...s, ...values }));
	};

	const loadNames = (modelID: string) => {
		api
			.genGenNamesByModelID(modelID)
			.then((data) => {
				setState({ map: data });
			})
			.catch((error) => {
				setState({ error: LOAD_ERROR });
			});
	};

	const onError = (error: Error) => {
		setState({ error: LOAD_ERROR });
	};

	const getData = (genID: GenID): Promise<void> => {
		return api
			.getGen(genID)
			.then((data) => {
				setState({ selected: data });
			})
			.catch(onError);
	};

	const postData = (data: IGenData): Promise<string> => {
		return api.postGen(data).catch(onError) as Promise<string>;
	};

	const patchData = (id: GenID, data: IGenData): Promise<void> => {
		return api.patchGen(id, data).catch(onError) as Promise<void>;
	};

	return { state, loadNames, getData, postData, patchData };
};

interface IState {
	selected: IGenData | null;
	map: Record<GenID, GenName>;
	error: Error | null;
}
type GenID = string;
type GenName = string;
