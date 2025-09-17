import { getLocalStorage } from "./utils.mjs";

const renderCartCount = () => {
    const cartItems = getLocalStorage("so-cart") || [];
    const cartBadge = document.getElementById("cart-badge");
    cartBadge.textContent = cartItems.length;
}

renderCartCount();