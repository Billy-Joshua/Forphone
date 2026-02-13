/**
 * AI Recommendations Engine
 * Tracks user browsing history and generates smart product suggestions
 */

class AIRecommendations {
    constructor(products = []) {
        this.products = products;
        this.browsingHistory = [];
        this.viewedTags = {};
        this.recommendations = [];
        this.maxHistoryItems = 20;
        this.loadFromStorage();
    }

    /**
     * Track when a product is viewed
     * @param {Object} product - Product object with id, name, brand, price
     */
    trackProductView(product) {
        const viewEntry = {
            productId: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            timestamp: Date.now(),
            tags: this.getProductTags(product)
        };

        // Add to browsing history
        this.browsingHistory.unshift(viewEntry);
        if (this.browsingHistory.length > this.maxHistoryItems) {
            this.browsingHistory.pop();
        }

        // Update tag frequency
        viewEntry.tags.forEach(tag => {
            this.viewedTags[tag] = (this.viewedTags[tag] || 0) + 1;
        });

        this.saveToStorage();
    }

    /**
     * Get tags for a product based on its properties
     * @param {Object} product - Product object
     * @returns {Array} Array of tags
     */
    getProductTags(product) {
        const tags = [];
        const name = product.name.toLowerCase();

        // AI & Intelligence features
        if (name.includes('pro') || name.includes('max') || name.includes('ultra')) {
            tags.push('premium');
            tags.push('performance');
        }

        // Camera features
        if (name.includes('pixel') || name.includes('pro')) {
            tags.push('camera');
            tags.push('photography');
        }

        // Premium features
        if (name.includes('17') || name.includes('s26') || name.includes('10')) {
            tags.push('latest');
            tags.push('ai');
        }

        // Brand tags
        if (product.brand === 'apple') {
            tags.push('ios');
            tags.push('ecosystem');
        } else if (product.brand === 'google') {
            tags.push('android');
            tags.push('ai');
            tags.push('pure-android');
        } else if (product.brand === 'samsung') {
            tags.push('android');
            tags.push('galaxys');
        }

        // Price-based tags
        if (product.price > 1000000) {
            tags.push('flagship');
            tags.push('premium');
            tags.push('expensive');
        } else if (product.price > 700000) {
            tags.push('mid-range-premium');
        } else {
            tags.push('budget');
            tags.push('affordable');
        }

        // Performance tags
        tags.push('5g');
        tags.push('fast');

        return [...new Set(tags)]; // Remove duplicates
    }

    /**
     * Generate AI recommendations based on browsing history
     * @param {number} limit - Number of recommendations to return
     * @returns {Array} Recommended products
     */
    generateRecommendations(limit = 5) {
        if (this.browsingHistory.length === 0) {
            // If no history, return trending items (newer models)
            return this.getTrendingProducts(limit);
        }

        const recommendations = new Map();

        // Score products based on similarity to viewed items
        this.products.forEach(product => {
            // Skip already viewed products
            if (this.browsingHistory.some(h => h.productId === product.id)) {
                return;
            }

            let score = 0;
            const productTags = this.getProductTags(product);

            // Matching tags - weight by tag frequency in history
            productTags.forEach(tag => {
                if (this.viewedTags[tag]) {
                    score += this.viewedTags[tag] * 10;
                }
            });

            // Brand preferences - if user views a lot of one brand, recommend more
            const brandMatches = this.browsingHistory.filter(h => h.brand === product.brand).length;
            score += brandMatches * 5;

            // Price similarity - users often buy similar priced items
            if (this.browsingHistory.length > 0) {
                const avgViewedPrice = this.browsingHistory.reduce((sum, h) => sum + h.price, 0) / this.browsingHistory.length;
                const priceDiff = Math.abs(product.price - avgViewedPrice);
                const maxPriceDeviation = 500000; // 500k RWF
                score += Math.max(0, (maxPriceDeviation - priceDiff) / maxPriceDeviation * 20);
            }

            if (score > 0) {
                recommendations.set(product.id, {
                    product,
                    score
                });
            }
        });

        // Sort by score and return top results
        const sorted = Array.from(recommendations.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.product);

        this.recommendations = sorted;
        return sorted;
    }

    /**
     * Get trending products (most recent models)
     * @param {number} limit - Number of products
     * @returns {Array} Trending products
     */
    getTrendingProducts(limit = 5) {
        // Products with higher IDs are newer
        return this.products
            .sort((a, b) => b.id - a.id)
            .slice(0, limit);
    }

