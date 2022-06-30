import { LOAD_ERROR } from 'src/api/error';
import type { ISearchAPI } from 'src/api/search.api';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
   brands: {},
   models: {},
   gens: {},
   error: null
};

export const createSearchStore = (api: ISearchAPI) => {
   const state = writable<IState>({ ...DEFAULT_STATE });

   const setState = (values: Partial<IState>) => {
      state.set(Object.assign({}, DEFAULT_STATE, values));
   };

   const search = (query: string) => {
      api.search(query).then(({ data, status }) => {
         if (status != 200) {
            throw new Error(LOAD_ERROR);
         }
         setState(data);
      }).catch((e: Error) => {
         setState({ error: new Error(e.message) });
      });
   };

   return {
      search, state
   };
};

interface IState {
   brands: Record<number, string>,
   models: Record<number, string>;
   gens: Record<number, string>;
   error: Error | null;
}