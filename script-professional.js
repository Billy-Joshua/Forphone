/**
 * EstoreRW - Professional E-Commerce Platform for Premium Phones in Rwanda
 * Production-Ready with Full Admin Panel & Cart System - 2026
 */

class EstoreRW {
  constructor() {
    this.products = this.loadFromStorage('estore_products') || [
      // Premium Apple Devices
    
  { id: 1, name: 'iPhone 17 Pro Max', price: 1299000, storage: '1TB', brand: 'apple', image: 'iphone17-pro-max.jpeg', badge: 'Latest', tags: ['premium', 'ai', 'futuristic'] },
  { id: 2, name: 'iPhone 17 Pro', price: 1099000, storage: '512GB', brand: 'apple', image: 'iphone17-pro.jpeg', badge: 'Latest', tags: ['premium', 'ai'] },
  { id: 3, name: 'iPhone 17', price: 899000, storage: '256GB', brand: 'apple', image: 'iphone17.jpeg', badge: 'Popular', tags: ['premium'] },
  { id: 4, name: 'iPhone 16 Pro Max', price: 999000, storage: '512GB', brand: 'apple', image: 'iphone16-pro-max.jpeg', badge: 'Popular', tags: ['premium'] },
  { id: 5, name: 'iPhone 16', price: 799000, storage: '256GB', brand: 'apple', image: 'iphone16.jpeg', badge: 'Sale', tags: ['affordable'] },
  { id: 17, name: 'iPhone 15 Pro Max', price: 899000, storage: '512GB', brand: 'apple', image: 'iphone15-pro-max.jpeg', badge: 'Sale', tags: ['premium'] },
      // ... All products
      // Premium Samsung Devices
      { id: 6, name: 'Samsung Galaxy S26 Ultra', price: 1399000, storage: '1TB', brand: 'samsung', image: 'samsung-s26-ultra.jpg', badge: 'Latest', tags: ['premium', 'ai'] },
      { id: 7, name: 'Samsung Galaxy S26', price: 999000, storage: '512GB', brand: 'samsung', image: 'samsung-s26.jpg', badge: 'Popular', tags: ['premium'] },
      { id: 8, name: 'Samsung Galaxy S25 Ultra', price: 899000, storage: '512GB', brand: 'samsung', image: 'samsung-s25-ultra.jpg', badge: 'Sale', tags: ['premium'] },
      { id: 9, name: 'Samsung Galaxy A55', price: 599000, storage: '256GB', brand: 'samsung', image: 'samsung-a55.jpg', badge: 'Popular', tags: ['affordable'] },
      
      // Google Pixel
      { id: 10, name: 'Google Pixel 10 Pro', price: 1199000, storage: '512GB', brand: 'google', image: 'pixel10-pro.jpg', badge: 'Latest', tags: ['ai', 'camera'] },
      { id: 11, name: 'Google Pixel 10', price: 899000, storage: '256GB', brand: 'google', image: 'pixel10.jpg', badge: 'Popular', tags: ['camera'] },
      { id: 12, name: 'Google Pixel 9', price: 699000, storage: '256GB', brand: 'google', image: 'pixel9.jpg', badge: 'Sale', tags: ['affordable'] },
      
      // OnePlus
      { id: 13, name: 'OnePlus 13 Pro', price: 949000, storage: '512GB', brand: 'oneplus', image: 'oneplus13-pro.jpg', badge: 'Fast', tags: ['premium', 'performance'] },
      { id: 14, name: 'OnePlus 13', price: 799000, storage: '256GB', brand: 'oneplus', image: 'oneplus13.jpg', badge: 'Popular', tags: ['performance'] },
      
      // Xiaomi
      { id: 15, name: 'Xiaomi 14 Ultra', price: 849000, storage: '512GB', brand: 'xiaomi', image: 'xiaomi14-ultra.jpg', badge: 'Value', tags: ['camera', 'value'] },
      { id: 16, name: 'Xiaomi 14', price: 699000, storage: '256GB', brand: 'xiaomi', image: 'xiaomi14.jpg', badge: 'Popular', tags: ['value'] },
    ];

    // Initialize state
    this.brands = [...new Set(this.products.map(p => p.brand))];
    this.cart = this.loadFromStorage('estore_cart') || [];
    this.currentUser = this.loadFromStorage('currentUser');
    this.users = this.loadFromStorage('users') || [
      { id: 1, email: 'test@estore.rw', password: 'test123', name: 'Ishimwe', isAdmin: true }
    ];
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.darkMode = true;
    this.maxProductId = Math.max(...this.products.map(p => p.id), 0);
    this.promoCode = null;

    this.init();
  }

