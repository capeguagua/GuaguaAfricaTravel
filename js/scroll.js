/* ========================================
   Scroll Module - Smooth Scroll & Animations
   ======================================== */

class ScrollManager {
  constructor() {
    this.sections = [];
    this.currentSection = 0;
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.scrollCooldown = 800;
  }

  init() {
    this.sections = Array.from(document.querySelectorAll('section[id]'));
    
    // Setup scroll observer for animations only
    this.setupScrollObserver();
    
    // Setup smooth scroll for anchor links only
    this.setupAnchorScroll();
    
    // Setup scroll progress indicator
    this.setupScrollProgress();
    
    // Initial check for visible sections
    this.checkInitialVisibility();
  }

  setupScrollObserver() {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: [0.1, 0.5]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          entry.target.classList.add('in-view');
          
          // Animate children with stagger
          const animateElements = entry.target.querySelectorAll(
            '.about-card, .traveler-card, .service-card, .journey-card, .process-card, .why-card, .contact-card'
          );
          
          animateElements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('animate-in');
            }, index * 80);
          });
        }
      });
    }, options);

    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  setupAnchorScroll() {
    // Only smooth scroll for navigation link clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
          this.scrollToSection(target);
        }
      });
    });
  }

  scrollToSection(target) {
    if (this.isScrolling) return;
    this.isScrolling = true;

    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
    const targetPosition = target.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Reset scrolling flag after animation
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, this.scrollCooldown);
  }

  setupScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // Update on scroll
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  getCurrentSectionIndex() {
    const scrollTop = window.scrollY;
    const headerHeight = document.getElementById('header')?.offsetHeight || 80;

    for (let i = this.sections.length - 1; i >= 0; i--) {
      if (scrollTop >= this.sections[i].offsetTop - headerHeight - 100) {
        return i;
      }
    }
    return 0;
  }

  checkInitialVisibility() {
    // Check which section is initially visible
    const windowHeight = window.innerHeight;

    this.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < windowHeight * 0.8) {
        section.classList.add('in-view');
        
        const animateElements = section.querySelectorAll(
          '.about-card, .traveler-card, .service-card, .journey-card, .process-card, .why-card, .contact-card'
        );
        
        animateElements.forEach((el, index) => {
          el.classList.add('animate-in');
        });
      }
    });
  }
}

// Global instance
const scrollManager = new ScrollManager();
window.scrollManager = scrollManager;
