import { LOAD_ERROR } from 'src/api/error';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
   list: [],
   map: {},
   error: null
};

export const createBrandStore = (api) => {
   const state = writable<IState>({ ...DEFAULT_STATE });

   const setState = (values: Partial<IState>) => {
      state.set(Object.assign({}, DEFAULT_STATE, values));
   };

   const load = () => {
      api.getBrandList().then(({ data, status }) => {
         if (status != 200) {
            throw new Error(LOAD_ERROR);
         }
         setState({
            list: Object.values(data),
            map: Object.fromEntries(Object.entries(data)) as Record<BrandID, BrandName>
         });
      }).catch((error) => {
         setState({ error });
      });
   };

   return {
      state,
      load
   };
};

interface IState {
   list: BrandName[],
   map: Record<BrandID, BrandName>;
   error: Error | null;
}
type BrandID = number;
type BrandName = string;