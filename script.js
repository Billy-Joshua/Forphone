/**
 * ForPhone Store  E-Commerce Platform
 */

class ForPhoneStore {
  constructor() {
 this.products = [
  { id: 1, name: 'iPhone 17 Pro Max', price: 1199, Storage: '1TB', brand: 'apple', image: 'iphone17-pro-max.jpg', badge: '-50%' },
  { id: 2, name: 'iPhone 17 Pro', price: 999, brand: 'apple', image: 'iphone17.jpg', badge: 'Hot' },
  { id: 2, name: 'iPhone Air', price: 999, Storage: '512GB', brand: 'apple', image: 'iphone air.jpg', badge: 'new' },
  { id: 3, name: 'Samsung Galaxy S26 Ultra', price: 1299, brand: 'samsung', image: 'samsung-s26-ultra.jpg', badge: 'Pro' },
  { id: 4, name: 'Samsung Galaxy S26', price: 999, brand: 'samsung', image: 'samsung-s26.jpg', badge: 'Sale' },
  { id: 5, name: 'Google Pixel 10 Pro', price: 1099, brand: 'google', image: 'pixel10.jpg', badge: 'AI' },
  { id: 6, name: 'Google Pixel 10', price: 899, brand: 'google', image: 'pixel10.jpg', badge: 'Best Value' },
  { id: 7, name: 'OnePlus 12 Pro', price: 899, brand: 'oneplus', image: 'oneplus12-pro.jpg', badge: 'Fast' },
  { id: 8, name: 'OnePlus 12', price: 699, brand: 'oneplus', image: 'oneplus12.jpg', badge: 'Affordable' },
  { id: 9, name: 'Samsung Galaxy S25 Ultra', price: 1199, brand: 'samsung', image: 'samsung-galaxy-s25-ultra.jpg', badge: 'New Arrival' },
  { id: 10, name: 'Google Pixel 9 Pro', price: 999, brand: 'google', image: 'google-pixel-9-pro.jpg', badge: 'Top Rated' },
  { id: 11, name: 'OnePlus 11 Pro', price: 799, brand: 'oneplus', image: 'oneplus-11-pro.jpg', badge: 'Value Pick' },
  { id: 12, name: 'iPhone 16 Pro max', price: 1000, brand: 'apple', image: 'iphone16-pro.jpg', badge: 'Bestseller' },
  { id: 13, name: 'Samsung Galaxy S25', price: 899, brand: 'samsung', image: 'samsung-galaxy-s25.jpg', badge: 'Trending' },
  { id: 14, name: 'Google Pixel 9', price: 799, brand: 'google', image: 'google-pixel-9.jpg', badge: 'Customer Favorite' },
  { id: 15, name: 'OnePlus 11', price: 699, brand: 'oneplus', image: 'oneplus-11.jpg', badge: 'Hot Deal' }, 
  { id: 16, name: 'iPhone SE (2024)', price: 499, brand: 'apple', image: 'iphone-se-2024.jpg', badge: 'Affordable' },
  { id: 17, name: 'Samsung Galaxy A14', price: 299, brand: 'samsung', image: 'samsung-galaxy-a14.jpg', badge: 'Budget' },
  { id: 18, name: 'Google Pixel 8a', price: 399, brand: 'google', image: 'google-pixel-8a.jpg', badge: 'Value' },
  { id: 19, name: 'OnePlus Nord N300', price: 249, brand: 'oneplus', image: 'oneplus-nord-n300.jpg', badge: 'Entry Level' },
  { id: 20, name: 'iPhone 15 Pro Max', price: 1099, brand: 'apple', image: 'iphone15-pro-max.jpg', badge: 'new' },
  { id: 21, name: 'iPhone 15 Pro', price: 899, brand: 'apple', image: 'iphone15-pro.jpg', badge: 'Hot' },
  { id: 22, name: 'Samsung Galaxy S24 Ultra', price: 1199, brand: 'samsung', image: 'samsung-s24-ultra.jpg', badge: 'Pro' },
  { id: 23, name: 'Samsung Galaxy S24', price: 899, brand: 'samsung', image: 'samsung-s24.jpg', badge: 'Sale' },
  { id: 24, name: 'Google Pixel 8 Pro', price: 999, brand: 'google', image: 'pixel8-pro.jpg', badge: 'AI' },
  { id: 25, name: 'Google Pixel 8', price: 799, brand: 'google', image: 'pixel8.jpg', badge: 'Best Value' },
  { id: 26, name: 'OnePlus 10 Pro', price: 799, brand: 'oneplus', image: 'oneplus10-pro.jpg', badge: 'Fast' },
  { id: 27, name: 'OnePlus 10', price: 599, brand: 'oneplus', image: 'oneplus10.jpg', badge: 'Affordable' },
  { id: 28, name: 'iPhone 14 Pro Max', price: 999, brand: 'apple', image: 'iphone14-pro-max.jpg', badge: 'Bestseller' },
  { id: 29, name: 'Samsung Galaxy S23 Ultra', price: 1099, brand: 'samsung', image: 'samsung-galaxy-s23-ultra.jpg', badge: 'New Arrival' },
  { id: 30, name: 'Google Pixel 7 Pro', price: 899, brand: 'google', image: 'google-pixel-7-pro.jpg', badge: 'Top Rated' },
  { id: 31, name: 'OnePlus 9 Pro', price: 699, brand: 'oneplus', image: 'oneplus-9-pro.jpg', badge: 'Value Pick' },
  { id: 32, name: 'iPhone 14 Pro', price: 799, brand: 'apple', image: 'iphone14-pro.jpg', badge: 'Trending' },
  { id: 33, name: 'Samsung Galaxy S23', price: 899, brand: 'samsung', image: 'samsung-galaxy-s23.jpg', badge: 'Customer Favorite' },
  { id: 34, name: 'Google Pixel 7', price: 699, brand: 'google', image: 'google-pixel-7.jpg', badge: 'Hot Deal' },
  { id: 35, name: 'OnePlus 9', price: 599, brand: 'oneplus', image: 'oneplus-9.jpg', badge: 'Popular' },
  { id: 36,name: 'iPhone 13 Mini', price: 599, brand: 'apple', image: 'iphone13-mini.jpg', badge: 'Compact' },
  { id: 37, name: 'Samsung Galaxy Z Flip 5', price: 999, brand: 'samsung', image: 'samsung-galaxy-z-flip-5.jpg', badge: 'Foldable' },
  { id: 38, name: 'Google Pixel Fold', price: 1799, brand: 'google', image: 'google-pixel-fold.jpg', badge: 'Innovative' },
  { id: 39, name: 'OnePlus Ace Pro', price: 749, brand: 'oneplus', image: 'oneplus-ace-pro.jpg', badge: 'Performance' },
  { id: 40, name: 'iPhone 13 Pro Max', price: 899, brand: 'apple', image: 'iphone13-pro-max.jpg', badge: 'Durable' },
  
];

    this.brands = [...new Set(this.products.map(p => p.brand))];
    this.cart = JSON.parse(localStorage.getItem('forphone_cart')) || [];
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.darkMode = this.darkMode !== null ? this.darkMode : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.init();
  }


