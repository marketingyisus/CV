/**
 * Jesús A. González — CV Portafolio
 * Interactive Carousel Controller & Instagram Embed Processor
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ============================================================
  // CAROUSEL SETUP
  // ============================================================

  /**
   * Initialize a horizontal carousel with prev/next navigation
   * and a slide counter display.
   *
   * @param {string} carouselId   - ID of the scrolling container
   * @param {string} prevBtnId    - ID of the "previous" button
   * @param {string} nextBtnId    - ID of the "next" button
   * @param {string} counterId    - ID of the counter display element
   */
  function setupCarousel(carouselId, prevBtnId, nextBtnId, counterId) {
    const carousel = document.getElementById(carouselId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const counter = document.getElementById(counterId);

    if (!carousel || !prevBtn || !nextBtn) return;

    const slides = carousel.children;
    const total = slides.length || 5;
    const GAP = 24; // 1.5rem gap between slides

    /**
     * Update the visible "Slide X de Y" counter based on scroll position.
     */
    function updateSlideCounter() {
      try {
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth + GAP;
        const currentIndex = Math.round(carousel.scrollLeft / slideWidth) + 1;
        const clamped = Math.min(Math.max(currentIndex, 1), total);
        if (counter) {
          counter.textContent = `Slide ${clamped} de ${total}`;
        }
      } catch (e) {
        // Silently handle layout-related errors
      }
    }

    // Navigate to the previous slide
    prevBtn.addEventListener('click', function () {
      const slideWidth = slides[0] ? slides[0].offsetWidth + GAP : 360;
      carousel.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    });

    // Navigate to the next slide
    nextBtn.addEventListener('click', function () {
      const slideWidth = slides[0] ? slides[0].offsetWidth + GAP : 360;
      carousel.scrollBy({ left: slideWidth, behavior: 'smooth' });
    });

    // Update counter on scroll
    carousel.addEventListener('scroll', updateSlideCounter, { passive: true });

    // Initial counter update
    updateSlideCounter();
  }

  // Initialize both carousels
  setupCarousel('reels-carousel', 'carousel-prev', 'carousel-next', 'reels-counter');
  setupCarousel('inmoparcelas-carousel', 'inmoparcelas-prev', 'inmoparcelas-next', 'inmoparcelas-counter');


  // ============================================================
  // INSTAGRAM EMBED PROCESSOR
  // ============================================================

  /**
   * Process Instagram embeds if the Instagram embed.js library
   * has loaded and exposed its API.
   */
  function processInstagramEmbeds() {
    try {
      if (
        window.instgrm &&
        window.instgrm.Embeds &&
        typeof window.instgrm.Embeds.process === 'function'
      ) {
        window.instgrm.Embeds.process();
      }
    } catch (e) {
      // Silently handle embed processing errors
    }
  }

  // Process embeds immediately and again after a short delay
  // to handle any late-loaded content
  processInstagramEmbeds();
  setTimeout(processInstagramEmbeds, 1000);


  // ============================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ============================================================
  // SCROLL-REVEAL ANIMATION (Intersection Observer)
  // ============================================================

  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }
});
