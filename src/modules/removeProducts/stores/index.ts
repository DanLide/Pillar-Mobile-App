import { RemoveProductsStore } from './RemoveProductsStore';
import { ScanningProductStore } from './ScanningProductStore';

const removeProductsStore = new RemoveProductsStore();
const scanningProductStore = new ScanningProductStore();

export { removeProductsStore, scanningProductStore, RemoveProductsStore };
