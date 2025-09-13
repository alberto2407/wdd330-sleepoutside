import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <div class="product-card">
      <img src="/images/${product.Image}" alt="${product.Name}" />
      <h3>${product.Brand}</h3>
      <h2>${product.Name}</h2>
      <p class="product-card__price">$${product.Price}</p>
      <p class="product__color">${product.Color}</p>
      <a href="./product_pages/?id=${product.Id}" class="view-product">View Product</a>
    </div>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  // async init() {
  //   const products = await this.dataSource.getData();
  //   this.renderList(products);
  // }

  async init() {
    const list = await this.dataSource.getData();
    const filteredList = list.filter(p => p.DetailPage);
    this.renderList(filteredList);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}