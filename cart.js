// ===== SHOPPING CART FUNCTIONALITY =====

class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('kishki_cart')) || [];
        this.init();
    }
    
    init() {
        this.updateCartUI();
        this.initCartEvents();
        this.initCheckoutProcess();
        this.initCartAnimations();
        this.loadCartFromStorage();
        this.setupCartAutoSave();
        this.initCouponSystem();
        this.initGiftWrapping();
        this.initShippingCalculator();
        this.initCartRecommendations();
    }
    
    initCartEvents() {
        // Quantity changes
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-increase')) {
                this.increaseQuantity(e.target.dataset.productId);
            } else if (e.target.classList.contains('quantity-decrease')) {
                this.decreaseQuantity(e.target.dataset.productId);
            }
        });
        
        // Remove items
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                this.removeItem(e.target.dataset.productId);
            }
        });
        
        // Input changes
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                this.updateQuantity(
                    e.target.dataset.productId,
                    parseInt(e.target.value) || 1
                );
            }
        });
    }
    
    addItem(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showAddToCartAnimation(product);
    }
    
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.showRemoveAnimation(productId);
    }
    
    increaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity++;
            this.saveCart();
            this.updateCartUI();
        }
    }
    
    decreaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item && item.quantity > 1) {
            item.quantity--;
            this.saveCart();
            this.updateCartUI();
        }
    }
    
    updateQuantity(productId, quantity) {
        if (quantity < 1) quantity = 1;
        
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
            this.updateCartUI();
        }
    }
    
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
    }
    
    getCartTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    saveCart() {
        localStorage.setItem('kishki_cart', JSON.stringify(this.cart));
        this.updateCartCounter();
        this.dispatchCartUpdateEvent();
    }
    
    updateCartUI() {
        this.updateCartCounter();
        this.updateCartDropdown();
        this.updateCartPage();
        this.updateCheckoutSummary();
    }
    
    updateCartCounter() {
        const cartCounters = document.querySelectorAll('.cart-count');
        const count = this.getCartCount();
        
        cartCounters.forEach(counter => {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'flex' : 'none';
        });
    }
    
    updateCartDropdown() {
        const cartDropdown = document.querySelector('.cart-dropdown');
        if (!cartDropdown) return;
        
        if (this.cart.length === 0) {
            cartDropdown.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            return;
        }
        
        cartDropdown.innerHTML = `
            <div class="cart-items">
                ${this.cart.slice(0, 3).map(item => `
                    <div class="cart-dropdown-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-info">
                            <h4>${item.name}</h4>
                            <p>${item.quantity} x $${item.price.toFixed(2)}</p>
                        </div>
                        <button class="remove-item" data-product-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-dropdown-footer">
                <div class="cart-total">
                    <strong>Total: $${this.getCartTotal().toFixed(2)}</strong>
                </div>
                <div class="cart-actions">
                    <a href="#cart" class="btn btn-outline">View Cart</a>
                    <a href="#checkout" class="btn btn-primary">Checkout</a>
                </div>
            </div>
        `;
    }
    
    updateCartPage() {
        const cartContainer = document.getElementById('cart-items');
        if (!cartContainer) return;
        
        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <h2>Your cart is empty</h2>
                    <p>Start shopping to add items to your cart</p>
                    <a href="#products" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            return;
        }
        
        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-category">${item.category}</p>
                    <p class="item-price">$${item.price.toFixed(2)} each</p>
                    
                    ${item.stockStatus === 'low' ? `
                        <p class="stock-warning low-stock">
                            <i class="fas fa-exclamation-triangle"></i>
                            Low stock
                        </p>
                    ` : ''}
                    
                    ${item.isNew ? '<span class="badge new-badge">New</span>' : ''}
                </div>
                
                <div class="quantity-controls">
                    <button class="quantity-btn quantity-decrease" data-product-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" 
                           value="${item.quantity}" min="1" max="99"
                           data-product-id="${item.id}">
                    <button class="quantity-btn quantity-increase" data-product-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <div class="item-total">
                    <span class="total-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                
                <button class="remove-item-btn" data-product-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        this.updateCartTotals();
    }
    
    updateCartTotals() {
        const subtotalElement = document.querySelector('.cart-subtotal');
        const taxElement = document.querySelector('.cart-tax');
        const shippingElement = document.querySelector('.cart-shipping');
        const totalElement = document.querySelector('.cart-total');
        
        if (subtotalElement) {
            subtotalElement.textContent = `$${this.getCartTotal().toFixed(2)}`;
        }
        
        // Calculate tax (example: 8%)
        const tax = this.getCartTotal() * 0.08;
        if (taxElement) {
            taxElement.textContent = `$${tax.toFixed(2)}`;
        }
        
        // Calculate shipping (example: free over $50)
        const shipping = this.getCartTotal() >= 50 ? 0 : 5.99;
        if (shippingElement) {
            shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        }
        
        // Calculate total
        const total = this.getCartTotal() + tax + shipping;
        if (totalElement) {
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    updateCheckoutSummary() {
        const checkoutItems = document.querySelector('.checkout-items');
        if (!checkoutItems) return;
        
        checkoutItems.innerHTML = this.cart.map(item => `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <span class="checkout-item-price">
                    $${(item.price * item.quantity).toFixed(2)}
                </span>
            </div>
        `).join('');
    }
    
    showAddToCartAnimation(product) {
        const animationElement = document.createElement('div');
        animationElement.className = 'add-to-cart-animation';
        animationElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="animation-check">✓</div>
        `;
        
        document.body.appendChild(animationElement);
        
        // Trigger animation
        setTimeout(() => {
            animationElement.classList.add('animate');
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            animationElement.remove();
        }, 1000);
    }
    
    showRemoveAnimation(productId) {
        const removedItem = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
        if (removedItem) {
            removedItem.classList.add('removing');
            setTimeout(() => {
                removedItem.remove();
                this.updateCartTotals();
            }, 300);
        }
    }
    
    initCheckoutProcess() {
        const checkoutForm = document.querySelector('.checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processCheckout();
            });
        }
    }
    
    async processCheckout() {
        try {
            this.showLoading('Processing your order...');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create order
            const order = {
                id: this.generateOrderId(),
                items: this.cart,
                total: this.getCartTotal(),
                date: new Date().toISOString(),
                status: 'confirmed'
            };
            
            // Save order to localStorage
            this.saveOrder(order);
            
            // Clear cart
            this.clearCart();
            
            // Redirect to success page
            this.showSuccess('Order placed successfully!');
            setTimeout(() => {
                window.location.href = `order-success.html?order_id=${order.id}`;
            }, 1500);
            
        } catch (error) {
            this.showError('Failed to process order. Please try again.');
            console.error('Checkout error:', error);
        }
    }
    
    generateOrderId() {
        return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('kishki_orders')) || [];
        orders.push(order);
        localStorage.setItem('kishki_orders', JSON.stringify(orders));
    }
    
    initCartAnimations() {
        // Add smooth animations for cart interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productCard = e.target.closest('.product-card');
                const product = {
                    id: productCard.dataset.productId,
                    name: productCard.querySelector('.product-title').textContent,
                    price: parseFloat(productCard.querySelector('.current-price').textContent.replace('$', '')),
                    image: productCard.querySelector('.product-image img').src,
                    category: productCard.querySelector('.product-category').textContent
                };
                
                this.addItem(product);
            }
        });
    }
    
    loadCartFromStorage() {
        // Additional loading logic if needed
        console.log('Cart loaded from storage:', this.cart);
    }
    
    setupCartAutoSave() {
        // Auto-save cart changes with debouncing
        let saveTimeout;
        
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    this.saveCart();
                }, 1000);
            }
        });
    }
    
    initCouponSystem() {
        const couponForm = document.querySelector('.coupon-form');
        if (couponForm) {
            couponForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const couponCode = couponForm.querySelector('input[name="coupon"]').value;
                this.applyCoupon(couponCode);
            });
        }
    }
    
    applyCoupon(code) {
        // Simple coupon validation
        const coupons = {
            'WELCOME10': { discount: 10, type: 'percentage' },
            'SAVE5': { discount: 5, type: 'fixed' },
            'FREESHIP': { discount: 0, type: 'shipping', minOrder: 0 }
        };
        
        const coupon = coupons[code.toUpperCase()];
        
        if (coupon) {
            this.showSuccess(`Coupon applied: ${code}`);
            // Apply coupon logic here
        } else {
            this.showError('Invalid coupon code');
        }
    }
    
    initGiftWrapping() {
        const giftWrapCheckbox = document.querySelector('.gift-wrap-checkbox');
        if (giftWrapCheckbox) {
            giftWrapCheckbox.addEventListener('change', (e) => {
                this.toggleGiftWrapping(e.target.checked);
            });
        }
    }
    
    toggleGiftWrapping(enabled) {
        // Gift wrapping logic
        console.log('Gift wrapping:', enabled ? 'enabled' : 'disabled');
    }
    
    initShippingCalculator() {
        const shippingForm = document.querySelector('.shipping-calculator');
        if (shippingForm) {
            shippingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateShipping();
            });
        }
    }
    
    calculateShipping() {
        // Shipping calculation logic
        console.log('Calculating shipping...');
    }
    
    initCartRecommendations() {
        // Show recommended products based on cart items
        if (this.cart.length > 0) {
            this.loadRecommendations();
        }
    }
    
    async loadRecommendations() {
        try {
            // Load recommendations from API or local data
            console.log('Loading cart recommendations...');
        } catch (error) {
            console.error('Failed to load recommendations:', error);
        }
    }
    
    showLoading(message) {
        // Show loading overlay
        console.log('Loading:', message);
    }
    
    showSuccess(message) {
        // Show success message
        console.log('Success:', message);
    }
    
    showError(message) {
        // Show error message
        console.log('Error:', message);
    }
    
    dispatchCartUpdateEvent() {
        // Dispatch custom event for other components to listen to
        const event = new CustomEvent('cartUpdated', {
            detail: { cart: this.cart, total: this.getCartTotal() }
        });
        document.dispatchEvent(event);
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
});

// Global cart functions
function addToCart(product) {
    if (window.cart) {
        window.cart.addItem(product);
    }
}

function getCartCount() {
    return window.cart ? window.cart.getCartCount() : 0;
}

function clearCart() {
    if (window.cart) {
        window.cart.clearCart();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart, addToCart, getCartCount, clearCart };
}
