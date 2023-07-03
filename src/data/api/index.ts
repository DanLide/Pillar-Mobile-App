import { getRoleManagerAPI } from './getRoleManager';
import { loginAPI, LoginAPIParams } from './login';
import { getFetchStockAPI } from './stocksAPI';
import {
  getFetchProductAPI,
  removeProductAPI,
  RemoveProductResponse,
  returnProductAPI,
} from './productsAPI';
import { getFetchJobsAPI } from './jobsAPI';

export {
  getRoleManagerAPI,
  loginAPI,
  getFetchStockAPI,
  getFetchProductAPI,
  getFetchJobsAPI,
  removeProductAPI,
  returnProductAPI,
};
export type { LoginAPIParams, RemoveProductResponse };
