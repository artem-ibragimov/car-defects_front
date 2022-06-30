import type { AxiosResponse } from 'axios';
import { LOAD_ERROR } from 'src/api/error';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
   map: {},
   error: null
};

export const createModelStore = (api: { getModelsByBrand(brand_id: number): Promise<AxiosResponse<Record<number, string>>>; }) => {
   const state = writable<IState>({ ...DEFAULT_STATE });

   const setState = (values: Partial<IState>) => {
      state.set(Object.assign({}, DEFAULT_STATE, values));
   };

   const load = (brand_id: number) => {
      api.getModelsByBrand(brand_id).then(({ data, status }) => {
         if (status != 200) {
            throw new Error(LOAD_ERROR);
         }
         setState({ map: data });
      }).catch((error) => {
         setState({ error });
      });
   };

   return { state, load };
};

interface IState {
   map: Record<ModelID, ModelName>;
   error: Error | null;
}
type ModelID = number;
type ModelName = string;