  // ===== INITIALIZATION =====
  init() {
    this.renderFilters();
    this.renderProducts();
    this.renderRecommendations();
    this.renderSellForm();
    this.renderCheckoutForm();
    this.updateCartUI();
    this.updateUserUI();
    this.updateYear();
    this.bindEvents();
    this.setupIntersectionObserver();
  }

  // ===== STORAGE UTILITIES =====
  loadFromStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error(`Error loading ${key} from storage:`, e);
      return null;
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  // ===== RENDER METHODS =====
  renderFilters() {
    const container = document.getElementById('filters');
    if (!container) return;
    
    const filters = ['all', ...this.brands];
    container.innerHTML = filters.map(f => `
      <button class="filter-btn ${f === 'all' ? 'active' : ''}" data-filter="${f}">
        ${f.charAt(0).toUpperCase() + f.slice(1)}
      </button>
    `).join('');
  }

  renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const filtered = this.products.filter(p => 
      (this.currentFilter === 'all' || p.brand === this.currentFilter) &&
      p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #cccccc;"><p>No products found. Try adjusting your filters.</p></div>';
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <article class="product-card" data-id="${p.id}" itemscope itemtype="https://schema.org/Product" role="article">
        <div class="badge">${p.badge}</div>
        <div class="product-image">
          <img src="images/${p.image}" 
               alt="${p.name} - Available in Rwanda" 
               loading="lazy" 
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22250%22%3E%3Crect fill=%22%23333%22 width=%22300%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${p.name}%3C/text%3E%3C/svg%3E'"
               decoding="async">
        </div>
        <div class="product-info">
          <h3 itemprop="name">${p.name}</h3>
          <p class="storage-spec">${p.storage}</p>
          <p class="price" itemprop="price">RWF ${p.price.toLocaleString()}</p>
          <button class="add-to-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" aria-label="Add ${p.name} to cart">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </article>
    `).join('');

    this.bindAddToCart();
  }

  renderRecommendations() {
    const container = document.getElementById('recommendations');
    if (!container) return;

    const recommended = this.products.filter(p => p.tags.includes('ai')).slice(0, 3);
    if (recommended.length === 0) return;

    container.innerHTML = `
      <div class="recommendations-section">
        <h3><i class="fas fa-sparkles"></i> Smart Phone Recommendations</h3>
        <p class="recommendations-subtitle">Verified selections based on your browsing patterns and selling goals, optimized for trust and resale value.</p>
      </div>
    `;
  }

  renderSellForm() {
    const container = document.getElementById('sell-form-container');
    if (!container) return;

    container.innerHTML = `
      <form id="sell-form" class="sell-form" novalidate>
        <input type="text" id="phone-model" placeholder="Phone Model (e.g., iPhone 15 Pro)" required aria-label="Phone model">
        <input type="number" id="phone-condition" placeholder="Condition (1-10)" min="1" max="10" required aria-label="Phone condition">
        <input type="number" id="phone-price" placeholder="Expected Price (RWF)" min="0" required aria-label="Expected price">
        <textarea id="phone-description" placeholder="Describe condition, damage, accessories..." rows="4" aria-label="Phone description"></textarea>
        <input type="email" id="seller-email" placeholder="Your Email" required aria-label="Your email">
        <input type="tel" id="seller-phone" placeholder="Your Phone Number" required aria-label="Your phone number">
        <button type="submit" class="btn-primary">Get Instant Quote</button>
      </form>
    `;
  }

  renderCheckoutForm() {
    const container = document.getElementById('checkout-form');
    if (!container) return;

    container.innerHTML = `
      <div class="checkout-steps">
        <div class="step active" data-step="1">
          <h3>1. Shipping Information</h3>
          <input type="text" id="full-name" placeholder="Full Name" required aria-label="Full name">
          <input type="email" id="email" placeholder="Email" required aria-label="Email">
          <input type="tel" id="phone" placeholder="Phone Number" required aria-label="Phone number">
          <input type="text" id="address" placeholder="Street Address" required aria-label="Address">
          <input type="text" id="city" placeholder="City" required aria-label="City">
          <select id="province" required aria-label="Province">
            <option value="">Select Province</option>
            <option value="kigali">Kigali</option>
            <option value="south">South Province</option>
            <option value="north">North Province</option>
            <option value="east">East Province</option>
            <option value="west">West Province</option>
          </select>
          <button type="button" class="btn-primary" onclick="store.nextCheckoutStep()">Continue to Payment</button>
        </div>

        <div class="step" data-step="2">
          <h3>2. Select Payment Method</h3>
          <div class="payment-methods">
            <div class="payment-method-group">
              <h3>Mobile Payment</h3>
              <label class="payment-option">
                <input type="radio" name="payment" value="mtn-momo" required>
                <span class="payment-option-icon"><i class="fas fa-mobile-alt"></i></span>
                <div class="payment-option-info">
                  <div class="payment-option-label">MTN Mobile Money</div>
                  <div class="payment-option-desc">Pay directly from your MTN account</div>
                </div>
              </label>
              <label class="payment-option">
                <input type="radio" name="payment" value="airtel-momo" required>
                <span class="payment-option-icon"><i class="fas fa-mobile-alt"></i></span>
                <div class="payment-option-info">
                  <div class="payment-option-label">Airtel Money</div>
                  <div class="payment-option-desc">Pay via Airtel Money Rwanda</div>
                </div>
              </label>
            </div>

            <div class="payment-method-group">
              <h3>Bank & Digital Wallets</h3>
              <label class="payment-option">
                <input type="radio" name="payment" value="bk-kigali" required>
                <span class="payment-option-icon"><i class="fas fa-university"></i></span>
                <div class="payment-option-info">
                  <div class="payment-option-label">Bank of Kigali</div>
                  <div class="payment-option-desc">Transfer from your BK account</div>
                </div>
              </label>
              <label class="payment-option">
                <input type="radio" name="payment" value="paypal" required>
                <span class="payment-option-icon"><i class="fab fa-paypal"></i></span>
                <div class="payment-option-info">
                  <div class="payment-option-label">PayPal</div>
                  <div class="payment-option-desc">International payment via PayPal</div>
                </div>
              </label>
            </div>

            <div class="payment-method-group">
              <h3>Other Options</h3>
              <label class="payment-option">
                <input type="radio" name="payment" value="cod" required>
                <span class="payment-option-icon"><i class="fas fa-hand-holding-usd"></i></span>
                <div class="payment-option-info">
                  <div class="payment-option-label">Cash on Delivery</div>
                  <div class="payment-option-desc">Pay when your order arrives</div>
                </div>
              </label>
            </div>
          </div>
          
          <div id="payment-details" style="margin-top: 1.5rem;"></div>
          <button type="button" class="btn-primary" onclick="store.nextCheckoutStep()" style="margin-top: 2rem;">Review Order</button>
        </div>

        <div class="step" data-step="3">
          <h3>3. Order Confirmation</h3>
          <div id="order-summary"></div>
          <button type="submit" class="btn-primary">Place Order</button>
          <p style="margin-top: 1rem; font-size: 0.9rem; color: #a0a0a0;">
            <input type="checkbox" id="terms" required aria-label="I agree to terms and conditions">
            I agree to Terms & Conditions and Privacy Policy
          </p>
        </div>
      </div>
    `;
  }

  // ===== CART OPERATIONS =====
  addToCart(id, name, price) {
    const existing = this.cart.find(item => item.id === id);
    if (existing) {
      existing.qty++;
    } else {
      this.cart.push({ id, name, price, qty: 1 });
    }
    this.saveToStorage('estore_cart', this.cart);
    this.updateCartUI();
    this.notify(`✓ ${name} added to cart!`, 'success');
  }

  removeFromCart(id) {
    const item = this.cart.find(i => i.id === id);
    this.cart = this.cart.filter(item => item.id !== id);
    this.saveToStorage('estore_cart', this.cart);
    this.updateCartUI();
    if (item) {
      this.notify(`✓ ${item.name} removed from cart`, 'success');
    }
  }

  updateCartQuantity(id, qty) {
    const qtyNum = parseInt(qty) || 1;
    const item = this.cart.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, Math.min(qtyNum, 100)); // Min 1, Max 100
      this.saveToStorage('estore_cart', this.cart);
      this.updateCartUI();
    }
  }

  updateCartUI() {
    const count = this.cart.reduce((sum, item) => sum + item.qty, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = count;
    this.renderCartModal();
  }

  renderCartModal() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #cccccc;">Your cart is empty. Start shopping!</p>';
      this.updateCartTotals();
      return;
    }

    container.innerHTML = this.cart.map(item => `
      <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #2a2a2a;">
        <div style="flex: 1;">
          <h4 style="color: #d0d0d0; margin-bottom: 0.3rem;">${item.name}</h4>
          <p style="font-size: 0.9rem; color: #00ffcc;">RWF ${item.price.toLocaleString()}</p>
        </div>
        <div class="cart-item-controls" style="display: flex; gap: 1rem; align-items: center;">
          <input type="number" min="1" max="100" value="${item.qty}" onchange="store.updateCartQuantity(${item.id}, this.value)" aria-label="Quantity for ${item.name}" style="width: 60px; padding: 6px; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 6px; color: #d0d0d0;">
          <span style="color: #d0d0d0; min-width: 120px; text-align: right;">RWF ${(item.price * item.qty).toLocaleString()}</span>
          <button onclick="store.removeFromCart(${item.id})" aria-label="Remove ${item.name}" class="cart-remove" style="background: #ef4444; color: white; border: none; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');

    this.updateCartTotals();
  }

