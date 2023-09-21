import { getRoleManagerAPI } from './getRoleManager';
import { loginAPI, LoginAPIParams } from './login';
import { getFetchStockAPI } from './stocksAPI';
import {
  getFetchProductAPI,
  removeProductAPI,
  RemoveProductResponse,
  returnProductAPI,
  getFetchProductByFacilityIdAPI,
} from './productsAPI';
import { getFetchJobsAPI } from './jobsAPI';
import { createInvoiceAPI } from './createInvoiceAPI';
import {
  getOrdersAPI,
  GetOrdersAPIResponse,
  GetOrderDetailsResponse,
  getOrderDetails,
  receiveOrderAPI,
  getOrderSummaryDetailsAPI,
  getOrderStorageAreaAPI,
} from './orders';
import { refreshTokenAPI } from './refreshToken';

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
  getOrdersAPI,
  getOrderDetails,
  refreshTokenAPI,
  receiveOrderAPI,
  getOrderSummaryDetailsAPI,
  getOrderStorageAreaAPI,
};
export type {
  LoginAPIParams,
  RemoveProductResponse,
  GetOrdersAPIResponse,
  GetOrderDetailsResponse,
};
