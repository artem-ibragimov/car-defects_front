import type { AxiosInstance } from 'axios';

export const createSearchAPI = (http: AxiosInstance): ISearchAPI => {
   return {
      search(query: string) {
         return http.get('/data/search', { params: { query } });
      }
   };
};
export interface ISearchAPI {
   search(query: string): Promise<{
      data: {
         brands: Record<number, string>,
         models: Record<number, string>;
         gens: Record<number, string>;
      },
      status: number;
   }>;
}