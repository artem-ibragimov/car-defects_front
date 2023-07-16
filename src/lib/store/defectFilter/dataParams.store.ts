import { restore, store } from '$lib/util/hashStore';
import { get, writable } from 'svelte/store';

const PARAMS_HASH_KEY = 'data_params';

export function createDataParams() {
	let initValue = {
		[DATA_PARAMS.NORMALIZE]: true,
		[DATA_PARAMS.BY_AGE]: true
	};
	try {
		initValue = JSON.parse(restore(PARAMS_HASH_KEY));
	} catch {
		store(PARAMS_HASH_KEY, JSON.stringify(initValue));
	}
	const params = writable<Partial<IDataParams>>(initValue);

	params.subscribe((v) => {
		v && store(PARAMS_HASH_KEY, JSON.stringify(v));
	});

	return {
		params,
		setDataParams(cfg: Record<Partial<DATA_PARAMS>, boolean>) {
			if (Object.keys(cfg).length === 0) {
				return;
			}
			params.update((prev) =>
				Object.fromEntries(Object.entries({ ...prev, ...cfg }).filter(([_, v]) => v))
			);
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
