import {
  fetchProductByScannedCode,
  FetchProductByScannedCodeTask,
  SaveProductToStoreTask,
} from '../fetchProductByScannedCode';

import { getFetchProductAPI, ProductResponse } from '../api/productsAPI';
import {
  CurrentProductStoreType,
  StockProductStoreType,
} from '../../stores/types';

jest.mock('../api/productsAPI');

const mockScanCode = '10';

const mockProductResponse: ProductResponse = {
  productId: 1,
  name: 'name',
  isRecoverable: 'Yes',
  onHand: 1,
  inventoryUseTypeId: 1,
  size: 'size',
  partNo: 'partNo',
  manufactureCode: 'manufactureCode',
  nameDetails: 'nameDetails',
};

const mockSetCurrentProduct = jest.fn();

const mockStore: CurrentProductStoreType & StockProductStoreType = {
  setCurrentProduct: mockSetCurrentProduct,
  removeCurrentProduct: jest.fn(),
  setCurrentStocks: jest.fn(),
};

describe('fetchProductByScannedCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute FetchProductByScannedCodeTask task', async () => {
    (getFetchProductAPI as jest.Mock).mockReturnValue(mockProductResponse);
    const fetchProductByScannedCodeTask = new FetchProductByScannedCodeTask(
      {},
      mockScanCode,
      mockStore,
    );
    await expect(fetchProductByScannedCodeTask.run()).resolves.not.toThrow();
    expect(fetchProductByScannedCodeTask.productContext.product).toBe(
      mockProductResponse,
    );
    expect(getFetchProductAPI).toHaveBeenCalledWith(
      mockScanCode,
      mockStore.currentStock?.partyRoleId,
    );
  });

  it('should throw Error FetchProductByScannedCodeTask task', async () => {
    (getFetchProductAPI as jest.Mock).mockImplementation(() => {
      throw Error();
    });
    const fetchProductByScannedCodeTask = new FetchProductByScannedCodeTask(
      {},
      mockScanCode,
    );
    await expect(fetchProductByScannedCodeTask.run()).rejects.toThrow();
    expect(getFetchProductAPI).toHaveBeenCalledWith(
      mockScanCode,
      mockStore.currentStock?.partyRoleId,
    );
  });

  it('should execute SaveProductToStoreTask task', async () => {
    const saveProductToStoreTask = new SaveProductToStoreTask(
      { product: mockProductResponse },
      mockStore,
    );
    await expect(saveProductToStoreTask.run()).resolves.not.toThrow();
    expect(mockSetCurrentProduct).toHaveBeenCalledWith({
      inventoryUseTypeId: 1,
      isRecoverable: true,
      isRemoved: false,
      manufactureCode: 'manufactureCode',
      name: 'name',
      nameDetails: 'manufactureCode partNo size',
      onHand: 1,
      partNo: 'partNo',
      productId: 1,
      reservedCount: 1,
      size: 'size',
      uuid: expect.any(String),
    });
  });

  it('should execute SaveProductToStoreTask task with empty product', async () => {
    const saveProductToStoreTask = new SaveProductToStoreTask(
      { product: undefined },
      mockStore,
    );
    await expect(saveProductToStoreTask.run()).resolves.not.toThrow();
    expect(mockSetCurrentProduct).toHaveBeenCalledWith(undefined);
  });

  it('should call fetchProductByScannedCode', async () => {
    await fetchProductByScannedCode(mockStore, mockScanCode);
    expect(getFetchProductAPI).toHaveBeenCalledWith(
      mockScanCode,
      mockStore.currentStock?.partyRoleId,
    );
  });
});
