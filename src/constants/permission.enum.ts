export enum Permission {
  /**
   * The flag representing the View permission for the Profile sub-module under My Account module.
   */
  Insights_Dashboard_View = 0,

  /**
   * The flag representing the Edit permission for the Profile sub-module under My Account module.
   */
  Insights_DashboardData_Edit = 1,

  /**
   * The flag representing the Create permission for the Notifications sub-module under My Account module.
   */
  Insights_DashboardData_Delete = 2,

  /**
   * The flag representing the View permission for the Notifications sub-module under My Account module.
   */
  Insights_PerformanceTargets_Edit = 3,

  /**
   * The flag representing the Edit permission for the Jobs sub-module under Planning module.
   */
  Planning_Jobs_Edit = 4,

  /**
   * The flag representing the View permission for the Jobs sub-module under Planning module.
   */
  Planning_Jobs_View = 5,

  /**
   * The flag representing the Create permission for the Jobs sub-module under Planning module.
   */
  Planning_Jobs_Create = 6,

  /**
   * The flag representing the Close permission for the Jobs sub-module under Planning module.
   */
  Planning_Jobs_Close = 7,

  /**
   * The flag representing the View permission for the Product Barcodes sub-module under Reports module.
   */
  Planning_Invoices_Edit = 8,

  /**
   * The flag representing the View permission for the Inventory sub-module under Reports module.
   */
  Planning_Invoices_View = 9,

  /**
   * The flag representing the View permission for the Jobs sub-module under Reports module.
   */
  Planning_Invoices_Create = 10,

  /**
   * The flag representing the View permission for the Jobs sub-module under Reports module.
   */
  Planning_Invoices_Delete = 11,

  /**
   * The flag representing the View permission for the KPIs sub-module under Reports module.
   */
  Planning_Templates_View = 12,

  /**
   * The flag representing the View permission for the Orders sub-module under Reports module.
   */
  Planning_Templates_Create = 13,

  /**
   * The flag representing the View permission for the Security sub-module under Reports module.
   */
  Planning_Templates_Edit = 14,

  /**
   * The flag representing the View permission for the User Barcode sub-module under Reports module.
   */
  Planning_Templates_Delete = 15,

  /**
   * The flag representing the Edit permission for the Dashboard sub-module under Distributor Tools module.
   */
  Planning_MaterialCatalog_View = 16,

  /**
   * The flag representing the Delete permission for the Dashboard sub-module under Distributor Tools module.
   */
  Planning_MaterialCatalog_Edit = 17,

  /**
   * The flag representing the Create permission for the Repair Order Templates sub-module under Planning module.
   */
  Planning_MaterialCatalog_Delete = 18,

  /**
   * The flag representing the View permission for the Repair Order Templates sub-module under Planning module.
   */
  Planning_Guides_View = 19,

  /**
   * The flag representing the Receive permission for the Stock sub-module under Inventory module.
   */
  InventoryManagement_Stock_Stock_Receive = 20,

  /**
   * The flag representing the Remove permission for the Stock sub-module under Inventory module.
   */
  InventoryManagement_Stock_Stock_Remove = 21,

  /**
   * The flag representing the Edit permission for the Stock sub-module under Inventory module.
   */
  InventoryManagement_Stock_Stock_Edit = 22,

  /**
   * The flag representing the Receive permission for the Stock Mobile sub-module under Inventory module.
   */
  InventoryManagement_StockMobile_Receive = 23,

  /**
   * The flag representing the Return permission for the Stock Mobile sub-module under Inventory module.
   */
  InventoryManagement_StockMobile_Return = 24,

  /**
   * The flag representing the Remove permission for the Stock Mobile sub-module under Inventory module.
   */
  InventoryManagement_StockMobile_Remove = 25,

  /**
   * The flag representing the Edit permission for the Stock Mobile sub-module under Inventory module.
   */
  InventoryManagement_StockMobile_Edit = 26,

  /**
   * The flag representing the Edit permission for the Material Catalog sub-module under Planning module.
   */
  InventoryManagement_ProductsInStock_Edit = 27,

  /**
   * The flag representing the Delete permission for the Material Catalog sub-module under Planning module.
   */
  InventoryManagement_ProductsInStock_Create = 28,

  /**
   * The flag representing the Create permission for the Jobs sub-module under Planning module.
   */
  InventoryManagement_ProductsInStock_Delete = 29,

  /**
   * The flag representing the View permission for the Jobs sub-module under Planning module.
   */
  InventoryManagement_ProductsInStockMobile_Edit = 30,

  /**
   * The flag representing the Edit permission for the Jobs sub-module under Planning module.
   */
  InventoryManagement_ProductsInStockMobile_Create = 31,

  /**
   * The flag representing the Delete permission for the Jobs sub-module under Planning module.
   */
  InventoryManagement_ProductsInStockMobile_Delete = 32,

  /**
   * The flag representing the Create permission for the Profile sub-module under Facilities module.
   */
  InventoryManagement_SpecialOrdersDesktop_Edit = 33,

  /**
   * The flag representing the View permission for the Profile sub-module under Facilities module.
   */
  InventoryManagement_SpecialOrdersDesktop_Create = 34,

  /**
   * The flag representing the Edit permission for the Profile sub-module under Facilities module.
   */
  InventoryManagement_SpecialOrdersDesktop_Delete = 35,

  /**
   * The flag representing the Delete permission for the Profile sub-module under Facilities module.
   */
  InventoryManagement_Order_View = 36,

  /**
   * The flag representing the Create permission for the Stock Location sub-module under Inventory Management module.
   */
  InventoryManagement_Order_Create = 37,

  /**
   * The flag representing the View permission for the Stock Location sub-module under Inventory Management module.
   */
  InventoryManagement_Order_Edit = 38,

  /**
   * The flag representing the Edit permission for the Stock Location sub-module under Inventory Management module.
   */
  InventoryManagement_Order_Delete = 39,

  /**
   * The flag representing the Delete permission for the Stock Location sub-module under Inventory Management module.
   */
  InventoryManagement_OrderMobile_View = 40,

  /**
   * The flag representing the Create permission for the Hardware sub-module under Inventory Management module.
   */
  InventoryManagement_OrderMobile_Create = 41,

  /**
   * The flag representing the View permission for the Hardware sub-module under Inventory Management module.
   */
  InventoryManagement_OrderMobile_Edit = 42,

  /**
   * The flag representing the Edit permission for the Hardware sub-module under Inventory Management module.
   */
  InventoryManagement_OrderMobile_Delete = 43,

  /**
   * The flag representing the Delete permission for the Hardware sub-module under Inventory Management module.
   */
  InventoryManagement_Distributors_View = 44,

  /**
   * The flag representing the Create permission for the Distributors sub-module under Inventory Management module.
   */
  InventoryManagement_Distributors_Edit = 45,

  /**
   * The flag representing the View permission for the Distributors sub-module under Inventory Management module.
   */
  InventoryManagement_Distributors_Create = 46,

  /**
   * The flag representing the Edit permission for the Distributors sub-module under Inventory Management module.
   */
  InventoryManagement_Distributors_Delete = 47,

  /**
   * The flag representing the Delete permission for the Distributors sub-module under Inventory Management module.
   */
  InventoryManagement_Insights_View = 48,

  /**
   * The flag representing the Create permission for the Products sub-module under Inventory Management module.
   */
  Reports_Barcodes_View = 49,

  /**
   * The flag representing the View permission for the Products sub-module under Inventory Management module.
   */
  Reports_Inventory_View = 50,

  /**
   * The flag representing the Edit permission for the Products sub-module under Inventory Management module.
   */
  Reports_Jobs_View = 51,

  /**
   * The flag representing the Delete permission for the Products sub-module under Inventory Management module.
   */
  Reports_KPIs_View = 52,

  /**
   * The flag representing the Create permission for the Inventory sub-module under Inventory Management module.
   */
  Reports_Orders_View = 53,

  /**
   * The flag representing the View permission for the Inventory sub-module under Inventory Management module.
   */
  Reports_Security_View = 54,

  /**
   * The flag representing the Delete permission for the Inventory sub-module under Inventory Management module.
   */
  Reports_Users_View = 55,

  /**
   * The flag representing the Create permission for the Order sub-module under Inventory Management module.
   */
  ConsultingTools_Dashboard_View = 56,

  /**
   * The flag representing the View permission for the Order sub-module under Inventory Management module.
   */
  ConsultingTools_ContractManagement_View = 57,

  /**
   * The flag representing the Edit permission for the Order sub-module under Inventory Management module.
   */
  ConsultingTools_ContractManagement_Create = 58,

  /**
   * The flag representing the Delete permission for the Order sub-module under Inventory Management module.
   */
  ConsultingTools_InstallationModeMobile_View = 59,

  /**
   * The flag representing the Create permission for the Users sub-module under Administration module.
   */
  ConsultingTools_Territories_View = 60,

  /**
   * The flag representing the View permission for the Users sub-module under Administration module.
   */
  ConsultingTools_Territories_Create = 61,

  /**
   * The flag representing the Edit permission for the Users sub-module under Administration module.
   */
  ConsultingTools_Territories_Delete = 62,

  /**
   * The flag representing the Delete permission for the Users sub-module under Administration module.
   */
  ConsultingTools_Territories_Edit = 63,

  //
  // ************************************
  // * Limit of ulong reached

  /**
   * The flag representing the View permission for the Unresolved Products  sub-module under Consulting Tools module.
   */
  ConsultingTools_UnresolvedProducts_UnresolvedProducts_View = 64,

  /**
   * The flag representing the Edit permission for the Unresolved Products  sub-module under Consulting Tools module.
   */
  ConsultingTools_UnresolvedProducts_UnresolvedProducts_Edit = 65,

  /**
   * The flag representing the Approve permission for the Unresolved Products  sub-module under Consulting Tools module.
   */
  ConsultingTools_UnresolvedProducts_UnresolvedProducts_Approve = 66,

  /**
   * The flag representing the Edit permission for the Subscription sub-module under Administration module.
   */
  Administration_ShopUsers_View = 67,

  /**
   * The flag representing the Delete permission for the Subscription sub-module under Administration module.
   */
  Administration_ShopUsers_Create = 68,

  /**
   * The flag representing the Create permission for the Territories sub-module under Administration module.
   */
  Administration_ShopUsers_Edit = 69,

  /**
   * The flag representing the View permission for the Territories sub-module under Administration module.
   */
  Administration_ShopUsers_Delete = 70,

  /**
   * The flag representing the Edit permission for the Territories sub-module under Administration module.
   */
  Administration_DistributorUsers_Edit = 71,

  /**
   * The flag representing the Delete permission for the Territories sub-module under Administration module.
   */
  Administration_DistributorUsers_Create = 72,

  /**
   * The flag representing the Create permission for the Region sub-module under Administration module.
   */
  Administration_DistributorUsers_Delete = 73,

  /**
   * The flag representing the View permission for the Region sub-module under Administration module.
   */
  Administration_Devices_View = 74,

  /**
   * The flag representing the Edit permission for the Region sub-module under Administration module.
   */
  Administration_Devices_Create = 75,

  /**
   * The flag representing the Delete permission for the Region sub-module under Administration module.
   */
  Administration_Devices_Edit = 76,

  /**
   * The flag representing the Delete permission for the Devices sub-module under Administration module.
   */
  Administration_Devices_Delete = 77,

  /**
   * The flag representing the View permission for the Stock Locations Without Serial Number sub-module under Administration module.
   */
  Administration_StockLocationsWithoutSerialNumber_View = 78,

  /**
   * The flag representing the Edit permission for the Stock Locations Without Serial Number sub-module under Administration module.
   */
  Administration_StockLocationsWithoutSerialNumber_Edit = 79,

  /**
   * The flag representing the Create permission for the Stock Locations Without Serial Number sub-module under Administration module.
   */
  Administration_StockLocationsWithoutSerialNumber_Create = 80,

  /**
   * The flag representing the Delete permission for the Stock Locations Without Serial Number sub-module under Administration module.
   */
  Administration_StockLocationsWithoutSerialNumber_Delete = 81,

  /**
   * The flag representing the View permission for the Stock Locations With Serial Numbers sub-module under Administration module.
   */
  Administration_StockLocationsWithSerialNumbers_View = 82,

  /**
   * The flag representing the Edit permission for the Stock Locations With Serial Numbers sub-module under Administration module.
   */
  Administration_StockLocationsWithSerialNumbers_Edit = 83,

  /**
   * The flag representing the Create permission for the Stock Locations With Serial Numbers sub-module under Administration module.
   */
  Administration_StockLocationsWithSerialNumbers_Create = 84,

  /**
   * The flag representing the Delete permission for the Stock Locations With Serial Numbers sub-module under Administration module.
   */
  Administration_StockLocationsWithSerialNumbers_Delete = 85,

  /**
   * The flag representing the View permission for the Stock Locations (Mobile) sub-module under Administration module.
   */
  Administration_StockLocationsMobile_View = 86,

  /**
   * The flag representing the Edit permission for the Stock Locations (Mobile) sub-module under Administration module.
   */
  Administration_StockLocationsMobile_Edit = 87,

  /**
   * The flag representing the Create permission for the Stock Locations (Mobile) sub-module under Administration module.
   */
  Administration_StockLocationsMobile_Create = 88,

  /**
   * The flag representing the Delete permission for the Stock Locations (Mobile) sub-module under Administration module.
   */
  Administration_StockLocationsMobile_Delete = 89,

  /**
   * The flag representing the View permission for the Facilities sub-module under Administration module.
   */
  Administration_Facilities_View = 90,

  /**
   * The flag representing the Edit permission for the Facilities sub-module under Administration module.
   */
  Administration_Facilities_Edit = 91,

  /**
   * The flag representing the Create permission for the Facilities sub-module under Administration module.
   */
  Administration_Facilities_Create = 92,

  /**
   * The flag representing the Delete permission for the Facilities sub-module under Administration module.
   */
  Administration_Facilities_Delete = 93,

  /**
   * The flag representing the View permission for the Profile sub-module under Administration module.
   */
  Administration_Profile_View = 94,

  /**
   * The flag representing the Edit permission for the Profile sub-module under Administration module.
   */
  Administration_Profile_Edit = 95,

  /**
   * The flag representing the View permission for the Subscription sub-module under Administration module.
   */
  Administration_Subscription_View = 96,

  /**
   * The flag representing the Edit permission for the Subscription sub-module under Administration module.
   */
  Administration_Subscription_Edit = 97,

  /**
   * The flag representing the Create permission for the Subscription sub-module under Administration module.
   */
  Administration_Subscription_Create = 98,

  /**
   * The flag representing the View permission for the Integrations sub-module under Administration module.
   */
  Administration_Integrations_View = 99,

  /**
   * The flag representing the Edit permission for the Integrations sub-module under Administration module.
   */
  Administration_Integrations_Edit = 100,

  /**
   * The flag representing the Create permission for the Integrations sub-module under Administration module.
   */
  Administration_Integrations_Create = 101,

  /**
   * The flag representing the Delete permission for the Integrations sub-module under Administration module.
   */
  Administration_Integrations_Delete = 102,

  /**
   * The flag representing the View permission for the Notifications sub-module under Administration module.
   */
  Notifications_Notifications_View = 103,

  /**
   * The flag representing the Create permission for the Notifications sub-module under Administration module.
   */
  Notifications_Notifications_Create = 104,

  /**
   * The flag representing the View permission for the PUROptimization sub-module under ContractManagement module.
   */
  ConsultingTools_PUROptimization_View = 105,

  /**
   * The flag representing the Edit permission for the PUROptimization sub-module under ContractManagement module.
   */
  ConsultingTools_PUROptimization_Edit = 106,

  /**
   * The flag representing the Create permission for the PUROptimization sub-module under ContractManagement module.
   */
  ConsultingTools_PUROptimization_Create = 107,

  /**
   * The flag representing the Delete permission for the PUROptimization sub-module under ContractManagement module.
   */
  ConsultingTools_PUROptimization_Delete = 108,

  /**
   * The flag representing the Delete permission for the Material Catalog sub-module under Planning module.
   */
  InventoryManagement_ProductsInStock_View = 109,

  /**
   * The flag representing the View permission for the Dashboard sub-module under Distributor Tools.
   */
  DistributorTools_Dashboard_View = 110,

  /**
   * The flag representing the Delete permission for the Dashboard sub-module under Distributor Tools.
   */
  DistributorTools_Dashboard_Delete = 111,

  /**
   * The flag representing the Edit permission for the Dashboard sub-module under Distributor Tools.
   */
  DistributorTools_Dashboard_Edit = 112,

  /**
   * The flag representing the Create  permission for the Dashboard sub-module under Distributor Tools.
   */
  DistributorTools_Dashboard_Create = 113,

  /**
   * The flag representing the View permission for the BranchUsers sub-module under Distributor Tools.
   */
  DistributorTools_BranchUsers_View = 114,

  /**
   * The flag representing the Delete permission for the BranchUsers sub-module under Distributor Tools.
   */
  DistributorTools_BranchUsers_Delete = 115,

  /**
   * The flag representing the Edit permission for the BranchUsers sub-module under Distributor Tools.
   */
  DistributorTools_BranchUsers_Edit = 116,

  /**
   * The flag representing the Create  permission for the BranchUsers sub-module under Distributor Tools.
   */
  DistributorTools_BranchUsers_Create = 117,

  /**
   * The flag representing the View permission for the BranchProfile sub-module under Distributor Tools.
   */
  DistributorTools_BranchProfile_View = 118,

  /**
   * The flag representing the Delete permission for the BranchProfile sub-module under Distributor Tools.
   */
  DistributorTools_BranchProfile_Delete = 119,

  /**
   * The flag representing the Edit permission for the BranchProfile sub-module under Distributor Tools.
   */
  DistributorTools_BranchProfile_Edit = 120,

  /**
   * The flag representing the Create  permission for the BranchProfile sub-module under Distributor Tools.
   */
  DistributorTools_BranchProfile_Create = 121,

  /**
   * The flag representing the View permission for the User Import sub-module under Consulting Tools module.
   */
  ConsultingTools_UserImport_View = 122,

  /**
   * The flag representing the View permission for the User Import sub-module under Consulting Tools module.
   */
  ConsultingTools_UserImport_Create = 123,
}
