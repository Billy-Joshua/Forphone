/**
 * ForPhone Store - Full E-Commerce JavaScript
 * Features:
 * - Product filtering
 * - Cart management with localStorage
 * - Sell form submission (simulation)
 * - Checkout form validation
 * - Mobile menu
 * - Smooth scroll
 * - Animations & notifications
 */

class ForPhoneStore {
    constructor() {
        // Selectors
        this.selectors = {
            nav: '.nav',
            menuToggle: '.menu-toggle',
            cartLink: '.cart-link',
            cartCount: '#cart-count',
            cartModal: '#cart-modal',
            checkoutModal: '#checkout-modal',
            closeBtns: '.close',
            productGrid: '#product-grid',
            filterBtns: '.filter-btn',
            sellForm: '#sell-form',
            checkoutForm: '#checkout-form'
        };

        // Data
        this.products = [
            { id: 1, name: 'iPhone 17 Pro Max', price: 1199, brand: 'apple', image: '📱' },
            { id: 2, name: 'iPhone 17', price: 999, brand: 'apple', image: '📱' },
            { id: 3, name: 'Samsung Galaxy S26 Ultra', price: 1299, brand: 'samsung', image: '📱' },
            { id: 4, name: 'Samsung Galaxy S26', price: 999, brand: 'samsung', image: '📱' },
            { id: 5, name: 'Google Pixel 10 Pro', price: 1099, brand: 'google', image: '📱' },
            { id: 6, name: 'Google Pixel 10', price: 899, brand: 'google', image: '📱' }
        ];

        this.cart = [];
        this.currentFilter = 'all';

        // Init
        this.init();
    }

    init() {
        this.loadCart();
        this.updateYear();
        this.renderProducts();
        this.bindEvents();
        this.handleScroll();
    }

    // Load cart from localStorage
    loadCart() {
        const saved = localStorage.getItem('forphoneCart');
        if (saved) {
            this.cart = JSON.parse(saved);
        }
        this.updateCartUI();
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('forphoneCart', JSON.stringify(this.cart));
    }

    // Update cart UI (count & modal)
    updateCartUI() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
        document.querySelector(this.selectors.cartCount).textContent = totalItems;
        this.renderCartModal();
    }

    // Render products in grid
    renderProducts(filter = 'all') {
        const grid = document.querySelector(this.selectors.productGrid);
        grid.innerHTML = this.products
            .filter(product => filter === 'all' || product.brand === filter)
            .map(product => `
                <div class="product-card" data-brand="${product.brand}">
                    <div class="product-image">${product.image}</div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="product-price">$${product.price}</div>
                        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                    </div>
                </div>
            `).join('');

        // Re-bind add to cart events
        this.bindAddToCart();
    }

    // Render cart in modal
    renderCartModal() {
        const container = document.querySelector('#cart-items');
        if (this.cart.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #86868b;">Your cart is empty.</p>';
            return;
        }

        container.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item">
                <span>${item.name} (x${item.qty})</span>
                <div>
                    <span>$${ (item.price * item.qty).toFixed(2) }</span>
                    <button onclick="forPhoneStore.removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        document.querySelector('#cart-total').textContent = total.toFixed(2);
    }

    // Add to cart
    addToCart(id, name, price) {
        const existing = this.cart.find(item => item.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            this.cart.push({ id, name, price, qty: 1 });
        }
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${name} added to cart!`);
    }

    // Remove from cart
    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartUI();
    }

    // Filter products
    filterProducts(filter) {
        this.currentFilter = filter;
        this.renderProducts(filter);
        document.querySelectorAll(this.selectors.filterBtns).forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    }

    // Sell form submission
    handleSellForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        // Simulate submission
        alert('Phone listing submitted! We\'ll review it soon.');
        e.target.reset();
    }

    // Checkout form validation & submission
    handleCheckout(e) {
        e.preventDefault();
        const form = e.target;
        if (!form.checkValidity()) {
            alert('Please fill all fields correctly.');
            return;
        }
        // Simulate payment
        alert('Order placed successfully! (Integrate Stripe here for real payments.)');
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        document.querySelector(this.selectors.checkoutModal).classList.remove('active');
    }

    // Show notification
    showNotification(message) {
        const notif = document.createElement('div');
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed; top: 80px; right: 20px; background: #0071e3; color: white;
            padding: 1rem; border-radius: 8px; z-index: 3000; animation: slideIn 0.3s;
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }

    // Bind all events
    bindEvents() {
        // Mobile menu
        document.querySelector(this.selectors.menuToggle).addEventListener('click', () => {
            document.querySelector(this.selectors.nav).classList.toggle('active');
        });

        // Close modals
        document.querySelectorAll(this.selectors.closeBtns).forEach(close => {
            close.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
            });
        });

        // Cart open
        document.querySelector(this.selectors.cartLink).addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(this.selectors.cartModal).classList.add('active');
        });

        // Checkout open
        document.getElementById('checkout-btn').addEventListener('click', () => {
            if (this.cart.length === 0) {
                alert('Cart is empty!');
                return;
            }
            document.querySelector(this.selectors.cartModal).classList.remove('active');
            document.querySelector(this.selectors.checkoutModal).classList.add('active');
        });

        // Filter buttons
        document.querySelectorAll(this.selectors.filterBtns).forEach(btn => {
            btn.addEventListener('click', () => this.filterProducts(btn.dataset.filter));
        });

        // Sell form
        document.querySelector(this.selectors.sellForm).addEventListener('submit', (e) => this.handleSellForm(e));

        // Checkout form
        document.querySelector(this.selectors.checkoutForm).addEventListener('submit', (e) => this.handleCheckout(e));

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                target?.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Close mobile menu on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.querySelector(this.selectors.nav).classList.remove('active');
            }
        });
    }

    // Bind add to cart buttons (dynamic)
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

    // Scroll handling (header shrink, etc.)
    handleScroll() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.site-header');
            if (window.scrollY > 100) {
                header.style.height = '50px';
            } else {
                header.style.height = '60px';
            }
        });
    }

    // Update year
    updateYear() {
        document.getElementById('year').textContent = new Date().getFullYear();
    }
}

// Inject animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    .nav.active { left: 0; }
    .modal { animation: fadeIn 0.3s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.forPhoneStore = new ForPhoneStore();
});