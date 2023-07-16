import { LOAD_ERROR } from '$lib/api/error';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
	map: {},
	error: null
};

export const createModelStore = (api: {
	genModelNamesByBrandID(brandID: string): Promise<Record<string, string>>;
}) => {
	const state = writable<IState>({ ...DEFAULT_STATE });

	const setState = (values: Partial<IState>) => {
		state.update((s) => ({ ...s, ...values }));
	};

	const loadNames = (brandID: string) => {
		api
			.genModelNamesByBrandID(brandID)
			.then((data) => {
				setState({ map: data });
			})
			.catch((error) => {
				setState({ error: LOAD_ERROR });
			});
	};

	return { state, loadNames };
};

interface IState {
	map: Record<ModelID, ModelName>;
	error: Error | null;
}
type ModelID = string;
type ModelName = string;
