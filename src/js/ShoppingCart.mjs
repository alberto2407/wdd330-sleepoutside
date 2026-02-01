import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
    return `
      <li class="cart-card divider">

        <a href="../product_pages/?product=${item.Id}" class="cart-card__image">
          <img src="${item.Images.PrimaryLarge}" alt="${item.Name}" />
        </a>

        <a href="../product_pages/?product=${item.Id}">
          <h2 class="card__name">${item.Name}</h2>
        </a>
        <p class="cart-card__color">${item.Colors[0].ColorName}</p>
        <p class="cart-card__price">$${item.FinalPrice}</p>
        <div class="cart-card__details">
          <p class="cart-card__quantity">Qty: ${item.Qtd}</p>
        </div>

        <div class="cart-card__buttons">
          <button class="remove-item" data-id="${item.Id}">✖</button>
        </div>
      </li>
    `;
} 

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
    this.items = [];
  }

  getItems() {
    this.items = getLocalStorage("so-cart") || [];
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.Id !== id);
    localStorage.setItem("so-cart", JSON.stringify(this.items));
    this.renderItems();
  }

  addRemoveListeners() {
    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        this.removeItem(id);
      });
    });
  }


  renderItems() {
    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      this.items,
      "afterbegin",
      true
    );
    this.addRemoveListeners();
  }

  renderTotal() {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  if (this.items.length === 0) return;

  cartFooter.classList.remove("hide");

  const total = this.items.reduce(
    (sum, item) => sum + (item.FinalPrice * item.Qtd),
    0
  );

  cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
}

  init() {
    this.getItems();
    this.renderItems();
    this.renderTotal();
  }
}