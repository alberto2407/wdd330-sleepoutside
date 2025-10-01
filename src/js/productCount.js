import { getLocalStorage } from "./utils.mjs";

function updateCartCount() {
  // Retrieve cart items from localStorage
  const cartItems = getLocalStorage("so-cart") || [];
  // Get the cart count element
  const cartCountElement = document.getElementById("cartCount");
  // Set the badge text to the number of items in the cart
  cartCountElement.textContent = cartItems.length;
}

// Call updateCartCount when the page loads to display the correct count
updateCartCount();
