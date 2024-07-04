import { getRoleManagerAPI } from './getRoleManager';
import { loginAPI, LoginAPIParams } from './login';
import { getFetchStockAPI, getFetchStockByDeviceNameAPI } from './stocksAPI';
import {
  getFetchProductAPI,
  removeProductAPI,
  RemoveProductResponse,
  returnProductAPI,
  getFetchProductByFacilityIdAPI,
  getFetchProductsByFacilityIdAPI,
} from './productsAPI';
import {
  getFetchJobsAPI,
  getFetchJobsByProductAPI,
  getFetchJobDetailQuantityAPI,
} from './jobsAPI';
import {
  createInvoiceAPI,
  createJobAPI,
  checkIsExistJobAPI,
} from './createInvoiceAPI';
import {
  getOrdersAPI,
  GetOrdersAPIResponse,
  GetOrderDetailsResponse,
  getOrderDetails,
  receiveOrderAPI,
  getOrderSummaryDetailsAPI,
  getOrderStorageAreaAPI,
} from './orders';

export {
  getFetchStockByDeviceNameAPI,
  getRoleManagerAPI,
  loginAPI,
  getFetchStockAPI,
  getFetchProductAPI,
  getFetchJobsAPI,
  getFetchJobsByProductAPI,
  getFetchJobDetailQuantityAPI,
  removeProductAPI,
  returnProductAPI,
  createInvoiceAPI,
  getFetchProductByFacilityIdAPI,
  getFetchProductsByFacilityIdAPI,
  getOrdersAPI,
  getOrderDetails,
  receiveOrderAPI,
  getOrderSummaryDetailsAPI,
  getOrderStorageAreaAPI,
  createJobAPI,
  checkIsExistJobAPI,
};
export type {
  LoginAPIParams,
  RemoveProductResponse,
  GetOrdersAPIResponse,
  GetOrderDetailsResponse,
};
