import { environment } from './environment';
import { AuthStore } from 'src/stores/AuthStore';
import { authStore, ssoStore } from 'src/stores';
import { OrderType, PartyRelationshipType } from 'src/constants/common.enum';
import { SSOStore } from 'src/stores/SSOStore';
import {
  RemoveProductsStore,
  removeProductsStore,
} from 'src/modules/removeProducts/stores';
import {
  ReturnProductsStore,
  returnProductsStore,
} from 'src/modules/returnProducts/stores';
import { StockModel } from 'src/modules/stocksList/stores/StocksStore';
import { OrdersStore } from 'src/modules/orders/stores/OrdersStore';
import { ordersStore } from 'src/modules/orders/stores';

export class URLProvider {
  authStore: AuthStore;
  ssoStore: SSOStore;
  removeProductsStore: RemoveProductsStore;
  returnProductsStore: ReturnProductsStore;
  ordersStore: OrdersStore;
  currentEnv: {
    b2c: { clientId: string; authority: string };
    modules: {
      pisaJob: { apiUri: string };
      pisaProduct: { apiUri: string };
      pisaUser: { apiUri: string };
      common: { apiUri: string };
      companies: { apiUri: string };
      pisaCompanyLocation: { apiUri: string };
      pisaEquipment: { apiUri: string };
      inventory: { apiUri: string };
      order: { apiUri: string };
    };
  };

  constructor(
    auth_store = authStore,
    sso_store = ssoStore,
    remove_products_store = removeProductsStore,
    return_products_store = returnProductsStore,
    orders_store = ordersStore,
  ) {
    this.authStore = auth_store;
    this.ssoStore = sso_store;
    this.removeProductsStore = remove_products_store;
    this.returnProductsStore = return_products_store;
    this.ordersStore = orders_store;
    this.currentEnv = environment;
  }

  getLoginUrl() {
    const url = new URL(`${this.currentEnv.b2c.authority}/oauth2/v2.0/token`);

    url.searchParams.set('grant_type', 'password');
    url.searchParams.set(
      'scope',
      `openid+${this.currentEnv.b2c.clientId}+offline_access`,
    );
    url.searchParams.set('client_id', this.currentEnv.b2c.clientId);

    return url;
  }

  getRoleModelUrl() {
    return new URL(
      `${this.currentEnv.modules.pisaUser.apiUri}/api/RoleManager`,
    );
  }

  getAcceptTermsUrl() {
    const partyRoleId = this.authStore.getPartyRoleId;

    return new URL(
      `${this.currentEnv.modules.common.apiUri}/api/Common/partySetting/${partyRoleId}`,
    );
  }

  getSingleSSOUrl(facilityID: string) {
    return new URL(
      `${this.currentEnv.modules.companies.apiUri}/api/repairFacility/${facilityID}`,
    );
  }

  getMultiSSOUrl(msoID: string) {
    // TODO replace 19 with PartyRelationshipType.MsoToRepairFacility or PartyRelationshipType.DistributorToRepairFacility or PartyRelationshipType.BranchToRepairFacility
    return new URL(
      `${this.currentEnv.modules.pisaCompanyLocation.apiUri}/api/RepairFacility/${msoID}/19`,
    );
  }

  getAllSSOUrl() {
    // TODO replace with constants repairFacilities + '/' + repairFacilityPrimaryContact + '/' + orgPartyRoleId
    return new URL(
      `${this.currentEnv.modules.pisaUser.apiUri}/api/Account/GetAllOrganizations/3/26/1`,
    );
  }

