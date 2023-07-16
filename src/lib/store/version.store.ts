import { LOAD_ERROR } from '$lib/api/error';
import type { IVersionData } from '$lib/api/data/version.api';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
	selected: null,
	map: {},
	error: null
};

export const createVersionStore = (api: {
	getVersionNamesByGenID(genID: string): Promise<Record<VersionID, VersionName>>;
	getVersion(versionID: string): Promise<IVersionData>;
	postVersion(data: IVersionData): Promise<string>;
	patchVersion(id: string, data: IVersionData): Promise<void>;
}) => {
	const state = writable<IState>({ ...DEFAULT_STATE });

	const setState = (values: Partial<IState>) => {
		state.update((s) => ({ ...s, ...values }));
	};

	const loadNames = (genID: string) => {
		api
			.getVersionNamesByGenID(genID)
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

	const getData = (versionID: string): Promise<void> => {
		return api
			.getVersion(versionID)
			.then((data) => {
				setState({ selected: data });
			})
			.catch(onError);
	};

	const postData = (data: IVersionData): Promise<string> => {
		return api.postVersion(data).catch(onError) as Promise<string>;
	};
	const patchData = (id: VersionID, data: IVersionData): Promise<void> => {
		return api.patchVersion(id, data).catch(onError) as Promise<void>;
	};

	return { state, loadNames, getData, postData, patchData };
};

interface IState {
	selected: IVersionData | null;
	map: Record<VersionID, VersionName>;
	error: Error | null;
}
type VersionID = string;
type VersionName = string;
