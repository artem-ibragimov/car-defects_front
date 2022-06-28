import axios from 'axios';
import { createBrandAPI } from './brand.api';
import { createSearchAPI } from './search.api';

// !FIXME
const baseURL = 'http://localhost:8081';
const http = axios.create({
   baseURL,
   headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
   },
   transformRequest: [
      (data) => JSON.stringify(data)
   ],
   transformResponse: [
      (data: string, header) => header && header['content-type'] === 'application/json; charset=utf-8' && data ? JSON.parse(data) : data,
   ],
});

// http.interceptors.response.use<object>(({ data }) => data, (error) => {
//    if (error.response) {
//       if (error.response.data && error.response.data.error) {
//          return Promise.reject(error.response.data.error);
//       }
//       return Promise.reject(error.response);
//    }
//    return Promise.reject(error);
// });

export const API = {
   brand: createBrandAPI(http),
   search: createSearchAPI(http)
};