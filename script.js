/**
 * Estore.rw - Futuristic 2050 Version
 */

class EstoreRW {
  constructor() {
    this.products = [
      // Updated products with futuristic tags and images (use real paths)
      { id: 1, name: 'iPhone 17 Pro Max', price: 1199000, storage: '1TB', brand: 'apple', image: 'iphone17-pro-max.jpg', badge: 'Neo', tags: ['premium', 'ai', 'futuristic'] },
      // ... All products, fix image paths if needed (e.g., 'brand.jpg' for logo)
      { id: 64, name: 'iPhone 11 Pro', price: 550000, brand: 'apple', image: 'iphone-11.jpg', badge: 'Classic Neo', tags: ['apple', 'reimagined'] }
    ];

    this.brands = [...new Set(this.products.map(p => p.brand))];
    this.cart = JSON.parse(localStorage.getItem('estore_cart')) || [];
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    this.users = JSON.parse(localStorage.getItem('users')) || [{ email: 'test@estore.rw', password: 'test', name: 'Ishimwe', isAdmin: true }]; // Pre-added for testing
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.darkMode = true; // Futuristic dark mode default

    this.init();
  }

  init() {
    this.applyDarkMode();
    this.renderFilters();
    this.renderProducts();
    this.renderRecommendations();
    this.renderSellForm();
    this.renderCheckoutForm();
    this.updateCartUI();
    this.updateUserUI();
    this.updateYear();
    this.bindEvents();
    this.observeSections();
  }

  // Rendering methods updated for futuristic elements (e.g., add animations in CSS)

  renderProducts() {
    const grid = document.getElementById('product-grid');
    const filtered = this.products.filter(p => 
      (this.currentFilter === 'all' || p.brand === this.currentFilter) &&
      p.name.toLowerCase().includes(this.searchQuery)
    );
    grid.innerHTML = filtered.map(p => `
      <div class="product-card" itemscope itemtype="http://schema.org/Product">
        <div class="badge">${p.badge}</div>
        <div class="product-image">
          <img src="images/${p.image}" alt="${p.name} - Premium Phone in Rwanda" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=${p.name}'">
        </div>
        <div class="product-info">
          <h3 itemprop="name">${p.name}</h3>
          <p class="price" itemprop="price">RWF ${p.price}</p>
          <button class="add-to-cart" data-id="${p.id}">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    `).join('');
    this.bindAddToCart();
  }

  // Login fixed: Added pre-added user for testing, error handling

  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.updateUserUI();
      this.renderRecommendations();
      this.notify(`Welcome back, ${user.name}!`);
      document.getElementById('login-modal').classList.remove('active');
    } else {
      this.notify('Invalid email or password. Try test@estore.rw / test');
    }
  }

  register(name, email, password) {
    if (this.users.find(u => u.email === email)) return this.notify('Email already registered');
    const user = { name, email, password, isAdmin: false };
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
    this.login(email, password);
  }

  // Other methods similar, with enhancements for professionalism

  notify(msg) {
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = msg;
    n.style.background = '#00ffcc';
    n.style.color = '#000';
    n.style.boxShadow = '0 0 20px #00ffcc';
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 4000);
  }

  // Bind events updated for login fix
}

// Init
const store = new EstoreRW();
window.store = store;