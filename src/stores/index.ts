import { AuthStore } from "./AuthStore";
import { SSOStore, SSOModel } from "./SSOStore";

const authStore = new AuthStore();
const ssoStore = new SSOStore();

export { authStore, ssoStore };