  init() {
    this.applyDarkMode();
    this.renderFilters();
    this.renderProducts();
    this.renderSellForm();
    this.renderCheckoutForm();
    this.updateCartUI();
    this.updateYear();
    this.bindEvents();
    this.observeSections();
  }

  // === RENDERING ===
  renderFilters() {
    const container = document.getElementById('filters');
    const filters = ['all', ...this.brands];
    container.innerHTML = filters.map(f => `
      <button class="filter-btn ${f === 'all' ? 'active' : ''}" data-filter="${f}">
        ${f.charAt(0).toUpperCase() + f.slice(1)}
      </button>
    `).join('');
  }

  renderProducts() {
  const grid = document.getElementById('product-grid');

  const filtered = this.products.filter(p =>
    (this.currentFilter === 'all' || p.brand === this.currentFilter) &&
    p.name.toLowerCase().includes(this.searchQuery)
  );

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="no-results">No phones found.</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-aos="fade-up">
      <div class="badge">${p.badge}</div>
      <div class="product-image">
        <img src="images/${p.image}" 
             alt="${p.name}" 
             loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x300.png?text=No+Image'">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="price">$${p.price}</p>
        <button class="add-to-cart" data-id="${p.id}">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `).join('');

  this.bindAddToCart();
}
 
  renderSellForm() {
    const container = document.getElementById('sell-form-container');
    container.innerHTML = `
      <form id="sell-form" class="sell-form">
        <input type="text" placeholder="Phone Model" required />
        <input type="number" placeholder="Your Price ($)" required />
        <select required>
          <option value="">Condition</option>
          <option>New</option>
          <option>Like New</option>
          <option>Good</option>
          <option>Fair</option>
        </select>
        <textarea placeholder="Description (storage, color, issues)" required></textarea>
        <div class="file-upload">
          <input type="file" id="sell-images" accept="image/*" multiple />
          <label for="sell-images"><i class="fas fa-camera"></i> Upload Photos</label>
          <div id="image-preview" class="image-preview"></div>
        </div>
        <button type="submit" class="btn-primary">Get Quote</button>
      </form>
    `;

    document.getElementById('sell-images').addEventListener('change', this.handleImagePreview);
    document.getElementById('sell-form').addEventListener('submit', e => this.handleSellSubmit(e));
  }
renderCheckoutForm() {
  document.getElementById('checkout-form').innerHTML = `
    <input type="text" placeholder="Full Name" required />
    <input type="email" placeholder="Email" required />
    <input type="text" placeholder="Shipping Address" required />
    <input type="tel" placeholder="Phone" required />

    <div class="payment-methods">
      <label>
        <input type="radio" name="payment" value="card" required />
        <img src="https://img.icons8.com/color/48/visa.png" alt="Card" />
        Card
      </label>
      <label>
        <input type="radio" name="payment" value="paypal" required />
        <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" />
        PayPal
      </label>
      <label>
        <input type="radio" name="payment" value="bank" required />
        <img src="images/BK_LOGO.png" alt="Bank of Kigali" />
        Bank of Kigali
      </label>
      <label>
        <input type="radio" name="payment" value="mtn_money" required />
        <img src="images/MTN LOGO.png" alt="MTN Mobile Money" />
        MTN Mobile Money
      </label>
    </div>

    <button type="submit" class="btn-primary">Pay & Order</button>
  `;
}


  // === CART ===
  addToCart(id) {
    const product = this.products.find(p => p.id === id);
    const existing = this.cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else this.cart.push({ ...product, qty: 1 });
    this.saveCart();
    this.updateCartUI();
    this.notify(`${product.name} added!`);
  }

  updateQuantity(index, change) {
    this.cart[index].qty += change;
    if (this.cart[index].qty <= 0) this.cart.splice(index, 1);
    this.saveCart();
    this.updateCartUI();
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.updateCartUI();
  }

  updateCartUI() {
    const count = this.cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cart-count').textContent = count;

    const items = document.getElementById('cart-items');
    const total = this.cart.reduce((s, i) => s + i.price * i.qty, 0);

    items.innerHTML = this.cart.length ? this.cart.map((item, i) => `
      <div class="cart-item">
        <img src="images/${item.image}" alt="${item.name}"/>
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price} × ${item.qty}</p>
        </div>
        <div class="qty-controls">
          <button onclick="store.updateQuantity(${i}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="store.updateQuantity(${i}, 1)">+</button>
          <button class="remove" onclick="store.removeFromCart(${i})">×</button>
        </div>
      </div>
    `).join('') : '<p class="empty-cart">Your cart is empty.</p>';

    document.getElementById('cart-total').textContent = total.toFixed(2);
  }

  // === EVENTS ===
  bindEvents() {
    // Nav
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth <= 768) document.getElementById('nav').classList.remove('active');
      });
    });

    // Menu
    document.getElementById('menu-toggle').addEventListener('click', () => {
      document.getElementById('nav').classList.toggle('active');
    });

    // Cart
    document.getElementById('cart-btn').addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('cart-modal').classList.add('active');
    });

    document.getElementById('checkout-btn').addEventListener('click', () => {
      if (!this.cart.length) return this.notify('Cart is empty!');
      document.getElementById('cart-modal').classList.remove('active');
      document.getElementById('checkout-modal').classList.add('active');
    });

    // Modals
    document.querySelectorAll('.close').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
      });
    });

    // Filters
    document.getElementById('filters').addEventListener('click', e => {
      if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.renderProducts();
      }
    });

    // Search
    document.getElementById('search-input').addEventListener('input', e => {
      this.searchQuery = e.target.value.toLowerCase();
      this.renderProducts();
    });
    // Search Bar Scroll Effect
window.addEventListener('scroll', () => {
  const searchBar = document.getElementById('search-bar');
  if (window.scrollY > 100) {
    searchBar.classList.add('scrolled');
  } else {
    searchBar.classList.remove('scrolled');
  }
});

    // Dark Mode
    document.getElementById('dark-mode-toggle').addEventListener('click', () => {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
      this.applyDarkMode();
    });

    // Checkout
    document.getElementById('checkout-form').addEventListener('submit', e => {
      e.preventDefault();
      this.notify('Order placed successfully!');
      this.cart = [];
      this.saveCart();
      this.updateCartUI();
      document.getElementById('checkout-modal').classList.remove('active');
    });
  }

  bindAddToCart() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        this.addToCart(id);
      });
    });
  }

  // === UTILITIES ===
  saveCart() {
    localStorage.setItem('forphone_cart', JSON.stringify(this.cart));
  }

  notify(msg) {
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
  }
  handleImagePreview(e) {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    [...e.target.files].slice(0, 4).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const img = document.createElement('img');
        img.src = ev.target.result;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  handleSellSubmit(e) {
    e.preventDefault();
    this.notify('Quote requested! We’ll email you in 24h.');
    e.target.reset();
    document.getElementById('image-preview').innerHTML = '';
  }

  applyDarkMode() {
    document.body.classList.toggle('dark-mode', this.darkMode);
    const icon = document.querySelector('#dark-mode-toggle i');
    icon.className = this.darkMode ? 'fas fa-sun' : 'fas fa-moon';
  }

  updateYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
  }

  observeSections() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(sec => observer.observe(sec));
  }
}
// Init
const store = new ForPhoneStore();
window.store = store; 

