import type { AxiosInstance, AxiosResponse } from 'axios';

export const createGenAPI = (http: AxiosInstance) => {
   return {
      getGensByModel(model_id: number): Promise<AxiosResponse<Record<number, IGenData>>> {
         return http.get('/data/generation', { params: { model_id } });
      }
   };
};

export interface IGenData {
   name: string;
   img: string;
   start: number;
   finish: number;
}