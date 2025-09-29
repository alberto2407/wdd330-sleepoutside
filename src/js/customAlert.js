function showAlert(message, duration = 1000) {
  // Default duration set to 1 seconds

  // Create alert div
  const alertDiv = document.createElement("div");
  alertDiv.className = "custom-alert";
  alertDiv.innerText = message;

  // Style the alert
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "20px";
  alertDiv.style.right = "20px";
  alertDiv.style.backgroundColor = "#4CAF50";
  alertDiv.style.color = "white";
  alertDiv.style.padding = "15px";
  alertDiv.style.zIndex = "1000";
  alertDiv.style.borderRadius = "5px";
  alertDiv.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";

  // Append to body
  document.body.appendChild(alertDiv);

  // Remove alert after specified duration
  setTimeout(() => {
    alertDiv.remove();
  }, duration);
}

export default showAlert;
