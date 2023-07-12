import { getRoleManagerAPI } from './getRoleManager';
import { loginAPI, LoginAPIParams } from './login';
import { getFetchStockAPI } from './stocksAPI';
import {
  getFetchProductAPI,
  removeProductAPI,
  RemoveProductResponse,
  returnProductAPI,
  getFetchProductByFacilityIdAPI
} from './productsAPI';
import { getFetchJobsAPI } from './jobsAPI';
import { createInvoiceAPI } from './createInvoiceAPI';

export {
  getRoleManagerAPI,
  loginAPI,
  getFetchStockAPI,
  getFetchProductAPI,
  getFetchJobsAPI,
  removeProductAPI,
  returnProductAPI,
  createInvoiceAPI,
  getFetchProductByFacilityIdAPI,
};
export type { LoginAPIParams, RemoveProductResponse };
