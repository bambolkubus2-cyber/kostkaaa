/* ================================================
   BRUKBŁYSK - MAIN JAVASCRIPT
   Wersja: 2.0 - Zoptymalizowana
   Data: 2026-09-05
================================================ */

// === DOM READY ===
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initScrollToTop();
    initAOS();
});

// === MOBILE MENU TOGGLE ===
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icon
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Close menu when clicking on a link
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }
}

// === SCROLL TO TOP BUTTON ===
function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    
    if (scrollBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// === AOS INITIALIZATION ===
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100
        });
    }
}

// === TAB SWITCHER (dla cennika) ===
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('[id$="-tab"]');
    tabs.forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }
    
    // Add active class to clicked button
    const activeButton = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Make switchTab global
window.switchTab = switchTab;

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 120; // Navbar height
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// === FORM VALIDATION (jeśli istnieje formularz) ===
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Simple validation
        if (!data.name || !data.phone || !data.message) {
            alert('Proszę wypełnić wszystkie wymagane pola!');
            return;
        }
        
        // Phone validation (simple)
        const phoneRegex = /^\+?[0-9\s\-()]{9,}$/;
        if (!phoneRegex.test(data.phone)) {
            alert('Proszę podać prawidłowy numer telefonu!');
            return;
        }
        
        // Show success modal or redirect
        showSuccessModal();
        
        // Reset form
        contactForm.reset();
    });
}

// === SUCCESS MODAL ===
function showSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.classList.add('active');
        
        // Auto close after 3 seconds
        setTimeout(function() {
            modal.classList.remove('active');
            // Redirect to thank you page
            window.location.href = 'dziekujemy.html';
        }, 3000);
    } else {
        // Fallback if no modal
        window.location.href = 'dziekujemy.html';
    }
}

// === LAZY LOADING IMAGES (modern browsers) ===
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for older browsers
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// === PERFORMANCE OPTIMIZATION ===
// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function() {
        // Your scroll code here if needed
    });
}, { passive: true });

// === ANIMATED COUNTERS ===
function animateCounter(elementId, targetValue, duration, suffix = '', decimals = 0) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Nie znaleziono elementu:', elementId);
        return;
    }
    
    const start = 0;
    const increment = targetValue / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(decimals) + suffix;
    }, 16);
}

// Uruchom liczniki gdy użytkownik scrolluje do sekcji stats
let countersAnimated = false;

function checkStatsVisible() {
    const statsSection = document.getElementById('counter-projects')?.closest('section');
    if (!statsSection) return;
    
    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isVisible && !countersAnimated) {
        countersAnimated = true;
        
        // Animuj liczniki
        setTimeout(() => animateCounter('counter-projects', 31, 2000), 100);
        setTimeout(() => animateCounter('counter-satisfaction', 100, 2000, '%'), 300);
        setTimeout(() => animateCounter('counter-rating', 4.94, 2000, '', 2), 500);
    }
}

// Sprawdź przy scroll i przy załadowaniu
window.addEventListener('scroll', checkStatsVisible);
window.addEventListener('load', checkStatsVisible);

// Sprawdź też po 1 sekundzie (na wszelki wypadek)
setTimeout(checkStatsVisible, 1000);

console.log('🚀 BrukBłysk - Strona załadowana pomyślnie!');
