import type { ISearchAPI } from '$lib/api/data/search.api';
import { transpile } from '$lib/i18n/transpilation';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
	brands: {},
	models: {},
	gens: {},
	error: null,
	warn: '',
	lastRequest: ''
};

export const createSearchStore = (api: ISearchAPI) => {
	const state = writable<IState>({ ...DEFAULT_STATE });
	const DELAY_MS = 1000;
	let isWaitingForReq = false;
	let query = '';

	const setState = (values: Partial<IState>) => {
		state.update((prev) => Object.assign(DEFAULT_STATE, prev, values));
	};

	const search = () => {
		return api
			.search(transpile(query))
			.then((data) => {
				setState(data);
				const noResults =
					Object.keys(data.brands).length === 0 &&
					Object.keys(data.models).length === 0 &&
					Object.keys(data.gens).length === 0;
				setState({ warn: noResults ? 'warn.NO_DATA' : '', lastRequest: query });
			})
			.catch((e: Error) => {
				setState({ error: new Error(e.message) });
			});
	};

	return {
		search(params: { query: string }) {
			query = params.query;
			if (isWaitingForReq) {
				return;
			}
			isWaitingForReq = true;
			setTimeout(() => {
				search().then(() => {
					isWaitingForReq = false;
				});
			}, DELAY_MS);
		},
		state
	};
};

interface IState {
	brands: Record<string, string>;
	models: Record<string, string>;
	gens: Record<string, string>;
	error: Error | null;
	warn: string;
	lastRequest: string;
}
