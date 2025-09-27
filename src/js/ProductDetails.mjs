import { getLocalStorage, setLocalStorage, animateCartIcon, updateCartBadge } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
    this.selectedColor = null;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    
    // Set default selected color to first color
    this.selectedColor = this.product.Colors[0];

    this.renderProductDetails();
    this.renderColorOptions();

    const addBtn = document.getElementById("addToCart");
    if (addBtn) {
      addBtn.addEventListener("click", this.addProductToCart.bind(this));
      addBtn.dataset.id = this.product.Id;
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    // Create a unique key based on product ID and selected color
    const itemKey = `${this.product.Id}-${this.selectedColor.ColorCode}`;
    
    // Ver si el artículo ya está en el carrito con este color
    const existingItemIndex = cartItems.findIndex(
      (item) => `${item.Id}-${item.selectedColorCode}` === itemKey
    );

    if (existingItemIndex > -1) {
      // Si está, incrementar la cantidad
      cartItems[existingItemIndex].quantity++;
    } else {
      // Si no, agregarlo con cantidad 1
      const productCopy = { ...this.product };
      productCopy.quantity = 1;
      productCopy.selectedColorCode = this.selectedColor.ColorCode;
      productCopy.selectedColorName = this.selectedColor.ColorName;
      cartItems.push(productCopy);
    }
    setLocalStorage("so-cart", cartItems);
    // animate the cart/backpack icon to give feedback to the user
    // run a short animation after updating localStorage
    animateCartIcon();
    // update the numeric badge showing number of items
    updateCartBadge();
  }

  renderProductDetails() {
    const productSection = document.querySelector(".product-detail");
    if (!productSection) return;

    productSection.querySelector("h3").textContent = this.product.Brand.Name || "";
    productSection.querySelector("h2").textContent = this.product.Name || "";
    
    const img = productSection.querySelector("img");
    img.src = this.product.Image || "";
    img.alt = this.product.Name || "Imagem do produto";

    productSection.querySelector(".product-card__price").textContent = this.product.FinalPrice ? `$${this.product.FinalPrice}` : "";
    productSection.querySelector(".product__description").innerHTML = this.product.DescriptionHtmlSimple || "";
    
    // Update selected color display
    this.updateSelectedColorDisplay();
  }

  renderColorOptions() {
    const colorOptionsContainer = document.querySelector(".color-options");
    if (!colorOptionsContainer || this.product.Colors.length <= 1) {
      // Hide color selection if only one color
      const colorsSection = document.querySelector(".product__colors");
      if (colorsSection && this.product.Colors.length <= 1) {
        colorsSection.style.display = "none";
      }
      return;
    }

    // Clear existing options
    colorOptionsContainer.innerHTML = "";

    this.product.Colors.forEach((color, index) => {
      const colorSwatch = document.createElement("div");
      colorSwatch.className = "color-swatch";
      colorSwatch.setAttribute("data-color-code", color.ColorCode);
      colorSwatch.setAttribute("title", color.ColorName);
      
      // Create a simple color representation based on color name
      const colorStyle = this.getColorFromName(color.ColorName);
      colorSwatch.style.background = colorStyle;
      
      // Mark first color as selected by default
      if (index === 0) {
        colorSwatch.classList.add("selected");
      }

      // Add click handler
      colorSwatch.addEventListener("click", () => {
        this.selectColor(color, colorSwatch);
      });

      colorOptionsContainer.appendChild(colorSwatch);
    });
  }

  selectColor(color, swatchElement) {
    this.selectedColor = color;
    
    // Update UI
    document.querySelectorAll(".color-swatch").forEach(swatch => {
      swatch.classList.remove("selected");
    });
    swatchElement.classList.add("selected");
    
    this.updateSelectedColorDisplay();
  }

  updateSelectedColorDisplay() {
    const selectedColorElement = document.querySelector(".selected-color");
    if (selectedColorElement && this.selectedColor) {
      selectedColorElement.textContent = this.selectedColor.ColorName;
    }
  }

  getColorFromName(colorName) {
    // Simple color mapping based on color names
    const colorMap = {
      "pale pumpkin": "#FFB366",
      "pumpkin": "#FF7F00",
      "terracotta": "#E2725B",
      "red": "#DC143C",
      "golden oak": "#B8860B",
      "saffron yellow": "#F4C430",
      "canary yellow": "#FFFF99",
      "high rise grey": "#C0C0C0",
      "grey": "#808080",
      "rust": "#B7410E",
      "clay": "#8B4513"
    };

    const lowerName = colorName.toLowerCase();
    
    // Check for matches in the color name
    for (const [key, value] of Object.entries(colorMap)) {
      if (lowerName.includes(key)) {
        return value;
      }
    }
    
    // Default gradient for unknown colors
    return "linear-gradient(45deg, #ddd, #999)";
  }
}