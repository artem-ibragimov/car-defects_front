import type { IDefectData, IEntity } from '$lib/api/data/defect.api';
import { derived } from 'svelte/store';
import { createCategoriesParams } from './categories.store';
import { createDataParams } from './dataParams.store';
import { createEntityParams } from './entityParams.store';

export const createDefectFilterStore = (
	api: { getDefectsCategories(): Promise<IDefectData> },
	onerror: (e: Error) => void
) => {
	const entityParams = createEntityParams();
	const dataParams = createDataParams();
	const categoryParams = createCategoriesParams(api, onerror);

	const selector = derived(
		[entityParams.selectedEntities, dataParams.params, categoryParams.categories],
		([selectedEntities, selectedData, categories]) => {
			typeof location !== 'undefined' && console.info(location.hash);
			return {
				selectedEntities,
				selectedData,
				categories
			};
		}
	);

	return {
		init(cfg: { entities?: Record<string, IEntity>; categories?: string[] }) {
			return Promise.all([entityParams.init(cfg.entities), categoryParams.init(cfg.categories)]);
		},
		client() {
			return entityParams.client();
		},
		selector,
		entityParams,
		categoryParams,
		dataParams
	};
};
