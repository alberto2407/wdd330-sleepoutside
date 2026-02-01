import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
  return `
    <li class="product-card">
      ${isDiscounted ? `<span class="discount-badge">SALE</span>` : ""}
      <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${product.Images.PrimaryLarge}" alt="Image of ${product.NameWithoutBrand}">
        <h2 class="card__brand">${product.Brand.Name}</h2>
        <h3 class="card__name">${product.NameWithoutBrand}</h3>
        <p class="product-card__price">
          ${
            isDiscounted
              ? `<span class="old-price">$${product.SuggestedRetailPrice}</span>`
              : ""
          }
          $${product.FinalPrice}
        </p>
      </a>
    </li>
  `;
}
export default class ProductList {
  constructor(category, dataSource, listElement, search = null) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.search = search;
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }

  sortByName(products) {
    return products.sort((a, b) =>
      a.NameWithoutBrand.localeCompare(b.NameWithoutBrand)
    );
  }

  sortByPrice(products) {
    return products.sort((a, b) =>
      a.FinalPrice - b.FinalPrice
    );
  }
  handleBrandCrumbs() {
    const breadcrumbsElement = document.querySelector("#breadcrumbs");
    breadcrumbsElement.innerHTML = `<span class="path">${this.category}</span> <span class="arrow">></span><span class="path">(${this.products.length} items)</span>`;
  }
  async init() {
    if (!this.category) {
      console.error("Category not provided in URL");
      return;
    }

    const list = await this.dataSource.getData(this.category);

    if (!list || list.length === 0) {
      this.listElement.innerHTML = "<p>No products found.</p>";
      return;
    }

    const titleSpan = document.querySelector(".title");
    if (titleSpan) {
      const prettyCategory = this.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());
      titleSpan.textContent = prettyCategory;
    }

    this.sortByName(list);
    this.renderList(list);
  }
}