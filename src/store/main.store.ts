import { API } from 'src/api/main.api';
import { createBrandStore } from 'src/store/brand.store';
import { createNav } from './route.store';
import { createSearchStore } from './search.store';

export const brandsStore = createBrandStore(API.brand);
export const searchStore = createSearchStore(API.search);
export const nav = createNav();
export const init = () => {
   brandsStore.load();
};