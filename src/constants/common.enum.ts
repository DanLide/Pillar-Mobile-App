export enum PartySettingsType {
  AutoCloseJobs = 1,
  AutoCloseJobsDurationInDays = 2,
  AllowAMP = 3,
  AMPValue = 4,
  TimeZone = 5,
  IsPasswordReqChange = 6,
  TaxRate = 7,
  BuildDate = 8,
  PurchaseDate = 9,
  IsLease = 10,
  IsExtWarr = 11,
  MaterialMarkup = 12,
  DateAdded = 13,
  IsSupplyArea = 14,
  DateAssigned = 15,
  JobMaterials = 16,
  LiquidMaterials = 17,
  IsTermsAccepted = 18,
  IsLanguageSelected = 19,
  IsTrainingCompleted = 28,
}

export enum PartyRelationshipType {
  DistributorUsers = 1,
  MsoUsers = 2,
  UserToRegion = 3,
  BranchUsers = 4,
  RepairFacilityUsers = 5,
  OrganizationToDistributor = 6,
  DistributorToBranch = 7,
  BranchToRepairFacility = 8,
  RepairFacilityToOrganization = 9,
  RepairFacilityToCart = 10,
  RepairFacilityToRoom = 11,
  RepairFacilityToUser = 12,
  UserToStockArea = 13,
  RepairFacilityToInsuranceCompany = 14,
  OrganizationToMso = 15,
  MsoToRegion = 16,
  RegionToDistrict = 17,
  DistrictToRepairFacility = 18,
  MsoToRepairFacility = 19,
  RegionToRepairFacility = 20,
  MsoPrimaryContact = 21,
  DistributorPrimaryContact = 22,
  RepairFacilityToMSO = 23,
  DistributorToRegion = 24,
  BranchPrimaryContact = 25,
  RepairFacilityPrimaryContact = 26,
  BranchToRegion = 27,
  RegionToBranch = 28,
  OrganizationToStorage = 29,
  RepairFacilityToSupplier = 30,
  RepairFacilityToCabinet = 29,
  RepairFacilityToExternalSupplier = 30,
  RepairFacilityToStorage = 31,
  RepairFacilityToDevice = 32,
  UserToStorage = 33,
  OrganizationToDevice = 34,
  RFStorageToLTStorage = 35,
  DistributorToRepairFacility = 36
}

