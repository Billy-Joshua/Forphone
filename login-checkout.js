/**
 * Enhanced Login, Cart & Checkout System
 * Handles user authentication, cart management, and complete checkout flow
 */

class ECommerceStore {
  constructor() {
    this.currentUser = null;
    this.cart = [];
    this.currentCheckoutStep = 1;
    this.checkoutData = {
      shipping: {},
      payment: {},
      items: []
    };
    this.loadFromStorage();
  }

  // ================== STORAGE MANAGEMENT ==================
  saveToStorage(key, value) {
    try {
      localStorage.setItem(`estore_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  getFromStorage(key) {
    try {
      const item = localStorage.getItem(`estore_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  }

  loadFromStorage() {
    this.currentUser = this.getFromStorage('user');
    this.cart = this.getFromStorage('cart') || [];
  }

  // ================== LOGIN SYSTEM ==================
  login(email, password) {
    // Validate inputs
    if (!email || !password) {
      this.showNotification('Please enter email and password', 'error');
      return false;
    }

    if (!this.validateEmail(email)) {
      this.showNotification('Invalid email format', 'error');
      return false;
    }

    // Demo accounts
    const demoAccounts = [
      { 
        id: 1, 
        email: 'test@estore.rw', 
        password: 'test123', 
        name: 'Test User',
        role: 'customer'
      },
      { 
        id: 2, 
        email: 'admin@estore.rw', 
        password: 'admin123', 
        name: 'Admin User',
        role: 'admin'
      }
    ];

    const user = demoAccounts.find(u => u.email === email && u.password === password);

    if (user) {
      this.currentUser = user;
      this.saveToStorage('user', user);
      this.showNotification(`Welcome back, ${user.name}! 👋`, 'success');
      this.updateLoginUI();
      this.closeModal('login-modal');
      return true;
    } else {
      this.showNotification('Invalid email or password. Try test@estore.rw / test123', 'error');
      return false;
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('estore_user');
    this.updateLoginUI();
    this.showNotification('You have logged out', 'info');
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  calculatePasswordStrength(password) {
    // Returns 0-4 for strength level
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return Math.min(strength - 1, 4);
  }

  // ================== CART MANAGEMENT ==================
  addToCart(productId, productName, price, quantity = 1) {
    if (!this.currentUser) {
      this.showNotification('Please login to add items to cart', 'error');
      this.openModal('login-modal');
      return;
    }

    const existingItem = this.cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: productId,
        name: productName,
        price: price,
        quantity: quantity
      });
    }

    this.saveToStorage('cart', this.cart);
    this.updateCartUI();
    this.showNotification(`${productName} added to cart! 🛒`, 'success');
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveToStorage('cart', this.cart);
    this.updateCartUI();
    this.showNotification('Item removed from cart', 'info');
  }

  updateCartQuantity(productId, quantity) {
    const item = this.cart.find(i => i.id === productId);
    if (item) {
      const newQuantity = parseInt(quantity, 10); // FIX: Convert string to integer
      if (newQuantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = newQuantity;
        this.saveToStorage('cart', this.cart);
        this.updateCartUI();
      }
    }
  }

  clearCart() {
    this.cart = [];
    this.saveToStorage('cart', this.cart);
    this.updateCartUI();
  }

  calculateCartTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = this.checkoutData.shipping.method === 'standard' ? 5000 : 
                     this.checkoutData.shipping.method === 'express' ? 10000 : 0;
    const discount = this.checkoutData.discount || 0;
    const total = subtotal + shipping - discount;

    return { subtotal, shipping, discount, total };
  }

  updateCartUI() {
    const cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
      cartCountEl.textContent = cartCount;
      cartCountEl.style.display = cartCount > 0 ? 'flex' : 'none';
    }

