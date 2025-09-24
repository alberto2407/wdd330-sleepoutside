import {
  getLocalStorage,
  setLocalStorage,
  priceTotal,
  updateCartBadge,
} from "./utils.mjs";

function deleteCartContent(event) {
  const itemId = event.target.getAttribute("data-id");
  let cartItems = getLocalStorage("so-cart");

  const itemIndex = cartItems.findIndex((item) => item.Id === itemId);
  cartItems[itemIndex].quantity -= 1;

  if (cartItems[itemIndex].quantity <= 0) {
    cartItems = cartItems.filter((item) => item.Id !== itemId);
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
  updateCartBadge();
}

function changeQuantity(productId, delta) {
  let cartItems = getLocalStorage("so-cart") || [];
  const index = cartItems.findIndex((item) => item.Id === productId);

  if (index !== -1) {
    cartItems[index].quantity = (cartItems[index].quantity || 1) + delta;

    if (cartItems[index].quantity <= 0) {
      cartItems = cartItems.filter((item) => item.Id !== productId);
    }

    setLocalStorage("so-cart", cartItems);
    renderCartContents();
    updateCartBadge();
  }
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartFooter = document.querySelector(".cart-footer");
  if (cartItems.length > 0) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
    const total = priceTotal(
      cartItems,
      (item) => item.FinalPrice * item.quantity,
    );
    document.querySelector(".cart-total__amount").textContent =
      `$${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");

    // botão de deletar
    document.querySelectorAll(".cart-card__delete").forEach((button) => {
      button.addEventListener("click", deleteCartContent);
    });

    // botões de quantidade
    document.querySelectorAll(".qty-btn.decrease").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        changeQuantity(id, -1);
      });
    });

    document.querySelectorAll(".qty-btn.increase").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        changeQuantity(id, 1);
      });
    });

    // botão de checkout
    document
      .querySelector("button.checkout")
      .addEventListener("click", () =>
        window.location.replace("/checkout/index.html"),
      );
  } else {
    document.querySelector(".product-list").innerHTML = "";
    cartFooter.classList.add("hide");
  }
}

function cartItemTemplate(item) {
  const subtotal = (item.quantity * item.FinalPrice).toFixed(2);
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">
    <button class="qty-btn decrease" data-id="${item.Id}">−</button>
    <span class="qty">${item.quantity || 1}</span>
    <button class="qty-btn increase" data-id="${item.Id}">+</button>
  </p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <span class="cart-card__delete" data-id=${item.Id}>X</span>
  <p class="cart-card__subtotal">Subtotal: $${subtotal}</p>
</li>`;

  return newItem;
}

renderCartContents();
updateCartBadge();
