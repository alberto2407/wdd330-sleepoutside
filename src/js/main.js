import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

const productData = new ProductData("tents");

const tentsContainer = document.getElementById("tents-list");

const tentsList = new ProductList("tents", productData, tentsContainer);
tentsList.init();