// بيانات مؤقتة للمنتجات (حتى تعمل)
const temporaryProducts = [
    {
        id: 1,
        name: "تفاح عضوي طازج",
        price: 15.99,
        category: "فواكه",
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300",
        rating: 4.8,
        description: "تفاح طازج من مزارع محلية"
    },
    {
        id: 2, 
        name: "زيت زيتون بكر",
        price: 32.99,
        category: "زيوت",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300",
        rating: 4.9,
        description: "زيت زيتون ممتاز من العصرة الأولى"
    }
];

// استخدم البيانات المؤقتة حتى يعمل الموقع
displayProducts(temporaryProducts);// ===== PRODUCTS MANAGEMENT =====

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initProductSearch();
    initProductSorting();
    initProductZoom();
    initWishlist();
    initProductComparison();
    initStockNotification();
    initProductReviews();
    initQuickView();
    initBulkActions();
});

// Load products from JSON file or API
async function loadProducts() {
    try {
        showLoadingState();
        
        // Try to load from local JSON file first
        const response = await fetch('data/products.json');
        
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        const products = await response.json();
        displayProducts(products);
        
    } catch (error) {
        console.error('Error loading products:', error);
        showErrorState();
        // Fallback to hardcoded products
        loadFallbackProducts();
    } finally {
        hideLoadingState();
    }
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    // Re-initialize any product-related functionality
    initProductInteractions();
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-price', product.price);
    
    const discountBadge = product.discount ? `
        <div class="product-badge sale">-${product.discount}%</div>
    ` : '';
    
    const ratingStars = generateRatingStars(product.rating);
    
    card.innerHTML = `
        ${discountBadge}
        ${product.isNew ? '<div class="product-badge new">New</div>' : ''}
        
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-overlay">
                <div class="product-actions">
                    <button class="action-btn wishlist-btn" title="Add to wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="action-btn quick-view-btn" title="Quick view">
                        <i class="far fa-eye"></i>
                    </button>
                    <button class="action-btn compare-btn" title="Add to compare">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="product-content">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${product.name}</h3>
            
            <div class="product-rating">
                <div class="stars">${ratingStars}</div>
                <span class="rating-count">(${product.reviewCount})</span>
            </div>
            
            <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.oldPrice ? `
                    <span class="old-price">$${product.oldPrice.toFixed(2)}</span>
                    <span class="discount">Save ${calculateDiscount(product.price, product.oldPrice)}%</span>
                ` : ''}
            </div>
            
            <button class="add-to-cart-btn">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
            </button>
            
            ${product.stockStatus === 'low' ? `
                <div class="stock-status low-stock">
                    <i class="fas fa-exclamation-triangle"></i>
                    Low stock
                </div>
            ` : product.stockStatus === 'out' ? `
                <div class="stock-status out-of-stock">
                    <i class="fas fa-times-circle"></i>
                    Out of stock
                </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function calculateDiscount(currentPrice, oldPrice) {
    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
}

function initProductSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length > 2) {
            filterProductsBySearch(searchTerm);
        } else if (searchTerm.length === 0) {
            resetProductFilter();
        }
    }, 300));
}

function filterProductsBySearch(searchTerm) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productName = product.querySelector('.product-title').textContent.toLowerCase();
        const productCategory = product.querySelector('.product-category').textContent.toLowerCase();
        const productDescription = product.getAttribute('data-description') || '';
        
        if (productName.includes(searchTerm) || 
            productCategory.includes(searchTerm) || 
            productDescription.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function resetProductFilter() {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => product.style.display = 'block');
}

function initProductSorting() {
    const sortSelect = document.querySelector('.sort-select');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function(e) {
        sortProducts(e.target.value);
    });
}

function sortProducts(sortBy) {
    const productsContainer = document.getElementById('products-container');
    const products = Array.from(productsContainer.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
            case 'price-high':
                return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
            case 'name':
                return a.querySelector('.product-title').textContent.localeCompare(
                    b.querySelector('.product-title').textContent
                );
            case 'newest':
                return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
            case 'rating':
                return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
            default:
                return 0;
        }
    });
    
    // Clear and re-append sorted products
    productsContainer.innerHTML = '';
    products.forEach(product => productsContainer.appendChild(product));
}

function initProductZoom() {
    // Product image zoom functionality
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(img => {
        img.addEventListener('click', function() {
            openImageZoom(this.src, this.alt);
        });
    });
}

function openImageZoom(src, alt) {
    // Implementation for image zoom modal
    console.log('Open image zoom:', src, alt);
}

