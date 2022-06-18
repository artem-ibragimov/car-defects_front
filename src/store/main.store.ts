import { createBrandStore } from 'src/store/brand.store';
import { API } from 'src/api/main.api';

export const brandsStore = createBrandStore(API.brand);