// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Query get url param
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);

  return product;
}

// Render a list of templates
export function renderListWithTemplate(
  templateFunction,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  const listElements = list.map(templateFunction);

  // if clear is true clear DOM
  clear && (parentElement.innerHtml = "");

  parentElement.insertAdjacentHTML(position, listElements.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  callback && callback(data);
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}


export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);


 /*  cartCount(); */
 updateCartBadge();
 updateWishlistBadge();
}

export function priceTotal(itemsList, getPrice) {
  let total = 0;
  itemsList.forEach((item) => (total += getPrice(item)));

  return `$ ${total.toFixed(2)}`;
}

export function cartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCounter = document.getElementById("cartCount");
  if (cartItems.length != 0) {
    cartCounter.innerHTML = cartItems.length;
    cartCounter.classList.remove("hidden");
  } else {
    cartCounter.classList.add("hidden");
  }
}

export function alertMessage(message, scroll = true, duration = 4000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;
  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "span") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);
  if (scroll) window.scrollTo(0, 0);

  // left this here to show how you could remove the alert automatically after a certain amount of time.
  setTimeout(function () {
    main.removeChild(alert);
  }, duration);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}

// add a tiny helper to animate the cart/backpack icon when items are added
export function animateCartIcon(duration = 600) {
  const cart = document.querySelector(".cart");
  if (!cart) return;
  // add class that triggers CSS animation
  cart.classList.add("cart-animate");
  // remove it after duration to allow retriggering
  window.setTimeout(() => cart.classList.remove("cart-animate"), duration);
}

// ---------- Cart badge helpers ----------
export function getCartCount() {
  const items = getLocalStorage("so-cart") || [];
  // count total quantity of items in cart
  return items.reduce((sum, it) => sum + (it.quantity || 0), 0);
}

function createBadgeElement() {
  const badge = document.createElement("span");
  badge.className = "cart-badge hide";
  badge.setAttribute("aria-hidden", "true");
  return badge;
}

export function renderCartBadge() {
  const cart = document.querySelector(".cart");
  if (!cart) return null;
  let badge = cart.querySelector(".cart-badge");
  if (!badge) {
    badge = createBadgeElement();
    // position badge inside cart container
    cart.appendChild(badge);
  }
  return badge;
}

export function updateCartBadge() {
  const count = getCartCount();
  const badge = renderCartBadge();
  if (!badge) return;
  if (count > 0) {
    badge.textContent = String(count);
    badge.classList.remove("hide");
  } else {
    badge.textContent = "";
    badge.classList.add("hide");
  }
}

// ---------- Wishlist badge helpers ----------
export function getWishlistCount() {
  const items = getLocalStorage("so-wishlist") || [];
  return items.length;
}

function createWishlistBadgeElement() {
  const badge = document.createElement("span");
  badge.className = "wishlist-badge hide";
  badge.setAttribute("aria-hidden", "true");
  return badge;
}

export function renderWishlistBadge() {
  const wishlistIcon = document.querySelector(".wishlist-icon");
  if (!wishlistIcon) return null;
  let badge = wishlistIcon.querySelector(".wishlist-badge");
  if (!badge) {
    badge = createWishlistBadgeElement();
    // position badge inside wishlist container
    wishlistIcon.appendChild(badge);
  }
  return badge;
}

export function updateWishlistBadge() {
  const count = getWishlistCount();
  const badge = renderWishlistBadge();
  if (!badge) return;
  if (count > 0) {
    badge.textContent = String(count);
    badge.classList.remove("hide");
  } else {
    badge.textContent = "";
    badge.classList.add("hide");
  }
}