  getFetchStockUrl() {
    const partyRoleID = this.authStore.getPartyRoleId;
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaEquipment.apiUri}/api/Equipment/StorageByPartyRoleID/${facilityId}/${PartyRelationshipType.RepairFacilityToStorage}/${partyRoleID}/${PartyRelationshipType.UserToStorage}`,
    );
  }

  getFetchProductUrl(scanCode: string, currentStock?: StockModel) {
    const partyRoleID = currentStock?.partyRoleId;
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/${partyRoleID}/${scanCode}/${facilityId}/0`,
    );
  }

  getFetchProductByFacilityId(scanCode: string) {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/Sync/${facilityId}/products/${scanCode}`,
    );
  }

  getProductByOrderTypeAndSupplier(
    scanCode: string,
    orderType = OrderType.Purchase,
  ) {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;
    const supplierId = this.ordersStore.supplierId;
    const stockId = 0;

    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/ProductByOrderTypeAndSupplier/${facilityId}/${supplierId}/${scanCode}/${orderType}/${stockId}`,
    );
  }

  getCategoriesByFacilityId() {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/InventoryClassificationType/InventoryClassification/${facilityId}`,
    );
  }

  getProductSettingsById(productId?: number, currentStock?: StockModel) {
    const partyRoleID = currentStock?.partyRoleId;

    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/ProductAreaSettings/${productId}/${partyRoleID}`,
    );
  }

  getSupplierListByFacilityId() {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/ProductSupplier/${facilityId}`,
    );
  }

  getEnabledSuppliersByProductId(productId?: number) {
    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/ProductSupplier/GetSupplierListByProductID/${productId}/true`,
    );
  }

  getFetchJobsBySso() {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaJob.apiUri}/api/Job/GetAllJobs/${facilityId}/OPEN`,
    );
  }

  removeProduct(productId: number, quantity?: number, jobId?: number | null) {
    const partyRoleID = this.removeProductsStore.currentStock?.partyRoleId;

    if (typeof jobId === 'number') {
      return new URL(
        `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/RemoveProduct/${partyRoleID}/${productId}/${jobId}/${quantity}`,
      );
    }
    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/RemoveProduct/${partyRoleID}/${productId}/${quantity}`,
    );
  }

  returnProduct(productId: number, quantity?: number) {
    const partyRoleID = this.returnProductsStore.currentStock?.partyRoleId;

    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/ReturnProduct/${partyRoleID}/${productId}/${quantity}`,
    );
  }

  createInvoice(jobId: number) {
    return new URL(
      `${this.currentEnv.modules.pisaJob.apiUri}/api/Invoice/SubmitInvoiceCCC/${jobId}`,
    );
  }

  updateProductQuantity() {
    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/InventoryTransaction`,
    );
  }

  updateProductSettings(productId?: number) {
    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/UpdateProductSettings/${productId}`,
    );
  }

  updateProductAreaSettings() {
    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/ProductAreaSettings/1`,
    );
  }

  updateProductOrderMultiple() {
    return new URL(
      `${this.currentEnv.modules.inventory.apiUri}/api/Inventory/OrderMultiple`,
    );
  }

  getFacilityProducts() {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/product/GetAllProduct/${facilityId}/-1`,
    );
  }

  getOrders() {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;
    return new URL(
      `${this.currentEnv.modules.order.apiUri}/api/Order/${facilityId}`,
    );
  }

  getOrderDetails(orderId: string) {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;
    return new URL(
      `${this.currentEnv.modules.order.apiUri}/api/Order/OrderSummaryDetailsByProduct/${orderId}/${facilityId}`,
    );
  }

  refreshToken() {
    const url = new URL(`${this.currentEnv.b2c.authority}/oauth2/v2.0/token`);
    url.searchParams.set('grant_type', 'refresh_token');
    url.searchParams.set('client_id', this.currentEnv.b2c.clientId);
    url.searchParams.set('refresh_token', authStore.getRefreshToken || '');

    return `${url}&scope=openid+${this.currentEnv.b2c.clientId}+offline_access`;
  }

  getOrderSummaryDetailsAPI(orderId: number, customPONumber: number) {
    const url = new URL(
      `${this.currentEnv.modules.order.apiUri}/api/Order/OrderSummaryDetails/${orderId}/${customPONumber}`,
    );
    return url;
  }

  getOrderStorageAreaAPI(orderId: number) {
    const url = new URL(
      `${this.currentEnv.modules.order.apiUri}/api/Order/StorageArea/${orderId}`,
    );
    return url;
  }

  receiveOrder() {
    return new URL(
      `${this.currentEnv.modules.order.apiUri}/api/Order/Receive/null`,
    );
  }

  getSuggestedProductsAPI() {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;
    const supplierId = this.ordersStore.supplierId;

    return new URL(
      `${this.currentEnv.modules.order.apiUri}/api/Order/SuggestedList/${facilityId}/${supplierId}`,
    );
  }

  createOrder() {
    return new URL(`${this.currentEnv.modules.order.apiUri}/api/Order/Create`);
  }
}
