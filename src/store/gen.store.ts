import type { AxiosResponse } from 'axios';
import { LOAD_ERROR } from 'src/api/error';
import type { IGenData } from 'src/api/gen.api';
import { writable } from 'svelte/store';

const DEFAULT_STATE: IState = {
   map: {},
   error: null
};

export const createGenlStore = (api: { getGensByModel(modelID: number): Promise<AxiosResponse<Record<GenID, IGenData>>>; }) => {
   const state = writable<IState>({ ...DEFAULT_STATE });

   const setState = (values: Partial<IState>) => {
      state.set(Object.assign({}, DEFAULT_STATE, values));
   };

   const load = (modelID: number) => {
      api.getGensByModel(modelID).then(({ data, status }) => {
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
   map: Record<GenID, IGenData>;
   error: Error | null;
}
type GenID = number;
type GenName = string;