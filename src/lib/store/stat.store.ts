import { LOAD_ERROR } from '$lib/api/error';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
	data: [],
	error: null
};

let isInit = false;

export const createStatStore = (api: { getTopReliableModels(): Promise<string[]> }) => {
	const state = writable<IState>({ ...DEFAULT_STATE });

	const setState = (values: Partial<IState>) => {
		state.update((s) => ({ ...s, ...values }));
	};

	const onError = (_: Error) => {
		isInit = false;
		setState({ error: LOAD_ERROR });
	};

	const getData = (): Promise<void> => {
		return api
			.getTopReliableModels()
			.then((data) => {
				setState({
					data: data.map((v) => {
						const [modelID, title, defects, sales] = v.split('|');
						return { modelID, title, defects: Number(defects), sales: Number(sales) };
					})
				});
			})
			.catch(onError);
	};

	return {
		state,
		init() {
			if (isInit) {
				return;
			}
			getData();
			isInit = true;
		}
	};
};

interface IState {
	data: { modelID: string; title: string; defects: number; sales: number }[];
	error: Error | null;
}
