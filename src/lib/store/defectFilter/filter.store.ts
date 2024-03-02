import type { IDefectData } from '$lib/api/data/defect.api';
import { derived } from 'svelte/store';
import { createCategoriesParams } from './categories.store';
import { createDataParams } from './dataParams.store';
import { createEntityParams } from './entityParams.store';

export const createDefectFilterStore = (
	api: { getDefectsCategories(): Promise<IDefectData> },
	onerror: () => void
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
		init(url: URL) {
			return Promise.all([entityParams.init(url), categoryParams.init(url)]);
		},
		selector,
		entityParams,
		categoryParams,
		dataParams
	};
};
