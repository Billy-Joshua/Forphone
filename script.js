/**
 * ForPhone Website - Full JavaScript
 * Features:
 * - Smooth scrolling
 * - Mobile menu toggle
 * - Active navigation highlight on scroll
 * - Auto-update year
 * - Responsive menu handling
 */

class ForPhoneWebsite {
  constructor() {
    // Selectors
    this.nav = document.querySelector('.nav');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.navLinks = document.querySelectorAll('.nav a');
    this.sections = document.querySelectorAll('section[id]');
    this.yearEl = document.getElementById('year');

    // State
    this.isMobile = window.innerWidth <= 768;

    // Initialize
    this.init();
  }

  init() {
    this.updateYear();
    this.bindEvents();
    this.handleScroll();
    this.checkMobileMenu();
  }

  // Update copyright year
  updateYear() {
    this.yearEl.textContent = new Date().getFullYear();
  }

  // Bind all event listeners
  bindEvents() {
    // Mobile menu toggle
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => {
        this.nav.classList.toggle('active');
      });
    }

    // Close menu when clicking a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMobile) {
          this.nav.classList.remove('active');
        }
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 60; // Header height
          const targetPosition = target.offsetTop - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jump
          history.pushState(null, null, targetId);
        }
      });
    });

    // Scroll and resize events
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.handleResize());
  }

  // Handle scroll: active nav + header
  handleScroll() {
    const scrollPos = window.scrollY + 100;

    // Highlight active section in nav
    this.sections.forEach(section => {
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav a[href="#${id}"]`);
      if (link) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          this.navLinks.forEach(a => a.style.color = '');
          link.style.color = '#0071e3';
        }
      }
    });
  }

  // Handle window resize
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    // Close mobile menu if switching to desktop
    if (wasMobile && !this.isMobile && this.nav.classList.contains('active')) {
      this.nav.classList.remove('active');
    }
  }

  // Check if mobile menu should be closed
  checkMobileMenu() {
    if (!this.isMobile && this.nav.classList.contains('active')) {
      this.nav.classList.remove('active');
    }
  }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.forPhoneSite = new ForPhoneWebsite();
});