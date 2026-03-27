/**
 * ============================================
 * EstoreRW - Modern Redesign JavaScript
 * Premium Phones in Rwanda
 * ============================================
 * Complete functionality for the redesigned homepage
 */

class EstoreRW {
  constructor() {
    // Product Database
    this.products = [
      { id: 1, name: 'iPhone 17 Pro Max', price: 1699000, brand: 'Apple', category: 'premium', image: 'iphone-17-pro.jpg' },
      { id: 2, name: 'iPhone 17 Pro', price: 1499000, brand: 'Apple', category: 'premium', image: 'iphone-17.jpg' },
      { id: 3, name: 'iPhone 17', price: 999000, brand: 'Apple', category: 'standard', image: 'iphone-17-basic.jpg' },
      { id: 4, name: 'Samsung Galaxy S25 Ultra', price: 1799000, brand: 'Samsung', category: 'premium', image: 'galaxy-s25.jpg' },
      { id: 5, name: 'Samsung Galaxy S25+', price: 1399000, brand: 'Samsung', category: 'premium', image: 'galaxy-s25-plus.jpg' },
      { id: 6, name: 'Samsung Galaxy S25', price: 999000, brand: 'Samsung', category: 'standard', image: 'galaxy-s25-basic.jpg' },
      { id: 7, name: 'Google Pixel 9 Pro XL', price: 1299000, brand: 'Google', category: 'premium', image: 'pixel-9-pro.jpg' },
      { id: 8, name: 'Google Pixel 9 Pro', price: 1099000, brand: 'Google', category: 'premium', image: 'pixel-9.jpg' },
      { id: 9, name: 'OnePlus 13', price: 899000, brand: 'OnePlus', category: 'standard', image: 'oneplus-13.jpg' },
      { id: 10, name: 'Xiaomi 15 Ultra', price: 849000, brand: 'Xiaomi', category: 'standard', image: 'xiaomi-15.jpg' },
      { id: 11, name: 'Huawei P60 Pro', price: 799000, brand: 'Huawei', category: 'standard', image: 'huawei-p60.jpg' },
      { id: 12, name: 'Motorola Edge Pro', price: 749000, brand: 'Motorola', category: 'standard', image: 'motorola-edge.jpg' },
    ];

    // State Management
    this.cart = JSON.parse(localStorage.getItem('estore_cart')) || [];
    this.promoCode = null;
    this.discountAmount = 0;
    this.currentFilter = '';
    this.searchQuery = '';
    this.darkMode = JSON.parse(localStorage.getItem('darkMode')) !== false;

    // Initialize App
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.setupDarkMode();
    this.renderProducts();
    this.populateFilters();
    this.setupEventListeners();
    this.updateCartUI();
    this.setupIntersectionObserver();
    this.setupFixedHeader();
  }

  /**
   * Setup Dark Mode
   */
  setupDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');
    if (this.darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
    toggle.addEventListener('click', () => this.toggleDarkMode());
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('light-mode');
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
    
    const toggle = document.getElementById('dark-mode-toggle');
    toggle.innerHTML = this.darkMode 
      ? '<i class="fas fa-moon"></i>' 
      : '<i class="fas fa-sun"></i>';
  }