    // Update cart items list
    const cartItemsEl = document.getElementById('cart-items');
    if (cartItemsEl) {
      if (this.cart.length === 0) {
        cartItemsEl.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: #a0a0a0;">
            <i class="fas fa-shopping-cart" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;"></i>
            <p>Your cart is empty</p>
          </div>
        `;
      } else {
        cartItemsEl.innerHTML = this.cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p>RWF ${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item-controls">
              <div class="qty-label">Qty:</div>
              <input 
                type="number" 
                value="${item.quantity}" 
                min="1" 
                max="10"
                class="qty-input"
                onchange="store.updateCartQuantity(${item.id}, this.value)"
              />
              <div class="cart-item-price">RWF ${(item.price * item.quantity).toLocaleString()}</div>
              <button class="cart-remove" onclick="store.removeFromCart(${item.id})" title="Remove item">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    // Update cart summary
    const totals = this.calculateCartTotals();
    const fields = {
      'subtotal': totals.subtotal,
      'shipping': totals.shipping,
      'discount-amount': totals.discount,
      'cart-total': totals.total,
      'cart-item-count': `${this.cart.length} item${this.cart.length !== 1 ? 's' : ''}`
    };

    Object.entries(fields).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) {
        if (typeof value === 'number') {
          el.textContent = value.toLocaleString();
        } else {
          el.textContent = value;
        }
      }
    });

    // Show/hide discount row
    const discountRow = document.getElementById('discount-row');
    if (discountRow) {
      discountRow.style.display = totals.discount > 0 ? 'flex' : 'none';
    }
  }

  // ================== CHECKOUT MANAGEMENT ==================
  goToCheckoutStep(step) {
    // Validate current step before moving
    if (step > this.currentCheckoutStep + 1) {
      this.showNotification('Please complete current step first', 'error');
      return;
    }

    if (step === 2 && !this.validateShippingInfo()) {
      return;
    }

    this.currentCheckoutStep = step;
    this.updateCheckoutUI();
  }

  validateShippingInfo() {
    const fields = ['full-name', 'phone', 'email', 'address', 'city'];
    const shipping = document.querySelector('input[name="shipping"]:checked');

    if (!shipping) {
      this.showNotification('Please select a shipping method', 'error');
      return false;
    }

    for (let field of fields) {
      const el = document.getElementById(field);
      if (!el || !el.value) {
        this.showNotification(`Please fill in all required fields`, 'error');
        return false;
      }
    }

    // Save shipping data
    this.checkoutData.shipping = {
      name: document.getElementById('full-name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      method: shipping.value
    };

    return true;
  }

  updateCheckoutUI() {
    // Update progress steps
    document.querySelectorAll('.progress-step').forEach(step => {
      const stepNum = parseInt(step.dataset.step);
      step.classList.toggle('active', stepNum <= this.currentCheckoutStep);
    });

    // Show/hide checkout steps
    document.querySelectorAll('.checkout-step').forEach(step => {
      const stepNum = parseInt(step.dataset.step);
      step.classList.toggle('active', stepNum === this.currentCheckoutStep);
    });

    // Update review data on step 3
    if (this.currentCheckoutStep === 3) {
      this.updateReviewSection();
    }
  }

  updateReviewSection() {
    const shipping = this.checkoutData.shipping;
    document.getElementById('review-name').textContent = `Name: ${shipping.name}`;
    document.getElementById('review-address').textContent = `Address: ${shipping.address}, ${shipping.city}`;
    document.getElementById('review-phone').textContent = `Phone: ${shipping.phone}`;

    // Items
    const itemsHtml = this.cart.map(item => `
      <div style="padding: 0.8rem 0; border-bottom: 1px solid #2a2a2a; display: flex; justify-content: space-between;">
        <span>${item.name} x${item.quantity}</span>
        <span style="color: #4a9eff;">RWF ${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('');
    document.getElementById('review-items').innerHTML = itemsHtml;

    // Summary
    const totals = this.calculateCartTotals();
    document.getElementById('review-subtotal').textContent = totals.subtotal.toLocaleString();
    document.getElementById('review-shipping').textContent = totals.shipping.toLocaleString();
    document.getElementById('review-total').textContent = totals.total.toLocaleString();
  }

  // ================== PAYMENT PROCESSING ==================
  processPayment(event) {
    event.preventDefault();

    // Validate we're on step 3 before submitting
    if (this.currentCheckoutStep !== 3) {
      this.showNotification('Please complete all checkout steps first', 'error');
      this.goToCheckoutStep(this.currentCheckoutStep);
      return;
    }

    // Validate terms
    const agreeTerms = document.getElementById('agree-terms');
    if (!agreeTerms.checked) {
      this.showNotification('Please agree to Terms and Conditions', 'error');
      return;
    }

    // Get payment method
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!paymentMethod) {
      this.showNotification('Please select a payment method', 'error');
      return;
    }

    this.checkoutData.payment = {
      method: paymentMethod.value
    };

    // Process based on payment method
    const method = paymentMethod.value;
    const totals = this.calculateCartTotals();
    const amount = totals.total;

    switch(method) {
      case 'mtn':
        this.processMTNPayment(amount);
        break;
      case 'airtel':
        this.processAirtelPayment(amount);
        break;
      case 'bank':
        this.processBankPayment(amount);
        break;
      case 'paypal':
        this.processPayPalPayment(amount);
        break;
      case 'cod':
        this.processCODPayment(amount);
        break;
      case 'crypto':
        this.processCryptoPayment(amount);
        break;
      default:
        this.showNotification('Invalid payment method', 'error');
    }
  }

  processMTNPayment(amount) {
    const phone = document.getElementById('phone').value;
    const message = `Please send RWF ${amount.toLocaleString()} to *151*2*5*${phone}# and reply with the transaction code`;
    this.showPaymentInstruction(message, 'MTN Mobile Money');
  }

  processAirtelPayment(amount) {
    const phone = document.getElementById('phone').value;
    const message = `Please dial *150*1*${phone}# to pay RWF ${amount.toLocaleString()} via Airtel Money`;
    this.showPaymentInstruction(message, 'Airtel Money');
  }

  processBankPayment(amount) {
    const message = `Bank Name: Bank of Kigali\nAccount: EStore RW\nAmount: RWF ${amount.toLocaleString()}\n\nAfter transfer, reply with the receipt number.`;
    this.showPaymentInstruction(message, 'Bank of Kigali');
  }

  processPayPalPayment(amount) {
    // In production, redirect to PayPal API
    const message = `Redirecting to PayPal to pay RWF ${amount.toLocaleString()}...`;
    this.showPaymentInstruction(message, 'PayPal');
    setTimeout(() => {
      alert('PayPal integration - In production this would redirect to PayPal...');
      this.completeOrder();
    }, 2000);
  }

  processCODPayment(amount) {
    const message = `Amount Due on Delivery: RWF ${amount.toLocaleString()}\n\nYour order will be delivered. Payment will be collected on delivery.`;
    this.showPaymentInstruction(message, 'Cash on Delivery');
  }

  processCryptoPayment(amount) {
    const message = `Bitcoin Address: 1A1z7agoat2Bt89zn1fQCbBn622Esq7\nAmount: ${(amount / 50000).toFixed(6)} BTC (approx)\n\nSend the amount and reply with transaction hash.`;
    this.showPaymentInstruction(message, 'Bitcoin');
  }

  showPaymentInstruction(message, method) {
    alert(`${method} Payment\n\n${message}\n\nOur team will verify your payment within 24 hours.`);
    this.completeOrder();
  }

  completeOrder() {
    const orderId = 'ORD-' + Date.now();
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      user: this.currentUser,
      items: this.cart,
      shipping: this.checkoutData.shipping,
      payment: this.checkoutData.payment,
      totals: this.calculateCartTotals()
    };

    // Save order
    const orders = this.getFromStorage('orders') || [];
    orders.push(order);
    this.saveToStorage('orders', orders);

    // Send email notification
    this.sendOrderEmail(order);

    // Show success message
    this.showNotification(`Order placed successfully! Order ID: ${orderId}`, 'success');
    
    // Reset
    this.clearCart();
    this.currentCheckoutStep = 1;
    this.closeModal('checkout-modal');
    this.closeModal('cart-modal');
    this.openModal('login-modal'); // Show order confirmation would be better in production
  }

