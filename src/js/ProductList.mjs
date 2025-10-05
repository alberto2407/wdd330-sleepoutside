import { renderListWithTemplate, setLocalStorage } from "./utils.mjs";

function productCardTemplate(product) {
    return `<li class="product-card">
                <a href="/product_pages/?product=${product.Id}">
                <img src="${product?.Images?.PrimaryLarge || product?.Image}" alt="Image of ${product.Name}">
                <h2 class="card__brand">${product.Brand.Name}</h2>
                <h3 class="card__name">${product.Name}</h3>
                <p class="product-card__price">$${product.FinalPrice}</p>
                </a>
            </li>`
}

export default class ProductList {
    constructor(category, dataSource, listElement){
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }
    async init(){
        const myList = await this.dataSource.getData(this.category);
        this.renderList(myList);
        document.querySelector("#product-category").textContent = this.category;
    }
    renderList(list){
        if (!list || list.length === 0) {
            this.listElement.innerHTML = `
                <div class="no-products-message">
                    <h2>No products found</h2>
                    <p>Sorry, we couldn't find any products in this category.</p>
                </div>
            `;
        } else {
            renderListWithTemplate(productCardTemplate, this.listElement, list);
        }
    }
}
