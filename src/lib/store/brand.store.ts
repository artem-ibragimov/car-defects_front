import { LOAD_ERROR } from '$lib/api/error';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
	map: {},
	error: null
};

export const createBrandStore = (api: { getBrandNames(): Promise<Record<BrandID, BrandName>> }) => {
	const state = writable<IState>({ ...DEFAULT_STATE });

	const setState = (values: Partial<IState>) => {
		state.update((s) => ({ ...s, ...values }));
	};

	const loadNames = () => {
		api
			.getBrandNames()
			.then((map) => {
				setState({ map });
			})
			.catch(() => {
				setState({ error: LOAD_ERROR });
			});
	};

	return {
		state,
		loadNames
	};
};

interface IState {
	map: Record<BrandID, BrandName>;
	error: Error | null;
}
type BrandID = string;
type BrandName = string;
