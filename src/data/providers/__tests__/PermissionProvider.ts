import { PermissionProvider } from 'src/data/providers/PermissionProvider';
import {
  getRolePermissionProviders
} from '../__mocks__/PermissionProvider';

describe('PermissionProvider', () => {
  const {
    adminPermissions,
    distributorPermissions,
    emptyPermissions,
    msoPermissions,
    technicianPermissions
  } = getRolePermissionProviders()

  it('should NOT grant permission if permission set is undefined', () => {
    const { userPermissions } = new PermissionProvider();

    expect(userPermissions.removeProduct).toBeFalsy();
  });

  it('should NOT grant permission if permission set is empty', () => {
    expect(emptyPermissions.removeProduct).toBeFalsy();
  });

  describe('Remove Product', () => {
    it('should grant permission for Technician', () => {
      expect(technicianPermissions.removeProduct).toBeTruthy();
    });

    it('should NOT grant permission for Distributor', () => {
      expect(distributorPermissions.removeProduct).toBeFalsy();
    });

    it('should grant permission for MSO', () => {
      expect(msoPermissions.removeProduct).toBeTruthy();
    });

    it('should grant permission for Admin', () => {
      expect(adminPermissions.removeProduct).toBeTruthy();
    });
  })

  describe('Return Product', () => {
    it('should grant permission for Technician', () => {
      expect(technicianPermissions.returnProduct).toBeTruthy();
    });

    it('should NOT grant permission for Distributor', () => {
      expect(distributorPermissions.returnProduct).toBeFalsy();
    });

    it('should grant permission for MSO', () => {
      expect(msoPermissions.returnProduct).toBeTruthy();
    });

    it('should grant permission for Admin', () => {
      expect(adminPermissions.returnProduct).toBeTruthy();
    });
  })

  describe('Receive Order', () => {
    it('should NOT grant permission for Technician', () => {
      expect(technicianPermissions.receiveOrder).toBeFalsy();
    });

    it('should grant permission for Distributor', () => {
      expect(distributorPermissions.receiveOrder).toBeTruthy();
    });

    it('should NOT grant permission for MSO', () => {
      expect(msoPermissions.receiveOrder).toBeFalsy();
    });

    it('should grant permission for Admin', () => {
      expect(adminPermissions.receiveOrder).toBeTruthy();
    });
  })

  describe('Edit Product', () => {
    it('should NOT grant permission for Technician', () => {
      expect(technicianPermissions.editProduct).toBeFalsy();
    });

    it('should NOT grant permission for Distributor', () => {
      expect(distributorPermissions.editProduct).toBeFalsy();
    });

    it('should grant permission for MSO', () => {
      expect(msoPermissions.editProduct).toBeTruthy();
    });

    it('should grant permission for Admin', () => {
      expect(adminPermissions.editProduct).toBeTruthy();
    });
  })

  describe('View Orders', () => {
    it('should grant permission for Technician', () => {
      expect(technicianPermissions.viewOrders).toBeTruthy();
    });

    it('should grant permission for Distributor', () => {
      expect(distributorPermissions.viewOrders).toBeTruthy();
    });

    it('should grant permission for MSO', () => {
      expect(msoPermissions.viewOrders).toBeTruthy();
    });

    it('should grant permission for Admin', () => {
      expect(adminPermissions.viewOrders).toBeTruthy();
    });
  })

  describe('Create Order', () => {
    it('should grant permission for Technician', () => {
      expect(technicianPermissions.createOrder).toBeTruthy();
    });

    it('should grant permission for Distributor', () => {
      expect(distributorPermissions.createOrder).toBeTruthy();
    });

    it('should grant permission for MSO', () => {
      expect(msoPermissions.createOrder).toBeTruthy();
    });

    it('should grant permission for Admin', () => {
      expect(adminPermissions.createOrder).toBeTruthy();
    });
  })

  describe('Edit Product In Stock', () => {
    it('should NOT grant permission for Technician', () => {
      expect(technicianPermissions.editProductInStock).toBeFalsy();
    });

    it('should grant permission for Distributor', () => {
      expect(distributorPermissions.editProductInStock).toBeTruthy();
    });

    it('should NOT grant permission for MSO', () => {
      expect(msoPermissions.editProductInStock).toBeFalsy();
    });

    it('should grant permission for Admin', () => {
      expect(adminPermissions.editProductInStock).toBeTruthy();
    });
  })

  describe('Configure Shop', () => {
    it('should NOT grant permission for Technician', () => {
      expect(technicianPermissions.configureShop).toBeFalsy();
    });

    it('should NOT grant permission for Distributor', () => {
      expect(distributorPermissions.configureShop).toBeFalsy();
    });

    it('should NOT grant permission for MSO', () => {
      expect(msoPermissions.configureShop).toBeFalsy();
    });

    it('should grant permission for Admin', () => {
      expect(adminPermissions.configureShop).toBeTruthy();
    });
  })

  describe('Create Invoice', () => {
    it('should grant permission for Technician', () => {
      expect(technicianPermissions.createInvoice).toBeTruthy();
    });

    it('should NOT grant permission for Distributor', () => {
      expect(distributorPermissions.createInvoice).toBeFalsy();
    });

    it('should grant permission for MSO', () => {
      expect(msoPermissions.createInvoice).toBeTruthy();
    });

    it('should grant permission for Admin', () => {
      expect(adminPermissions.createInvoice).toBeTruthy();
    });
  })
});