function initWishlist() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            
            toggleWishlist(productId, this);
        });
    });
}

function toggleWishlist(productId, button) {
    let wishlist = JSON.parse(localStorage.getItem('kishki_wishlist')) || [];
    const icon = button.querySelector('i');
    
    if (wishlist.includes(productId)) {
        // Remove from wishlist
        wishlist = wishlist.filter(id => id !== productId);
        icon.className = 'far fa-heart';
        showToast('Removed from wishlist');
    } else {
        // Add to wishlist
        wishlist.push(productId);
        icon.className = 'fas fa-heart';
        showToast('Added to wishlist');
    }
    
    localStorage.setItem('kishki_wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('kishki_wishlist')) || [];
    const wishlistCount = document.querySelector('.wishlist-count');
    
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.style.display = wishlist.length > 0 ? 'inline' : 'none';
    }
}

function initProductComparison() {
    const compareButtons = document.querySelectorAll('.compare-btn');
    let comparisonProducts = JSON.parse(localStorage.getItem('kishki_comparison')) || [];
    
    compareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            
            if (comparisonProducts.includes(productId)) {
                // Remove from comparison
                comparisonProducts = comparisonProducts.filter(id => id !== productId);
                this.classList.remove('active');
                showToast('Removed from comparison');
            } else {
                // Add to comparison (max 4 products)
                if (comparisonProducts.length >= 4) {
                    showToast('Maximum 4 products can be compared', 'error');
                    return;
                }
                
                comparisonProducts.push(productId);
                this.classList.add('active');
                showToast('Added to comparison');
            }
            
            localStorage.setItem('kishki_comparison', JSON.stringify(comparisonProducts));
            updateComparisonCount();
        });
    });
}

function updateComparisonCount() {
    const comparisonProducts = JSON.parse(localStorage.getItem('kishki_comparison')) || [];
    const compareCount = document.querySelector('.compare-count');
    
    if (compareCount) {
        compareCount.textContent = comparisonProducts.length;
        compareCount.style.display = comparisonProducts.length > 0 ? 'inline' : 'none';
    }
}

function initStockNotification() {
    const notifyButtons = document.querySelectorAll('.notify-btn');
    
    notifyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('.product-title').textContent;
            
            subscribeToStockNotification(productId, productName);
        });
    });
}

function subscribeToStockNotification(productId, productName) {
    // Implementation for stock notification subscription
    console.log('Subscribe to stock notification:', productId, productName);
}

function initProductReviews() {
    const reviewButtons = document.querySelectorAll('.review-btn');
    
    reviewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            
            openReviewModal(productId);
        });
    });
}

function openReviewModal(productId) {
    // Implementation for review modal
    console.log('Open review modal for product:', productId);
}

function initQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    
    quickViewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            
            openQuickView(productId);
        });
    });
}

function openQuickView(productId) {
    // Implementation for quick view modal
    console.log('Open quick view for product:', productId);
}

function initBulkActions() {
    const bulkCheckbox = document.querySelector('.bulk-select');
    const productCheckboxes = document.querySelectorAll('.product-select');
    const bulkActions = document.querySelector('.bulk-actions');
    
    if (bulkCheckbox) {
        bulkCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            productCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            toggleBulkActions();
        });
    }
    
    productCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleBulkActions);
    });
    
    function toggleBulkActions() {
        const checkedCount = document.querySelectorAll('.product-select:checked').length;
        bulkActions.style.display = checkedCount > 0 ? 'block' : 'none';
    }
}

function showLoadingState() {
    const loadingElement = document.querySelector('.products-loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
}

function hideLoadingState() {
    const loadingElement = document.querySelector('.products-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

function showErrorState() {
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        productsContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to load products</h3>
                <p>Please try again later or refresh the page.</p>
                <button onclick="loadProducts()" class="btn btn-primary">
                    <i class="fas fa-redo"></i>
                    Try Again
                </button>
            </div>
        `;
    }
}

function loadFallbackProducts() {
    const fallbackProducts = [
        {
            id: 1,
            name: "Fresh Organic Apples",
            price: 2.99,
            category: "Fruits",
            image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400",
            rating: 4.5,
            reviewCount: 23,
            isNew: true
        },
        {
            id: 2,
            name: "Premium Olive Oil",
            price: 12.99,
            category: "Oils",
            image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
            rating: 4.8,
            reviewCount: 45,
            oldPrice: 15.99
        }
    ];
    
    displayProducts(fallbackProducts);
}

// Utility function (duplicate from main.js, but needed here)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message, type = 'success') {
    // Toast implementation
    console.log(`${type}: ${message}`);
}
