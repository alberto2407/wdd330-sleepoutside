import { loadHeaderFooter } from "./utils.mjs";
import { getParam } from "./utils.mjs";

loadHeaderFooter();

function displayOrderDetails() {
  // Get the order ID from URL parameters
  const orderId = getParam("order_id");
  
  // Display the order ID
  document.getElementById("order-id").textContent = orderId || "N/A";
  
  // Retrieve order details from localStorage if available
  const orderDetails = localStorage.getItem("so-order-details");
  
  if (orderDetails) {
    const order = JSON.parse(orderDetails);
    
    // Display order items
    const orderItemsElement = document.getElementById("order-items");
    
    // Display order total
    if (order.orderTotal) {
      document.getElementById("order-total").textContent = `$${order.orderTotal}`;
    }
    
    // Clear order details from localStorage (optional)
    localStorage.removeItem("so-order-details");
  }
}

document.addEventListener("DOMContentLoaded", displayOrderDetails);
