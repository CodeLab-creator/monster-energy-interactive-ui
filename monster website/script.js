/* ============================================
   MONSTER ENERGY SCROLL WEBSITE - JAVASCRIPT
   Scroll-Driven Animations & Effects
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    scrollThreshold: 0.4,
    canRollDuration: 500,
    transitionDuration: 800,
    particleCount: 30,
    sparkCount: 15
};

// ============================================
// STATE
// ============================================
let currentSection = 0;
let isScrolling = false;
let lastScrollY = 0;
let scrollTimeout = null;
let sections = [];
let canWrappers = [];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeSections();
    initializeParticles();
    initializeSparks();
    setupScrollObserver();
    setupScrollAnimation();

    // Initial animation
    setTimeout(() => {
        document.querySelector('.hero-section').classList.add('active');
    }, 500);
});

// ============================================
// SECTION INITIALIZATION
// ============================================
function initializeSections() {
    sections = document.querySelectorAll('.section');
    canWrappers = document.querySelectorAll('.flavor-section .can-wrapper, .hero-can');

    // Set initial states
    sections.forEach((section, index) => {
        section.style.zIndex = sections.length - index;
    });
}

// ============================================
// PARTICLE SYSTEM
// ============================================
function initializeParticles() {
    const container = document.getElementById('particles-container');

    for (let i = 0; i < CONFIG.particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random positioning
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + 100 + '%';

    // Random size
    const size = Math.random() * 4 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    // Random animation duration and delay
    particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';

    container.appendChild(particle);
}

// ============================================
// SPARKS SYSTEM (for Zero Ultra section)
// ============================================
function initializeSparks() {
    const sparksContainer = document.querySelector('.sparks-container');
    if (!sparksContainer) return;

    for (let i = 0; i < CONFIG.sparkCount; i++) {
        createSpark(sparksContainer);
    }
}

function createSpark(container) {
    const spark = document.createElement('div');
    spark.className = 'spark';

    spark.style.left = Math.random() * 100 + '%';
    spark.style.animationDuration = (Math.random() * 3 + 3) + 's';
    spark.style.animationDelay = (Math.random() * 4) + 's';

    container.appendChild(spark);
}

// ============================================
// INTERSECTION OBSERVER FOR SECTIONS
// ============================================
function setupScrollObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0.3, 0.5, 0.7]
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            const flavor = section.dataset.flavor;

            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                // Activate section
                activateSection(section);
                updateParticleColors(flavor);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// ============================================
// SECTION ACTIVATION
// ============================================
function activateSection(section) {
    // Remove active from all sections
    sections.forEach(s => s.classList.remove('active'));

    // Add active to current section
    section.classList.add('active');

    // Get section index
    const newIndex = Array.from(sections).indexOf(section);
    const direction = newIndex > currentSection ? 'down' : 'up';

    // Trigger can animation
    if (newIndex !== currentSection) {
        animateCan(section, direction);
        currentSection = newIndex;
    }
}

// ============================================
// CAN ANIMATIONS
// ============================================
function animateCan(section, direction) {
    const canWrapper = section.querySelector('.can-wrapper');
    if (!canWrapper) return;

    // Remove existing animation classes
    canWrapper.classList.remove('entering-left', 'entering-right', 'exiting-left', 'exiting-right');

    // Apply new animation based on direction
    if (direction === 'down') {
        canWrapper.classList.add('entering-right');
    } else {
        canWrapper.classList.add('entering-left');
    }

    // Trigger roll animation on can image
    const canImage = canWrapper.querySelector('.can-image');
    if (canImage) {
        canImage.classList.add('rolling');
        setTimeout(() => {
            canImage.classList.remove('rolling');
        }, CONFIG.canRollDuration);
    }
}

// ============================================
// SCROLL-BASED ANIMATIONS
// ============================================
function setupScrollAnimation() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll(scrollY, scrollDelta);
                ticking = false;
            });
            ticking = true;
        }

        lastScrollY = scrollY;

        // Motion blur effect
        applyMotionBlur();
    });
}

function handleScroll(scrollY, scrollDelta) {
    // Parallax effect on backgrounds
    applyParallax(scrollY);

    // Rolling effect on visible cans
    applyScrollRoll(scrollDelta);
}

function applyParallax(scrollY) {
    sections.forEach(section => {
        const bg = section.querySelector('.section-bg');
        if (bg) {
            const speed = 0.3;
            const yPos = scrollY * speed;
            bg.style.transform = `translateY(${yPos * 0.1}px)`;
        }
    });
}

function applyScrollRoll(scrollDelta) {
    const activeSection = document.querySelector('.section.active');
    if (!activeSection) return;

    const canImage = activeSection.querySelector('.can-image');
    if (!canImage) return;

    // Calculate roll angle based on scroll speed
    const maxRoll = 15;
    const rollAngle = Math.max(-maxRoll, Math.min(maxRoll, scrollDelta * 0.5));
    const tiltAngle = Math.max(-5, Math.min(5, scrollDelta * 0.2));

    // Apply 3D transform
    canImage.style.transform = `rotateY(${rollAngle}deg) rotateZ(${tiltAngle}deg)`;

    // Reset after scroll stops
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        canImage.style.transform = 'rotateY(0deg) rotateZ(0deg)';
    }, 150);
}

// ============================================
// MOTION BLUR EFFECT
// ============================================
function applyMotionBlur() {
    const canImages = document.querySelectorAll('.can-image');

    canImages.forEach(can => {
        can.classList.add('motion-blur');
        can.classList.remove('motion-blur-off');
    });

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        canImages.forEach(can => {
            can.classList.remove('motion-blur');
            can.classList.add('motion-blur-off');
        });
    }, 100);
}

// ============================================
// PARTICLE COLOR UPDATES
// ============================================
function updateParticleColors(flavor) {
    const particles = document.querySelectorAll('.particle');
    let color;

    switch (flavor) {
        case 'dragon':
        case 'hero':
            color = 'rgba(155, 77, 202, 0.8)';
            break;
        case 'zero':
            color = 'rgba(255, 255, 255, 0.8)';
            break;
        case 'cotton':
            color = 'rgba(0, 212, 255, 0.8)';
            break;
        case 'mango':
            color = 'rgba(251, 191, 36, 0.8)';
            break;
        default:
            color = 'rgba(255, 255, 255, 0.6)';
    }

    particles.forEach(particle => {
        particle.style.background = color;
        particle.style.boxShadow = `0 0 6px ${color}`;
    });
}

// ============================================
// CTA SECTION - CLICK TO FOCUS INTERACTION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const ctaCans = document.querySelectorAll('.cta-can');
    const cansContainer = document.querySelector('.all-cans-container');
    let focusedCan = null;

    ctaCans.forEach((can, index) => {
        // Staggered entrance animation
        can.style.opacity = '0';
        can.style.transform = 'translateY(50px)';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        can.style.transition = 'opacity 0.6s ease, transform 0.6s ease, filter 0.4s ease';
                        can.style.opacity = '1';
                        can.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(can);

        // Click to Focus - Center the clicked can
        can.addEventListener('click', (e) => {
            e.stopPropagation();

            if (focusedCan === can) {
                // If clicking the same can, release focus
                releaseFocus();
                return;
            }

            // Calculate center position offset
            const containerRect = cansContainer.getBoundingClientRect();
            const canRect = can.getBoundingClientRect();
            const containerCenter = containerRect.left + containerRect.width / 2;
            const canCenter = canRect.left + canRect.width / 2;
            const offsetX = containerCenter - canCenter;

            // Apply focus state
            focusedCan = can;
            cansContainer.classList.add('has-focus');

            // Center the clicked can
            can.classList.add('focused');
            can.style.transform = `translateX(${offsetX}px) translateY(-30px) scale(1.25)`;
            can.style.zIndex = '100';

            // Blur and fade other cans
            ctaCans.forEach(otherCan => {
                if (otherCan !== can) {
                    otherCan.classList.add('unfocused');
                }
            });
        });
    });

    // Release focus when clicking outside
    function releaseFocus() {
        if (!focusedCan) return;

        cansContainer.classList.remove('has-focus');
        focusedCan.classList.remove('focused');
        focusedCan.style.transform = '';
        focusedCan.style.zIndex = '';

        ctaCans.forEach(can => {
            can.classList.remove('unfocused');
        });

        focusedCan = null;
    }

    // Click outside to release
    document.addEventListener('click', (e) => {
        if (focusedCan && !e.target.closest('.cta-can')) {
            releaseFocus();
        }
    });

    // Escape key to release
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            releaseFocus();
        }
    });
});

// ============================================
// BUTTON INTERACTIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const ctaButton = document.querySelector('.cta-button');

    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', () => {
            ctaButton.style.boxShadow = '0 0 60px rgba(155, 77, 202, 0.6), 0 0 100px rgba(0, 212, 255, 0.4)';
        });

        ctaButton.addEventListener('mouseleave', () => {
            ctaButton.style.boxShadow = '';
        });

        ctaButton.addEventListener('click', () => {
            // Scroll to top with animation
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ============================================
// SMOOTH SCROLL ENHANCEMENT
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Reduce particle count on lower-end devices
if (window.matchMedia('(max-width: 768px)').matches ||
    navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    CONFIG.particleCount = 15;
    CONFIG.sparkCount = 8;
}

// Pause animations when page is not visible
document.addEventListener('visibilitychange', () => {
    const particles = document.querySelectorAll('.particle, .spark, .smoke, .vapor, .mist');

    if (document.hidden) {
        particles.forEach(p => p.style.animationPlayState = 'paused');
    } else {
        particles.forEach(p => p.style.animationPlayState = 'running');
    }
});

// ============================================
// RESIZE HANDLER
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate positions if needed
        initializeSections();
    }, 250);
});

console.log('🔋 Monster Energy Website Loaded - Unleash The Energy!');
