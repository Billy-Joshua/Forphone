/**
 * ============================================
 * PREMIUM PHONE STORE - JavaScript
 * EstoreRW - Luxury Tech Store
 * ============================================
 * 
 * FUNCTIONALITY:
 * - Cart Management System
 * - Product Loading & Display
 * - Mobile Navigation
 * - Search Functionality
 * - Modal Management
 * - Smooth Scrolling & Animations
 */

/* ============================================
   INITIALIZATION
   ============================================ */

// Products Database
const PRODUCTS = [
  {
    id: 1,
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    price: "1,299",
    image: "images/iPhone 17 pro max.jpeg",
    badge: "New",
    status: "In Stock"
  },
  {
    id: 2,
    name: "Samsung Galaxy S26 Ultra",
    brand: "Samsung",
    price: "1,199",
    image: "images/samsung-s26-ultra.jpg",
    badge: "Hot",
    status: "In Stock"
  },
  {
    id: 3,
    name: "Google Pixel 10",
    brand: "Google",
    price: "999",
    image: "images/pixel10.jpg",
    badge: "Sale",
    status: "In Stock"
  },
  {
    id: 4,
    name: "OnePlus 12 Pro",
    brand: "OnePlus",
    price: "849",
    image: "images/OnePlus 12 Pro.jpg",
    badge: "New",
    status: "In Stock"
  },
  {
    id: 5,
    name: "Samsung Galaxy S26",
    brand: "Samsung",
    price: "899",
    image: "images/samsung-s26.jpg",
    badge: "Hit",
    status: "In Stock"
  },
  {
    id: 6,
    name: "iPhone Air",
    brand: "Apple",
    price: "999",
    image: "images/iphone Air.jpg",
    badge: "Sale",
    status: "In Stock"
  }
];

// Cart Array
let cart = [];

// ============================================
// DOM ELEMENTS
// ============================================

const cartToggle = document.getElementById('cart-toggle');
const cartBadge = document.querySelector('.cart-badge');
const cartModal = document.getElementById('cart-modal');
const modalOverlay = document.getElementById('modal-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const emptyMessage = document.getElementById('empty-cart-message');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const productsGrid = document.getElementById('products-grid');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const nav = document.querySelector('.nav');
const searchToggle = document.getElementById('search-toggle');
const mobileSearch = document.querySelector('.mobile-search');
const searchInput = mobileSearch?.querySelector('.search-input');
const searchBtn = mobileSearch?.querySelector('.search-btn');

// ============================================
// UTILITIES
// ============================================

/**
 * Get stored value from localStorage
 * @param {string} key - The key to retrieve
 * @param {*} defaultValue - Default value if not found
 * @returns {*} The stored value or default
 */
function getFromStorage(key, defaultValue = null) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Error reading from storage: ${e}`);
    return defaultValue;
  }
}

/**
 * Save value to localStorage
 * @param {string} key - The key to save
 * @param {*} value - The value to save
 */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving to storage: ${e}`);
  }
}

/**
 * Toggle a modal's visibility
 * @param {Element} modal - The modal element
 * @param {boolean} show - Whether to show or hide
 */
function toggleModal(modal, show) {
  if (show) {
    modal.hidden = false;
    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
  } else {
    modal.hidden = true;
    modalOverlay.hidden = true;
    document.body.style.overflow = 'auto';
  }
}

/**
 * Format currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
  return `$${amount.toLocaleString()}`;
}

/**
 * Add animation class to element
 * @param {Element} element - The element to animate
 * @param {string} animation - The animation class name
 */
function animate(element, animation) {
  element.classList.add(animation);
  setTimeout(() => {
    element.classList.remove(animation);
  }, 500);
}

// ============================================
// PRODUCT FUNCTIONALITY
// ============================================

/**
 * Load and display products in the grid
 */
