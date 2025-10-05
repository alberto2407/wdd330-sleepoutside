import { getLocalStorage ,setLocalStorage, } from "./utils.mjs";
import WishList from "./WishList.mjs";
//import showAlert from "./customAlert";

function productDetailsTemplate(product, colorIndex = 0) {
    return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
        <h2 class="divider">${product.NameWithoutBrand}</h2>
        <img
            class="divider"
            src="${product?.Image || product?.Images?.PrimaryLarge}"
            alt="${product.NameWithoutBrand}"
        />
        <p class="product-card__price">$${product.FinalPrice}</p>
        <p class="product__color">${product.Colors[colorIndex].ColorName}</p>
       <div class="product__color-list">
  ${product.Colors.map((color, index) => `
    <img 
      class="color-option" 
      data-index="${index}" 
      src="${color.ColorChipImageSrc}" 
      alt="${color.ColorName}"
      style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; cursor: pointer; border: 2px solid transparent;"
    /> 
  `).join("")}
</div>
        <p class="product__description">
        ${product.DescriptionHtmlSimple}
        </p>
        <div class="product-detail__add">
            <button id="addToCart" type="button" data-id="${product.Id}">Add to Cart</button>
            <button id="addToWishlist" type="button" data-id="${product.Id}" class="btn-wishlist">
                <span class="wishlist-icon">♡</span>
                <span class="wishlist-text">Add to Wishlist</span>
            </button>
        </div></section>`;
}


export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
        this.colorIndex = 0;
        this.wishlist = new WishList();
    }
    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails("main");
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addToCart.bind(this));

        document
            .getElementById("addToWishlist")
            .addEventListener("click", this.addToWishlist.bind(this));

        this.updateWishlistButton();

        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("color-option")) {
                this.colorIndex = parseInt(event.target.dataset.index, 10);
                setLocalStorage("colorIndex", this.colorIndex);
                window.location.reload();
            }
        })
    }
    updateCartListWithQuantity(){
        const itemList = getLocalStorage("so-cart") || [];
        const found = itemList.findIndex(item => item.Id === this.productId);

        if(found < 0){
            this.product = {...this.product, quantity: 1};
            itemList.push(this.product);
            return itemList;
        }

        itemList[found].quantity += 1;
        return itemList;
    }
    addToCart() {
        // add the current product to the cart
        const itemList = this.updateCartListWithQuantity();
        setLocalStorage("so-cart", itemList);
        /* showAlert("Product added successfully!") */
        setTimeout(()=> {
          if (this?.product?.Category) {
            window.location.href = `/product_listing/?category=${this.product.Category}`;
          } else {
                        window.location.href = `/cart/index.html`;
          }
        }, 1000);
        
    }

    addToWishlist() {
        const success = this.wishlist.addToWishlist(this.product);
        if (success) {
            this.updateWishlistButton();
        }
    }

    updateWishlistButton() {
        const wishlistBtn = document.getElementById("addToWishlist");
        const wishlistIcon = wishlistBtn.querySelector(".wishlist-icon");
        const wishlistText = wishlistBtn.querySelector(".wishlist-text");
        
        if (this.wishlist.isInWishlist(this.productId)) {
            wishlistBtn.classList.add("in-wishlist");
            wishlistIcon.textContent = "♥";
            wishlistText.textContent = "In Wishlist";
            wishlistBtn.disabled = true;
        } else {
            wishlistBtn.classList.remove("in-wishlist");
            wishlistIcon.textContent = "♡";
            wishlistText.textContent = "Add to Wishlist";
            wishlistBtn.disabled = false;
        }
    }

    renderProductDetails(selector) {
        const element = document.querySelector(selector);
        let localIndex = getLocalStorage("colorIndex") || 0;
        if (this.product.Colors[localIndex]) {
            this.colorIndex = localIndex
        }
        element.insertAdjacentHTML(
            "afterBegin",
            productDetailsTemplate(this.product, this.colorIndex)
        );
    }
}
