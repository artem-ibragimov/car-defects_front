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
			return {
				selectedEntities,
				selectedData,
				categories
			};
		}
	);

	return {
		ssr(cfg: {
			entities?: Record<string, IEntity>;
			categories?: string[];
		}): Promise<{ entityParamsState: string; categoryParamsState: string }> {
			return Promise.all([
				entityParams.init(cfg.entities),
				categoryParams.init(cfg.categories)
			]).then(([entityParamsState, categoryParamsState]) => ({
				entityParamsState,
				categoryParamsState
			}));
		},
		csr(states: { entityParamsState: string; categoryParamsState: string }) {
			return Promise.all([
				categoryParams.csr(states.categoryParamsState),
				entityParams.csr(states.entityParamsState),
				dataParams.csr()
			]);
		},
		selector,
		entityParams,
		categoryParams,
		dataParams
	};
};