  updateCartTotals() {
    const total = this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const cartTotalEl = document.getElementById('cart-total');
    const itemCountEl = document.getElementById('cart-item-count');
    const discountRow = document.getElementById('discount-row');
    const discountAmountEl = document.getElementById('discount-amount');
    
    const shipping = this.cart.length > 0 ? 5000 : 0;
    let discount = 0;
    
    // Apply promo discount if exists
    if (this.promoCode && this.cart.length > 0) {
      const promoDiscounts = {
        'SAVE10': total * 0.10,
        'SAVE20': total * 0.20,
        'WELCOME5': total * 0.05
      };
      discount = promoDiscounts[this.promoCode.toUpperCase()] || 0;
    }
    
    const cartTotal = total + shipping - discount;
    const itemCount = this.cart.reduce((sum, item) => sum + item.qty, 0);
    
    if (subtotalEl) subtotalEl.textContent = total.toLocaleString();
    if (shippingEl) shippingEl.textContent = shipping.toLocaleString();
    if (discountAmountEl && discount > 0) discountAmountEl.textContent = `-${discount.toLocaleString()}`;
    if (discountRow) discountRow.style.display = discount > 0 ? 'flex' : 'none';
    if (cartTotalEl) cartTotalEl.textContent = cartTotal.toLocaleString();
    if (itemCountEl) itemCountEl.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
  }

  applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    if (!promoInput) return;
    
    const code = promoInput.value.trim().toUpperCase();
    const validCodes = ['SAVE10', 'SAVE20', 'WELCOME5'];
    
    if (!code) {
      this.notify('Please enter a promo code', 'error');
      return;
    }
    
    if (validCodes.includes(code)) {
      this.promoCode = code;
      const discountPercent = code === 'SAVE20' ? '20%' : code === 'SAVE10' ? '10%' : '5%';
      this.notify(`✓ Promo code applied! ${discountPercent} discount`, 'success');
      this.updateCartTotals();
      promoInput.value = '';
    } else {
      this.notify(' Invalid promo code', 'error');
      this.promoCode = null;
    }
  }

  // ===== AUTHENTICATION =====
  login(email, password) {
    console.log('Login attempt:', { email, password }); // Debug log
    
    if (!email || !password) {
      this.notify('Please enter email and password', 'error');
      return;
    }

    if (!this.validateEmail(email)) {
      this.notify('Please enter a valid email', 'error');
      return;
    }

    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      this.saveToStorage('currentUser', user);
      this.updateUserUI();
      this.notify(`✓ Welcome back, ${user.name}!`, 'success');
      this.closeModal('login-modal');
      this.renderRecommendations();
    } else {
      this.notify('❌ Invalid credentials. Try test@estore.rw / test123', 'error');
    }
  }

  register(name, email, password, passwordConfirm) {
    if (!name || !email || !password) {
      this.notify('Please fill all fields', 'error');
      return;
    }

    if (password !== passwordConfirm) {
      this.notify('Passwords do not match', 'error');
      return;
    }

    if (!this.validateEmail(email)) {
      this.notify('Invalid email format', 'error');
      return;
    }

    if (this.users.find(u => u.email === email)) {
      this.notify('Email already registered', 'error');
      return;
    }

    const newUser = { id: Date.now(), name, email, password, isAdmin: false };
    this.users.push(newUser);
    this.saveToStorage('users', this.users);
    this.notify('✓ Account created! Logging in...', 'success');
    setTimeout(() => this.login(email, password), 800);
  }

  logout() {
    this.currentUser = null;
    this.saveToStorage('currentUser', null);
    this.updateUserUI();
    this.notify('✓ Logged out successfully', 'success');
  }

  updateUserUI() {
    const loginBtn = document.getElementById('login-btn');
    if (!loginBtn) return;

    if (this.currentUser) {
      loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${this.currentUser.name}`;
      
      // Create dropdown menu for logged-in users
      loginBtn.onclick = (e) => {
        e.preventDefault();
        this.toggleUserMenu();
      };

      // Create user menu if it doesn't exist
      let userMenu = document.getElementById('user-menu');
      if (!userMenu) {
        userMenu = document.createElement('div');
        userMenu.id = 'user-menu';
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
          <div class="user-menu-header">
            <div class="user-avatar"><i class="fas fa-user-circle"></i></div>
            <div>
              <div class="user-name">${this.currentUser.name}</div>
              <div class="user-email">${this.currentUser.email}</div>
              ${this.currentUser.isAdmin ? '<div class="user-badge">Admin</div>' : ''}
            </div>
          </div>
          <div class="user-menu-divider"></div>
          ${this.currentUser.isAdmin ? `<a href="#" class="user-menu-item" onclick="store.openModal('admin-modal'); store.closeUserMenu(); return false;">
            <i class="fas fa-cog"></i> Admin Dashboard
          </a>
          <div class="user-menu-divider"></div>` : ''}
          <a href="#" class="user-menu-item" onclick="store.logout(); store.closeUserMenu(); return false;">
            <i class="fas fa-sign-out-alt"></i> Logout
          </a>
        `;
        document.querySelector('.header').appendChild(userMenu);
      }
    } else {
      loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
      loginBtn.onclick = (e) => { e.preventDefault(); this.openModal('login-modal'); };
      
      // Remove user menu if exists
      const userMenu = document.getElementById('user-menu');
      if (userMenu) userMenu.remove();
    }
  }

  toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
      userMenu.classList.toggle('active');
    }
  }

  closeUserMenu() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
      userMenu.classList.remove('active');
    }
  }

  // ===== FORM HANDLERS =====
  handleSellForm(e) {
    e.preventDefault();
    
    const model = document.getElementById('phone-model').value;
    const condition = document.getElementById('phone-condition').value;
    const price = document.getElementById('phone-price').value;
    const email = document.getElementById('seller-email').value;
    const phone = document.getElementById('seller-phone').value;

    if (!model || !condition || !price || !email || !phone) {
      this.notify('Please fill all required fields', 'error');
      return;
    }

    if (!this.validateEmail(email)) {
      this.notify('Invalid email address', 'error');
      return;
    }

    this.notify('✓ Your listing has been submitted! We\'ll review it within 24 hours.', 'success');
    e.target.reset();
  }

  handleCheckout(e) {
    e.preventDefault();

    const terms = document.getElementById('terms');
    if (!terms?.checked) {
      this.notify('Please accept Terms & Conditions', 'error');
      return;
    }

    if (this.cart.length === 0) {
      this.notify('Your cart is empty', 'error');
      return;
    }

    const total = this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    
    this.notify(`✓ Order placed! Total: RWF ${total.toLocaleString()}\n\nWe'll contact you shortly with payment details.`, 'success');
    this.cart = [];
    this.saveToStorage('estore_cart', this.cart);
    this.updateCartUI();
    this.closeModal('checkout-modal');

    // Redirect to WhatsApp for confirmation (optional)
    setTimeout(() => {
      const msg = `I just placed an order on EstoreRW for RWF ${total.toLocaleString()}. Please confirm my order!`;
      window.open(`https://wa.me/250788544811?text=${encodeURIComponent(msg)}`, '_blank');
    }, 1500);
  }

  nextCheckoutStep() {
    const currentStep = document.querySelector('.step.active');
    if (!currentStep) return;

    const inputs = currentStep.querySelectorAll('input[required], select[required]');
    for (let input of inputs) {
      if (!input.value) {
        input.focus();
        this.notify('Please fill all required fields', 'error');
        return;
      }
    }

    const nextStep = parseInt(currentStep.dataset.step) + 1;
    const nextStepEl = document.querySelector(`.step[data-step="${nextStep}"]`);
    
    if (nextStepEl) {
      currentStep.classList.remove('active');
      nextStepEl.classList.add('active');
      nextStepEl.scrollIntoView({ behavior: 'smooth' });

      if (nextStep === 2) this.updatePaymentDetails();
      if (nextStep === 3) this.updateOrderSummary();
    }
  }

  updatePaymentDetails() {
    const paymentDetails = document.getElementById('payment-details');
    const method = document.querySelector('input[name="payment"]:checked')?.value;
    
    if (method === 'momo') {
      paymentDetails.innerHTML = `
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(0,255,204,0.1); border-radius: 12px;">
          <p><strong>MTN Mobile Money:</strong> *156*2#</p>
          <p><strong>Airtel Money:</strong> *110#</p>
          <p style="font-size: 0.9rem; color: #aaa; margin-top: 1rem;">Send the exact amount to our account</p>
        </div>
      `;
    }
  }

  updateOrderSummary() {
    const summary = document.getElementById('order-summary');
    const items = this.cart.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>RWF ${item.price.toLocaleString()}</td>
        <td>RWF ${(item.price * item.qty).toLocaleString()}</td>
      </tr>
    `).join('');

    const total = this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = 5000; // 5000 RWF shipping
    const grandTotal = total + shipping;

    summary.innerHTML = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
        <thead>
          <tr style="border-bottom: 1px solid #00ffcc;">
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${items}</tbody>
      </table>
      <div style="display: flex; justify-content: space-between; font-size: 1.1rem; padding: 1rem 0; border-top: 1px solid #00ffcc; border-bottom: 1px solid #00ffcc;">
        <span>Subtotal:</span>
        <span>RWF ${total.toLocaleString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 1rem; color: #00ffcc; padding: 0.5rem 0;">
        <span>Shipping:</span>
        <span>RWF ${shipping.toLocaleString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: bold; color: #00ffcc; padding: 1rem 0;  margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #ff00ff;">
        <span>Grand Total:</span>
        <span>RWF ${grandTotal.toLocaleString()}</span>
      </div>
    `;
  }

  // ===== MODAL MANAGEMENT =====
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Load admin data if opening admin modal
      if (modalId === 'admin-modal' && this.currentUser?.isAdmin) {
        this.updateStats();
        this.refreshAdminProductsList();
      }
    }
    this.closeUserMenu(); // Close user menu when opening modal
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  goToCheckoutStep(step) {
    const currentSteps = document.querySelectorAll('.checkout-step.active');
    currentSteps.forEach(s => s.classList.remove('active'));
    const targetStep = document.querySelector(`.checkout-step[data-step="${step}"]`);
    if (targetStep) {
      targetStep.classList.add('active');
      targetStep.scrollIntoView({ behavior: 'smooth' });
    }

    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((ps, idx) => {
      if (idx + 1 <= step) {
        ps.classList.add('active');
      } else {
        ps.classList.remove('active');
      }
    });
  }

  // ===== UTILITIES =====
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  filter(brand) {
    this.currentFilter = brand;
    this.renderProducts();
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === brand);
    });
  }

  search(query) {
    this.searchQuery = query;
    this.renderProducts();
  }

  notify(msg, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = msg.replace(/\n/g, '<br>');
    n.setAttribute('role', 'status');
    n.setAttribute('aria-live', 'polite');
    document.body.appendChild(n);

    setTimeout(() => n.remove(), 4000);
  }

  updateYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.product-card, .feature, .testimonial').forEach(el => {
      observer.observe(el);
    });
  }

  // ===== ADMIN FUNCTIONS =====
  updateStats() {
    if (!this.currentUser?.isAdmin) return;
    
    const totalRevenue = this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const productCount = document.getElementById('admin-products');
    const cartCount = document.getElementById('admin-cart-count');
    const userCount = document.getElementById('admin-users');
    const brandCount = document.getElementById('admin-brands');
    const revenueEl = document.getElementById('admin-revenue');
    const updateTimeEl = document.getElementById('admin-update-time');
    
    if (productCount) productCount.textContent = this.products.length;
    if (cartCount) cartCount.textContent = this.cart.reduce((sum, item) => sum + item.qty, 0);
    if (userCount) userCount.textContent = this.users.length;
    if (brandCount) brandCount.textContent = this.brands.length;
    if (revenueEl) revenueEl.textContent = 'RWF ' + totalRevenue.toLocaleString();
    if (updateTimeEl) {
      const now = new Date();
      updateTimeEl.textContent = now.toLocaleTimeString();
    }
    
    this.notify('✓ Dashboard updated', 'success');
  }

  addProduct(name, price, storage, brand, image, badge, tags = []) {
    if (!this.currentUser?.isAdmin) {
      this.notify('Admin access required', 'error');
      return;
    }

    if (!name || !price || !storage || !brand || !image) {
      this.notify('Please fill all required fields', 'error');
      return;
    }

    const newProduct = {
      id: ++this.maxProductId,
      name,
      price: parseFloat(price),
      storage,
      brand: brand.toLowerCase(),
      image,
      badge: badge || 'New',
      tags: tags.length > 0 ? tags : ['new']
    };

    this.products.push(newProduct);
    this.saveToStorage('estore_products', this.products);
    this.brands = [...new Set(this.products.map(p => p.brand))];
    this.renderFilters();
    this.renderProducts();
    this.updateStats();
    this.notify(`✓ Product "${name}" added successfully!`, 'success');
  }

  removeProduct(productId) {
    if (!this.currentUser?.isAdmin) {
      this.notify('Admin access required', 'error');
      return;
    }

    const product = this.products.find(p => p.id === productId);
    if (!product) {
      this.notify('Product not found', 'error');
      return;
    }

    this.products = this.products.filter(p => p.id !== productId);
    this.saveToStorage('estore_products', this.products);
    this.renderProducts();
    this.updateStats();
    this.notify(`✓ Product "${product.name}" removed`, 'success');
  }

  editProduct(productId, updates) {
    if (!this.currentUser?.isAdmin) {
      this.notify('Admin access required', 'error');
      return;
    }

    const product = this.products.find(p => p.id === productId);
    if (!product) {
      this.notify('Product not found', 'error');
      return;
    }

    Object.assign(product, updates);
    this.saveToStorage('estore_products', this.products);
    this.renderProducts();
    this.updateStats();
    this.notify('✓ Product updated successfully', 'success');
  }

  getAdminProductsHTML() {
    if (!this.currentUser?.isAdmin) return '';
    
    return `
      <div class="admin-products-list">
        <h4 style="color: #d0d0d0; margin-bottom: 1rem;"><i class="fas fa-list"></i> Current Products</h4>
        <table style="width: 100%; border-collapse: collapse;;">
          <thead>
            <tr style="border-bottom: 2px solid #4a9eff;">
              <th style="text-align: left; padding: 10px; color: #d0d0d0;">Name</th>
              <th style="text-align: left; padding: 10px; color: #d0d0d0;">Price</th>
              <th style="text-align: left; padding: 10px; color: #d0d0d0;">Brand</th>
              <th style="text-align: center; padding: 10px; color: #d0d0d0;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.products.map(p => `
              <tr style="border-bottom: 1px solid #2a2a2a; background: rgba(255, 255, 255, 0.02);">
                <td style="padding: 10px; color: #d0d0d0;">${p.name}</td>
                <td style="padding: 10px; color: #d0d0d0;">RWF ${p.price.toLocaleString()}</td>
                <td style="padding: 10px; color: #d0d0d0; text-transform: capitalize;">${p.brand}</td>
                <td style="text-align: center; padding: 10px;">
                  <button onclick="store.removeProduct(${p.id})" class="btn-admin-remove" style="background: #ef4444; color: white; padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s;">
                    Remove
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  addProductFromForm() {
    if (!this.currentUser?.isAdmin) {
      this.notify('Admin access required', 'error');
      return;
    }

    const name = document.getElementById('admin-product-name')?.value.trim();
    const price = document.getElementById('admin-product-price')?.value;
    const storage = document.getElementById('admin-product-storage')?.value.trim();
    const brand = document.getElementById('admin-product-brand')?.value.trim();
    const image = document.getElementById('admin-product-image')?.value.trim();
    const badge = document.getElementById('admin-product-badge')?.value.trim();

    if (!name || !price || !storage || !brand || !image) {
      this.notify('Please fill all required fields', 'error');
      return;
    }

    this.addProduct(name, price, storage, brand, image, badge);

    // Clear form
    document.getElementById('admin-product-name').value = '';
    document.getElementById('admin-product-price').value = '';
    document.getElementById('admin-product-storage').value = '';
    document.getElementById('admin-product-brand').value = '';
    document.getElementById('admin-product-image').value = '';
    document.getElementById('admin-product-badge').value = '';

    // Refresh admin products list
    this.refreshAdminProductsList();
  }

  refreshAdminProductsList() {
    const container = document.getElementById('admin-products-list');
    if (container) {
      container.innerHTML = this.getAdminProductsHTML();
    }
  }

  exportData() {
    if (!this.currentUser?.isAdmin) {
      this.notify('Admin access required', 'error');
      return;
    }

    const data = {
      users: this.users,
      products: this.products,
      cart: this.cart,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `estore-data-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    this.notify('✓ Data exported successfully', 'success');
  }

  clearData() {
    if (!this.currentUser?.isAdmin) {
      this.notify('Admin access required', 'error');
      return;
    }

    if (confirm('⚠️ This will clear all cart data. Are you sure?')) {
      this.cart = [];
      this.saveToStorage('estore_cart', this.cart);
      this.updateCartUI();
      this.updateStats();
      this.notify('✓ Cart data cleared', 'success');
    }
  }

  // ===== EVENT BINDING =====
  bindEvents() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filter(e.target.dataset.filter);
      });
    });

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.search(e.target.value);
      });
    }

    // Forms
    const sellForm = document.getElementById('sell-form');
    if (sellForm) sellForm.addEventListener('submit', (e) => this.handleSellForm(e));

    const checkoutForm = document.querySelector('form[id="checkout-form"]') || document.getElementById('checkout-form');
    if (checkoutForm?.tagName === 'FORM') {
      checkoutForm.addEventListener('submit', (e) => this.handleCheckout(e));
    }

    // Modal controls - IMPROVED
    document.querySelectorAll('.close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const modal = e.target.closest('.modal');
        if (modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Mobile menu
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[Menu] toggle clicked');
        nav.classList.toggle('active');
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) nav.classList.remove('active');
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          nav?.classList.remove('active');
        }
      });
    });

    // Dark mode toggle
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    if (darkModeBtn) {
      darkModeBtn.addEventListener('click', () => {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('dark-mode', this.darkMode);
        localStorage.setItem('darkMode', this.darkMode);
      });
    }

    // CART BUTTON - Primary Click Handler
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openModal('cart-modal');
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.cart.length === 0) {
          this.notify('Your cart is empty', 'error');
          return;
        }
        this.closeModal('cart-modal');
        this.openModal('checkout-modal');
      });
    }

    // Continue shopping button
    const continueShoppingBtn = document.getElementById('continue-shopping');
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal('cart-modal');
      });
    }

    // Apply promo code button
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
      applyPromoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.applyPromoCode();
      });
    }

    // Allow Enter key to apply promo
    const promoInput = document.getElementById('promo-code');
    if (promoInput) {
      promoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.applyPromoCode();
        }
      });
    }

    // LOGIN FORM - Improved event binding
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = loginForm.querySelector('#login-email');
        const passwordInput = loginForm.querySelector('#login-password');
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';
        this.login(email, password);
      });
    }

    // REGISTER FORM - Improved event binding
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = registerForm.querySelector('#register-name');
        const emailInput = registerForm.querySelector('#register-email');
        const passwordInput = registerForm.querySelector('#register-password');
        const confirmPasswordInput = registerForm.querySelector('#register-confirm');
        
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';
        const passwordConfirm = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';
        
        this.register(name, email, password, passwordConfirm);
        registerForm.reset();
      });
    }

    // Register link
    const registerLink = document.getElementById('register-link');
    if (registerLink) {
      registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal('login-modal');
        this.openModal('register-modal');
      });
    }

    // Login from register link
    const loginFromRegisterLink = document.getElementById('login-from-register');
    if (loginFromRegisterLink) {
      loginFromRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal('register-modal');
        this.openModal('login-modal');
      });
    }

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    });

    // Close user menu on outside click
    document.addEventListener('click', (e) => {
      const userMenu = document.getElementById('user-menu');
      const loginBtn = document.getElementById('login-btn');
      
      if (userMenu && !userMenu.contains(e.target) && !loginBtn.contains(e.target)) {
        userMenu.classList.remove('active');
      }
    });
  }

  bindAddToCart() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        this.addToCart(id, name, price);
      });
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.store = new EstoreRW();
});