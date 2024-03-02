import { API, init as initAPI } from '$lib/api/main.api';
import { createAuthorStore } from '$lib/store/author.store';
import { createBrandStore } from '$lib/store/brand.store';
import { createCountryStore } from '$lib/store/country.store';
import { createDefectStore } from '$lib/store/defect.store';
import { createEngineStore } from '$lib/store/engine.store';
import { createGenlStore } from '$lib/store/gen.store';
import { creatLocaleStore } from '$lib/store/locale.store';
import { createModelStore } from '$lib/store/model.store';
import { createSearchStore } from '$lib/store/search.store';
import { createTransStore } from '$lib/store/trans.store';
import { createVersionStore } from '$lib/store/version.store';
import { createStatStore } from './stat.store';

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

export const appInit = (cfg: {
	url: URL;
	fetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response>;
}) => {
	initAPI(cfg.fetch);
	return Promise.all([defectStore.init(cfg.url), statStore.init()]);
};