  // ================== EMAIL NOTIFICATIONS ==================
  sendOrderEmail(order) {
    const adminEmail = 'billyjoshuaishimwe@gmail.com';
    const customerEmail = order.shipping.email;
    
    // Format order details
    const itemsList = order.items.map(item => `${item.name} x${item.quantity} = RWF ${(item.price * item.quantity).toLocaleString()}`).join('\n');
    
    const emailData = {
      orderId: order.id,
      customerName: order.shipping.name,
      customerEmail: customerEmail,
      customerPhone: order.shipping.phone,
      shippingAddress: `${order.shipping.address}, ${order.shipping.city}`,
      items: itemsList,
      paymentMethod: order.payment.method.toUpperCase(),
      subtotal: order.totals.subtotal,
      shipping: order.totals.shipping,
      discount: order.totals.discount,
      total: order.totals.total,
      date: new Date().toLocaleString()
    };

    // Log for admin view
    console.log('📧 NEW ORDER EMAIL NOTIFICATION');
    console.log('To Admin:', adminEmail);
    console.log('To Customer:', customerEmail);
    console.log('Order:', emailData);

    // Store email notification in localStorage
    const emailNotifications = this.getFromStorage('email_notifications') || [];
    emailNotifications.push(emailData);
    this.saveToStorage('email_notifications', emailNotifications);

    // In production, call backend API:
    // fetch('/api/send-order-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ adminEmail, customerEmail, order: emailData })
    // }).catch(err => console.error('Email send failed:', err));
  }

