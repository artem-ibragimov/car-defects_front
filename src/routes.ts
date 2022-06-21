import { ROUTE_NAMES } from './store/route.store';
import AddDataSvelte from './view/AddData.svelte';
import LoadingSvelte from './view/Loading.svelte';
import MainSvelte from './view/Main.svelte';

export const ROUTES = {
   [ROUTE_NAMES.ADD_DATA]: {
      component: AddDataSvelte
   },
   [ROUTE_NAMES.LOADING]: {
      component: LoadingSvelte
   },
   [ROUTE_NAMES.MAIN]: {
      component: MainSvelte
   }
};
