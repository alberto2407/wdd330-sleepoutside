import {
  getLocalStorage,
  setLocalStorage,
  priceTotal,
  updateCartBadge,
  loadHeaderFooter,
  updateWishlistBadge,
} from "./utils.mjs";
import WishList from "./WishList.mjs";

loadHeaderFooter();

const wishlist = new WishList();

function deleteCartContent(event) {
  const itemId = event.target.getAttribute("data-id");
  const colorCode = event.target.getAttribute("data-color-code");
  let cartItems = getLocalStorage("so-cart");

  // Find the item by ID and color code if available
  const itemIndex = cartItems.findIndex((item) => {
    if (colorCode) {
      return item.Id === itemId && item.selectedColorCode === colorCode;
    }
    return item.Id === itemId;
  });

  if (itemIndex === -1) return;

  cartItems[itemIndex].quantity -= 1;

  if (cartItems[itemIndex].quantity <= 0) {
    cartItems = cartItems.filter((_, index) => index !== itemIndex);
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

function moveToWishlist(productId) {
  const cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex(
    (cartItem) => cartItem.Id === productId,
  );

  if (itemIndex === -1) return;

  const item = cartItems[itemIndex];

  // Add to wishlist
  const success = wishlist.addToWishlist(item);

  if (success) {
    // Remove from cart
    cartItems.splice(itemIndex, 1);
    setLocalStorage("so-cart", cartItems);

    // Re-render cart and update badges
    renderCartContents();
    updateCartBadge();
    updateWishlistBadge();
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
    document.querySelector(".cart-total__amount").textContent = total;
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

    // botões de mover para wishlist
    document.querySelectorAll(".move-to-wishlist-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        moveToWishlist(id);
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
  const colorName =
    item.selectedColorName ||
    (item.Colors && item.Colors[0] ? item.Colors[0].ColorName : "");
  const colorCode = item.selectedColorCode || "";
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item?.Images?.PrimaryMedium || item?.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">
    <button class="qty-btn decrease" data-id="${item.Id}">−</button>
    <span class="qty">${item.quantity || 1}</span>
    <button class="qty-btn increase" data-id="${item.Id}">+</button>
  </p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <div class="cart-card__actions">
    <button class="move-to-wishlist-btn" data-id="${item.Id}" title="Move to Wishlist">
      ♡ Wishlist
    </button>
    <span class="cart-card__delete" data-id="${item.Id}" data-color-code="${colorCode}" title="Remove from Cart">X</span>
  </div>
  <p class="cart-card__subtotal">Subtotal: $${subtotal}</p>
</li>`;

  return newItem;
}

renderCartContents();
updateCartBadge();
updateWishlistBadge();
