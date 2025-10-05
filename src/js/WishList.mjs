import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./utils.mjs";
import { animateCartIcon, updateCartBadge } from "./utils.mjs";

// Wishlist item template
function wishlistItemTemplate(item) {
    return `<li class="wishlist-item" data-id="${item.Id}">
        <div class="wishlist-item__image">
            <img src="${item?.Image || item?.Images?.PrimaryLarge}" alt="${item.Name}">
        </div>
        <div class="wishlist-item__details">
            <h3 class="wishlist-item__brand">${item.Brand.Name}</h3>
            <h4 class="wishlist-item__name">${item.NameWithoutBrand}</h4>
            <p class="wishlist-item__price">$${item.FinalPrice}</p>
        </div>
        <div class="wishlist-item__actions">
            <button class="btn btn--primary add-to-cart-btn" data-id="${item.Id}">
                Add to Cart
            </button>
            <button class="btn btn--secondary remove-from-wishlist-btn" data-id="${item.Id}">
                Remove
            </button>
        </div>
    </li>`;
}

export default class WishList {
    constructor(listElement) {
        this.listElement = listElement;
    }

    // Get wishlist items from localStorage
    getWishlistItems() {
        return getLocalStorage("so-wishlist") || [];
    }

    // Save wishlist items to localStorage
    saveWishlistItems(items) {
        setLocalStorage("so-wishlist", items);
        this.updateWishlistBadge();
    }

    // Add item to wishlist
    addToWishlist(product) {
        const currentWishlist = this.getWishlistItems();
        
        // Check if item already exists in wishlist
        const existingItem = currentWishlist.find(item => item.Id === product.Id);
        
        if (existingItem) {
            // Item already in wishlist, show message
            this.showWishlistMessage("Item is already in your wishlist!", "info");
            return false;
        }

        // Add new item to wishlist
        currentWishlist.push(product);
        this.saveWishlistItems(currentWishlist);
        this.showWishlistMessage("Added to wishlist!", "success");
        this.animateWishlistIcon();
        return true;
    }

    // Remove item from wishlist
    removeFromWishlist(productId) {
        const currentWishlist = this.getWishlistItems();
        const updatedWishlist = currentWishlist.filter(item => item.Id !== productId);
        this.saveWishlistItems(updatedWishlist);
        this.showWishlistMessage("Removed from wishlist", "info");
        
        // Re-render the wishlist if we're on the wishlist page
        if (this.listElement) {
            this.renderWishlist();
        }
    }

    // Move item from wishlist to cart
    moveToCart(productId) {
        const wishlistItems = this.getWishlistItems();
        const product = wishlistItems.find(item => item.Id === productId);
        
        if (!product) return;

        // Add to cart
        this.addToCart(product);
        
        // Remove from wishlist
        this.removeFromWishlist(productId);
        
        this.showWishlistMessage("Moved to cart!", "success");
        animateCartIcon();
    }

    // Add item to cart (similar to ProductDetails logic)
    addToCart(product) {
        const currentCart = getLocalStorage("so-cart") || [];
        
        // Check if item already exists in cart
        const existingItemIndex = currentCart.findIndex(item => item.Id === product.Id);
        
        if (existingItemIndex > -1) {
            // Increment quantity if item exists
            currentCart[existingItemIndex].quantity = (currentCart[existingItemIndex].quantity || 1) + 1;
        } else {
            // Add new item with quantity 1
            product.quantity = 1;
            currentCart.push(product);
        }
        
        setLocalStorage("so-cart", currentCart);
        updateCartBadge();
    }

    // Render the wishlist
    renderWishlist() {
        const wishlistItems = this.getWishlistItems();
        
        if (!this.listElement) return;

        if (wishlistItems.length === 0) {
            this.listElement.innerHTML = `
                <div class="empty-wishlist">
                    <h2>Your wishlist is empty</h2>
                    <p>Start adding items you love to your wishlist!</p>
                    <a href="/product_listing/?category=tents" class="btn btn--primary">Browse Products</a>
                </div>
            `;
        } else {
            renderListWithTemplate(wishlistItemTemplate, this.listElement, wishlistItems, "afterbegin", true);
            this.setupEventListeners();
        }
    }

    // Setup event listeners for wishlist actions
    setupEventListeners() {
        if (!this.listElement) return;

        // Add to cart buttons
        this.listElement.addEventListener("click", (e) => {
            if (e.target.classList.contains("add-to-cart-btn")) {
                const productId = e.target.dataset.id;
                this.moveToCart(productId);
            }
        });

        // Remove from wishlist buttons
        this.listElement.addEventListener("click", (e) => {
            if (e.target.classList.contains("remove-from-wishlist-btn")) {
                const productId = e.target.dataset.id;
                this.removeFromWishlist(productId);
            }
        });
    }

    // Check if item is in wishlist
    isInWishlist(productId) {
        const wishlistItems = this.getWishlistItems();
        return wishlistItems.some(item => item.Id === productId);
    }

    // Get wishlist count
    getWishlistCount() {
        return this.getWishlistItems().length;
    }

    // Update wishlist badge
    updateWishlistBadge() {
        const count = this.getWishlistCount();
        const badge = this.renderWishlistBadge();
        if (!badge) return;
        
        if (count > 0) {
            badge.textContent = String(count);
            badge.classList.remove("hide");
        } else {
            badge.textContent = "";
            badge.classList.add("hide");
        }
    }

    // Render wishlist badge
    renderWishlistBadge() {
        const wishlistIcon = document.querySelector(".wishlist-icon");
        if (!wishlistIcon) return null;
        
        let badge = wishlistIcon.querySelector(".wishlist-badge");
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "wishlist-badge hide";
            badge.setAttribute("aria-hidden", "true");
            wishlistIcon.appendChild(badge);
        }
        return badge;
    }

    // Show wishlist message
    showWishlistMessage(message, type = "info") {
        // Remove existing messages
        const existingMessages = document.querySelectorAll(".wishlist-message");
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageEl = document.createElement("div");
        messageEl.className = `wishlist-message wishlist-message--${type}`;
        messageEl.textContent = message;

        // Add to page
        const main = document.querySelector("main");
        if (main) {
            main.appendChild(messageEl);

            // Remove after 3 seconds
            setTimeout(() => {
                messageEl.remove();
            }, 3000);
        }
    }

    // Animate wishlist icon
    animateWishlistIcon(duration = 600) {
        const wishlistIcon = document.querySelector(".wishlist-icon");
        if (!wishlistIcon) return;
        
        wishlistIcon.classList.add("wishlist-animate");
        setTimeout(() => wishlistIcon.classList.remove("wishlist-animate"), duration);
    }

    // Initialize wishlist
    init() {
        this.updateWishlistBadge();
        if (this.listElement) {
            this.renderWishlist();
        }
    }
}