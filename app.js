// Techpath X Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initModal();
    initForms();
    initScrollEffects();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                
                // Reset hamburger menu
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                
                // Reset hamburger menu
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('courseModal');
    const modalClose = document.querySelector('.modal-close');
    const courseEnquiryButtons = document.querySelectorAll('.course-enquiry-btn');
    const modalTitle = document.getElementById('modalTitle');
    const modalCourseInput = document.getElementById('modalCourse');

    // Course titles mapping
    const courseTitles = {
        'swe-fullstack': 'Software Engineering Full Stack Technical Training',
        'swe-programming': 'Software Engineering Programming Training',
        'data-analytics-fullstack': 'Data Analytics Professional Full Stack Training',
        'data-analytics-programming': 'Data Analytics Professional Programming Training'
    };

    // Open modal when course enquiry button is clicked
    courseEnquiryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course');
            const courseTitle = courseTitles[courseId] || 'Course Enquiry';
            
            modalTitle.textContent = `Enquiry: ${courseTitle}`;
            modalCourseInput.value = courseId;
            modal.style.display = 'block';
            
            // Focus on first input
            setTimeout(() => {
                document.getElementById('modalName').focus();
            }, 100);
        });
    });

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        // Reset form
        document.getElementById('courseEnquiryForm').reset();
        clearMessages();
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Form handling
function initForms() {
    const contactForm = document.getElementById('contactForm');
    const courseEnquiryForm = document.getElementById('courseEnquiryForm');

    // Handle contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'contact');
        });
    }

    // Handle course enquiry form submission
    if (courseEnquiryForm) {
        courseEnquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'course-enquiry');
        });
    }

    // Real-time validation
    const forms = [contactForm, courseEnquiryForm].filter(Boolean);
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

// Handle form submission
function handleFormSubmission(form, formType) {
    // Clear previous messages
    clearMessages();
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.classList.add('loading');
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button state
        submitButton.classList.remove('loading');
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Show success message
        showSuccessMessage(form, formType);
        
        // Reset form
        form.reset();
        
        // Close modal if it's a course enquiry
        if (formType === 'course-enquiry') {
            document.getElementById('courseModal').style.display = 'none';
        }
        
        console.log('Form submitted:', { type: formType, data });
    }, 2000);
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--color-error)';
    errorDiv.style.fontSize = 'var(--font-size-sm)';
    errorDiv.style.marginTop = 'var(--space-4)';
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Show success message
function showSuccessMessage(form, formType) {
    const message = formType === 'contact' 
        ? 'Thank you for your enquiry! We will get back to you within 24 hours.'
        : 'Thank you for your course enquiry! Our team will contact you soon with more details.';
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    form.parentNode.insertBefore(successDiv, form);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Clear all messages
function clearMessages() {
    const messages = document.querySelectorAll('.success-message, .error-message, .field-error');
    messages.forEach(message => message.remove());
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
}

// Scroll effects
function initScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for header styling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .stat-item, .about-content, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Utility functions

// Debounce function for performance optimization
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

// Throttle function for scroll events
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

// Add CSS for scroll header effect
const scrollHeaderStyle = document.createElement('style');
scrollHeaderStyle.textContent = `
    .header.scrolled {
        background-color: rgba(255, 255, 253, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: var(--shadow-md);
    }
    
    @media (prefers-color-scheme: dark) {
        .header.scrolled {
            background-color: rgba(38, 40, 40, 0.95);
        }
    }
    
    [data-color-scheme="dark"] .header.scrolled {
        background-color: rgba(38, 40, 40, 0.95);
    }
    
    .field-error {
        animation: fadeIn 0.3s ease-in-out;
    }
    
    .success-message {
        animation: slideIn 0.3s ease-in-out;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-control.error {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
    }
`;
document.head.appendChild(scrollHeaderStyle);

// Course enquiry tracking (for analytics)
function trackCourseEnquiry(courseId) {
    // This would integrate with analytics services
    console.log('Course enquiry tracked:', courseId);
    
    // Example: Google Analytics event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'course_enquiry', {
            'course_id': courseId,
            'event_category': 'engagement'
        });
    }
}

// Contact form tracking
function trackContactForm() {
    console.log('Contact form submitted');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submit', {
            'event_category': 'engagement'
        });
    }
}

// Performance optimization - Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Initialize lazy loading
initLazyLoading();

// Error handling for the entire application
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // You could send this to an error tracking service
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
});

// Export functions for testing (if needed)
window.TechpathX = {
    validateEmail: isValidEmail,
    validateForm: validateForm,
    trackCourseEnquiry: trackCourseEnquiry,
    trackContactForm: trackContactForm
};