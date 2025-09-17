import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    this.renderProductDetails();

    const addBtn = document.getElementById("addToCart");
    if (addBtn) {
      addBtn.addEventListener("click", this.addProductToCart.bind(this));
      addBtn.dataset.id = this.product.Id;
    }
  }

  addProductToCart() {
    const cartContent = getLocalStorage("so-cart") || [];
    cartContent.push(this.product);
    setLocalStorage("so-cart", cartContent);
  }

  renderProductDetails() {
    const productSection = document.querySelector(".product-detail");
    if (!productSection) return;

    productSection.querySelector("h3").textContent = this.product.Brand.Name || "";
    productSection.querySelector("h2").textContent = this.product.Name || "";
    
    const img = productSection.querySelector("img");
    img.src = this.product.Image || "";
    img.alt = this.product.Name || "Imagem do produto";

    productSection.querySelector(".product-card__price").textContent = this.product.FinalPrice ? `$${this.product.FinalPrice}` : "";
    productSection.querySelector(".product__color").textContent = this.product.Colors[0].ColorName || "";
    productSection.querySelector(".product__description").innerHTML = this.product.DescriptionHtmlSimple || "";
  }
}