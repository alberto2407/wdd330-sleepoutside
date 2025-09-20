import ProductData from "../js/ProductData.mjs";
import ProductList from "../js/ProductList.mjs";
import { loadHeaderFooter, getParam } from "../js/utils.mjs";

loadHeaderFooter();

const category = getParam("category"); // pega categoria da URL
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

const myList = new ProductList(category, dataSource, listElement);
myList.init();