  // ================== UI MANAGEMENT ==================
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  updateLoginUI() {
    const loginBtn = document.getElementById('login-btn');
    if (!loginBtn) return;

    if (this.currentUser) {
      loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${this.currentUser.name}`;
      loginBtn.onclick = (e) => {
        e.preventDefault();
        this.openUserMenu();
      };
    } else {
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
      loginBtn.onclick = (e) => {
        e.preventDefault();
        this.openModal('login-modal');
      };
    }
  }

  openUserMenu() {
    // Implementation for user menu
    alert(`Logged in as: ${this.currentUser.name}\n\nRole: ${this.currentUser.role}`);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // ================== INITIALIZATION ==================
  bindEvents() {
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        this.login(email, password);
      });
    }

    // Registration Form with validation
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      // Password strength indicator
      const passwordInput = document.getElementById('register-password');
      if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
          const strength = this.calculatePasswordStrength(e.target.value);
          const bar = document.getElementById('strength-bar');
          const text = document.getElementById('strength-text');
          
          if (bar && text) {
            const colors = ['#ff4444', '#ffaa44', '#ffdd44', '#aaff44', '#44ff44'];
            const widths = ['20%', '40%', '60%', '80%', '100%'];
            bar.style.width = widths[strength];
            bar.style.background = colors[strength];
            
            const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
            text.textContent = labels[strength];
          }
        });
      }

      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        const terms = document.getElementById('register-terms').checked;

        // Validation
        if (!name || !email || !phone || !password || !confirm) {
          this.showNotification('Please fill in all fields', 'error');
          return;
        }

        if (!this.validateEmail(email)) {
          this.showNotification('Invalid email format', 'error');
          return;
        }

        if (password !== confirm) {
          this.showNotification('Passwords do not match', 'error');
          return;
        }

        if (password.length < 8) {
          this.showNotification('Password must be at least 8 characters', 'error');
          return;
        }

        if (!terms) {
          this.showNotification('Please agree to Terms and Conditions', 'error');
          return;
        }

        // Create account
        const newUser = {
          id: Date.now(),
          name: name,
          email: email,
          phone: phone,
          createdAt: new Date().toISOString()
        };

        // Save user
        const users = this.getFromStorage('registered_users') || [];
        users.push(newUser);
        this.saveToStorage('registered_users', users);

        this.showNotification(`Account created successfully! Now you can login.`, 'success');
        registerForm.reset();
        this.closeModal('register-modal');
        this.openModal('login-modal');
      });
    }

    // Registration link from login
    const registerLink = document.getElementById('register-link');
    if (registerLink) {
      registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal('login-modal');
        this.openModal('register-modal');
      });
    }

    // Login link from registration
    const loginFromRegister = document.getElementById('login-from-register');
    if (loginFromRegister) {
      loginFromRegister.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal('register-modal');
        this.openModal('login-modal');
      });
    }

    // Checkout Form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => this.processPayment(e));
    }

    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Continue shopping
    const continueShopping = document.getElementById('continue-shopping');
    if (continueShopping) {
      continueShopping.addEventListener('click', () => {
        this.closeModal('cart-modal');
      });
    }

    // Cart button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.cart.length === 0) {
          this.showNotification('Your cart is empty', 'error');
          return;
        }
        this.closeModal('cart-modal');
        this.openModal('checkout-modal');
      });
    }

    this.updateLoginUI();
    this.updateCartUI();
  }

  init() {
    this.bindEvents();
  }
}

// Initialize store
const store = new ECommerceStore();
document.addEventListener('DOMContentLoaded', () => {
  store.init();
});

// Make store globally accessible
window.store = store;
