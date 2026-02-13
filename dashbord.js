
class ForPhoneStore {
    constructor() {
        this.selectors = {
            nav: '.nav',
            menuToggle: '.menu-toggle',
            cartLink: '#cart-btn',
            cartCount: '#cart-count',
            cartModal: '#cart-modal',
            cartContainer: '.cart-container',
            checkoutModal: '#checkout-modal',
            closeBtns: '.close',
            productGrid: '#product-grid',
            productsContainer: '#product-grid',
            filterBtns: '.filter-btn',
            filters: '#filters',
            sellForm: '#sell-form',
            checkoutForm: '#checkout-form',
            loginBtn: '#login-btn',
            loginModal: '#login-modal'
        };

        this.products = [
            { id: 1, name: 'iPhone 17 Pro Max', price: 1199000, brand: 'apple', image: 'iphone17-pro-max.jpg', stock: 5 },
            { id: 2, name: 'iPhone 17', price: 999000, brand: 'apple', image: 'iphone17.jpg', stock: 8 },
            { id: 3, name: 'Samsung Galaxy S26 Ultra', price: 1299000, brand: 'samsung', image: 'samsung-s26-ultra.jpg', stock: 3 },
            { id: 4, name: 'Samsung Galaxy S26', price: 999000, brand: 'samsung', image: 'samsung-s26.jpg', stock: 6 },
            { id: 5, name: 'Google Pixel 10 Pro', price: 1099000, brand: 'google', image: 'pixel10.jpg', stock: 4 },
            { id: 6, name: 'Google Pixel 10', price: 899000, brand: 'google', image: 'Google Pixel 9 Pro.jpeg', stock: 7 },
            { id: 7, name: 'iPhone 16 Pro Max', price: 799000, brand: 'apple', image: 'iphone16-pro-max.jpg', stock: 10 },
            { id: 8, name: 'iPhone 16', price: 699000, brand: 'apple', image: 'iphone16.jpg', stock: 12 },
            { id: 9, name: 'Samsung Galaxy S25 Ultra', price: 899000, brand: 'samsung', image: 'samsung-s25-ultra.jpg', stock: 5 },
            { id: 10, name: 'Samsung Galaxy S25', price: 699000, brand: 'samsung', image: 'samsung-s25.jpg', stock: 9 },
            { id: 11, name: 'Google Pixel 9 Pro', price: 799000, brand: 'google', image: 'pixel9-pro.jpg', stock: 6 },
            { id: 12, name: 'Google Pixel 9', price: 599000, brand: 'google', image: 'pixel9.jpg', stock: 11 },
            { id: 13, name: 'iPhone 15 Pro Max', price: 599000, brand: 'apple', image: 'iphone15-pro-max.jpg', stock: 15 },
            { id: 14, name: 'iPhone 15', price: 499000, brand: 'apple', image: 'iphone15.jpg', stock: 20 },
            { id: 15, name: 'Samsung Galaxy S24 Ultra', price: 699000, brand: 'samsung', image: 'samsung-s24-ultra.jpg', stock: 10 },
            { id: 16, name: 'Samsung Galaxy S24', price: 499000, brand: 'samsung', image: 'samsung-s24.jpg', stock: 18 },
        ];

        this.cart = [];
        this.listings = [];
        this.currentFilter = 'all';

        this.init();
    }

