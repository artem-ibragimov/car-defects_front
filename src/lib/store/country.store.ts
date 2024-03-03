import { LOAD_ERROR } from '$lib/api/error';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
	id: '0',
	error: null
};

export const createCountryStore = (api: { postCounrty(name: string): Promise<string> }) => {
	const state = writable<IState>({ ...DEFAULT_STATE });

	const setState = (values: Partial<IState>) => {
		state.update((s) => ({ ...s, ...values }));
	};

	return {
		state,
		postCounrty(name: string) {
			return api
				.postCounrty(name)
				.then((id) => {
					setState({ id });
				})
				.catch((error) => {
					console.error(error);
					setState({ error: LOAD_ERROR });
				});
		}
	};
};

interface IState {
	id: string;
	error: Error | null;
}
