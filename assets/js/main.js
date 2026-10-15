/**
 * VELOCE PERFORMANCE - CORE INTERACTIVE ENGINE
 * Lightweight Vanilla JavaScript
 * Zero external libraries required, high SEO compliance, super fast load time
 */

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initMobileDrawer();
  initSearchModal();
  initScrollTop();
  initHeroSlider();
  initLightbox();
  initNewsletterForm();
  initSmoothScroll();
  initFaqAccordion();
  initCartPage();
});

/* ==========================================================================
   1. Lightweight IntersectionObserver Animate On Scroll (AOS)
   ========================================================================== */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          // Once animated, keep it visible for performance and SEO
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    elements.forEach(el => el.classList.add('aos-animate'));
  }
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const submenuToggles = document.querySelectorAll('.mobile-submenu-toggle');

  if (!drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // Submenu Accordion
  submenuToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.closest('li');
      const submenu = parent.querySelector('.mobile-submenu');
      if (submenu) {
        submenu.classList.toggle('open');
      }
    });
  });
}

/* ==========================================================================
   3. Search Popup Modal
   ========================================================================== */
function initSearchModal() {
  const searchTogglers = document.querySelectorAll('.searchBoxToggler');
  const searchModal = document.querySelector('.search-modal');
  const searchClose = document.querySelector('.search-modal-close');
  const searchInput = searchModal ? searchModal.querySelector('input') : null;

  if (!searchModal) return;

  function openSearch() {
    searchModal.classList.add('active');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 150);
    }
  }

  function closeSearch() {
    searchModal.classList.remove('active');
  }

  searchTogglers.forEach(btn => btn.addEventListener('click', openSearch));
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      closeSearch();
    }
  });
}

/* ==========================================================================
   4. Scroll To Top Button
   ========================================================================== */
function initScrollTop() {
  const scrollBtn = document.querySelector('.scroll-top-btn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   5. Hero Banner Slider (Vanilla JS Carousel)
   ========================================================================== */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dotsContainer = slider.querySelector('.hero-dots');
  const prevBtn = slider.querySelector('.hero-prev');
  const nextBtn = slider.querySelector('.hero-next');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const autoPlayDelay = 5500;

  // Create dots if not present
  if (dotsContainer && !dotsContainer.children.length) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `hero-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlides() {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.hero-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
  }

  function goToSlide(idx) {
    currentSlide = idx;
    updateSlides();
  }

  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, autoPlayDelay);
  }

  function stopAutoplay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoplay();
    });
  }

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Initialize first slide
  updateSlides();
  startAutoplay();
}

/* ==========================================================================
   6. Image Lightbox
   ========================================================================== */
function initLightbox() {
  const lightbox = document.querySelector('.image-lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-lightbox') || el.getAttribute('href') || el.querySelector('img')?.src;
      if (src && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   7. Newsletter Simulation
   ========================================================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const msg = document.getElementById('newsletterMessage');
    if (!input || !input.value) return;

    if (msg) {
      msg.innerHTML = '<div style="color: #4ade80; font-size: 0.85rem; margin-top: 8px;">✓ Terima kasih! Anda telah terdaftar untuk menerima update katalog eksklusif.</div>';
    }
    form.reset();
  });
}

/* ==========================================================================
   8. Smooth Anchor Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================================================
   9. FAQ Accordion Handler
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close other open items
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Open first item by default if present
  if (faqItems[0]) {
    const firstAns = faqItems[0].querySelector('.faq-answer');
    if (firstAns) {
      faqItems[0].classList.add('active');
      firstAns.style.maxHeight = firstAns.scrollHeight + 'px';
    }
  }
}

/* ==========================================================================
   10. Cart & Consultation Estimator
   ========================================================================== */
function initCartPage() {
  const cartTable = document.querySelector('.cart-table');
  if (!cartTable) return;

  const totalEl = document.getElementById('cartTotalSummary');
  const subtotalEl = document.getElementById('cartSubtotalSummary');
  const countEl = document.getElementById('cartItemCount');
  const emptyWrap = document.getElementById('cartEmptyState');
  const layoutWrap = document.querySelector('.cart-layout');
  const waBtn = document.getElementById('btnCheckoutWA');
  const carInput = document.getElementById('consultCarModel');

  function formatIDR(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  }

  function updateTotals() {
    const rows = cartTable.querySelectorAll('tbody tr[data-price]');
    let subtotal = 0;
    let itemCount = 0;

    rows.forEach(row => {
      const price = parseFloat(row.getAttribute('data-price')) || 0;
      const qtyInput = row.querySelector('.qty-input');
      const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
      const rowSubtotal = price * qty;
      const subtotalEl = row.querySelector('.row-subtotal');
      if (subtotalEl) {
        subtotalEl.textContent = formatIDR(rowSubtotal);
      }
      subtotal += rowSubtotal;
      itemCount += qty;
    });

    if (subtotalEl) subtotalEl.textContent = formatIDR(subtotal);
    if (totalEl) totalEl.textContent = formatIDR(subtotal);
    if (countEl) countEl.textContent = `${itemCount} Item`;

    if (rows.length === 0) {
      if (layoutWrap) layoutWrap.style.display = 'none';
      if (emptyWrap) emptyWrap.style.display = 'block';
    }
  }

  // Handle Qty & Remove buttons
  cartTable.addEventListener('click', (e) => {
    const incBtn = e.target.closest('.qty-inc');
    const decBtn = e.target.closest('.qty-dec');
    const delBtn = e.target.closest('.cart-del-btn');

    if (incBtn) {
      const row = incBtn.closest('tr');
      const input = row.querySelector('.qty-input');
      if (input) {
        input.value = (parseInt(input.value, 10) || 1) + 1;
        updateTotals();
      }
    } else if (decBtn) {
      const row = decBtn.closest('tr');
      const input = row.querySelector('.qty-input');
      if (input) {
        const val = parseInt(input.value, 10) || 1;
        if (val > 1) {
          input.value = val - 1;
          updateTotals();
        }
      }
    } else if (delBtn) {
      const row = delBtn.closest('tr');
      if (row) {
        row.style.opacity = '0';
        row.style.transform = 'translateX(20px)';
        row.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          row.remove();
          updateTotals();
        }, 300);
      }
    }
  });

  // Direct WhatsApp Checkout
  if (waBtn) {
    waBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const rows = cartTable.querySelectorAll('tbody tr[data-price]');
      if (!rows.length) return;

      const car = carInput && carInput.value.trim() ? carInput.value.trim() : 'Belum diisi';
      let message = `Halo VELOCE, saya ingin konsultasi fitment dan memesan item berikut:%0A%0A`;
      message += `*Mobil / Model:* ${encodeURIComponent(car)}%0A%0A`;
      message += `*Daftar Produk:*%0A`;

      rows.forEach((row, idx) => {
        const nameEl = row.querySelector('.cart-product-name');
        const qtyInput = row.querySelector('.qty-input');
        const name = nameEl ? nameEl.textContent.trim() : 'Produk';
        const qty = qtyInput ? qtyInput.value : '1';
        const price = row.getAttribute('data-price') || '0';
        message += `${idx + 1}. ${encodeURIComponent(name)} (${qty}x) - ${encodeURIComponent(formatIDR(price * qty))}%0A`;
      });

      if (totalEl) {
        message += `%0A*Estimasi Total:* ${encodeURIComponent(totalEl.textContent)}%0A%0AMohon konfirmasi ketersediaan stok & fitment untuk mobil saya. Terima kasih!`;
      }

      window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
    });
  }

  // Initial calculation
  updateTotals();
}

