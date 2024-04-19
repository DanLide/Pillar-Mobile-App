import { StockModel } from 'src/modules/stocksList/stores/StocksStore';
import {
  OrderMethodType,
  OrderStatusType,
  OrderType,
} from 'src/constants/common.enum';
import { URLProvider, tryAuthFetch } from '../helpers';
import { ProductModel } from 'src/stores/types';

export interface GetOrdersAPIResponse {
  area: number;
  inventoryAssignmentId: number;
  isShipped: number;
  jobId: number;
  orderAreaId: number;
  orderDetailId: number;
  orderDetails: OrderDetailsProduct[];
  orderGroupId: number;
  orderId: number;
  orderMethodTypeId: OrderMethodType;
  orderStatusTypeId: number;
  orderTotal: number;
  partyRelationshipId: number;
  products: ProductModel[];
  quantityOrdered: number;
  quantityShipped: number;
  receivedTotal: number;
  shippedSubTotal: number;
  shippedTax: number;
  shippedTotal: number;
  subTotal: number;
  supplierPartyRoleId: number;
  tax: number;
  taxRate: number;
  totalCost: string;
  unitPrice: number;
  status: OrderStatusType;
  orderTypeId?: OrderType;
  orderType?: string;
  supplierName?: string;
  orderGroup?: string;
  orderArea?: string;
  exception?: string;
  user?: string;
  comments?: string;
  taxStatus?: string;
  supplier?: string;
  identifier?: string;
  customPONumber?: string;
  isReceived?: string;
  dateTime?: string;
  fromDateTime?: string;
  toDateTime?: string;
  isPORequired?: string;
  isFromPrimarySupplier?: string;
  repairFacilityId?: number;
  supplierId?: number;
}

export interface OrderDetailsProduct {
  inventoryAssignmentId?: number;
  price?: number;
  orderQty?: number;
  isTaxable?: number;
  jobId?: number;
}

export interface OrderProductResponse {
  // id: number;
  product: string;
  productId: number;
  manufactureCode: string;
  partNo: string;
  size: string;
  name: string;
  cost: number;
  onHand: number;
  onOrder: number;
  consignmentQty: number;
  extQty: number;
  unitsPer: number;
  quantityOnHand: number;
  extCost: number;
  shippedQty: number;
  orderedQty: number;
  receivedQty: number;
  isTaxable: boolean;
  markup: number;
  tax: number;
  inventoryUseTypeId: number;
  receivableQty: number;
  min: number;
  max: number;
  inventoryAssignmentTypeId: number;
  errorMessage?: string;
}

export interface GetOrderSummaryProduct extends OrderProductResponse {
  orderDetailId: number;
  storageAreaId: number;
  storageAreaName: string;
  cabinets: StockModel[];
}

export interface GetOrderSummaryAPIResponse {
  order: GetOrdersAPIResponse;
  productList: GetOrderSummaryProduct[];
}

export interface GetOrderDetailsResponse {
  order: GetOrdersAPIResponse;
  productList: OrderProductResponse[];
}

export interface GetOrderStorageAreaResponse {
  partyRoleId: number;
}

export interface ReceiveOrderRequestProduct {
  number?: string;
  orderDetailId: number;
  partyRoleId: number;
  productId: number;
  transactionTypeId: number;
  unitCost: number;
  quantityReceived: number;
  comments: string;
}

export interface CreateOrderRequestPayload
  extends Pick<
    GetOrdersAPIResponse,
    | 'comments'
    | 'orderArea'
    | 'orderDetails'
    | 'orderGroup'
    | 'orderId'
    | 'orderMethodTypeId'
    | 'orderTotal'
    | 'orderTypeId'
    | 'taxStatus'
    | 'repairFacilityId'
    | 'supplierId'
  > {
  customPoNumber: string;
}

export const getOrdersAPI = () => {
  const url = new URLProvider().getOrders();
  return tryAuthFetch<GetOrdersAPIResponse[]>({
    url,
    request: { method: 'GET' },
  });
};

export const getOrderDetails = (orderId: string) => {
  const url = new URLProvider().getOrderDetails(orderId);
  return tryAuthFetch<GetOrderDetailsResponse>({
    url,
    request: { method: 'GET' },
  });
};

export const getOrderSummaryDetailsAPI = (
  orderId: number,
  partyRoleId: number,
) => {
  const url = new URLProvider().getOrderSummaryDetailsAPI(orderId, partyRoleId);
  return tryAuthFetch<GetOrderSummaryAPIResponse>({
    url,
    request: { method: 'GET' },
  });
};

export const getOrderStorageAreaAPI = (orderId: number) => {
  const url = new URLProvider().getOrderStorageAreaAPI(orderId);
  return tryAuthFetch<GetOrderStorageAreaResponse[]>({
    url,
    request: { method: 'GET' },
  });
};

export const receiveOrderAPI = (products: ReceiveOrderRequestProduct[]) => {
  const url = new URLProvider().receiveOrder();

  return tryAuthFetch<string>({
    url,
    request: {
      body: JSON.stringify(products),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
};

export const receiveBackOrderAPI = (products: ReceiveOrderRequestProduct[]) => {
  const url = new URLProvider().receiveBackOrder();

  return tryAuthFetch<string>({
    url,
    request: {
      body: JSON.stringify(products),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
};

export const getProductByOrderTypeAndSupplierAPI = (
  scanCode: string,
  orderType?: OrderType,
) => {
  const url = new URLProvider().getProductByOrderTypeAndSupplier(
    scanCode,
    orderType,
  );

  return tryAuthFetch<GetOrderSummaryProduct>({
    url,
    request: { method: 'GET' },
  });
};

export const getProductMultipleStocks = (scanCode: string) => {
  const url = new URLProvider().getProductMultipleStocks(scanCode);

  return tryAuthFetch<GetOrderSummaryProduct[]>({
    url,
    request: { method: 'GET' },
  });
};

export const getSuggestedProductsAPI = () => {
  const url = new URLProvider().getSuggestedProductsAPI();

  return tryAuthFetch<OrderProductResponse[]>({
    url,
    request: { method: 'GET' },
  });
};

export const createOrderAPI = (payload: CreateOrderRequestPayload) => {
  const url = new URLProvider().createOrder();

  return tryAuthFetch<GetOrdersAPIResponse[]>({
    url,
    request: {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
};

export const updatePONumberAPI = (orderId: number, CustomPONumber: string) => {
  const url = new URLProvider().updatePONumber();

  const body = JSON.stringify([{ orderId, CustomPONumber }]);

  return tryAuthFetch<string>({
    url,
    request: {
      body,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
};
