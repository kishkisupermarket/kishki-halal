// ===== MAIN JAVASCRIPT FILE - KISHKI SUPERMARKET =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('KISHKI Supermarket website loaded successfully!');
    
    // Initialize all components
    initNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initProductFilter();
    initCartSystem();
    initContactForm();
    initBackToTop();
    initLoadingOverlay();
    initResponsiveImages();
    initLazyLoading();
    initAnimationObserver();
    initServiceWorker();
    initPerformanceMonitoring();
    initErrorHandling();
    initAccessibilityFeatures();
});

// ===== NAVIGATION =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
            
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL hash
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    }
}

// ===== PRODUCT FILTER =====
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');
    const productsContainer = document.querySelector('.products-grid');
    const loadingElement = document.querySelector('.products-loading');
    
    if (!filterButtons.length || !products.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show loading
            if (loadingElement) {
                loadingElement.style.display = 'block';
            }
            
            // Simulate loading delay
            setTimeout(() => {
                filterProducts(filter);
                
                // Hide loading
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
            }, 500);
        });
    });
    
    function filterProducts(filter) {
        products.forEach(product => {
            if (filter === 'all') {
                product.style.display = 'block';
            } else {
                const productFilter = product.getAttribute('data-filter');
                if (productFilter && productFilter.includes(filter)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            }
        });
        
        // Re-initialize animations
        initAnimationObserver();
    }
}

// ===== CART SYSTEM =====
function initCartSystem() {
    let cart = JSON.parse(localStorage.getItem('kishki_cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    // Update cart count on page load
    updateCartCount();
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = parseFloat(productCard.querySelector('.current-price').textContent.replace('$', ''));
            const productImage = productCard.querySelector('.product-image img').src;
            
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            
            // Show added feedback
            this.classList.add('added');
            this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
            
            setTimeout(() => {
                this.classList.remove('added');
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            }, 2000);
        });
    });
    
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('kishki_cart', JSON.stringify(cart));
        updateCartCount();
        showToast('Product added to cart!', 'success');
    }
    
    function updateCartCount() {
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    function showToast(message, type = 'success') {
        // Toast implementation would go here
        console.log(`${type}: ${message}`);
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formObject = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (!formObject.name || !formObject.email || !formObject.message) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formObject.email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            setTimeout(() => {
                // Simulate successful submission
                showToast('Message sent successfully! We will get back to you soon.', 'success');
                this.reset();
                
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 2000);
        });
    }
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTop = document.createElement('a');
    backToTop.href = '#top';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    
    document.body.appendChild(backToTop);
}

// ===== LOADING OVERLAY =====
function initLoadingOverlay() {
    // Show loading overlay during page transitions
    const links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href && this.href !== '#' && !this.href.includes('javascript:')) {
                showLoadingOverlay();
            }
        });
    });
    
    function showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay show';
        overlay.innerHTML = `
            <div class="loading-overlay-content">
                <div class="loading-overlay-spinner"></div>
                <p>Loading...</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            if (document.querySelector('.loading-overlay')) {
                document.querySelector('.loading-overlay').remove();
            }
        }, 5000);
    }
}

// ===== RESPONSIVE IMAGES =====
function initResponsiveImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'KISHKI Supermarket');
        }
    });
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const backgroundObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.backgroundImage = `url(${element.dataset.bg})`;
                    element.removeAttribute('data-bg');
                    backgroundObserver.unobserve(element);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
        lazyBackgrounds.forEach(bg => backgroundObserver.observe(bg));
    } else {
        // Fallback for browsers without Intersection Observer
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
        
        lazyBackgrounds.forEach(bg => {
            bg.style.backgroundImage = `url(${bg.dataset.bg})`;
        });
    }
}

// ===== ANIMATION OBSERVER =====
function initAnimationObserver() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers without Intersection Observer
        animatedElements.forEach(el => el.classList.add('animated'));
    }
}

// ===== SERVICE WORKER =====
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
    window.addEventListener('load', function() {
        // Measure page load time
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        if (navigationTiming) {
            const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
            
            // Send to analytics (example)
            if (loadTime > 3000) {
                console.warn('Page load time is slow');
            }
        }
    });
}

// ===== ERROR HANDLING =====
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // Send to error tracking service
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        // Send to error tracking service
    });
}

// ===== ACCESSIBILITY FEATURES =====
function initAccessibilityFeatures() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Skip to main content
        if (e.key === 'Tab' && e.shiftKey) {
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.focus();
            }
        }
    });
    
    // Focus visible polyfill
    document.addEventListener('mousedown', function() {
        document.body.classList.add('using-mouse');
    });
    
    document.addEventListener('keydown', function() {
        document.body.classList.remove('using-mouse');
    });
    
    // High contrast mode detection
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
    
    // Reduced motion detection
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
}

// ===== UTILITY FUNCTIONS =====
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for global access (if needed)
window.KISHKI = {
    initNavigation,
    initCartSystem,
    debounce,
    throttle
};

// Global error handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Global error:', msg, url, lineNo, columnNo, error);
    return false;
};
