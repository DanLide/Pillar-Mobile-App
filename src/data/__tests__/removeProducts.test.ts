import { RemoveProductsStore } from '../../modules/removeProducts/stores';
import { onRemoveProducts, RemoveProductTask } from '../removeProducts';
import { removeProductAPI } from '../api/productsAPI';
import { ProductModel } from '../../stores/types';

jest.mock('../api/productsAPI');

const mockRemoveProductStore = new RemoveProductsStore();

const mockSetProducts = jest.fn();
mockRemoveProductStore.setProducts = mockSetProducts;

const mockProduct: ProductModel = {
  productId: 1,
  uuid: 'uuid',
  isRemoved: false,
  reservedCount: 1,
  nameDetails: 'nameDetails',
  job: undefined,
  isRecoverable: false,
  onHand: 1,
  name: 'name',
  inventoryUseTypeId: 1,
  size: 'size',
  partNo: 'partNo',
  manufactureCode: 'manufactureCode',
};

describe('removeProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute RemoveProductTask task', async () => {
    (removeProductAPI as jest.Mock).mockReturnValue(undefined);
    mockRemoveProductStore.addProduct(mockProduct);
    const removeProductTask = new RemoveProductTask(mockRemoveProductStore);
    await expect(removeProductTask.run()).resolves.not.toThrow();
    expect(removeProductAPI).toHaveBeenCalled();
    expect(mockSetProducts).toHaveBeenCalledWith([
      {
        inventoryUseTypeId: 1,
        isRecoverable: false,
        isRemoved: true,
        job: undefined,
        manufactureCode: 'manufactureCode',
        name: 'name',
        nameDetails: 'nameDetails',
        onHand: 1,
        partNo: 'partNo',
        productId: 1,
        reservedCount: 1,
        size: 'size',
        uuid: expect.any(String),
      },
    ]);
  });

  it('should throw Error RemoveProductTask task', async () => {
    (removeProductAPI as jest.Mock).mockImplementation(() => {
      throw Error();
    });
    mockRemoveProductStore.addProduct(mockProduct);
    const removeProductTask = new RemoveProductTask(mockRemoveProductStore);
    await expect(removeProductTask.run()).rejects.toThrow();
    expect(removeProductAPI).toHaveBeenCalled();
  });

  it('should call onRemoveProducts', async () => {
    await onRemoveProducts(mockRemoveProductStore);
    expect(removeProductAPI).toHaveBeenCalled();
  });
});
