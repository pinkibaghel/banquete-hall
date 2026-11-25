/**
 * L'AURA ROYALE PALACE & BANQUETS
 * Premium Luxury Banquet Hall Portfolio JavaScript
 * Features:
 * - Hero crossfade carousel & golden particle ambient canvas
 * - Sticky header with scroll spy and mobile navigation drawer
 * - Animated statistics counters with IntersectionObserver
 * - Interactive venue spaces filter & detailed 360° view modal
 * - Gallery category filters & full-featured interactive Lightbox
 * - Package switchers & auto pre-fill inquiry form triggers
 * - Testimonial slider with autoplay & controls
 * - Real-time booking form validation & investment estimate
 * - Royal booking receipt modal with unique reference generator
 * - Interactive FAQ accordion
 * - Circular progress back-to-top button & toast notification system
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. HERO CROSSFADE CAROUSEL & GOLD PARTICLES CANVAS
     ========================================================================== */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  let currentHeroSlide = 0;
  let heroSlideInterval;

  function showHeroSlide(index) {
    if (!heroSlides.length) return;
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentHeroSlide = index;
  }

  function nextHeroSlide() {
    let nextIndex = (currentHeroSlide + 1) % heroSlides.length;
    showHeroSlide(nextIndex);
  }

  function startHeroTimer() {
    clearInterval(heroSlideInterval);
    heroSlideInterval = setInterval(nextHeroSlide, 6500);
  }

  if (heroDots.length > 0) {
    heroDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
        showHeroSlide(targetIndex);
        startHeroTimer();
      });
    });
    startHeroTimer();
  }

  // Golden Floating Particles Canvas Effect
  const canvas = document.getElementById('heroParticles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.2 + 0.6;
        this.speedY = -(Math.random() * 0.4 + 0.15);
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.increasing = Math.random() > 0.5;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.increasing) {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= 0.8) this.increasing = false;
        } else {
          this.opacity -= this.fadeSpeed;
          if (this.opacity <= 0.1) this.increasing = true;
        }

        if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
          this.y = canvas.height + 10;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 200, 114, ${this.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      resizeCanvas();
      particlesArray = [];
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 55);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    initParticles();
    animateParticles();
  }

  /* ==========================================================================
     2. STICKY HEADER, SCROLL SPY & MOBILE DRAWER
     ========================================================================== */
  const mainHeader = document.getElementById('mainHeader');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  // Sticky header class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('header-scrolled');
    } else {
      mainHeader.classList.remove('header-scrolled');
    }
    updateScrollSpy();
    updateBackToTop();
  });

  // Scroll Spy for nav links
  function updateScrollSpy() {
    const scrollPos = window.scrollY + 180;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // Mobile Drawer toggles
  function openDrawer() {
    mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  /* ==========================================================================
     3. ANIMATED STATISTICS COUNTERS (INTERSECTION OBSERVER)
     ========================================================================== */
  const statCards = document.querySelectorAll('.stat-card');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateAllCounters();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  function animateAllCounters() {
    statCards.forEach((card) => {
      const target = parseFloat(card.getAttribute('data-counter'));
      const counterEl = card.querySelector('.stat-counter');
      const duration = 2200; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out quadratic
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(easeProgress * target);

        if (counterEl) {
          counterEl.textContent = currentVal.toLocaleString();
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (counterEl) {
            counterEl.textContent = target.toLocaleString();
          }
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  /* ==========================================================================
     4. VENUE SPACES FILTER & DETAILED MODAL
     ========================================================================== */
  const venueTabs = document.querySelectorAll('.v-tab-btn');
  const venueCards = document.querySelectorAll('.venue-card');

  venueTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      venueTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCategory = tab.getAttribute('data-venue-target');

      venueCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Venue Data dictionary for modal display
  const venueData = {
    ballroom: {
      title: "The Grand Ballroom Royale",
      subtitle: "Flagship Imperial Celebration Hall",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85",
      sqft: "16,500 sq. ft.",
      seated: "1,200 Guests",
      floating: "2,000 Guests",
      ceiling: "32 Feet Cathedral",
      description: "Our signature palatial hall, designed with neoclassical columns, gold leaf trims, and eighteen hand-assembled Czech crystal chandeliers. Features dual curved marble staircases ideal for royal couple aisle entrances and a hydraulic performance stage designed for full orchestras.",
      amenities: [
        "Dual sweeping imperial marble staircases",
        "Two private en-suite bridal glam dressing suites",
        "Integrated concert-grade L-Acoustics audio system",
        "Computer-controlled dynamic moving-head pin spotlights",
        "Hydraulic center-stage with projection mapping",
        "Direct vehicle / royal horse carriage load-in ramp"
      ]
    },
    pavilion: {
      title: "The Crystal Glass Pavilion",
      subtitle: "Climate-Controlled Botanical Conservatory",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
      sqft: "9,200 sq. ft.",
      seated: "450 Guests",
      floating: "750 Guests",
      ceiling: "24 Feet Glass Dome",
      description: "An architectural marvel enclosed in 24-foot panoramic insulated glass. Offers 360-degree views of the estate's centenary cypress gardens, cascading water fountains, and starlit California skies while keeping guests in supreme temperature-controlled comfort.",
      amenities: [
        "Floor-to-ceiling panoramic insulated glass panels",
        "Retractable UV-filtering ceiling silk shades",
        "Private limestone fountain terrace and cocktail plaza",
        "Underfloor radiant heating and silent HVAC",
        "Suspended brass chandelier truss for custom florals",
        "Adjacent bridal touch-up lounge"
      ]
    },
    courtyard: {
      title: "The Sovereign Courtyard & Lawns",
      subtitle: "Open-Air Neoclassical Garden Sanctuary",
      image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85",
      sqft: "24,000 sq. ft.",
      seated: "850 Guests",
      floating: "1,600 Guests",
      ceiling: "Open Starlit Sky",
      description: "Framed by neoclassical Roman arches, manicured boxwood parterres, and a three-tiered illuminated fountain. Designed for grand baraats, golden-hour vow ceremonies, and open-air dinner galas under suspended fairy canopies.",
      amenities: [
        "Central carved Roman stone water fountain",
        "Perimeter centenary cypress trees with ambient fairy illumination",
        "Direct paved processional aisle for horse carriage or baraat",
        "Built-in heavy-duty tent anchor points",
        "Paved exterior bar pavilions and fire lounge areas",
        "Private estate helipad access within 100 meters"
      ]
    },
    terrace: {
      title: "The Versailles Sunset Terrace & Lounge",
      subtitle: "Panoramic Hillside Penthouse Soirée Space",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85",
      sqft: "5,800 sq. ft.",
      seated: "250 Guests",
      floating: "450 Guests",
      ceiling: "Terrace Sky Canopy",
      description: "Positioned on the upper level of the palace with commanding views of the estate's private hills and dramatic sunset vistas. Furnished with an illuminated onyx cocktail bar, gold fire features, and cozy velvet lounge pergolas.",
      amenities: [
        "Backlit translucent onyx circular cocktail bar",
        "Linear gas fire tables with gold river glass",
        "Panoramic west-facing sunset valley viewpoints",
        "Heated natural granite pavers for evening warmth",
        "Private express elevator from VIP valet parking",
        "Integrated ambient DJ audio system"
      ]
    },
    monarch: {
      title: "The Monarch Salon & Boardroom",
      subtitle: "Intimate VIP Sanctuary & Executive Suite",
      image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=85",
      sqft: "3,200 sq. ft.",
      seated: "80 Guests",
      floating: "150 Guests",
      ceiling: "18 Feet Coffered Mahogany",
      description: "A private club-style VIP salon wrapped in rich mahogany paneling, gold leaf moldings, and private dining rooms. Built for high-security executive summits, private family rehearsal dinners, and VIP green rooms.",
      amenities: [
        "Ultra-HD 4K multi-screen video display wall",
        "Acoustic isolation rating with private secure entrance",
        "Dedicated chef's staging pass and sommelier wine cellar",
        "Private marble restroom facilities",
        "High-security escort protocol readiness",
        "Direct access to private palace suites"
      ]
    }
  };

  const venueModal = document.getElementById('venueModal');
  const venueModalBackdrop = document.getElementById('venueModalBackdrop');
  const venueModalClose = document.getElementById('venueModalClose');
  const venueModalBody = document.getElementById('venueModalBody');
  const quickViewBtns = document.querySelectorAll('.btn-quick-view');

  function openVenueModal(venueKey) {
    const data = venueData[venueKey];
    if (!data || !venueModalBody) return;

    venueModalBody.innerHTML = `
      <div class="modal-v-header">
        <img src="${data.image}" alt="${data.title}">
        <div class="modal-v-overlay">
          <span class="badge-award" style="margin-bottom:6px;"><i class="fa-solid fa-crown"></i> ${data.subtitle}</span>
          <h2 style="font-size: 2.2rem; color: #FFF; margin: 0;">${data.title}</h2>
        </div>
      </div>
      <div class="modal-v-content">
        <div class="venue-specs-grid" style="margin-top: 10px; margin-bottom: 24px;">
          <div class="spec-cell">
            <span class="spec-label"><i class="fa-solid fa-expand"></i> Dimensions</span>
            <span class="spec-val">${data.sqft}</span>
          </div>
          <div class="spec-cell">
            <span class="spec-label"><i class="fa-solid fa-chair"></i> Seated Banquet</span>
            <span class="spec-val">${data.seated}</span>
          </div>
          <div class="spec-cell">
            <span class="spec-label"><i class="fa-solid fa-users"></i> Cocktail / Floating</span>
            <span class="spec-val">${data.floating}</span>
          </div>
          <div class="spec-cell">
            <span class="spec-label"><i class="fa-solid fa-arrows-up-down"></i> Ceiling Height</span>
            <span class="spec-val">${data.ceiling}</span>
          </div>
        </div>

        <p style="font-size: 0.95rem; line-height: 1.8; color: #D6D0C2; margin-bottom: 24px;">
          ${data.description}
        </p>

        <h4 style="font-size: 1.15rem; color: #ECC872; margin-bottom: 12px; font-family: var(--font-royal); letter-spacing: 0.08em; text-transform: uppercase;">
          Space Features & Technology
        </h4>
        <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px;">
          ${data.amenities
            .map(
              (item) => `
            <li style="font-size: 0.85rem; color: #EAE5D9; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-check" style="color: #D4AF37;"></i> ${item}
            </li>
          `
            )
            .join('')}
        </ul>

        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <a href="#booking" class="btn-royal-primary modal-inquire-btn" data-venue-name="${data.title}" style="flex-grow: 1;">
            <span>Inquire For ${data.title}</span>
            <i class="fa-solid fa-calendar-check"></i>
          </a>
          <button class="btn-royal-outline close-v-modal-action" style="padding: 12px 24px;">
            <span>Close Details</span>
          </button>
        </div>
      </div>
    `;

    venueModal.classList.add('active');
    venueModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Bind Inquire button inside modal to prefill form
    const modalInquire = venueModalBody.querySelector('.modal-inquire-btn');
    if (modalInquire) {
      modalInquire.addEventListener('click', () => {
        closeVenueModal();
        prefillForm('preferredVenue', data.title);
      });
    }

    const closeBtnInner = venueModalBody.querySelector('.close-v-modal-action');
    if (closeBtnInner) {
      closeBtnInner.addEventListener('click', closeVenueModal);
    }
  }

  function closeVenueModal() {
    if (venueModal) {
      venueModal.classList.remove('active');
      venueModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  quickViewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const venueKey = btn.getAttribute('data-venue');
      openVenueModal(venueKey);
    });
  });

  if (venueModalClose) venueModalClose.addEventListener('click', closeVenueModal);
  if (venueModalBackdrop) venueModalBackdrop.addEventListener('click', closeVenueModal);

  /* ==========================================================================
     5. GALLERY FILTER & INTERACTIVE LIGHTBOX
     ========================================================================== */
  const galleryFilterBtns = document.querySelectorAll('.g-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentGalleryIndex = 0;
  let activeVisibleItems = Array.from(galleryItems);

  // Gallery Filters
  galleryFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      activeVisibleItems = [];

      galleryItems.forEach((item) => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          activeVisibleItems.push(item);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Lightbox Open & Navigation
  function updateLightboxContent(index) {
    if (!activeVisibleItems.length) return;
    if (index < 0) index = activeVisibleItems.length - 1;
    if (index >= activeVisibleItems.length) index = 0;

    currentGalleryIndex = index;
    const item = activeVisibleItems[index];

    const src = item.getAttribute('data-src');
    const title = item.getAttribute('data-title');
    const desc = item.getAttribute('data-desc');
    const cat = item.getAttribute('data-category');

    if (lightboxImage) {
      lightboxImage.src = src;
      lightboxImage.alt = title;
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    if (lightboxCategory) lightboxCategory.textContent = cat.toUpperCase();
    if (lightboxCounter) {
      lightboxCounter.textContent = `${index + 1} / ${activeVisibleItems.length}`;
    }
  }

  function openLightbox(index) {
    updateLightboxContent(index);
    if (lightboxModal) {
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const idx = activeVisibleItems.indexOf(item);
      if (idx !== -1) {
        openLightbox(idx);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      updateLightboxContent(currentGalleryIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      updateLightboxContent(currentGalleryIndex + 1);
    });
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      updateLightboxContent(currentGalleryIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateLightboxContent(currentGalleryIndex + 1);
    }
  });

  /* ==========================================================================
     6. PACKAGE TOGGLE & PRE-FILL FORM AUTOMATION
     ========================================================================== */
  const pkgToggleBtns = document.querySelectorAll('.pkg-toggle-btn');
  const weddingPackages = document.getElementById('weddingPackages');
  const corporatePackages = document.getElementById('corporatePackages');

  pkgToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      pkgToggleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const type = btn.getAttribute('data-pkg-type');
      if (type === 'wedding') {
        weddingPackages.classList.add('active');
        corporatePackages.classList.remove('active');
      } else {
        corporatePackages.classList.add('active');
        weddingPackages.classList.remove('active');
      }
    });
  });

  // Prefill helper for all CTA prefill buttons across the page
  function prefillForm(fieldId, value) {
    const el = document.getElementById(fieldId);
    if (el) {
      el.value = value;
      // Trigger change for live estimate updates
      const event = new Event('change');
      el.dispatchEvent(event);
    }
    // Scroll smoothly to booking
    const bookingSec = document.getElementById('booking');
    if (bookingSec) {
      bookingSec.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Selected "${value}" - Preferences loaded into inquiry form.`, 'fa-crown');
  }

  // Attach to all elements with class .prefill-btn
  const prefillBtns = document.querySelectorAll('.prefill-btn');
  prefillBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const venue = btn.getAttribute('data-venue-name');
      const eventType = btn.getAttribute('data-event-type');
      const pkg = btn.getAttribute('data-package');

      if (venue) prefillForm('preferredVenue', venue);
      if (eventType) prefillForm('eventType', eventType);
      if (pkg) prefillForm('packageTier', pkg);
    });
  });

  /* ==========================================================================
     7. TESTIMONIAL SLIDER WITH AUTOPLAY & CONTROLS
     ========================================================================== */
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.t-dot');
  const testPrev = document.getElementById('testPrev');
  const testNext = document.getElementById('testNext');
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    if (!testimonialSlides.length) return;
    if (index < 0) index = testimonialSlides.length - 1;
    if (index >= testimonialSlides.length) index = 0;

    testimonialSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    testimonialDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentTestimonial = index;
  }

  function startTestimonialTimer() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
      showTestimonial(currentTestimonial + 1);
    }, 7000);
  }

  if (testPrev) {
    testPrev.addEventListener('click', () => {
      showTestimonial(currentTestimonial - 1);
      startTestimonialTimer();
    });
  }

  if (testNext) {
    testNext.addEventListener('click', () => {
      showTestimonial(currentTestimonial + 1);
      startTestimonialTimer();
    });
  }

  testimonialDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-t-slide'), 10);
      showTestimonial(idx);
      startTestimonialTimer();
    });
  });

  startTestimonialTimer();

  /* ==========================================================================
     8. BOOKING INQUIRY FORM VALIDATION & ESTIMATE CALCULATOR
     ========================================================================== */
  const bookingForm = document.getElementById('bookingInquiryForm');
  const fullName = document.getElementById('fullName');
  const emailAddress = document.getElementById('emailAddress');
  const phoneNumber = document.getElementById('phoneNumber');
  const eventDate = document.getElementById('eventDate');
  const eventType = document.getElementById('eventType');
  const preferredVenue = document.getElementById('preferredVenue');
  const guestCount = document.getElementById('guestCount');
  const packageTier = document.getElementById('packageTier');
  const estimateValue = document.getElementById('estimateValue');

  // Set min date to tomorrow
  if (eventDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    eventDate.min = `${yyyy}-${mm}-${dd}`;
  }

  // Live Investment & Capacity Estimator
  function updateLiveEstimate() {
    if (!estimateValue) return;

    const guests = parseInt(guestCount.value, 10);
    const selectedPkg = packageTier.value;

    let pricePerGuest = 0;
    let baseBuyout = 0;

    switch (selectedPkg) {
      case 'Silver Laurel Collection':
        pricePerGuest = 155;
        baseBuyout = 22000;
        break;
      case 'Majestic Sovereign Collection':
        pricePerGuest = 245;
        baseBuyout = 42000;
        break;
      case 'Imperial Versailles Collection':
        pricePerGuest = 365;
        baseBuyout = 75000;
        break;
      case 'Diplomat Corporate Summit':
        pricePerGuest = 95;
        baseBuyout = 8500;
        break;
      case 'Grand Gala Soirée':
        pricePerGuest = 175;
        baseBuyout = 25000;
        break;
      default:
        pricePerGuest = 210; // blended average
        baseBuyout = 30000;
    }

    if (guests && guests >= 20) {
      const estimatedTotal = Math.max(guests * pricePerGuest, baseBuyout);
      const formattedTotal = estimatedTotal.toLocaleString('en-US');
      estimateValue.innerHTML = `<strong>Estimated Range:</strong> $${formattedTotal} USD (includes venue, gastronomy, white-glove staffing & suite)`;
    } else {
      estimateValue.textContent = 'Enter estimated guest count and desired package for instant budget guidance.';
    }
  }

  if (guestCount) guestCount.addEventListener('input', updateLiveEstimate);
  if (packageTier) packageTier.addEventListener('change', updateLiveEstimate);
  if (eventType) eventType.addEventListener('change', updateLiveEstimate);

  // Form Validation Handlers
  function validateField(input, condition, errorElId) {
    const formGroup = input.closest('.form-group');
    if (!condition) {
      formGroup.classList.add('has-error');
      return false;
    } else {
      formGroup.classList.remove('has-error');
      return true;
    }
  }

  function validateFullName() {
    return validateField(fullName, fullName.value.trim().length >= 3, 'nameError');
  }

  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validateField(emailAddress, emailRegex.test(emailAddress.value.trim()), 'emailError');
  }

  function validatePhone() {
    const cleaned = phoneNumber.value.replace(/\D/g, '');
    return validateField(phoneNumber, cleaned.length >= 10, 'phoneError');
  }

  function validateDate() {
    if (!eventDate.value) {
      return validateField(eventDate, false, 'dateError');
    }
    const chosen = new Date(eventDate.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return validateField(eventDate, chosen > today, 'dateError');
  }

  function validateEventType() {
    return validateField(eventType, eventType.value !== '', 'typeError');
  }

  function validateGuests() {
    const count = parseInt(guestCount.value, 10);
    return validateField(guestCount, count >= 20 && count <= 2500, 'guestError');
  }

  // Real-time blur listeners
  if (fullName) fullName.addEventListener('blur', validateFullName);
  if (emailAddress) emailAddress.addEventListener('blur', validateEmail);
  if (phoneNumber) phoneNumber.addEventListener('blur', validatePhone);
  if (eventDate) eventDate.addEventListener('change', validateDate);
  if (eventType) eventType.addEventListener('change', validateEventType);
  if (guestCount) guestCount.addEventListener('blur', validateGuests);

  // Booking Receipt Success Modal
  const bookingSuccessModal = document.getElementById('bookingSuccessModal');
  const bookingModalBackdrop = document.getElementById('bookingModalBackdrop');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  const modalClientName = document.getElementById('modalClientName');
  const modalEventDate = document.getElementById('modalEventDate');
  const modalRefId = document.getElementById('modalRefId');
  const modalEventType = document.getElementById('modalEventType');
  const modalVenue = document.getElementById('modalVenue');
  const modalGuestCount = document.getElementById('modalGuestCount');

  function openSuccessModal(data) {
    if (!bookingSuccessModal) return;

    modalClientName.textContent = data.name;
    modalEventDate.textContent = data.date;
    modalRefId.textContent = data.refId;
    modalEventType.textContent = data.type;
    modalVenue.textContent = data.venue;
    modalGuestCount.textContent = `${data.guests} Guests`;

    bookingSuccessModal.classList.add('active');
    bookingSuccessModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSuccessModal() {
    if (bookingSuccessModal) {
      bookingSuccessModal.classList.remove('active');
      bookingSuccessModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (closeSuccessModalBtn) closeSuccessModalBtn.addEventListener('click', closeSuccessModal);
  if (bookingModalBackdrop) bookingModalBackdrop.addEventListener('click', closeSuccessModal);

  // Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateFullName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();
      const isDateValid = validateDate();
      const isTypeValid = validateEventType();
      const isGuestValid = validateGuests();

      if (isNameValid && isEmailValid && isPhoneValid && isDateValid && isTypeValid && isGuestValid) {
        const submitBtn = document.getElementById('submitInquiryBtn');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = `
          <i class="fa-solid fa-spinner fa-spin"></i>
          <span>Securing Royal Registry...</span>
        `;
        submitBtn.disabled = true;

        setTimeout(() => {
          // Generate unique reference
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          const currentYear = new Date().getFullYear();
          const refCode = `#LR-${currentYear}-${randomNum}`;

          const submissionData = {
            name: fullName.value.trim(),
            email: emailAddress.value.trim(),
            date: new Date(eventDate.value).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            type: eventType.value,
            venue: preferredVenue.value,
            guests: guestCount.value,
            refId: refCode
          };

          openSuccessModal(submissionData);
          showToast(`Inquiry ${refCode} registered successfully!`, 'fa-crown');

          bookingForm.reset();
          updateLiveEstimate();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 1200);
      } else {
        showToast('Please correct highlighted fields before submitting.', 'fa-circle-exclamation');
      }
    });
  }

  /* ==========================================================================
     9. FREQUENTLY ASKED QUESTIONS (ACCORDION)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isCurrentActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach((other) => {
          other.classList.remove('active');
          const btn = other.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isCurrentActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* ==========================================================================
     10. BACK TO TOP BUTTON WITH CIRCULAR PROGRESS RING
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTopBtn');
  const scrollProgress = document.getElementById('scrollProgress');

  function updateBackToTop() {
    if (!backToTopBtn || !scrollProgress) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Radius 21 => circumference is 2 * PI * 21 ≈ 132
    const totalCircumference = 132;
    const offset = totalCircumference - (scrollPercent / 100) * totalCircumference;
    scrollProgress.style.strokeDashoffset = offset;

    if (scrollTop > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     11. BROCHURE DOWNLOAD, NEWSLETTER & TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  const downloadBrochureBtn = document.getElementById('downloadBrochureBtn');
  if (downloadBrochureBtn) {
    downloadBrochureBtn.addEventListener('click', () => {
      showToast("L'Aura Royale 2026 Estate Brochure dispatched to your download tray.", "fa-file-pdf");
    });
  }

  const virtualTourBtn = document.getElementById('virtualTourBtn');
  if (virtualTourBtn) {
    virtualTourBtn.addEventListener('click', () => {
      showToast("Opening 360° Virtual Palace Walkthrough...", "fa-vr-cardboard");
    });
  }

  // Newsletter subscription form
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterMsg = document.getElementById('newsletterMsg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailRegex.test(email)) {
        newsletterMsg.className = 'newsletter-msg success';
        newsletterMsg.textContent = 'Welcome to The Royal Journal. A private welcome preview has been sent.';
        showToast('Subscribed to The Royal Journal successfully.', 'fa-envelope-open-text');
        newsletterForm.reset();
      } else {
        newsletterMsg.className = 'newsletter-msg error';
        newsletterMsg.textContent = 'Please enter a valid email address.';
      }
    });
  }

  // Toast Notification Function
  function showToast(message, iconClass = 'fa-crown') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideToastOut 0.35s ease forwards';
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 350);
    }, 4200);
  }

  window.showRoyalToast = showToast;
});
