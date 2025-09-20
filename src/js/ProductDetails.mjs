import { getLocalStorage, setLocalStorage, animateCartIcon, updateCartBadge } from "./utils.mjs";

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
    const cartItems = getLocalStorage("so-cart") || [];
    // Ver si el artículo ya está en el carrito
    const existingItemIndex = cartItems.findIndex(
      (item) => item.Id === this.product.Id
    );

    if (existingItemIndex > -1) {
      // Si está, incrementar la cantidad
      cartItems[existingItemIndex].quantity++;
    } else {
      // Si no, agregarlo con cantidad 1
      this.product.quantity = 1;
      cartItems.push(this.product);
    }
    setLocalStorage("so-cart", cartItems);
    // animate the cart/backpack icon to give feedback to the user
    // run a short animation after updating localStorage
    animateCartIcon();
    // update the numeric badge showing number of items
    updateCartBadge();
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