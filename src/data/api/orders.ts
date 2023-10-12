import { ProductModel } from 'src/stores/types';
import { OrderStatusType, OrderType } from '../../constants/common.enum';
import { URLProvider, tryAuthFetch } from '../helpers';

export interface GetOrdersAPIResponse {
  orderId: number;
  orderDetailID: number;
  dateTime: string;
  orderTypeID: string;
  orderType: string;
  supplierName: string;
  orderGroup: string;
  orderArea: string;
  status: OrderStatusType;
  orderStatusTypeID: number;
  orderTotal: number;
  receivedTotal: number;
  subTotal: number;
  shippedSubTotal: number;
  shippedTax: number;
  shippedTotal: number;
  tax: number;
  exception: string;
  user: string;
  supplierPartyRoleID: number;
  products: ProductModel[];
  comments: string;
  unitPrice: number;
  taxStatus: string;
  area: number;
  inventoryAssignmentID: number;
  quantityOrdered: number;
  quantityShipped: number;
  orderDetailList: [
    {
      orderID: number;
      partyRelationshipID: number;
      area: number;
      taxStatus: number;
      orderGroup: number;
      inventoryAssignmentID: number;
      basePrice: number;
      qtyOrdered: number;
      isTaxable: number;
      tax: number;
    },
  ];
  partyRelationshipID: number;
  orderMethodTypeID: number;
  orderGroupID: number;
  orderAreaID: number;
  taxRate: number;
  supplier: string;
  identifier: string;
  totalCost: string;
  customPONumber: string;
  isReceived: string;
  fromDateTime: string;
  toDateTime: string;
  jobID: number;
  isPORequired: string;
  isShipped: number;
  isFromPrimarySupplier: string;
  orderDetails: [
    {
      orderID: number;
      inventoryAssignmentID: number;
      price: number;
      orderQty: number;
      isTaxable: number;
      jobID: number;
    },
  ];
  repairFacilityID: number;
  supplierID: number;
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

export const getProductByOrderTypeAndSupplierAPI = (
  scanCode: string,
  supplierId: number,
  stockId?: number,
  orderType?: OrderType,
) => {
  const url = new URLProvider().getProductByOrderTypeAndSupplier(
    scanCode,
    supplierId,
    stockId,
    orderType,
  );

  return tryAuthFetch<GetOrderSummaryProduct>({
    url,
    request: { method: 'GET' },
  });
};
