import type { AxiosInstance, AxiosResponse } from 'axios';

export const createBrandAPI = (http: AxiosInstance) => {
   return {
      getBrands(): Promise<AxiosResponse<Record<number, string>>> {
         return http.get('/data/brand');
      }
   };
};