  /**
   * Render Products
   */
  renderProducts() {
    const grid = document.getElementById('product-grid');
    const filtered = this.getFilteredProducts();

    if (filtered.length === 0) {
      grid.innerHTML = '';
      document.getElementById('no-products').hidden = false;
      return;
    }

    document.getElementById('no-products').hidden = true;
    grid.innerHTML = filtered.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="badge">${product.category === 'premium' ? '⭐ Premium' : 'Standard'}</div>
        <div class="product-image">
          <img 
            src="images/${product.image}" 
            alt="${product.name} - Premium smartphone" 
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}'"
          />
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="price">RWF ${this.formatPrice(product.price)}</p>
          <button class="add-to-cart" data-id="${product.id}">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    `).join('');

    this.attachAddToCartListeners();
  }

  /**
   * Get Filtered Products
   */
  getFilteredProducts() {
    return this.products.filter(product => {
      const matchBrand = !this.currentFilter || product.brand === this.currentFilter;
      const matchSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchBrand && matchSearch;
    });
  }

  /**
   * Populate Brand Filter
   */
  populateFilters() {
    const select = document.getElementById('brand-filter');
    const brands = [...new Set(this.products.map(p => p.brand))].sort();
    
    brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
      this.currentFilter = e.target.value;
      this.renderProducts();
    });
  }

  /**
   * Format Price
   */
  formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(price);
  }

  /**
   * Attach Add to Cart Listeners
   */
  attachAddToCartListeners() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.currentTarget.dataset.id);
        this.addToCart(productId);
      });
    });
  }

  /**
   * Add to Cart
   */
  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = this.cart.find(item => item.id === productId);
    
    if (cartItem) {
      cartItem.quantity = (cartItem.quantity || 1) + 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1
      });
    }

    this.saveCart();
    this.updateCartUI();
    this.showNotification(`${product.name} added to cart!`);
  }

  /**
   * Remove from Cart
   */
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
    this.renderCartItems();
  }

  /**
   * Update Cart Item Quantity
   */
  updateQuantity(productId, quantity) {
    const item = this.cart.find(p => p.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
      }
    }
  }

  /**
   * Save Cart to LocalStorage
   */
  saveCart() {
    localStorage.setItem('estore_cart', JSON.stringify(this.cart));
  }

  /**
   * Update Cart UI
   */
  updateCartUI() {
    const count = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.getElementById('cart-count').textContent = count;
    this.updateCartTotals();
  }

  /**
   * Update Cart Totals
   */
  updateCartTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = this.cart.length > 0 ? 5000 : 0;
    const total = subtotal + shipping - this.discountAmount;

    document.getElementById('subtotal').textContent = this.formatPrice(subtotal);
    document.getElementById('shipping').textContent = this.formatPrice(shipping);
    document.getElementById('cart-total').textContent = this.formatPrice(Math.max(total, 0));

    if (this.discountAmount > 0) {
      document.getElementById('discount-row').hidden = false;
      document.getElementById('discount-amount').textContent = this.formatPrice(this.discountAmount);
    } else {
      document.getElementById('discount-row').hidden = true;
    }
  }

  /**
   * Render Cart Items
   */
  renderCartItems() {
    const container = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    const empty = document.getElementById('empty-cart');

    if (this.cart.length === 0) {
      container.innerHTML = '';
      empty.hidden = false;
      summary.hidden = true;
      return;
    }

    empty.hidden = true;
    summary.hidden = false;

    container.innerHTML = this.cart.map(item => `
      <div class="cart-item" data-product-id="${item.id}">
        <div class="cart-item-image">
          <img 
            src="images/${item.image}" 
            alt="${item.name}"
            loading="lazy"
          />
        </div>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>RWF ${this.formatPrice(item.price)}</p>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button class="qty-decrease" data-id="${item.id}">−</button>
            <span class="qty-value">${item.quantity || 1}</span>
            <button class="qty-increase" data-id="${item.id}">+</button>
          </div>
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `).join('');

    // Setup quantity controls
    document.querySelectorAll('.qty-increase').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const item = this.cart.find(p => p.id === id);
        this.updateQuantity(id, (item.quantity || 1) + 1);
      });
    });

    document.querySelectorAll('.qty-decrease').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const item = this.cart.find(p => p.id === id);
        this.updateQuantity(id, (item.quantity || 1) - 1);
      });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.removeFromCart(parseInt(e.target.dataset.id));
      });
    });
  }

  /**
   * Apply Promo Code
   */
  applyPromoCode() {
    const input = document.getElementById('promo-code');
    const code = input.value.trim().toUpperCase();

    if (!code) {
      this.showNotification('Please enter a promo code', 'error');
      return;
    }

    const discounts = {
      'SAVE10': 0.10,
      'SAVE20': 0.20,
      'WELCOME5': 0.05,
      'ESTORE25': 0.25,
    };

    if (!discounts[code]) {
      this.showNotification('Invalid promo code', 'error');
      return;
    }

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    this.discountAmount = Math.floor(subtotal * discounts[code]);
    this.promoCode = code;

    this.showNotification(`✓ Promo code ${code} applied! Saved RWF ${this.formatPrice(this.discountAmount)}`);
    input.value = '';
    this.updateCartTotals();
  }

  /**
   * Show Notification
   */
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4a9eff' : '#ff6b6b'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 3000;
      animation: slideInUp 0.3s ease-out;
      font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  }

  /**
   * Setup Event Listeners
   */
  setupEventListeners() {
    // Cart Modal
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeButtons = document.querySelectorAll('.close-btn, .close-cart');

    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.renderCartItems();
      cartModal.hidden = false;
    });

    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        cartModal.hidden = true;
      });
    });

    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) cartModal.hidden = true;
    });

    // Promo Code
    const promoBtn = document.getElementById('apply-promo');
    const promoInput = document.getElementById('promo-code');
    
    promoBtn?.addEventListener('click', () => this.applyPromoCode());
    promoInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.applyPromoCode();
    });

    // Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn?.addEventListener('click', () => this.handleCheckout());

    // Search
    const searchInput = document.getElementById('search-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderProducts();
    });

    // sell Form
    const sellForm = document.getElementById('sell-form');
    sellForm?.addEventListener('submit', (e) => this.handleSellForm(e));

    // Menu Toggle (Mobile)
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    menuToggle?.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });

    // Search Toggle (Mobile)
    const searchToggle = document.getElementById('search-toggle');
    const mobileSearch = document.getElementById('mobile-search');
    searchToggle?.addEventListener('click', () => {
      mobileSearch.hidden = !mobileSearch.hidden;
    });
  }

  /**
   * Handle Checkout
   */
  handleCheckout() {
    if (this.cart.length === 0) {
      this.showNotification('Your cart is empty', 'error');
      return;
    }
    
    this.showNotification('Proceeding to checkout...');
    // In a real application, this would navigate to a checkout page
    setTimeout(() => {
      alert('Checkout functionality would be integrated with your payment processor (MTN, Airtel, PayPal, etc).');
    }, 500);
  }

  /**
   * Handle Sell Form
   */
  handleSellForm(e) {
    e.preventDefault();
    
    const brand = document.getElementById('phone-brand-sell')?.value;
    const model = document.getElementById('phone-model-sell')?.value;
    const condition = document.getElementById('phone-condition-sell')?.value;
    const storage = document.getElementById('phone-storage-sell')?.value;
    const email = document.getElementById('contact-email-sell')?.value;
    const phone = document.getElementById('contact-phone-sell')?.value;

    if (!brand || !model || !condition || !storage || !email || !phone) {
      this.showNotification('Please fill in all fields', 'error');
      return;
    }

    // Estimate quote
    const basePrice = 300000;
    const conditionMultiplier = { 'like-new': 0.9, 'excellent': 0.75, 'good': 0.6, 'fair': 0.45 };
    const multiplier = conditionMultiplier[condition] || 0.5;
    const quote = Math.floor(basePrice * multiplier);

    // Show quote
    const quoteSection = document.getElementById('estimated-quote');
    document.getElementById('quote-amount').textContent = this.formatPrice(quote);
    quoteSection.hidden = false;

    this.showNotification('Quote generated! Our team will contact you soon.');
  }

  /**
   * Setup Intersection Observer for animations
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .product-card, .testimonial-card').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Setup Fixed Header
   */
  setupFixedHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.estoreApp = new EstoreRW();
});

// Add smooth scroll animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
