import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {}; 
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document.getElementById('addToCart').addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    const itemIndex = cartItems.findIndex(
      item => item.Id === this.product.Id
    );

    if (itemIndex >= 0) {
      cartItems[itemIndex].Qtd += 1;
    } else {
      this.product.Qtd = 1;
      cartItems.push(this.product);
    }
    setLocalStorage("so-cart", cartItems);
  }
  
  handleBrandCrumbs() {
    const breadcrumbsElement = document.querySelector("#breadcrumbs");
    breadcrumbsElement.innerHTML = `<span class="path">${this.product.Category}</span>`
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector('h2').innerText = product.Brand.Name;
  document.querySelector('h3').innerText = product.NameWithoutBrand; 

  const productImage = document.getElementById('productImage');
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById('productPrice').innerHTML = priceTemplate(product);
  document.getElementById('productColor').textContent = product.Colors[0].ColorName;
  document.getElementById('productDescription').innerHTML = product.DescriptionHtmlSimple;

  document.getElementById('addToCart').dataset.id = product.Id;
}

function priceTemplate(product) {
  if (product.FinalPrice < product.SuggestedRetailPrice) {
    const discountPercent = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) /
        product.SuggestedRetailPrice) * 100
    );

    return `
      <p> 
        <span class="original-price">$${product.SuggestedRetailPrice}</span>
        <span class="sale-price">$${product.FinalPrice}</span>
        <div class="discount-info">
          <span>Save ${discountPercent}%</span>
        </div>
      </p>
    `;
  }

  return `<p class="price-sale">Price: $${product.FinalPrice}</p>`;
}
