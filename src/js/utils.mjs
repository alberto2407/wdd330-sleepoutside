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

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function priceTotal(itemsList, getPrice) {
  let total = 0;
  itemsList.forEach((item) => (total += getPrice(item)));

  return total;
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

// -----------------------------------------
