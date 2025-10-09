const newsletterForm = document.getElementById("newsletter-form");
newsletterForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  const emailInput = newsletterForm.querySelector("input[type='email']");
  const email = emailInput.value;

  if (email) {
    alert(`Thank you for signing up, ${email}!`);
    emailInput.value = ""; // Clear the input field
  } else {
    alert("Please enter a valid email address.");
  }
});