    init() {
        this.loadCart();
        this.loadListings();
        this.updateYear();
        this.renderFilters();
        this.renderProducts();
        this.renderSellForm();
        this.renderListings();
        this.updateUserUI();
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

    loadListings() {
        const saved = localStorage.getItem('forphoneListings');
        if (saved) this.listings = JSON.parse(saved);
    }

    saveListings() {
        localStorage.setItem('forphoneListings', JSON.stringify(this.listings));
    }

    updateCartUI() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
        const cartCountEl = document.querySelector(this.selectors.cartCount);
        if (cartCountEl) {
            cartCountEl.textContent = totalItems;
            cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        this.renderCartModal();
    }

    renderFilters() {
        const brands = ['all', ...new Set(this.products.map(p => p.brand))];
        const container = document.querySelector(this.selectors.filters);
        if (!container) return;
        
        container.innerHTML = brands.map(brand => `
            <button class="filter-btn ${brand === 'all' ? 'active' : ''}" data-filter="${brand}">
                ${brand.charAt(0).toUpperCase() + brand.slice(1)}
            </button>
        `).join('');
    }

    renderSellForm() {
        const container = document.querySelector('[id="sell-form-container"]');
        if (!container) return;

        container.innerHTML = `
            <div class="sell-section">
                <div class="sell-form-wrapper">
                    <form id="sell-form" class="sell-form-professional">
                        <!-- Header -->
                        <div class="form-header">
                            <h3><i class="fas fa-tag"></i> List Your Phone for Sale</h3>
                            <p>Get instant quote and reach thousands of buyers</p>
                        </div>

                        <!-- Phone Details -->
                        <div class="form-section">
                            <h4>Phone Details</h4>
                            
                            <div class="form-group">
                                <label for="phone-brand">Phone Brand *</label>
                                <select id="phone-brand" required class="form-input">
                                    <option value="">Select Brand</option>
                                    <option value="apple">Apple (iPhone)</option>
                                    <option value="samsung">Samsung</option>
                                    <option value="google">Google Pixel</option>
                                    <option value="nokia">Nokia</option>
                                    <option value="motorola">Motorola</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="phone-model">Phone Model *</label>
                                <input type="text" id="phone-model" class="form-input" placeholder="e.g., iPhone 15 Pro Max, Galaxy S24 Ultra" required>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="phone-year">Year of Release *</label>
                                    <select id="phone-year" required class="form-input">
                                        <option value="">Select Year</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                        <option value="2021">2021</option>
                                        <option value="2020">2020</option>
                                        <option value="older">Older</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="phone-condition">Condition (1-10) *</label>
                                    <div class="condition-slider">
                                        <input type="range" id="phone-condition" min="1" max="10" value="5" class="slider">
                                        <div class="condition-labels">
                                            <span>Poor</span>
                                            <span id="condition-value" style="color: #4a9eff; font-weight: bold;">5</span>
                                            <span>Perfect</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Storage & Specifications -->
                        <div class="form-section">
                            <h4>Storage & Specs</h4>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="phone-storage">Storage Capacity *</label>
                                    <select id="phone-storage" required class="form-input">
                                        <option value="">Select Storage</option>
                                        <option value="64gb">64 GB</option>
                                        <option value="128gb">128 GB</option>
                                        <option value="256gb">256 GB</option>
                                        <option value="512gb">512 GB</option>
                                        <option value="1tb">1 TB</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="phone-color">Color *</label>
                                    <input type="text" id="phone-color" class="form-input" placeholder="e.g., Space Black, Silver" required>
                                </div>
                            </div>
                        </div>

                        <!-- Condition Details -->
                        <div class="form-section">
                            <h4>Condition Details</h4>
                            
                            <div class="form-group">
                                <label for="phone-description">Description of Condition *</label>
                                <textarea id="phone-description" class="form-input" placeholder="Describe scratches, dents, screen condition, any damage, missing parts, etc..." rows="4" required></textarea>
                            </div>

                            <div class="checkbox-group">
                                <label><input type="checkbox" id="has-box"> Original box included</label>
                                <label><input type="checkbox" id="has-charger"> Original charger included</label>
                                <label><input type="checkbox" id="has-glass"> Screen protector/glass</label>
                                <label><input type="checkbox" id="has-case"> Phone case</label>
                            </div>
                        </div>

                        <!-- Photos -->
                        <div class="form-section">
                            <h4>Upload Photos</h4>
                            <p class="form-help">Add photos of your phone (up to 5 images)</p>
                            
                            <div class="photo-upload-area" id="photo-upload-area">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Click to upload or drag & drop</p>
                                <span>JPG, PNG (Max 5MB each)</span>
                                <input type="file" id="phone-photos" multiple accept="image/*" style="display: none;">
                            </div>
                            <div id="photo-preview" class="photo-preview"></div>
                        </div>

                        <!-- Pricing -->
                        <div class="form-section">
                            <h4>Pricing</h4>
                            
                            <div class="form-group">
                                <label for="phone-price">Expected Price (RWF) *</label>
                                <div class="price-input-group">
                                    <span>RWF</span>
                                    <input type="number" id="phone-price" class="form-input price-input" placeholder="100000" min="0" required>
                                </div>
                                <div id="price-estimate" class="price-estimate"></div>
                            </div>
                        </div>

                        <!-- Seller Info -->
                        <div class="form-section">
                            <h4>Your Information</h4>
                            
                            <div class="form-group">
                                <label for="seller-name">Full Name *</label>
                                <input type="text" id="seller-name" class="form-input" placeholder="Your full name" required>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="seller-email">Email Address *</label>
                                    <input type="email" id="seller-email" class="form-input" placeholder="your@email.com" required>
                                </div>

                                <div class="form-group">
                                    <label for="seller-phone">Phone Number *</label>
                                    <input type="tel" id="seller-phone" class="form-input" placeholder="+250 7XX XXX XXX" required>
                                </div>
                            </div>
                        </div>

                        <!-- Terms -->
                        <div class="form-group checkbox-group">
                            <label>
                                <input type="checkbox" id="agree-terms" required>
                                I agree to the terms and conditions
                            </label>
                        </div>

                        <!-- Submit -->
                        <button type="submit" class="btn-sell-primary">
                            <i class="fas fa-check"></i> List Phone for Sale
                        </button>
                    </form>
                </div>

                <!-- Listings Display -->
                <div id="listings-container" class="listings-container"></div>
            </div>
        `;

        // Bind form events
        this.bindSellFormEvents();
    }

    bindSellFormEvents() {
        const form = document.getElementById('sell-form');
        if (!form) return;

        // Condition slider
        const conditionSlider = document.getElementById('phone-condition');
        if (conditionSlider) {
            conditionSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                const conditionText = document.getElementById('condition-value');
                if (conditionText) conditionText.textContent = value;
            });
        }