// export enum RoleType {
//   Organization = 1,
//   Distributor = 2,
//   Branch = 3,
//   RepairFacility = 4,
//   Cabinet = 5,
//   Cart = 6,
//   Room = 7,
//   SuperUserAdmin = 8,
//   DistributorStandard = 9,
//   BranchManager = 10,
//   BranchDriver = 11,
//   RepairFacilityManager = 12,
//   Mso = 13,
//   Technician = 14,
//   SuperUserStandard = 15,
//   Region = 16,
//   District = 17,
//   MsoAdmin = 18,
//   DistributorRegionalManager = 19,
//   //DistrictManager = 20,
//   GroupManager = 21,
//   MsoStandard = 22,
//   DistributorAdmin = 23,
//   MSORegionalManager = 24,
//   ManufactureCode = 25,
//   InsuranceCompany = 26,
//   Estimator = 27,
//   Mobile = 28,
//   StockRoom = 29,
//   SL22 = 30,
//   Supplier = 31,
//   ThreeMRep = 20,
// }
//
//
// export enum PartyRelationshipType {
//   DistributorUsers = 1,
//   MsoUsers = 2,
//   UserToRegion = 3,
//   BranchUsers = 4,
//   RepairFacilityUsers = 5,
//   OrganizationToDistributor = 6,
//   DistributorToBranch = 7,
//   BranchToRepairFacility = 8,
//   RepairFacilityToOrganization = 9,
//   RepairFacilityToCart = 10,
//   RepairFacilityToRoom = 11,
//   RepairFacilityToUser = 12,
//   UserToStockArea = 13,
//   RepairFacilityToInsuranceCompany = 14,
//   OrganizationToMso = 15,
//   MsoToRegion = 16,
//   RegionToDistrict = 17,
//   DistrictToRepairFacility = 18,
//   MsoToRepairFacility = 19,
//   RegionToRepairFacility = 20,
//   MsoPrimaryContact = 21,
//   DistributorPrimaryContact = 22,
//   RepairFacilityToMSO = 23,
//   DistributorToRegion = 24,
//   BranchPrimaryContact = 25,
//   RepairFacilityPrimaryContact = 26,
//   BranchToRegion = 27,
//   RegionToBranch = 28,
//   OrganizationToStorage = 29,
//   RepairFacilityToSupplier = 30,
//   RepairFacilityToCabinet = 29,
//   RepairFacilityToExternalSupplier = 30,
//   RepairFacilityToStorage = 31,
//   RepairFacilityToDevice = 32,
//   UserToStorage = 33,
//   OrganizationToDevice = 34,
//   RFStorageToLTStorage = 35,
//   DistributorToRepairFacility = 36
// }
//
// export enum RoleClassificationType {
//
//   SecurityRoles = 1,
//   SystemRoles = 2,
//   SuperUsers = 3,
//   RepairFacilityUsers = 4,
//   BranchUsers = 5,
//   DistributorUsers = 6,
//   MsoUsers = 7,
//   RegionUsers = 8,
//   OrganizationToOrganization = 9,
//   Storage = 10,
//   Device = 11
//
// }
//
// export enum Organization {
//   OrgPartyRoleID = 1
// }
//
// export enum PartyRelationshipClassificationType {
//   Users = 1,
//   PrimaryContacts = 2,
//   RepairFacilities = 3,
//   Branches = 4,
//   Distributors = 5,
//   Area = 6,
//   Supplier = 7,
//   ExternalSupplier = 8
// }
//
//
// export enum ResourceType {
//   Controller = 1,
//   View = 2,
//   Button = 3,
//   Field = 4,
//   Page = 5,
//   Method = 6,
//   Component = 7,
//   Tab = 8,
//   MobilePage = 9,
//   VideoUrl = 11
// }
//
// export enum TransactionType {
//   Order = 1,
//   JobScan = 2,
//   Adjustment = 3,
//   BeginningBalance = 4
// }
//
// export enum LanguageType {
//   English = 1,
//   Spanish = 2,
//   French = 3,
// }
//
// export enum InventoryAdjusmentType {
//   Initial = 1,
//   Normal = 2
// }
//
// export enum DefaultInventoryUseTypeID {
//   Container = 1,
//   Each = 2,
//   Percent = 3
// }
//
// export enum InventoryUseType {
//   Stock = -1,
//   Container = 1,
//   Percent = 2,
//   Each = 3,
//   NonStock = 4,
//   All = null
// }
//
// export enum SimulateScanScreenSelection {
//   MngP_EAorContainer = 1,
//   MngP_Percent = 2,
//   MngP_NonStock = 3,
//   MngP_StockedOtherAreas = 4,
//   MngP_StockedNoAreas = 5,
//   MngP_MasterList = 12,
//   //----------------------------------
//   RtnP_Recoverable = 6,
//   RtnP_NonRecoverableContainerorEA = 7,
//   RtnP_NonRecoverablePercent = 8,
//   //----------------------------------
//   RmvP_Recoverable = 9,
//   RmvP_Percent = 10,
//   RmvP_NonStock = 11,
// }
//
//
// export enum ScreenType {
//   REMOVEPRODUCT = 'REMOVEPRODUCT',
//   MANAGEPRODUCT = 'MANAGEPRODUCT',
// }
//
// export enum ActionType {
//   Yes = 'Yes',
//   No = 'No',
//   ByScan = "ByScan",
//   ByScanAndExist = "ByScanAndExist",
//   ByClick = "ByClick",
//   NOTEXISTS = "NOTEXISTS",
//   EXISTS = "EXISTS",
//   CLOSED = "CLOSED"
// }
//
// export enum ButtonType {
//   Cancel,
//   Submit,
//   Setting,
//   Product,
//   Location
// }
//
// export enum RoleTypeSettingType {
//   SignOutDuration = 1
// }
//
// export enum OrderType {
//   Purchase = 1,
//   Return = 2,
//
//
// }
//
// export enum OrderMethodType {
//   Auto = 1,
//   Manual = 2,
//   Return = 3
// }
//
// export enum Resource {
//   Remove = 51,
//   Return = 52,
//   Order = 53,
//   Product = 54,
//   ChangeLocation = 111,
//   Create = 232,
//   Receive = 233,
//   Help = 235,
//   Backorder = 260
// }
//
// export enum ResourceType {
//
//   Manual = 20,
//   Video = 21,
// }
//
// export enum SupportFileType{
//   PDF = "PDF",
//   Video = "Video"
// }
