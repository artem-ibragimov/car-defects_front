import { restore, store } from '$lib/util/hashStore';
import { get, writable } from 'svelte/store';

export enum DATA_PARAMS {
	TOTAL = 'total',
	NORMALIZE = 'norm',
	BY_AGE = 'by_age',
	BY_MILEAGE = 'by_mileage'
}

const PARAMS_HASH_KEY = 'data_params';
const DEFAULT_VALUE = {
	[DATA_PARAMS.NORMALIZE]: true,
	[DATA_PARAMS.BY_AGE]: true
};
export function createDataParams() {
	const params = writable<Partial<IDataParams>>({ ...DEFAULT_VALUE });

	return {
		csr() {
			try {
				const restored = restore(PARAMS_HASH_KEY);
				if (!restored) {
					return;
				}
				const data = JSON.parse(restored) as Partial<IDataParams>;
				params.set({
					by_age: data.by_age || (typeof data.by_mileage !== 'undefined' && !data.by_mileage),
					by_mileage: data.by_mileage || (typeof data.by_age !== 'undefined' && !data.by_age),
					norm: data.norm || (typeof data.total !== 'undefined' && !data.total),
					total: data.total || (typeof data.norm !== 'undefined' && !data.norm)
				});
			} catch (e) {
				console.error(e);
			}
		},
		params,
		setDataParams(cfg: Record<Partial<DATA_PARAMS>, boolean>) {
			if (Object.keys(cfg).length === 0) {
				return;
			}
			params.update((prev) =>
				Object.fromEntries(Object.entries({ ...prev, ...cfg }).filter(([_, v]) => v))
			);
			const v = JSON.stringify(get(params));
			v && store(PARAMS_HASH_KEY, JSON.stringify(v));
		},
		getDataParams() {
			return get(params);
		}
	};
}

type IDataParams = Record<Partial<DATA_PARAMS>, boolean>;
