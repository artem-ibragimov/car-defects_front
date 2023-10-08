import { LOAD_ERROR } from '$lib/api/error';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
	id: 0,
	error: null
};

export const createAuthorStore = (api: { postAuthor(name: string): Promise<number> }) => {
	const state = writable<IState>({ ...DEFAULT_STATE });

	const setState = (values: Partial<IState>) => {
		state.update((s) => ({ ...s, ...values }));
	};

	return {
		state,
		postAuthor(name: string) {
			return api
				.postAuthor(name)
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
	id: number;
	error: Error | null;
}
