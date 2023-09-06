import { OrderStatusType } from '../../constants/common.enum';
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
  // TODO https://dev.azure.com/3M-Bluebird/Pillar/_workitems/edit/117082
  products: [];
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
  id: number;
  product: string;
  productId: number;
  manufactureCode: string;
  partNo: string;
  size: string;
  name: string;
  cost: number;
  jobPrice: number;
  onHand: number;
  onOrder: number;
  consignmentQty: number;
  lastActivityDate: null;
  extQty: number;
  unitsPer: number;
  quantityOnHand: number;
  extCost: number;
  shippedQty: number;
  orderedQty: number;
  receivedQty: number;
  isTaxable: boolean;
  isInvoiceable: null;
  markup: number;
  tax: number;
  storageAreaId: number;
  inventoryUseTypeId: number;
  isNonStock: number;
  receivableQty: number;
  min: number;
  max: number;
  isPoRequired: string;
  crimpCategories: null;
  dimension: null;
  is3m: boolean;
  isEnabled: boolean;
  invoiceUnit: null;
  invoiceSize: null;
  inventoryAssignmentTypeId: number;
  stockLocationId: number;
}

export interface GetOrderDetailsResponse {
  order: GetOrdersAPIResponse;
  productList: OrderProductResponse[];
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
