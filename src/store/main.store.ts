import { API } from 'src/api/main.api';
import { createBrandStore } from 'src/store/brand.store';
import { createNav } from './route.store';

export const brandsStore = createBrandStore(API.brand);

export const nav = createNav();
export const init = () => {
   brandsStore.load();
};