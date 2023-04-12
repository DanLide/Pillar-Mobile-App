import { RemoveProductsStore } from './RemoveProductsStore';
import { ProductJobStore } from './ProductJobStore';

const removeProductsStore = new RemoveProductsStore();
const productJobStore = new ProductJobStore();

export { removeProductsStore, productJobStore, RemoveProductsStore };