        // Photo upload
        const uploadArea = document.getElementById('photo-upload-area');
        const photoInput = document.getElementById('phone-photos');
        if (uploadArea && photoInput) {
            uploadArea.addEventListener('click', () => photoInput.click());
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#4a9eff';
                uploadArea.style.background = 'rgba(74, 158, 255, 0.1)';
            });
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = '#2a2a2a';
                uploadArea.style.background = 'transparent';
            });
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#2a2a2a';
                uploadArea.style.background = 'transparent';
                photoInput.files = e.dataTransfer.files;
                this.previewPhotos(e.dataTransfer.files);
            });
            photoInput.addEventListener('change', (e) => {
                this.previewPhotos(e.target.files);
            });
        }

        // Price estimate
        const priceInput = document.getElementById('phone-price');
        if (priceInput) {
            priceInput.addEventListener('input', (e) => {
                const price = parseFloat(e.target.value);
                const estimate = document.getElementById('price-estimate');
                if (estimate && price > 0) {
                    estimate.innerHTML = `<i class="fas fa-lightbulb"></i> Estimated value: RWF ${price.toLocaleString()}`;
                }
            });
        }

        // Form submission
        form.addEventListener('submit', (e) => this.handleSellFormSubmit(e));
    }

    previewPhotos(files) {
        const preview = document.getElementById('photo-preview');
        preview.innerHTML = '';
        const maxFiles = 5;
        const validFiles = Array.from(files).slice(0, maxFiles);

        validFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const photoCard = document.createElement('div');
                photoCard.className = 'photo-card';
                photoCard.innerHTML = `
                    <img src="${e.target.result}" alt="Photo ${index + 1}">
                    <button type="button" class="photo-remove" onclick="this.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                preview.appendChild(photoCard);
            };
            reader.readAsDataURL(file);
        });

        if (files.length > maxFiles) {
            this.showNotification(`⚠️ Only ${maxFiles} photos allowed, ${files.length - maxFiles} were skipped`);
        }
    }

    handleSellFormSubmit(e) {
        e.preventDefault();

        const brand = document.getElementById('phone-brand').value;
        const model = document.getElementById('phone-model').value;
        const condition = document.getElementById('phone-condition').value;
        const description = document.getElementById('phone-description').value;
        const price = parseFloat(document.getElementById('phone-price').value);
        const sellerName = document.getElementById('seller-name').value;
        const sellerEmail = document.getElementById('seller-email').value;
        const sellerPhone = document.getElementById('seller-phone').value;
        const agreeTerms = document.getElementById('agree-terms').checked;
        const year = document.getElementById('phone-year').value;
        const storage = document.getElementById('phone-storage').value;
        const color = document.getElementById('phone-color').value;

        if (!agreeTerms) {
            this.showNotification('❌ Please agree to the terms and conditions');
            return;
        }

        const listing = {
            id: Date.now(),
            brand,
            model,
            condition,
            description,
            price,
            sellerName,
            sellerEmail,
            sellerPhone,
            year,
            storage,
            color,
            accessories: {
                box: document.getElementById('has-box').checked,
                charger: document.getElementById('has-charger').checked,
                glass: document.getElementById('has-glass').checked,
                case: document.getElementById('has-case').checked
            },
            photos: this.getPhotoData(),
            listedDate: new Date().toLocaleDateString(),
            status: 'active'
        };

        this.listings.push(listing);
        this.saveListings();
        this.renderListings();

        // Reset form
        document.getElementById('sell-form').reset();
        document.getElementById('photo-preview').innerHTML = '';
        document.getElementById('condition-value').textContent = '5';

        this.showNotification(`✅ Phone listed successfully! ID: ${listing.id}`);
    }

    getPhotoData() {
        const photos = [];
        const previewCards = document.querySelectorAll('.photo-card img');
        previewCards.forEach(img => {
            photos.push(img.src);
        });
        return photos;
    }

    renderListings() {
        const container = document.getElementById('listings-container');
        if (!container) return;

        if (this.listings.length === 0) {
            container.innerHTML = `
                <div class="no-listings">
                    <i class="fas fa-inbox"></i>
                    <p>No phones listed yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="listings-header">
                <h3><i class="fas fa-list"></i> Active Listings (${this.listings.length})</h3>
            </div>
            <div class="listings-grid">
                ${this.listings.map(listing => this.renderListingCard(listing)).join('')}
            </div>
        `;
    }

    renderListingCard(listing) {
        const photo = listing.photos && listing.photos[0] ? listing.photos[0] : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%232a2a2a" width="200" height="200"/%3E%3C/svg%3E';
        
        return `
            <div class="listing-card">
                <div class="listing-image">
                    <img src="${photo}" alt="${listing.model}">
                    <span class="condition-badge">Condition: ${listing.condition}/10</span>
                </div>
                <div class="listing-info">
                    <h4>${listing.brand.charAt(0).toUpperCase() + listing.brand.slice(1)} ${listing.model}</h4>
                    <div class="listing-specs">
                        <span><i class="fas fa-calendar"></i> ${listing.year}</span>
                        <span><i class="fas fa-microchip"></i> ${listing.storage}</span>
                        <span><i class="fas fa-palette"></i> ${listing.color}</span>
                    </div>
                    <p class="listing-condition">${listing.description.substring(0, 80)}...</p>
                    <div class="listing-accessories">
                        ${listing.accessories.box ? '<span class="acc-badge"><i class="fas fa-box"></i> Box</span>' : ''}
                        ${listing.accessories.charger ? '<span class="acc-badge"><i class="fas fa-plug"></i> Charger</span>' : ''}
                        ${listing.accessories.glass ? '<span class="acc-badge"><i class="fas fa-shield-alt"></i> Glass</span>' : ''}
                        ${listing.accessories.case ? '<span class="acc-badge"><i class="fas fa-shield-alt"></i> Case</span>' : ''}
                    </div>
                </div>
                <div class="listing-footer">
                    <div class="listing-price">RWF ${listing.price.toLocaleString()}</div>
                    <div class="listing-seller">
                        <small><i class="fas fa-user"></i> ${listing.sellerName}</small>
                        <small><i class="fas fa-phone"></i> ${listing.sellerPhone}</small>
                    </div>
                    <button class="btn-contact-seller" onclick="forPhoneStore.contactSeller('${listing.sellerEmail}', '${listing.id}')">
                        <i class="fas fa-envelope"></i> Contact Seller
                    </button>
                </div>
            </div>
        `;
    }

    contactSeller(email, listingId) {
        this.showNotification(`📧 Opening email to ${email}...`);
        window.location.href = `mailto:${email}?subject=Interest in your phone listing (ID: ${listingId})`;
    }

    renderProducts(filter = 'all') {
        const filtered = filter === 'all' ? this.products : this.products.filter(p => p.brand === filter);
        const container = document.querySelector(this.selectors.productsContainer);
        if (!container) return;

        // Professional product cards in RWF with stock and actions
        container.innerHTML = filtered.map(p => {
            const priceStr = 'RWF ' + (p.price || 0).toLocaleString();
            const imgSrc = `images/${p.image}`;
            const stockBadge = (p.stock && p.stock > 0) ? `<span class="stock-badge in-stock">In stock: ${p.stock}</span>` : `<span class="stock-badge out-of-stock">Out of stock</span>`;

            return `
            <div class="product-card featured">
                <div class="product-image">
                    <img src="${imgSrc}" alt="${p.name}" loading="lazy">
                    ${stockBadge}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${p.name}</h3>
                    <div class="product-meta">
                        <span class="brand">${p.brand.charAt(0).toUpperCase() + p.brand.slice(1)}</span>
                        <span class="price">${priceStr}</span>
                    </div>
                    <p class="product-actions">
                        <button class="btn-primary add-to-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" ${p.stock && p.stock > 0 ? '' : 'disabled'}>
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn-secondary view-details" data-id="${p.id}">View</button>
                    </p>
                </div>
            </div>`;
        }).join('');

        this.bindAddToCart();
        // optional: bind view details
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const p = this.products.find(x => x.id === id);
                if (p) {
                    alert(`${p.name}\nPrice: RWF ${p.price.toLocaleString()}\nStock: ${p.stock || 0}`);
                }
            });
        });
    }

    renderCartModal() {
        const container = document.querySelector('#cart-items');
        if (!container) return;
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem 1rem; color: #86868b;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Your cart is empty</p>
                    <p style="font-size: 0.9rem;">Add some products to get started!</p>
                </div>
            `;
            document.querySelector('#cart-total').textContent = '0.00';
            document.querySelector('#subtotal').textContent = '0.00';
            document.querySelector('#shipping').textContent = '0.00';
            return;
        }

        // Render cart items with professional styling
        container.innerHTML = this.cart.map((item, i) => `
            <div class="cart-item-card">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-sku">SKU: ${item.id}</p>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="forPhoneStore.updateQty(${i}, ${item.qty - 1})">−</button>
                    <span class="qty-display">${item.qty}</span>
                    <button class="qty-btn" onclick="forPhoneStore.updateQty(${i}, ${item.qty + 1})">+</button>
                </div>
                <div class="cart-item-price">
                    <div class="unit-price">$${item.price}</div>
                    <div class="item-total">$${(item.price * item.qty).toFixed(2)}</div>
                </div>
                <button class="cart-item-remove" onclick="forPhoneStore.removeFromCart(${i})" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // Calculate and display totals
        const subtotal = this.cart.reduce((s, i) => s + i.price * i.qty, 0);
        const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
        const total = subtotal + shipping;

        document.querySelector('#subtotal').textContent = subtotal.toFixed(2);
        document.querySelector('#shipping').textContent = shipping.toFixed(2);
        document.querySelector('#cart-total').textContent = total.toFixed(2);
        const cartCountEl = document.querySelector('#cart-item-count');
        if (cartCountEl) {
            cartCountEl.textContent = `${this.cart.length} item${this.cart.length !== 1 ? 's' : ''}`;
        }
    }

    updateQty(index, newQty) {
        if (newQty <= 0) {
            this.removeFromCart(index);
        } else {
            this.cart[index].qty = newQty;
            this.saveCart();
            this.renderCartModal();
        }
    }

    addToCart(id, name, price) {
        const existing = this.cart.find(i => i.id === id);
        if (existing) existing.qty++;
        else this.cart.push({ id, name, price, qty: 1 });
        this.saveCart();
        this.updateCartUI();
        this.renderCartModal();
        this.showNotification(`✅ ${name} added to cart!`);
    }

    removeFromCart(index) {
        const itemName = this.cart[index].name;
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartUI();
        this.renderCartModal();
        this.showNotification(`❌ ${itemName} removed from cart`);
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
        n.style.cssText = 'position:fixed;top:80px;right:20px;background:#0071e3;color:white;padding:1rem;border-radius:8px;z-index:3000;animation:slideIn .3s';
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 3000);
    }

    bindEvents() {
        const menuToggle = document.querySelector(this.selectors.menuToggle);
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const nav = document.querySelector(this.selectors.nav);
                if (nav) nav.classList.toggle('active');
            });
        }

        document.querySelectorAll(this.selectors.closeBtns).forEach(c => {
            c.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            });
        });

        const cartLink = document.querySelector(this.selectors.cartLink);
        if (cartLink) {
            cartLink.addEventListener('click', e => {
                e.preventDefault();
                const cartModal = document.querySelector(this.selectors.cartModal);
                if (cartModal) cartModal.classList.add('active');
            });
        }

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) return alert('Cart empty!');
                const cartModal = document.querySelector(this.selectors.cartModal);
                const checkoutModal = document.querySelector(this.selectors.checkoutModal);
                if (cartModal) cartModal.classList.remove('active');
                if (checkoutModal) checkoutModal.classList.add('active');
            });
        }

        document.querySelectorAll(this.selectors.filterBtns).forEach(b => {
            b.addEventListener('click', () => this.filterProducts(b.dataset.filter));
        });

        const sellForm = document.querySelector(this.selectors.sellForm);
        if (sellForm) {
            sellForm.addEventListener('submit', e => this.handleSellForm(e));
        }

        const checkoutForm = document.querySelector(this.selectors.checkoutForm);
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', e => this.handleCheckout(e));
        }

        // Continue Shopping button
        const continueShopping = document.getElementById('continue-shopping');
        if (continueShopping) {
            continueShopping.addEventListener('click', () => {
                const cartModal = document.querySelector(this.selectors.cartModal);
                if (cartModal) cartModal.classList.remove('active');
            });
        }

        // Login button
        const loginBtn = document.querySelector(this.selectors.loginBtn);
        if (loginBtn) {
            loginBtn.addEventListener('click', e => {
                e.preventDefault();
                const loginModal = document.querySelector(this.selectors.loginModal);
                if (loginModal) loginModal.classList.add('active');
            });
        }

        // Login form submit
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
            // show/hide password toggle
            const pass = document.getElementById('login-password');
            if (pass) {
                const toggle = document.createElement('button');
                toggle.type = 'button';
                toggle.className = 'password-toggle';
                toggle.innerHTML = '<i class="fas fa-eye"></i>';
                toggle.addEventListener('click', () => {
                    pass.type = pass.type === 'password' ? 'text' : 'password';
                });
                pass.parentElement.appendChild(toggle);
            }
        }

        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const href = a.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                const nav = document.querySelector(this.selectors.nav);
                if (nav) nav.classList.remove('active');
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

    // ===== User / Login Handling =====
    handleLoginSubmit(e) {
        e.preventDefault();
        const emailEl = document.getElementById('login-email');
        const passEl = document.getElementById('login-password');
        if (!emailEl || !passEl) return;
        const email = emailEl.value.trim().toLowerCase();
        const password = passEl.value;

        // Try common storage keys
        const stored = localStorage.getItem('users') || localStorage.getItem('forphoneUsers') || localStorage.getItem('estoreUsers');
        const users = stored ? JSON.parse(stored) : [];

        const user = users.find(u => (u.email || '').toLowerCase() === email && (u.password || '') === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showNotification('✅ Logged in successfully');
            // close modal
            const loginModal = document.querySelector(this.selectors.loginModal);
            if (loginModal) loginModal.classList.remove('active');
            this.updateUserUI();
        } else {
            this.showNotification('❌ Incorrect email or password');
        }
    }

    updateUserUI() {
        const loginBtn = document.querySelector(this.selectors.loginBtn);
        const current = localStorage.getItem('currentUser');
        if (!loginBtn) return;
        if (current) {
            const user = JSON.parse(current);
            loginBtn.classList.add('user-logged');
            loginBtn.innerHTML = `<span class="user-name">${user.name || user.email}</span> <button id="logout-btn" class="icon-btn"><i class="fas fa-sign-out-alt"></i></button>`;
            const logout = document.getElementById('logout-btn');
            if (logout) logout.addEventListener('click', () => this.logoutUser());
        } else {
            loginBtn.classList.remove('user-logged');
            loginBtn.innerHTML = `<i class="fas fa-user"></i> Login`;
        }
    }

    logoutUser() {
        localStorage.removeItem('currentUser');
        this.showNotification('🔒 Logged out');
        this.updateUserUI();
    }

    handleScroll() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.site-header');
            if (header) header.style.height = window.scrollY > 100 ? '50px' : '60px';
        });
    }

    updateYear() {
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
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
