import { getParam, updateCartBadge } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const productId = getParam("product");
const dataSource = new ProductData("tents");

const product = new ProductDetails(productId, dataSource);

product.init();

// ensure the cart badge is initialized on product pages
updateCartBadge();
