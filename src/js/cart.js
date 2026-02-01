import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

const carList = document.querySelector(".product-list");

const cart = new ShoppingCart(carList);
cart.init();