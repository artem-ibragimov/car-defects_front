import type { AxiosInstance, AxiosResponse } from 'axios';

export const createModelAPI = (http: AxiosInstance) => {
   return {
      getModelsByBrand(brand_id:number): Promise<AxiosResponse<Record<number, string>>> {
         return http.get('/data/model', { params: { brand_id } });
      }
   };
};