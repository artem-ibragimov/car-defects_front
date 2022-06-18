import { LOAD_ERROR } from 'src/api/error';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
   list: [],
   error: null
};

export const createBrandStore = (api) => {
   const state = writable<IState>({ ...DEFAULT_STATE });

   const setState = (values: Partial<IState>) => {
      state.set(Object.assign({}, DEFAULT_STATE, values));
   };

   const loadList = () => {
      api.getBrandList().then(({ data, status }) => {
         if (status != 200) {
            debugger
            throw new Error(LOAD_ERROR);
         }
         setState({ list: data });
      }).catch((error) => {
         setState({ error });
      });
   };

   return {
      state,
      loadList
   };
};

interface IState {
   list: Record<BrandID, string>;
   error: Error | null;
}
type BrandID = number;