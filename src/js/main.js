import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";

loadHeaderFooter();


setTimeout(() => {
  setupSearch();
  updateCartCount(); 
}, 500);

function setupSearch() {
  const searchForm = document.getElementById('search-form');
  
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);
  }
}

function handleSearch(event) {
  event.preventDefault();
  
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.trim();
  
  if (query) {
    // Redirigir a la página de resultados de búsqueda
    window.location.href = `search/?q=${encodeURIComponent(query)}`;
  }
}

function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCount = document.getElementById("cart-count");
  
  console.log("Cart items:", cartItems); // Para debugging
  console.log("Cart count element:", cartCount); // Para debugging
  
  if (cartCount) {
    cartCount.textContent = cartItems.length;
    
    // Hide count if cart is empty
    if (cartItems.length === 0) {
      cartCount.style.display = "none";
    } else {
      cartCount.style.display = "flex";
    }
  } else {
    // Si no encuentra el elemento, intentar de nuevo después de un poco más de tiempo
    setTimeout(updateCartCount, 200);
  }
}
// main.js - Solo agregar esta línea al final de tu archivo existente
import { ProductSearch } from './search.js';

// Inicializar el buscador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new ProductSearch();
});
