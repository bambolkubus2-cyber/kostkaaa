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

// === FORM VALIDATION - MOVED TO INLINE SCRIPT IN HTML ===
// (kod formularza jest teraz bezpośrednio w index.html)

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

// === ANIMATED COUNTERS - MOVED TO INLINE SCRIPT IN HTML ===
// (kod liczników jest już w index.html)

// === LIGHTBOX GALLERY ===
let currentImageIndex = 0;
let galleryImages = [];

function initLightbox() {
    // Zbierz wszystkie obrazy z galerii
    const galleryImgs = document.querySelectorAll('.gallery-image');
    galleryImages = Array.from(galleryImgs);
    
    galleryImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openLightbox(index));
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (lightbox && lightboxImg) {
        const img = galleryImages[currentImageIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        if (lightboxCaption) {
            lightboxCaption.textContent = img.alt || '';
        }
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function changeLightboxImage(direction) {
    currentImageIndex += direction;
    
    // Loop around
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }
    
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (lightboxImg) {
        const img = galleryImages[currentImageIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        if (lightboxCaption) {
            lightboxCaption.textContent = img.alt || '';
        }
    }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            changeLightboxImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeLightboxImage(1);
        }
    }
});

// Make functions global
window.closeLightbox = closeLightbox;
window.changeLightboxImage = changeLightboxImage;

// Initialize lightbox when page loads
window.addEventListener('load', initLightbox);

// === BEFORE/AFTER TOGGLE BUTTON ===
function toggleBeforeAfter(id) {
    const container = document.querySelector(`[data-toggle-id="${id}"]`);
    if (!container) return;
    
    const images = container.querySelectorAll('.before-after-img');
    const label = container.querySelector('.before-after-label');
    const button = container.querySelector('.before-after-button span');
    
    // Get current state
    const currentState = container.getAttribute('data-state') || 'before';
    
    if (currentState === 'before') {
        // Switch to AFTER
        images[0].classList.remove('active');
        images[1].classList.add('active');
        label.textContent = 'PO';
        button.textContent = 'Zobacz PRZED';
        container.setAttribute('data-state', 'after');
    } else {
        // Switch to BEFORE
        images[0].classList.add('active');
        images[1].classList.remove('active');
        label.textContent = 'PRZED';
        button.textContent = 'Zobacz PO';
        container.setAttribute('data-state', 'before');
    }
}

// Make function global
window.toggleBeforeAfter = toggleBeforeAfter;

// Initialize all toggles to "before" state
document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.before-after-toggle');
    toggles.forEach(toggle => {
        toggle.setAttribute('data-state', 'before');
    });
});

console.log('🚀 BrukBłysk - Strona załadowana pomyślnie!');