function loadProducts() {
  if (!productsGrid) return;
  
  productsGrid.innerHTML = '';
  
  PRODUCTS.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-badge">${product.badge}</div>
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div class="product-info">
        <p class="brand">${product.brand}</p>
        <h3>${product.name}</h3>
        <p class="status">${product.status}</p>
        <div class="price">$${product.price}</div>
        <button class="btn btn-primary product-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price.replace(/,/g, '')})">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    `;
    productsGrid.appendChild(productCard);
  });
}

// ============================================
// CART FUNCTIONALITY
// ============================================

/**
 * Add product to cart
 * @param {number} id - Product ID
 * @param {string} name - Product name
 * @param {number} price - Product price
 */
function addToCart(id, name, price) {
  // Check if item already in cart
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      quantity: 1
    });
  }
  
  // Save cart to storage
  saveToStorage('cart', cart);
  
  // Update UI
  updateCartBadge();
  showNotification(`${name} added to cart!`);
}

/**
 * Remove item from cart
 * @param {number} id - Product ID
 */
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveToStorage('cart', cart);
  updateCartBadge();
  renderCartItems();
}

/**
 * Update quantity of cart item
 * @param {number} id - Product ID
 * @param {number} quantity - New quantity
 */
function updateCartQuantity(id, quantity) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveToStorage('cart', cart);
    updateCartBadge();
    renderCartItems();
  }
}

/**
 * Update cart badge with item count
 */
function updateCartBadge() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

/**
 * Calculate cart total
 * @returns {number} Cart total
 */
function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Render cart items in modal
 */
function renderCartItems() {
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    emptyMessage.style.display = 'block';
    cartTotal.style.display = 'none';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }
  
  emptyMessage.style.display = 'none';
  cartTotal.style.display = 'flex';
  if (checkoutBtn) checkoutBtn.style.display = 'block';
  
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid rgba(168, 198, 63, 0.1);
    `;
    
    cartItem.innerHTML = `
      <div style="flex: 1;">
        <h4 style="margin-bottom: 0.5rem; color: #333333; font-size: 1rem;">${item.name}</h4>
        <p style="margin: 0; color: #666666; font-size: 0.9rem;">
          $${item.price} x ${item.quantity} = <strong style="color: #A8C63F;">$${(item.price * item.quantity).toLocaleString()}</strong>
        </p>
      </div>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})" style="
          background: rgba(168, 198, 63, 0.2);
          border: none;
          color: #A8C63F;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          border-radius: 4px;
          font-weight: bold;
        ">−</button>
        <span style=\"min-width: 30px; text-align: center; color: #333333;\">${item.quantity}</span>
        <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})" style="
          background: rgba(168, 198, 63, 0.2);
          border: none;
          color: #A8C63F;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          border-radius: 4px;
          font-weight: bold;
        ">+</button>
        <button onclick="removeFromCart(${item.id})" style="
          background: rgba(231, 76, 60, 0.2);
          border: none;
          color: #E74C3C;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          border-radius: 4px;
          margin-left: 0.5rem;
          font-weight: bold;
        ">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    cartItemsContainer.appendChild(cartItem);
  });
  
  // Update total
  const total = getCartTotal();
  cartTotal.innerHTML = `
    <strong>Total:</strong>
    <strong style="color: #A8C63F; font-size: 1.3rem;">${formatCurrency(total)}</strong>
  `;
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

/**
 * Show temporary notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'success', duration = 3000) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === 'success' ? '#2ECC71' : type === 'error' ? '#E74C3C' : '#3498DB'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
    font-weight: 500;
    max-width: 300px;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Remove after duration
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, duration);
}

// ============================================
// MOBILE NAVIGATION
// ============================================

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
  if (!nav) return;
  nav.classList.toggle('mobile-menu-open');
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  if (!nav) return;
  nav.classList.remove('mobile-menu-open');
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

/**
 * Toggle search bar visibility
 */
function toggleSearch() {
  if (!mobileSearch) return;
  mobileSearch.classList.toggle('active');
  
  if (mobileSearch.classList.contains('active')) {
    searchInput?.focus();
  }
}

/**
 * Perform search
 */
function performSearch() {
  if (!searchInput) return;
  
  const query = searchInput.value.toLowerCase();
  
  if (!query) {
    loadProducts();
    return;
  }
  
  const filtered = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.brand.toLowerCase().includes(query)
  );
  
  displayFilteredProducts(filtered);
}

/**
 * Display filtered products
 * @param {Array} products - Array of products to display
 */
function displayFilteredProducts(products) {
  if (!productsGrid) return;
  
  productsGrid.innerHTML = '';
  
  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666666;">
        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5; display: block;"></i>
        <p>No products found. Try another search.</p>
      </div>
    `;
    return;
  }
  
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-badge">${product.badge}</div>
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div class="product-info">
        <p class="brand">${product.brand}</p>
        <h3>${product.name}</h3>
        <p class="status">${product.status}</p>
        <div class="price">$${product.price}</div>
        <button class="btn btn-primary product-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price.replace(/,/g, '')})">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    `;
    productsGrid.appendChild(productCard);
  });
}

// ============================================
// SMOOTH SCROLLING
// ============================================

/**
 * Smooth scroll to element
 * @param {string} elementId - The ID of the element to scroll to
 */
function smoothScroll(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    closeMobileMenu();
  }
}

/**
 * Handle smooth scroll for links with href="#id"
 */
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const elementId = href.substring(1);
      smoothScroll(elementId);
    }
  }
});

// ============================================
// EVENT LISTENERS
// ============================================

// Cart toggle
cartToggle?.addEventListener('click', () => {
  renderCartItems();
  toggleModal(cartModal, true);
});

// Close cart modal
closeCartBtn?.addEventListener('click', () => {
  toggleModal(cartModal, false);
});

// Modal overlay click to close
modalOverlay?.addEventListener('click', () => {
  toggleModal(cartModal, false);
});

// Checkout button
checkoutBtn?.addEventListener('click', () => {
  if (cart.length === 0) {
    showNotification('Cart is empty!', 'error');
    return;
  }
  
  const total = getCartTotal();
  showNotification(`Processing checkout for ${formatCurrency(total)}...`, 'info', 2000);
  
  // Simulate checkout
  setTimeout(() => {
    showNotification('Order placed successfully! Thank you for your purchase.', 'success', 3000);
    cart = [];
    saveToStorage('cart', []);
    updateCartBadge();
    renderCartItems();
  }, 2000);
});

// Mobile menu toggle
mobileMenuToggle?.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Search functionality
searchToggle?.addEventListener('click', toggleSearch);
searchBtn?.addEventListener('click', performSearch);
searchInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
});

// ============================================
// INITIALIZATION ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Load products
  loadProducts();
  
  // Load cart from storage
  cart = getFromStorage('cart', []);
  updateCartBadge();
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
    
    .mobile-menu-open {
      display: flex !important;
      animation: slideIn 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
  
  // Log initialization
  console.log('EstoreRW Premium Store Initialized ✓');
});

// ============================================
// SERVICE WORKER REGISTRATION (Optional)
// ============================================

// Uncomment to enable offline support
/*
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(error => {
    console.log('Service Worker registration failed:', error);
  });
}
*/

// ============================================
// EXPORT FOR TESTING (if using modules)
// ============================================

// Uncomment if using as module:
// export { addToCart, removeFromCart, performSearch };
