import { AuthStore } from 'src/stores/AuthStore';
import { authStore, ssoStore, deviceInfoStore } from 'src/stores';
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
import { OrdersStore } from 'src/modules/orders/stores/OrdersStore';
import { ordersStore } from 'src/modules/orders/stores';
import { StockModel } from '../../modules/stocksList/stores/StocksStore';
import { environment } from './environment';

export class URLProvider {
  authStore: AuthStore;
  ssoStore: SSOStore;
  removeProductsStore: RemoveProductsStore;
  returnProductsStore: ReturnProductsStore;
  ordersStore: OrdersStore;
  currentEnv: {
    b2c: { clientId: string; authority: string; magicLink: string };
    modules: {
      pisaJob: { apiUri: string };
      pisaProduct: { apiUri: string };
      pisaProductSync: { apiUri: string };
      pisaProductCrimpAndCatalog: { apiUri: string };
      pisaProductInventory: { apiUri: string };
      pisaProductSupplier: { apiUri: string };
      pisaUser: { apiUri: string };
      common: { apiUri: string };
      companies: { apiUri: string };
      pisaCompanyLocation: { apiUri: string };
      pisaEquipment: { apiUri: string };
      inventory: { apiUri: string };
      order: { apiUri: string };
      shopSetup: { apiUri: string };
      shopSetupAuthentication: { apiUri: string };
      base: { apiUri: string; webURL: string };
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

  getRoleModelMobileUrl() {
    return new URL(
      `${this.currentEnv.modules.pisaUser.apiUri}/api/Mobile/RoleManager`,
    );
  }

  getAcceptTermsUrl() {
    const partyRoleId = this.authStore.getPartyRoleId;

    return new URL(
      `${this.currentEnv.modules.common.apiUri}/api/Common/partySetting/${partyRoleId}`,
    );
  }

  getDistributorSSOUrl(partyRoleId: number, roleTypeFacilityId: number) {
    return new URL(
      `${this.currentEnv.modules.pisaCompanyLocation.apiUri}/api/RepairFacility/${partyRoleId}/${roleTypeFacilityId}`,
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
    return new URL(
      `${this.currentEnv.modules.pisaUser.apiUri}/api/Account/GetShopsListForMobile`,
    );
  }

  getFetchStockUrl() {
    const partyRoleID = this.authStore.getPartyRoleId;
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaEquipment.apiUri}/api/Equipment/StorageByPartyRoleID/${facilityId}/${PartyRelationshipType.RepairFacilityToStorage}/${partyRoleID}/${PartyRelationshipType.UserToStorage}`,
    );
  }

  getFetchStockByPartyRoleIdUrl() {
    const partyRoleID = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaEquipment.apiUri}/api/Equipment/StorageByPartyRoleID/${partyRoleID}/${PartyRelationshipType.RepairFacilityToStorage}`,
    );
  }

  getShopSetupLoginUrl() {
    return new URL(
      `${this.currentEnv.modules.shopSetupAuthentication.apiUri}/api/login`,
    );
  }

  getDeviceByRepairFacilityIdUrl() {
    const partyRoleID = this.ssoStore.getCurrentSSO?.pisaId;
    return new URL(
      `${this.currentEnv.modules.pisaEquipment.apiUri}/api/Equipment/DeviceByRepairFacilityPartyRoleID/${partyRoleID}`,
    );
  }

  getFetchStocksWithCabinetsData() {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;
    const deviceName = deviceInfoStore.getDeviceName;
    return new URL(
      `${this.currentEnv.modules.pisaEquipment.apiUri}/api/Equipment/StorageByPartyRoleIDAndDeviceID/${facilityId}/${PartyRelationshipType.RepairFacilityToStorage}/${deviceName}`,
    );
  }

  getFetchProductUrl(scanCode: string, partyRoleId?: number) {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/${partyRoleId}/${scanCode}/${facilityId}/0`,
    );
  }

  getFetchProductByFacilityId(scanCode: string) {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaProductSync.apiUri}/api/Sync/${facilityId}/products/${scanCode}`,
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
      `${this.currentEnv.modules.pisaProductSupplier.apiUri}/api/Product/ProductByOrderTypeAndSupplier/${facilityId}/${supplierId}/${scanCode}/${orderType}/${stockId}`,
    );
  }

  getProductMultipleStocks(scanCode: string) {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;
    const supplierId = this.ordersStore.supplierId;
    return `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/StockLocationByProductUPC/${facilityId}/${supplierId}/${scanCode}`;
  }

