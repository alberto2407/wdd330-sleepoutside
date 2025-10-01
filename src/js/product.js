import { getParam, loadHeaderFooter, updateCartBadge } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const productId = getParam("product");
const dataSource = new ExternalServices("tents");

const product = new ProductDetails(productId, dataSource);
product.init();
updateCartBadge();
