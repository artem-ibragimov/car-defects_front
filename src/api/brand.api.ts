import type { AxiosInstance } from 'axios';

export const createBrandAPI = (http: AxiosInstance) => {
   return {
      getBrandList() {
         return http.get('/data/brand');
      }
   };
};