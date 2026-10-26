/**
 * Ravi & Sowjanya Wedding Invitation
 * Interactive Royal Premium Animations & Functions
 */

// Register GSAP Plugins
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const entryScreen = document.getElementById('entryScreen');
  const openBtn = document.getElementById('openInvitationBtn');
  const mainInvitation = document.getElementById('mainInvitation') || document.getElementById('mainContent') || document.querySelector('main');
  const musicBtn = document.getElementById('musicToggleBtn');
  const bgMusic = document.getElementById('bgMusic') || document.getElementById('weddingAudio');

  let isMusicPlaying = false;
  let isInvitationOpened = false;

  // --- 1. Audio Control ---
  function playAudio() {
    if (!bgMusic) return;
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      musicBtn.classList.add('rp-music--playing');
      musicBtn.querySelector('.rp-music__text').textContent = 'Sound On';
    }).catch(err => {
      console.warn('Autoplay prevented by browser:', err);
      isMusicPlaying = false;
      musicBtn.classList.remove('rp-music--playing');
      musicBtn.querySelector('.rp-music__text').textContent = 'Sound Off';
    });
  }

  function pauseAudio() {
    if (!bgMusic) return;
    bgMusic.pause();
    isMusicPlaying = false;
    musicBtn.classList.remove('rp-music--playing');
    musicBtn.querySelector('.rp-music__text').textContent = 'Sound Off';
  }

  musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  // --- 2. Initial Entry Screen Animation (GSAP) ---
  if (typeof gsap !== 'undefined') {
    const entryTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    entryTl
      .from('.rp-entry__glow', { scale: 0.6, opacity: 0, duration: 0.8 }, 0)
      .from('.rp-entry__mandala', { scale: 0.8, opacity: 0, rotate: -15, duration: 0.6 }, 0.05)
      .from('.rp-entry__top-icon', { y: -10, opacity: 0, duration: 0.45 }, 0.1)
      .from('.rp-entry__title', { y: 10, opacity: 0, duration: 0.45 }, 0.15)
      .from('.rp-entry__names', { scale: 0.92, opacity: 0, duration: 0.55 }, 0.2)
      .from('.rp-entry__ornament', { scaleX: 0.7, opacity: 0, duration: 0.45 }, 0.25)
      .from('.rp-entry__cta', { scale: 0.9, opacity: 0, duration: 0.45, ease: 'back.out(1.5)' }, 0.3);

    // Idle breathing rotation of mandala
    gsap.to('.rp-entry__mandala', { rotate: 8, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  // Ensure CTA button is always visible even if GSAP is interrupted or delayed
  setTimeout(() => {
    if (openBtn) {
      openBtn.style.opacity = '1';
      openBtn.style.visibility = 'visible';
    }
  }, 350);

  // --- 3. Confetti Celebratory Burst ---
  function fireConfetti() {
    if (typeof confetti === 'function') {
      const colors = ['#d9a34b', '#fff4da', '#f5d99d', '#cc9448', '#ffffff'];
      confetti({
        particleCount: 100,
        spread: 90,
        startVelocity: 42,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        shapes: ['circle'],
        gravity: 0.6,
        scalar: 1.1,
        ticks: 120,
        zIndex: 200
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          startVelocity: 35,
          origin: { x: 0.25, y: 0.55 },
          colors: colors,
          shapes: ['circle'],
          gravity: 0.7,
          scalar: 0.9,
          ticks: 100,
          zIndex: 200
        });
      }, 120);
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          startVelocity: 35,
          origin: { x: 0.75, y: 0.55 },
          colors: colors,
          shapes: ['circle'],
          gravity: 0.7,
          scalar: 0.9,
          ticks: 100,
          zIndex: 200
        });
      }, 180);
    }
  }

  // --- 4. Open Invitation Transition ---
  openBtn.addEventListener('click', () => {
    if (isInvitationOpened) return;
    isInvitationOpened = true;

    playAudio();

    if (typeof gsap !== 'undefined') {
      const exitTl = gsap.timeline({
        onComplete: () => {
          entryScreen.style.display = 'none';
          initScrollAnimations();
        }
      });

      exitTl
        .to('.rp-entry__cta', { scale: 0.92, duration: 0.1, ease: 'power2.in' })
        .to('.rp-entry__cta', { scale: 1.1, opacity: 0, duration: 0.2, ease: 'power2.out' })
        .to('.rp-entry__content', { scale: 1.05, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.1)
        .call(fireConfetti, [], 0.15)
        .to('.rp-entry__flash', { opacity: 1, duration: 0.25, ease: 'power2.in' }, 0.2)
        .call(() => {
          if (mainInvitation) {
            mainInvitation.style.display = 'block';
            mainInvitation.style.opacity = '1';
          }
        }, [], 0.35)
        .to(entryScreen, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0.35);
    } else {
      fireConfetti();
      entryScreen.style.opacity = '0';
      setTimeout(() => {
        entryScreen.style.display = 'none';
        mainInvitation.style.display = 'block';
        mainInvitation.style.opacity = '1';
      }, 500);
    }
  });

  // --- 5. GSAP ScrollTrigger Animations ---
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.refresh();

    // Hero Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    heroTl
      .from('.rp-hero__photo', { scale: 1.08, duration: 1.2, ease: 'power2.out' }, 0)
      .from('.rp-hero__ganesha, .rp-hero__emblem', { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' }, 0.1)
      .from('.rp-hero__label', { y: 12, opacity: 0, duration: 0.4 }, 0.2)
      .from('.rp-hero__names', { y: 24, opacity: 0, scale: 0.95, duration: 0.6, ease: 'back.out(1.4)' }, 0.25)
      .from('.rp-hero__chip', { scale: 0.85, opacity: 0, duration: 0.4, ease: 'back.out(1.4)' }, 0.35)
      .from('.rp-hero__welcome', { y: 12, opacity: 0, duration: 0.45 }, 0.4)
      .from('.rp-hero__ornament, .rp-hero__scroll', { y: 12, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.45);

    // Hero Parallax on Scroll
    gsap.to('.rp-hero__photo', {
      yPercent: 20,
      scale: 1.08,
      scrollTrigger: { trigger: '.rp-hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
      ease: 'none'
    });
    gsap.to('.rp-hero__content', {
      y: -60,
      opacity: 0.3,
      scrollTrigger: { trigger: '.rp-hero', start: '30% top', end: 'bottom top', scrub: 1 },
      ease: 'none'
    });
    gsap.to('.rp-hero__mandala-bg', {
      rotate: 30,
      scrollTrigger: { trigger: '.rp-hero', start: 'top top', end: 'bottom top', scrub: 2 },
      ease: 'none'
    });

    // Couple Section
    gsap.from('.rp-couple__heading', {
      scrollTrigger: { trigger: '.rp-couple', start: 'top 84%' },
      y: 30, opacity: 0, scale: 0.92, duration: 0.9, ease: 'power3.out'
    });
    gsap.from('.rp-couple__sub', {
      scrollTrigger: { trigger: '.rp-couple', start: 'top 80%' },
      y: 18, opacity: 0, duration: 0.7, delay: 0.15
    });
    const coupleCards = document.querySelectorAll('.rp-couple__card');
    if (coupleCards[0]) {
      gsap.from(coupleCards[0], {
        scrollTrigger: { trigger: coupleCards[0], start: 'top 88%' },
        x: -50, opacity: 0, duration: 0.9, ease: 'power3.out'
      });
    }
    if (coupleCards[1]) {
      gsap.from(coupleCards[1], {
        scrollTrigger: { trigger: coupleCards[1], start: 'top 88%' },
        x: 50, opacity: 0, duration: 0.9, ease: 'power3.out'
      });
    }

    // Celebration Schedule Cards (Staggered Entrance)
    gsap.from('.rp-events__title, .rp-events__subtitle', {
      scrollTrigger: { trigger: '.rp-events', start: 'top 85%' },
      y: 28, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out'
    });
    document.querySelectorAll('.rp-events__card').forEach((card, idx) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 92%' },
        y: 35,
        opacity: 0,
        duration: 0.8,
        delay: 0.08 * (idx % 4),
        ease: 'power3.out'
      });
    });
    document.querySelectorAll('.rp-events__icon-wrap').forEach(icon => {
      gsap.from(icon, {
        scrollTrigger: { trigger: icon, start: 'top 92%' },
        scale: 0,
        rotation: -180,
        duration: 0.7,
        ease: 'back.out(1.8)'
      });
    });

    // Countdown Section
    gsap.from('.rp-countdown__title, .rp-countdown__subtitle', {
      scrollTrigger: { trigger: '.rp-countdown', start: 'top 88%' },
      y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out'
    });
    gsap.from('.rp-countdown__cell', {
      scrollTrigger: { trigger: '.rp-countdown', start: 'top 88%' },
      y: 40, opacity: 0, duration: 0.85, stagger: 0.1, ease: 'back.out(1.7)'
    });

    // Gallery Items
    gsap.from('.rp-gallery__title, .rp-gallery__subtitle', {
      scrollTrigger: { trigger: '.rp-gallery', start: 'top 84%' },
      y: 28, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out'
    });
    document.querySelectorAll('.rp-gallery__item').forEach((item, idx) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 92%' },
        scale: 0.8,
        opacity: 0,
        y: 30,
        duration: 0.7,
        delay: 0.06 * (idx % 4),
        ease: 'power3.out'
      });
    });

    // Venue & Travel Section
    gsap.from('.rp-venue__title, .rp-venue__subtitle', {
      scrollTrigger: { trigger: '.rp-venue', start: 'top 85%' },
      y: 28, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out'
    });
    gsap.from('.rp-venue__event-card', {
      scrollTrigger: { trigger: '.rp-venue__event-cards', start: 'top 90%' },
      scale: 0.85, y: 16, opacity: 0, stagger: 0.1, duration: 0.65, ease: 'back.out(1.4)'
    });
    gsap.from('.rp-venue__card', {
      scrollTrigger: { trigger: '.rp-venue__card', start: 'top 90%' },
      y: 40, opacity: 0, scale: 0.96, duration: 0.9, ease: 'power3.out'
    });

    // Share Section
    gsap.from('.rp-share__title', {
      scrollTrigger: { trigger: '.rp-share', start: 'top 95%' },
      y: 24, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
    gsap.from('.rp-share__subtitle', {
      scrollTrigger: { trigger: '.rp-share', start: 'top 95%' },
      y: 18, opacity: 0, duration: 0.7, delay: 0.12
    });
    gsap.from('.rp-share .rp-divider', {
      scrollTrigger: { trigger: '.rp-share', start: 'top 95%' },
      scaleX: 0, opacity: 0, duration: 0.9, delay: 0.18, ease: 'power2.out'
    });
    gsap.from('.rp-share__btn', {
      scrollTrigger: { trigger: '.rp-share', start: 'top 95%' },
      y: 16, duration: 0.6, stagger: 0.08, ease: 'power2.out'
    });

    // Footer
    gsap.from('.rp-footer__content > *', {
      scrollTrigger: { trigger: '.rp-footer', start: 'top 84%' },
      y: 25, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out'
    });
  }

  // --- 6. Live Muhurat Countdown Timer ---
  // Target: Thursday, August 27, 2026, 11:40 PM IST
  // Target: Thursday, 5th November 2026, 9:54 PM IST
  const targetDate = new Date('2026-11-05T21:54:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.querySelector('.rp-countdown__value--days').textContent = '00';
      document.querySelector('.rp-countdown__value--hours').textContent = '00';
      document.querySelector('.rp-countdown__value--minutes').textContent = '00';
      document.querySelector('.rp-countdown__value--seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('cdDays') || document.querySelector('.rp-countdown__value--days') || document.querySelectorAll('.rp-countdown__value')[0];
    const hoursEl = document.getElementById('cdHours') || document.querySelector('.rp-countdown__value--hours') || document.querySelectorAll('.rp-countdown__value')[1];
    const minsEl = document.getElementById('cdMinutes') || document.querySelector('.rp-countdown__value--minutes') || document.querySelectorAll('.rp-countdown__value')[2];
    const secsEl = document.getElementById('cdSeconds') || document.querySelector('.rp-countdown__value--seconds') || document.querySelectorAll('.rp-countdown__value')[3];

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // --- 7. Photo Gallery Lightbox ---
  const galleryItems = document.querySelectorAll('.rp-gallery__item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const galleryImages = Array.from(galleryItems).map(item => item.querySelector('img').src);
  let currentImageIdx = 0;

  function showLightbox(index) {
    currentImageIdx = index;
    lightboxImg.src = galleryImages[currentImageIdx];
    lightbox.style.display = 'flex';
    setTimeout(() => {
      lightbox.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function hideLightbox() {
    lightbox.classList.remove('active');
    setTimeout(() => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => showLightbox(idx));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', hideLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIdx = (currentImageIdx - 1 + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[currentImageIdx];
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIdx = (currentImageIdx + 1) % galleryImages.length;
      lightboxImg.src = galleryImages[currentImageIdx];
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) hideLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') hideLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  // --- 8. Spread The Joy / Share This Invitation ---
  function shareInvitationOnWa() {
    const shareText = "You are warmly invited to celebrate the wedding of Ravi Sri Surya Mani Sankar & Lakshmi Sowjanya on Thursday, 5th November 2026 at Sitarama Community Hall, Mandapeta.\n\nView personal invitation: " + window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
  }

  const shareWaBtn = document.getElementById('shareInviteWaBtn');
  if (shareWaBtn) {
    shareWaBtn.addEventListener('click', shareInvitationOnWa);
  }

  const shareCalBtn = document.getElementById('shareInviteCalBtn');
  if (shareCalBtn) {
    shareCalBtn.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//RoyalWedding//Invitation//EN',
        'BEGIN:VEVENT',
        'DTSTART:20261105T162400Z',
        'DTEND:20261106T000000Z',
        'SUMMARY:Wedding of Ravi & Sowjanya',
        'DESCRIPTION:Join us for the wedding ceremony of Ravi Sri Surya Mani Sankar and Lakshmi Sowjanya on Thursday, 5th November 2026 at 9:54 PM at Sitarama Community Hall, Beside DharmaGundam Cheruvu, Mandapeta.',
        'LOCATION:Sitarama Community Hall, Beside DharmaGundam Cheruvu, Mandapeta, Andhra Pradesh',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'bhanu-prakash-vijaya-lakshmi-wedding.ics';
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

  const shareCopyBtn = document.getElementById('shareInviteCopyBtn');
  if (shareCopyBtn) {
    shareCopyBtn.addEventListener('click', async () => {
      const url = window.location.href;
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      const label = shareCopyBtn.querySelector('.rp-share__label');
      if (label) {
        const originalText = label.textContent;
        label.textContent = 'Copied!';
        setTimeout(() => {
          label.textContent = originalText;
        }, 2000);
      }
    });
  }
});
