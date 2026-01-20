import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

const listElement = document.querySelector('.product-list');

const dataSource = new ProductData('tents');

const productList = new ProductList('tents', dataSource, listElement);
productList.init();