  getFetchProductsByFacilityId() {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaProduct.apiUri}/api/Product/GetAllProduct/${facilityId}`,
    );
  }

  getCategoriesByFacilityId() {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaProductInventory.apiUri}/api/InventoryClassificationType/InventoryClassification/${facilityId}`,
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
      `${this.currentEnv.modules.pisaProductSupplier.apiUri}/api/ProductSupplier/${facilityId}`,
    );
  }

  getEnabledSuppliersByProductId(productId?: number) {
    return new URL(
      `${this.currentEnv.modules.pisaProductSupplier.apiUri}/api/ProductSupplier/GetSupplierListByProductID/${productId}/true`,
    );
  }

  getFetchJobsBySso() {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaJob.apiUri}/api/Job/GetAllJobs/${facilityId}/OPEN`,
    );
  }

  getFetchJobsByProductUrl(productId: number, partyRoleId: number) {
    return new URL(
      `${this.currentEnv.modules.pisaJob.apiUri}/api/Job/GetJobByProduct/${productId}/${partyRoleId}/1`,
    );
  }

  getFetchJobDetailQuantityUrl(
    jobId: number,
    partyRoleId: number,
    productId: number,
  ) {
    return new URL(
      `${this.currentEnv.modules.pisaJob.apiUri}/api/Job/JobDetailQuantity/${jobId}/${partyRoleId}/${productId}`,
    );
  }

  removeProduct(productId: number, quantity?: number, jobId?: number | null) {
    const partyRoleID = this.removeProductsStore.currentStock?.partyRoleId;

    if (typeof jobId === 'number') {
      return new URL(
        `${this.currentEnv.modules.pisaProductInventory.apiUri}/api/Product/RemoveProduct/${partyRoleID}/${productId}/${jobId}/${quantity}`,
      );
    }
    return new URL(
      `${this.currentEnv.modules.pisaProductInventory.apiUri}/api/Product/RemoveProduct/${partyRoleID}/${productId}/${quantity}`,
    );
  }

  returnProduct(productId: number, quantity?: number, jobDetailId?: number) {
    const partyRoleID = this.returnProductsStore.currentStock?.partyRoleId;

    return new URL(
      `${this.currentEnv.modules.pisaProductInventory.apiUri}/api/Product/ReturnProduct/${partyRoleID}/${productId}/${quantity}/${jobDetailId}`,
    );
  }

  createInvoice(jobId: number) {
    const partyRoleId = this.ssoStore.getCurrentSSO?.pisaId;
    return new URL(
      `${this.currentEnv.modules.pisaJob.apiUri}/api/Invoice/SubmitInvoiceCCC/${partyRoleId}/${jobId}`,
    );
  }

  updateProductQuantity() {
    return new URL(
      `${this.currentEnv.modules.pisaProductInventory.apiUri}/api/InventoryTransaction`,
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
      `${this.currentEnv.modules.pisaProductInventory.apiUri}/api/product/GetAllProduct/${facilityId}/0`,
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

  receiveBackOrder() {
    return new URL(
      `${this.currentEnv.modules.order.apiUri}/api/Order/BackOrder`,
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

  updatePONumber() {
    return new URL(
      `${this.currentEnv.modules.order.apiUri}/api/Order/PONumber`,
    );
  }

  resetMasterlock() {
    return new URL(
      `${this.currentEnv.modules.pisaEquipment.apiUri}/api/Device/MasterLock/ResetKeys`,
    );
  }

  SSOAssignMobileDevice(deviceId: number) {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;

    return new URL(
      `${this.currentEnv.modules.pisaEquipment.apiUri}/api/Equipment/AssignDevice/${deviceId}/${facilityId}`,
    );
  }

  getUnassignedDevices() {
    return new URL(
      `${this.currentEnv.modules.pisaEquipment.apiUri}/api/Equipment/UnassignedEquipment/34`,
    );
  }

  getRNToken() {
    const facilityId = this.ssoStore.getCurrentSSO?.pillarId;
    const deviceId =
      deviceInfoStore.partyRoleId ??
      this.ssoStore.getCurrentMobileDevice(deviceInfoStore.getDeviceName)
        ?.partyRoleId;

    return `${this.currentEnv.modules.base.apiUri}/MAP/api/auth/rn-token/${facilityId}/${deviceId}`;
  }

  setPin(b2cUserId: string) {
    return new URL(
      `${this.currentEnv.modules.base.apiUri}/map/api/auth/set-pin/${b2cUserId}`,
    );
  }

  getLoginLink(b2cUserId: string, pin: string) {
    return new URL(
      `${this.currentEnv.modules.base.apiUri}/map/api/auth/login-link/${b2cUserId}/${pin}`,
    );
  }

  getSSOUsers() {
    const facilityId = this.ssoStore.getCurrentSSO?.pillarId;

    return `${this.currentEnv.modules.base.apiUri}/MAP/api/users/${facilityId}`;
  }

  getLoginMagicLink(b2cUserId: string) {
    return `${this.currentEnv.b2c.magicLink}${b2cUserId}`;
  }

  createJob() {
    return `${this.currentEnv.modules.base.apiUri}/job/api/Job`;
  }

  isJobExist(jobNumber: string) {
    const facilityId = this.ssoStore.getCurrentSSO?.pisaId;
    return `${this.currentEnv.modules.base.apiUri}/job/api/Job/IsJobNumberExists/${facilityId}/${jobNumber}/0`;
  }

  removeDeviceFromSSO(id: string) {
    return `${this.currentEnv.modules.pisaEquipment.apiUri}/api/Equipment/AssignedDevice/${id}`;
  }

  webURL() {
    return `${this.currentEnv.modules.base.webURL}`;
  }
}
