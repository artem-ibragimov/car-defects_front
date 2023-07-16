import type { ITransData } from '$lib/api/data/trans.api';
import { LOAD_ERROR } from '$lib/api/error';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
	selected: null,
	map: {},
	error: null
};

export const createTransStore = (api: {
	getTransNames(brandID: string): Promise<Record<string, string>>;
	getTrans(id: string): Promise<ITransData>;
	postTrans(data: ITransData): Promise<string>;
	patchTrans(id: string, data: ITransData): Promise<void>;
}) => {
	const state = writable<IState>({ ...DEFAULT_STATE });

	const setState = (values: Partial<IState>) => {
		state.update((s) => ({ ...s, ...values }));
	};

	const loadNames = (brandID: string) => {
		api
			.getTransNames(brandID)
			.then((data) => {
				setState({ map: data });
			})
			.catch(onError);
	};

	const onError = (error: Error) => {
		setState({ error: LOAD_ERROR });
	};

	const getData = (id: string): Promise<void> => {
		return api
			.getTrans(id)
			.then((data) => {
				setState({ selected: data });
			})
			.catch(onError);
	};

	const postData = (data: ITransData) => {
		return api.postTrans(data).catch(onError);
	};

	const patchData = (id: string, data: ITransData) => {
		return api.patchTrans(id, data).catch(onError);
	};

	return { state, loadNames, getData, patchData, postData };
};

interface IState {
	selected: ITransData | null;
	map: Record<TransID, TransName>;
	error: Error | null;
}
type TransID = string;
type TransName = string;
