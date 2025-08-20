// ===== CONTACT FORM ENHANCEMENTS =====

document.addEventListener('DOMContentLoaded', function() {
    initContactFormValidation();
    initMapIntegration();
    initContactFormAjax();
    initBusinessHours();
    initContactFormAnimations();
    initFileUpload();
    initReCaptcha();
    initContactFormAnalytics();
});

function initContactFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            submitContactForm(this);
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.getAttribute('type');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Minimum length validation
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
        showFieldError(field, `Minimum ${minLength} characters required`);
        return false;
    }
    
    // Maximum length validation
    const maxLength = field.getAttribute('maxlength');
    if (maxLength && value.length > parseInt(maxLength)) {
        showFieldError(field, `Maximum ${maxLength} characters allowed`);
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
}

function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}

async function submitContactForm(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful submission
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        form.reset();
        
        // Track conversion
        trackContactFormSubmission();
        
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
        console.error('Contact form error:', error);
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function initMapIntegration() {
    const mapElement = document.getElementById('storeMap');
    if (!mapElement) return;
    
    // Simple map initialization
    const mapOptions = {
        center: { lat: 21.4858, lng: 39.1925 }, // Jeddah coordinates
        zoom: 15,
        mapTypeId: 'roadmap'
    };
    
    // This would be replaced with actual Google Maps API call
    console.log('Initializing map at:', mapOptions.center);
    
    // Fallback image for maps
    mapElement.innerHTML = `
        <img src="https://maps.googleapis.com/maps/api/staticmap?center=21.4858,39.1925&zoom=15&size=600x300&markers=color:red%7C21.4858,39.1925&key=YOUR_API_KEY" 
             alt="KISHKI Supermarket Location" 
             style="width: 100%; height: 100%; border-radius: 10px;">
    `;
}

function initContactFormAjax() {
    // AJAX form submission would be implemented here
    console.log('AJAX form submission initialized');
}

function initBusinessHours() {
    const hoursElement = document.querySelector('.business-hours');
    if (!hoursElement) return;
    
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();
    
    // Mark current day
    const dayElements = hoursElement.querySelectorAll('li');
    dayElements.forEach((li, index) => {
        if (index === currentDay) {
            li.classList.add('current-day');
            
            // Check if currently open
            const hoursText = li.textContent;
            if (hoursText.toLowerCase().includes('closed')) {
                li.classList.add('closed-now');
            } else {
                // Simple open/close check (would need proper parsing)
                li.classList.add('open-now');
            }
        }
    });
}

function initContactFormAnimations() {
    const formElements = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    
    formElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('animate-in');
    });
}

function initFileUpload() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0]?.name || 'No file chosen';
            const label = this.nextElementSibling;
            
            if (label && label.classList.contains('file-upload-label')) {
                label.textContent = fileName;
            }
        });
    });
}

function initReCaptcha() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // This would integrate with Google reCAPTCHA
    console.log('reCAPTCHA initialization placeholder');
}

function initContactFormAnalytics() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Track form interactions
    contactForm.addEventListener('focusin', function(e) {
        if (e.target.matches('input, textarea, select')) {
            console.log('Form field focused:', e.target.name);
        }
    });
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function trackContactFormSubmission() {
    // Track in analytics
    console.log('Contact form submission tracked');
    
    // Send to Google Analytics (example)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submit', {
            'event_category': 'Contact',
            'event_label': 'Main Contact Form'
        });
    }
}

// Utility function for phone number formatting
function formatPhoneNumber(input) {
    const value = input.value.replace(/\D/g, '');
    
    if (value.length <= 3) {
        input.value = value;
    } else if (value.length <= 6) {
        input.value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
        input.value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }
}

// International phone number support
function initInternationalPhone() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        // Add country code dropdown if needed
        const wrapper = document.createElement('div');
        wrapper.className = 'phone-input-wrapper';
        wrapper.innerHTML = `
            <select class="country-code">
                <option value="+966">+966 (SA)</option>
                <option value="+971">+971 (UAE)</option>
                <option value="+973">+973 (BHR)</option>
                <option value="+974">+974 (QAT)</option>
                <option value="+965">+965 (KWT)</option>
            </select>
        `;
        
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        showFieldError,
        clearFieldError,
        submitContactForm
    };
}
