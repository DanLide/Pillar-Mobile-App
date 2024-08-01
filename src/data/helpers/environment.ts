import { Config } from 'react-native-config';

export const environment = {
  b2c: {
    clientId: `${Config.AUTH_CLIENT_ID}`,
    authority: `${Config.AUTH_URL}`,
    magicLink: `${Config.MAGIC_LINK_URL}`,
  },
  modules: {
    base: {
      webURL: `${Config.WEB_URL}`,
      apiUri: `${Config.API_URL}`,
    },
    pisaUser: {
      apiUri: `${Config.API_URL}/pisauser`,
    },
    common: {
      apiUri: `${Config.API_URL}/common`,
    },
    companies: {
      apiUri: `${Config.API_URL}/repairfacility`,
    },
    pisaCompanyLocation: {
      apiUri: `${Config.API_URL}/companylocation`,
    },
    pisaEquipment: {
      apiUri: `${Config.API_URL}/equipment`,
    },
    pisaProduct: {
      apiUri: `${Config.API_URL}/im-product`,
    },
    pisaProductSync: {
      apiUri: `${Config.API_URL}/im-productsync`,
    },
    pisaProductCrimpAndCatalog: {
      apiUri: `${Config.API_URL}/im-productcrimpandcatalog`,
    },
    pisaProductInventory: {
      apiUri: `${Config.API_URL}/im-productinventory`,
    },
    pisaProductSupplier: {
      apiUri: `${Config.API_URL}/im-productsupplier`,
    },
    pisaJob: {
      apiUri: `${Config.API_URL}/job`,
    },
    inventory: {
      apiUri: `${Config.API_URL}/inventory`,
    },
    order: {
      apiUri: `${Config.API_URL}/order`,
    },
    shopSetup: {
      apiUri: `${Config.API_URL}/shopsetup`,
    },
    shopSetupAuthentication: {
      apiUri: `${Config.API_URL}/shopsetupauthentication`,
    },
  },
  features: {
    editProductROSwitch: false,
  },
  appInsights: {
    instrumentationKey: `${Config.INSTRUMENTATION_KEY}`,
  },
};
