import {
  loadHeaderFooter,
  alertMessage,
  setLocalStorage,
  removeAllAlerts,
} from "./utils.mjs";

import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

// Initialize the CheckoutProcess with key 'so-cart' and output selectors
const checkout = new CheckoutProcess("so-cart", {
  subtotal: "#subtotal",
  shipping: "#shipping",
  tax: "#tax",
  total: "#total",
});

checkout.init(); // Initialize the process to calculate the item subtotal

// Add an event listener for ZIP code input to trigger the order total calculation
document.querySelector("#zip").addEventListener("input", (event) => {
  const zipCode = event.target.value;
  // Validate ZIP code length (5 digits)
  if (zipCode.length === 5) {
    checkout.calculateOrderTotal();
  } else {
    document.querySelector(checkout.outputSelector.shipping).innerText = "0.00";
    document.querySelector(checkout.outputSelector.tax).innerText = "0.00";
    document.querySelector(checkout.outputSelector.total).innerText = "0.00";
  }
});

// Handle form submission for checkout
document
  .querySelector("#checkout-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    //Get the form from the event.
    const myForm = event.target;

    // Check if the form is valid
    const isFormValid = myForm.checkValidity();
    myForm.reportValidity(); // Show validation messages
    if (!isFormValid) {
      alertMessage("Please fill in all required fields.", true);
      return;
    }

    // Validate card number and expiration date manually
    const cardNumber = myForm.cardNumber.value;
    const expirationDate = myForm.expiration.value;

    const isCardNumberValid = isValidCardNumber(cardNumber);
    const isExpirationValid = isValidExpirationDate(expirationDate);

    if (!isCardNumberValid) {
      alertMessage("Invalid Card Number", true);
      return;
    }

    if (!isExpirationValid) {
      alertMessage("Invalid Expiration Date", true);
      return;
    }

    // Show validation messages
    try {
      await checkout.checkout(myForm);
      setLocalStorage("so-cart", []);
      removeAllAlerts();
      window.location.href = "/checkout/success.html";
    } catch (error) {
      alertMessage("Error when processing the order: " + error.message, true);
    }
  });

function isValidCardNumber(cardNumber) {
  // Card number validation logic (let 13-19 digits)
  return /^\d{13,19}$/.test(cardNumber.replace(/\s/g, "")); // Eliminar espacios
}

// validate expiration date (MM/YY) year must be current or future year
function isValidExpirationDate(expirationDate) {
  if (!/^\d{2}\/\d{2}$/.test(expirationDate)) return false;

  const [month, year] = expirationDate.split("/");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Últimos 2 dígitos
  const currentMonth = currentDate.getMonth() + 1; // Mes actual (1-12)

  // Validar año y mes
  if (parseInt(year) < currentYear) return false;
  if (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    return false;

  return true;
}
