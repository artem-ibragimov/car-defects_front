import type { IEntity } from '$lib/api/data/defect.api';
import { API, init as initAPI } from '$lib/api/main.api';
import { createAuthorStore } from '$lib/store/author.store';
import { createBrandStore } from '$lib/store/brand.store';
import { createCountryStore } from '$lib/store/country.store';
import { createDefectStore, type IDefectsStoreStates } from '$lib/store/defect.store';
import { createEngineStore } from '$lib/store/engine.store';
import { createGenlStore } from '$lib/store/gen.store';
import { creatLocaleStore } from '$lib/store/locale.store';
import { createModelStore } from '$lib/store/model.store';
import { createSearchStore } from '$lib/store/search.store';
import { createStatStore } from '$lib/store/stat.store';
import { createTransStore } from '$lib/store/trans.store';
import { createVersionStore } from '$lib/store/version.store';

export const brandsStore = createBrandStore(API.brand);
export const modelStore = createModelStore(API.model);
export const genStore = createGenlStore(API.gen);
export const versionStore = createVersionStore(API.version);
export const engineStore = createEngineStore(API.engine);
export const transStore = createTransStore(API.trans);
export const defectStore = createDefectStore(API.defect);
export const searchStore = createSearchStore(API.search);
export const localeStore = creatLocaleStore();
export const authorStore = createAuthorStore(API.author);
export const countryStore = createCountryStore(API.country);
export const statStore = createStatStore(API.stat);

export const appSsr = (cfg: {
	entities?: Record<string, IEntity>;
	categories?: string[];
	locale?: string;
	stat?: boolean;
	fetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response>;
}): Promise<[IDefectsStoreStates, string, void]> => {
	initAPI(cfg.fetch);
	return Promise.all([
		defectStore.ssr({ entities: cfg.entities, categories: cfg.categories }),
		cfg.stat ? statStore.ssr() : '',
		localeStore.ssr(cfg.locale)
	]);
};
export const appCsr = ([defectStoreState, statStoreState]: [IDefectsStoreStates, string, void]) => {
	return Promise.all([
		defectStore.csr(defectStoreState),
		statStore.csr(statStoreState),
		localeStore.csr()
	]);
};
