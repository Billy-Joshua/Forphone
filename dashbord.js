/**
 * ForPhone Store - Full E-Commerce JavaScript
 * Now with REAL IMAGES
 */

class ForPhoneStore {
    constructor() {
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

        this.products = [
            { id: 1, name: 'iPhone 17 Pro Max', price: 1199, brand: 'apple', image: 'iphone17.jpg.' },
            { id: 2, name: 'iPhone 17', price: 999, brand: 'apple', image: 'iphone17.jpg' },
            { id: 3, name: 'Samsung Galaxy S26 Ultra', price: 1299, brand: 'samsung', image: 'samsung-s26.jpg.jpg' },
            { id: 4, name: 'Samsung Galaxy S26', price: 999, brand: 'samsung', image: 'samsung-s26.jpg' },
            { id: 5, name: 'Google Pixel 10 Pro', price: 1099, brand: 'google', image: 'pixel10.jpg' },
            { id: 6, name: 'Google Pixel 10', price: 899, brand: 'google', image: 'pixel10.jpg' },
            { id: 7, name: 'OnePlus 12 Pro', price: 899, brand: 'oneplus', image: 'oneplus12.jpg' },
        ];


        this.cart = [];
        this.currentFilter = 'all';

        this.init();
    }

    init() {
        this.loadCart();
        this.updateYear();
        this.renderProducts();
        this.bindEvents();
        this.handleScroll();
    }

    loadCart() {
        const saved = localStorage.getItem('forphoneCart');
        if (saved) this.cart = JSON.parse(saved);
        this.updateCartUI();
    }

    saveCart() {
        localStorage.setItem('forphoneCart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
        document.querySelector(this.selectors.cartCount).textContent = totalItems;
        this.renderCartModal();
    }

    renderProducts(filter = 'all') {
        const grid = document.querySelector(this.selectors.productGrid);
        grid.innerHTML = this.products
            .filter(p => filter === 'all' || p.brand === filter)
            .map(p => `
                <div class="product-card" data-brand="${p.brand}">
                    <div class="product-image">
                        <img src="images/${p.image}" alt="${p.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3>${p.name}</h3>
                        <div class="product-price">$${p.price}</div>
                        <button class="add-to-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `).join('');
        this.bindAddToCart();
    }

    renderCartModal() {
        const container = document.querySelector('#cart-items');
        if (this.cart.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #86868b;">Your cart is empty.</p>';
            return;
        }
        container.innerHTML = this.cart.map((item, i) => `
            <div class="cart-item">
                <span>${item.name} (x${item.qty})</span>
                <div>
                    <span>$${ (item.price * item.qty).toFixed(2) }</span>
                    <button onclick="forPhoneStore.removeFromCart(${i})">Remove</button>
                </div>
            </div>
        `).join('');
        const total = this.cart.reduce((s, i) => s + i.price * i.qty, 0);
        document.querySelector('#cart-total').textContent = total.toFixed(2);
    }

    addToCart(id, name, price) {
        const existing = this.cart.find(i => i.id === id);
        if (existing) existing.qty++;
        else this.cart.push({ id, name, price, qty: 1 });
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${name} added!`);
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartUI();
    }

    filterProducts(filter) {
        this.currentFilter = filter;
        this.renderProducts(filter);
        document.querySelectorAll(this.selectors.filterBtns).forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    }

    handleSellForm(e) {
        e.preventDefault();
        alert('Listing submitted! We’ll review it.');
        e.target.reset();
    }

    handleCheckout(e) {
        e.preventDefault();
        if (!e.target.checkValidity()) {
            alert('Fill all fields.');
            return;
        }
        alert('Order placed! (Add Stripe for real payments)');
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        document.querySelector(this.selectors.checkoutModal).classList.remove('active');
    }

    showNotification(msg) {
        const n = document.createElement('div');
        n.textContent = msg;
        n.style.cssText = `position:fixed;top:80px;right:20px;background:#0071e3;color:white;padding:1rem;border-radius:8px;z-index:3000;animation:slideIn .3s`;
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 3000);
    }

    bindEvents() {
        document.querySelector(this.selectors.menuToggle).addEventListener('click', () => {
            document.querySelector(this.selectors.nav).classList.toggle('active');
        });

        document.querySelectorAll(this.selectors.closeBtns).forEach(c => {
            c.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            });
        });

        document.querySelector(this.selectors.cartLink).addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(this.selectors.cartModal).classList.add('active');
        });

        document.getElementById('checkout-btn').addEventListener('click', () => {
            if (this.cart.length === 0) return alert('Cart empty!');
            document.querySelector(this.selectors.cartModal).classList.remove('active');
            document.querySelector(this.selectors.checkoutModal).classList.add('active');
        });

        document.querySelectorAll(this.selectors.filterBtns).forEach(b => {
            b.addEventListener('click', () => this.filterProducts(b.dataset.filter));
        });

        document.querySelector(this.selectors.sellForm).addEventListener('submit', e => this.handleSellForm(e));
        document.querySelector(this.selectors.checkoutForm).addEventListener('submit', e => this.handleCheckout(e));

        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.querySelector(this.selectors.nav).classList.remove('active');
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

    handleScroll() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.site-header');
            header.style.height = window.scrollY > 100 ? '50px' : '60px';
        });
    }

    updateYear() {
        document.getElementById('year').textContent = new Date().getFullYear();
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    .nav.active { left: 0; }
    .modal { animation: fadeIn 0.3s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    window.forPhoneStore = new ForPhoneStore();
});
