import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartBadge } from "./utils.mjs";

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("tents", dataSource, element);
productList.init();

// initialize cart badge on page load
updateCartBadge();