    /**
     * Get recently viewed products
     * @param {number} limit - Number of products
     * @returns {Array} Recently viewed products
     */
    getRecentlyViewed(limit = 5) {
        return this.browsingHistory
            .slice(0, limit)
            .map(entry => this.products.find(p => p.id === entry.productId))
            .filter(p => p !== undefined);
    }

    /**
     * Get personalized feed based on user preferences
     * @param {number} limit - Number of products
     * @returns {Array} Personalized products
     */
    getPersonalizedFeed(limit = 8) {
        // 60% recommendations, 40% trending
        const recommendedCount = Math.ceil(limit * 0.6);
        const trendingCount = limit - recommendedCount;

        const recommended = this.generateRecommendations(recommendedCount);
        const trending = this.getTrendingProducts(trendingCount);

        return [...recommended, ...trending];
    }

    /**
     * Get user preference summary
     * @returns {Object} User preferences
     */
    getUserPreferences() {
        if (this.browsingHistory.length === 0) {
            return null;
        }

        const brands = {};
        const avgPrice = this.browsingHistory.reduce((sum, h) => sum + h.price, 0) / this.browsingHistory.length;

        this.browsingHistory.forEach(h => {
            brands[h.brand] = (brands[h.brand] || 0) + 1;
        });

        const topBrand = Object.keys(brands).length > 0
            ? Object.keys(brands).reduce((a, b) => brands[a] > brands[b] ? a : b)
            : null;

        return {
            browsingCount: this.browsingHistory.length,
            topBrand,
            brands,
            averagePrice: Math.round(avgPrice),
            topTags: Object.keys(this.viewedTags).sort((a, b) => this.viewedTags[b] - this.viewedTags[a]).slice(0, 5)
        };
    }

    /**
     * Clear browsing history and recommendations
     */
    clearHistory() {
        this.browsingHistory = [];
        this.viewedTags = {};
        this.recommendations = [];
        localStorage.removeItem('aiRecommendations');
    }

    /**
     * Save recommendations to local storage
     */
    saveToStorage() {
        const data = {
            browsingHistory: this.browsingHistory,
            viewedTags: this.viewedTags,
            timestamp: Date.now()
        };
        localStorage.setItem('aiRecommendations', JSON.stringify(data));
    }

    /**
     * Load recommendations from local storage
     */
    loadFromStorage() {
        const saved = localStorage.getItem('aiRecommendations');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.browsingHistory = data.browsingHistory || [];
                this.viewedTags = data.viewedTags || {};
            } catch (e) {
                console.warn('Failed to load recommendations from storage');
            }
        }
    }

    /**
     * Render recommendations to DOM
     * @param {string} containerId - ID of container element
     * @param {number} limit - Number of recommendations
     */
    renderRecommendations(containerId, limit = 5) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const recommendations = this.generateRecommendations(limit);

        if (recommendations.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <div class="recommendations-header">
                <h3><i class="fas fa-sparkles"></i> Recommended For You</h3>
                <p>Based on your browsing history</p>
            </div>
            <div class="recommendations-grid">
                ${recommendations.map(product => this.renderRecommendationCard(product)).join('')}
            </div>
        `;
    }

    /**
     * Render a single recommendation card
     * @param {Object} product - Product to render
     * @returns {string} HTML for recommendation card
     */
    renderRecommendationCard(product) {
        const imgSrc = `images/${product.image}`;
        const priceStr = 'RWF ' + (product.price || 0).toLocaleString();
        const stockBadge = (product.stock && product.stock > 0)
            ? `<span class="stock-badge in-stock">In stock: ${product.stock}</span>`
            : `<span class="stock-badge out-of-stock">Out of stock</span>`;

        return `
            <div class="recommendation-card" data-product-id="${product.id}">
                <div class="recommendation-badge">
                    <i class="fas fa-check-circle"></i> Recommended
                </div>
                <div class="recommendation-image">
                    <img src="${imgSrc}" alt="${product.name}" loading="lazy">
                    ${stockBadge}
                </div>
                <div class="recommendation-info">
                    <h4 class="recommendation-name">${product.name}</h4>
                    <div class="recommendation-meta">
                        <span class="recommendation-brand">${product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}</span>
                        <span class="recommendation-price">${priceStr}</span>
                    </div>
                    <button class="btn-recommend add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" ${product.stock && product.stock > 0 ? '' : 'disabled'}>
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
    }
}

// Initialize AI Recommendations when document loads
let aiRecommendations = null;

document.addEventListener('DOMContentLoaded', function() {
    // This will be initialized after ForPhoneStore loads products
    console.log('AI Recommendations engine loaded');
});
