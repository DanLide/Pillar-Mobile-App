import { AuthStore } from './AuthStore';
import { SSOStore } from './SSOStore';
import { CategoriesStore } from './CategoriesStore';
import { SuppliersStore } from './SuppliersStore';

const authStore = new AuthStore();
const ssoStore = new SSOStore();

const categoriesStore = new CategoriesStore();

const suppliersStore = new SuppliersStore();

export { authStore, ssoStore, categoriesStore, suppliersStore };
