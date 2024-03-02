import { restore, store } from '$lib/util/getParamsStore';
import { get, writable } from 'svelte/store';

const PARAMS_HASH_KEY = 'data_params';

export function createDataParams() {
	const params = writable<Partial<IDataParams>>({
		[DATA_PARAMS.NORMALIZE]: true,
		[DATA_PARAMS.BY_AGE]: true
	});

	return {
		init(url: URL) {
			try {
				params.set(JSON.parse(restore(PARAMS_HASH_KEY, url)));
			} catch {}
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

export enum DATA_PARAMS {
	TOTAL = 'total',
	NORMALIZE = 'norm',
	BY_AGE = 'by_age',
	BY_MILEAGE = 'by_mileage'
}

type IDataParams = Record<Partial<DATA_PARAMS>, boolean>;
