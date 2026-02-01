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
  const product = urlParams.get(param);
  return product;                        
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  
  const htmlStrings = list.map(templateFn);

  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement, null, updateCartCount);
  renderWithTemplate(footerTemplate, footerElement);

  searchProducts();
}

export function updateCartCount() {
  const cart = getLocalStorage("so-cart") || [];
  const cartCountElement = document.querySelector(".cart-count");

  if (!cartCountElement) return;

  if (cart.length > 0) {
    cartCountElement.classList.remove("hide");
    cartCountElement.textContent = cart.length;
  } else {
    cartCountElement.classList.add("hide");
  }
}

function searchProducts() {
  const sButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");

  // 👇 CLAVE: si no existe el buscador, salir
  if (!sButton || !searchInput) return;

  sButton.addEventListener("click", () => {
    performSearch(searchInput.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      performSearch(searchInput.value);
    }
  });
}



export function performSearch(term) {
  if (!term) return;

  const searchParams = new URLSearchParams();
  searchParams.append("search", term);

  const newUrl = `product_listing/index.html?${searchParams.toString()}`;
  window.location.href = newUrl;
}

