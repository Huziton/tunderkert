(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- Intro overlay ---------------- */
  const introOverlay = document.querySelector('.intro-overlay');
  if (introOverlay) {
    const alreadySeen = sessionStorage.getItem('tk-intro-seen');
    if (alreadySeen || prefersReducedMotion) {
      introOverlay.remove();
    } else {
      sessionStorage.setItem('tk-intro-seen', '1');
      window.setTimeout(() => introOverlay.classList.add('is-hidden'), 1200);
      introOverlay.addEventListener('transitionend', () => introOverlay.remove(), { once: true });
    }
  }

  /* ---------------- Sticky header ---------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------- Mobile nav ---------------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    const closeNav = () => {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    };
    const openNav = () => {
      hamburger.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('is-open');
      document.body.classList.add('no-scroll');
    };
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeNav() : openNav();
    });
    mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---------------- Accordion ---------------- */
  document.querySelectorAll('.accordion-item').forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      item.closest('.accordion').querySelectorAll('.accordion-item').forEach((other) => {
        other.setAttribute('data-open', 'false');
        other.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      });
      item.setAttribute('data-open', isOpen ? 'false' : 'true');
      trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });

  /* ---------------- Gallery lightbox ---------------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    let currentIndex = 0;

    const showImage = (index) => {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const img = galleryItems[currentIndex].querySelector('img');
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
    };
    const openLightbox = (index) => {
      showImage(index);
      lightbox.classList.add('is-open');
      document.body.classList.add('no-scroll');
    };
    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index); }
      });
    });

    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', () => showImage(currentIndex - 1));
    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', () => showImage(currentIndex + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    });
  }

  /* ---------------- Fairy custom cursor (desktop only) ---------------- */
  if (isFinePointer && !prefersReducedMotion) {
    document.body.classList.add('has-fairy-cursor');

    const cursor = document.createElement('div');
    cursor.className = 'fairy-cursor';
    cursor.innerHTML = '<svg viewBox="0 0 40 40" width="26" height="26"><use href="#sparkle"/></svg>';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
    let lastDust = 0;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const now = performance.now();
      if (now - lastDust > 90) {
        lastDust = now;
        const dust = document.createElement('span');
        dust.className = 'cursor-dust';
        dust.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        document.body.appendChild(dust);
        requestAnimationFrame(() => {
          dust.style.transition = 'transform 700ms ease-out, opacity 700ms ease-out';
          dust.style.transform = `translate(${mouseX + (Math.random() * 20 - 10)}px, ${mouseY + 16 + Math.random() * 10}px)`;
          dust.style.opacity = '0';
        });
        window.setTimeout(() => dust.remove(), 750);
      }
    }, { passive: true });

    const raf = () => {
      curX += (mouseX - curX) * 0.2;
      curY += (mouseY - curY) * 0.2;
      cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(raf);
    };
    raf();

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
  }

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Contact form (front-end only placeholder) ---------------- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Köszönjük! Hamarosan jelentkezünk. ✓';
      btn.disabled = true;
      contactForm.reset();
      window.setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 4000);
    });
  }
})();
