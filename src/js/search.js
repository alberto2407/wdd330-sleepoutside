export class ProductSearch {
  constructor() {
    this.allProducts = [];
    this.searchInput = document.getElementById('product-search');
    this.searchResults = document.getElementById('search-results');
    this.init();
  }

  async init() {
    await this.loadAllProducts();
    this.setupEventListeners();
  }

  async loadAllProducts() {
    try {
      console.log('Loading products...');
      const categories = ['tents', 'backpacks', 'sleeping-bags'];
      const results = [];
      
      for (const category of categories) {
        const response = await fetch(`/public/json/${category}.json`);
        const data = await response.json();
        console.log(`${category} products found:`, data.Result?.length || 0);
        
        // Los productos están en data.Result
        if (data.Result && Array.isArray(data.Result)) {
          results.push(...data.Result);
        }
      }
      
      this.allProducts = results;
      console.log('Total products loaded:', this.allProducts.length);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  setupEventListeners() {
    let searchTimeout;
    
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });

    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
        this.hideResults();
      }
    });
  }

  performSearch(query) {
    console.log('Searching for:', query);
    console.log('Total products:', this.allProducts.length);
    
    if (query.length < 2) {
      this.hideResults();
      return;
    }

    const filtered = this.allProducts.filter(product => 
      product.Name.toLowerCase().includes(query.toLowerCase()) ||
      product.Brand.Name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    console.log('Filtered results:', filtered.length);
    this.displayResults(filtered);
  }

  displayResults(products) {
    if (products.length === 0) {
      this.searchResults.innerHTML = '<div class="no-results">No products found</div>';
    } else {
      this.searchResults.innerHTML = products.map(product => `
        <a href="/product_pages/?product=${product.Id}" class="search-result-item">
          <img src="${product.Images.PrimarySmall}" alt="${product.Name}">
          <div>
            <strong>${product.Brand.Name}</strong>
            <p>${product.NameWithoutBrand}</p>
            <span class="price">$${product.FinalPrice}</span>
          </div>
        </a>
      `).join('');
    }
    this.showResults();
  }

  showResults() {
    this.searchResults.classList.remove('hidden');
  }

  hideResults() {
    this.searchResults.classList.add('hidden');
  }
}