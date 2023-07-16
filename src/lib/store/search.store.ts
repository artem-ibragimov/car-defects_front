import type { ISearchAPI } from '$lib/api/data/search.api';
import { transpile } from '$lib/i18n/transpilation';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
	brands: {},
	models: {},
	gens: {},
	error: null
};

export const createSearchStore = (api: ISearchAPI) => {
	const state = writable<IState>({ ...DEFAULT_STATE });

	const setState = (values: Partial<IState>) => {
		state.update((prev) => Object.assign(prev, DEFAULT_STATE, values));
	};

	const search = (params: { query: string }) => {
		api
			.search(transpile(params.query))
			.then((data) => {
				setState(data);
			})
			.catch((e: Error) => {
				setState({ error: new Error(e.message) });
			});
	};

	return {
		search,
		state
	};
};

interface IState {
	brands: Record<string, string>;
	models: Record<string, string>;
	gens: Record<string, string>;
	error: Error | null;
}
