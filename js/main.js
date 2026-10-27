/**
 * Ravi & Sowjanya Wedding Invitation
 * Interactive Royal Premium Animations & Functions
 */

// Register GSAP Plugins
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
  // Enforce page starts from top
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.body.classList.add('is-entry-active');

  // Elements
  const entryScreen = document.getElementById('entryScreen');
  const openBtn = document.getElementById('openInvitationBtn');
  const mainInvitation = document.getElementById('mainInvitation') || document.getElementById('mainContent') || document.querySelector('main');
  const musicBtn = document.getElementById('musicToggleBtn');
  const bgMusic = document.getElementById('bgMusic') || document.getElementById('weddingAudio');

  let isMusicPlaying = false;
  let isInvitationOpened = false;

  // --- 1. Audio Control with Smooth Fade-In Effect ---
  let fadeAudioInterval = null;

  function updateMusicButtonUI(playing) {
    if (!musicBtn) return;
    const text = musicBtn.querySelector('.rp-music__text');
    if (playing) {
      musicBtn.classList.add('rp-music--playing');
      if (text) text.textContent = 'Sound On';
    } else {
      musicBtn.classList.remove('rp-music--playing');
      if (text) text.textContent = 'Sound Off';
    }
  }

  function fadeInAudio(targetVolume = 0.85, durationMs = 2500) {
    if (!bgMusic) return;
    if (fadeAudioInterval) {
      clearInterval(fadeAudioInterval);
      fadeAudioInterval = null;
    }

    try {
      bgMusic.volume = 0;
    } catch (e) {}

    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isMusicPlaying = true;
        updateMusicButtonUI(true);

        const stepMs = 50;
        const steps = Math.max(1, Math.floor(durationMs / stepMs));
        const volumeStep = targetVolume / steps;

        fadeAudioInterval = setInterval(() => {
          if (!isMusicPlaying || bgMusic.paused) {
            clearInterval(fadeAudioInterval);
            fadeAudioInterval = null;
            return;
          }
          try {
            if (bgMusic.volume + volumeStep >= targetVolume) {
              bgMusic.volume = targetVolume;
              clearInterval(fadeAudioInterval);
              fadeAudioInterval = null;
            } else {
              bgMusic.volume = Math.min(targetVolume, bgMusic.volume + volumeStep);
            }
          } catch (e) {
            clearInterval(fadeAudioInterval);
            fadeAudioInterval = null;
          }
        }, stepMs);
      }).catch(err => {
        console.warn('Autoplay prevented by browser:', err);
        isMusicPlaying = false;
        updateMusicButtonUI(false);
      });
    }
  }

  function fadeOutAudio(durationMs = 400, callback) {
    if (!bgMusic) return;
    if (fadeAudioInterval) {
      clearInterval(fadeAudioInterval);
      fadeAudioInterval = null;
    }

    isMusicPlaying = false;
    updateMusicButtonUI(false);

    const stepMs = 40;
    const steps = Math.max(1, Math.floor(durationMs / stepMs));
    const startVol = bgMusic.volume;
    const volumeStep = startVol / steps;

    fadeAudioInterval = setInterval(() => {
      try {
        if (bgMusic.volume - volumeStep <= 0.05) {
          bgMusic.volume = 0;
          bgMusic.pause();
          clearInterval(fadeAudioInterval);
          fadeAudioInterval = null;
          if (callback) callback();
        } else {
          bgMusic.volume = Math.max(0, bgMusic.volume - volumeStep);
        }
      } catch (e) {
        if (bgMusic) bgMusic.pause();
        clearInterval(fadeAudioInterval);
        fadeAudioInterval = null;
        if (callback) callback();
      }
    }, stepMs);
  }

  function playAudio() {
    fadeInAudio(0.85, 2500);
  }

  function pauseAudio(immediate = false) {
    if (immediate) {
      if (fadeAudioInterval) {
        clearInterval(fadeAudioInterval);
        fadeAudioInterval = null;
      }
      if (bgMusic) {
        bgMusic.pause();
        try { bgMusic.volume = 0; } catch (e) {}
      }
      isMusicPlaying = false;
      updateMusicButtonUI(false);
    } else {
      fadeOutAudio(400);
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (bgMusic && !bgMusic.paused) {
        pauseAudio(false);
      } else {
        const vid = document.getElementById('weddingVideo');
        if (vid && !vid.paused) {
          vid.pause();
        }
        playAudio();
      }
    });
  }

  // --- 2. Initial Entry Screen Animation (GSAP) ---
  if (typeof gsap !== 'undefined') {
    const entryTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    entryTl
      .from('.rp-entry__glow', { scale: 0.6, opacity: 0, duration: 0.8 }, 0)
      .from('.rp-entry__mandala', { scale: 0.88, opacity: 0, y: 14, duration: 0.65 }, 0.05)
      .from('.rp-entry__top-icon', { y: -10, opacity: 0, duration: 0.45 }, 0.1)
      .from('.rp-entry__title', { y: 10, opacity: 0, duration: 0.45 }, 0.15)
      .from('.rp-entry__names', { scale: 0.92, opacity: 0, duration: 0.55 }, 0.2)
      .from('.rp-entry__ornament', { scaleX: 0.7, opacity: 0, duration: 0.45 }, 0.25)
      .from('.rp-entry__cta', { scale: 0.9, opacity: 0, duration: 0.45, ease: 'back.out(1.5)' }, 0.3);

    // Idle gentle floating of emblem
    gsap.to('.rp-entry__mandala', { y: -6, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
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

    // Immediately reset scroll position to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    playAudio();

    if (entryScreen) {
      entryScreen.style.setProperty('pointer-events', 'none', 'important');
    }

    if (typeof gsap !== 'undefined') {
      const exitTl = gsap.timeline({
        onComplete: () => {
          if (entryScreen) {
            entryScreen.classList.add('is-hidden');
            entryScreen.style.setProperty('display', 'none', 'important');
            entryScreen.style.setProperty('pointer-events', 'none', 'important');
          }
          // Enforce starting from the very top section
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          const heroEl = document.querySelector('.rp-hero');
          if (heroEl) {
            heroEl.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
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
          document.body.classList.remove('is-entry-active');
          if (mainInvitation) {
            mainInvitation.style.display = 'block';
            mainInvitation.style.opacity = '1';
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          }
        }, [], 0.35)
        .to(entryScreen, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0.35);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      fireConfetti();
      entryScreen.style.opacity = '0';
      setTimeout(() => {
        document.body.classList.remove('is-entry-active');
        entryScreen.style.display = 'none';
        mainInvitation.style.display = 'block';
        mainInvitation.style.opacity = '1';
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 500);
    }
  });

  // --- 5. GSAP ScrollTrigger Animations ---
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

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
  function getShareUrl() {
    let url = window.location.href;
    if (!url || url.startsWith('file:') || url.includes('localhost') || url.includes('127.0.0.1')) {
      url = 'https://vishnuvamsi02.github.io/Invitation/';
    }
    return url;
  }

  function shareInvitationOnWa(e) {
    if (e) e.preventDefault();
    const shareUrl = getShareUrl();
    const shareText = "You are warmly invited to celebrate the wedding ceremony of Ravi Sri Surya Mani Shankar and Lakshmi Sowjanya on Thursday, 5th November 2026 at Sitarama Community Hall, Mandapeta.\n\nView personal invitation: " + shareUrl;
    const encoded = encodeURIComponent(shareText);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank');
  }

  const shareWaBtn = document.getElementById('shareInviteWaBtn');
  if (shareWaBtn) {
    shareWaBtn.addEventListener('click', shareInvitationOnWa);
  }

  const shareCalBtn = document.getElementById('shareInviteCalBtn');
  if (shareCalBtn) {
    shareCalBtn.addEventListener('click', (e) => {
      if (e) e.preventDefault();

      const googleCalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Ravi+%26+Sowjanya&dates=20261105T162400Z/20261106T000000Z&details=Join+us+for+the+wedding+ceremony+of+Ravi+Sri+Surya+Mani+Shankar+and+Lakshmi+Sowjanya+on+Thursday%2C+5th+November+2026+at+9%3A54+PM+at+Sitarama+Community+Hall%2C+Beside+DharmaGundam+Cheruvu%2C+Mandapeta.&location=Sitarama+Community+Hall%2C+Beside+DharmaGundam+Cheruvu%2C+Mandapeta%2C+Andhra+Pradesh';

      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        window.open(googleCalUrl, '_blank');
        return;
      }

      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//RoyalWedding//Invitation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:wedding-ravi-sowjanya-20261105@myshaadhi',
        'DTSTAMP:20261027T000000Z',
        'DTSTART:20261105T162400Z',
        'DTEND:20261106T000000Z',
        'SUMMARY:Wedding of Ravi & Sowjanya',
        'DESCRIPTION:Join us for the wedding ceremony of Ravi Sri Surya Mani Shankar and Lakshmi Sowjanya on Thursday, 5th November 2026 at 9:54 PM at Sitarama Community Hall, Beside DharmaGundam Cheruvu, Mandapeta.',
        'LOCATION:Sitarama Community Hall, Beside DharmaGundam Cheruvu, Mandapeta, Andhra Pradesh',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      try {
        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', 'ravi-sowjanya-wedding.ics');
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 30000);
      } catch (err) {
        window.open(googleCalUrl, '_blank');
      }
    });
  }

  const shareCopyBtn = document.getElementById('shareInviteCopyBtn');
  if (shareCopyBtn) {
    shareCopyBtn.addEventListener('click', async (e) => {
      if (e) e.preventDefault();
      const url = getShareUrl();
      let copied = false;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
          copied = true;
        }
      } catch (err) {
        copied = false;
      }

      if (!copied) {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = url;
          textarea.style.position = 'fixed';
          textarea.style.top = '-9999px';
          textarea.style.left = '-9999px';
          textarea.setAttribute('readonly', '');
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          textarea.setSelectionRange(0, 99999);
          copied = document.execCommand('copy');
          document.body.removeChild(textarea);
        } catch (err) {
          console.warn('execCommand fallback failed:', err);
        }
      }

      const label = shareCopyBtn.querySelector('.rp-share__label') || shareCopyBtn;
      if (label) {
        const originalText = label.textContent;
        label.textContent = 'Link Copied!';
        setTimeout(() => {
          label.textContent = originalText;
        }, 2500);
      }
    });
  }

  // --- 9. Celebration Video Player ---
  function initVideoPlayer() {
    const video = document.getElementById('weddingVideo');
    if (!video) return;

    const videoFrame = document.getElementById('videoFrame');
    const bigPlayBtn = document.getElementById('videoBigPlayBtn');
    const playPauseCtrl = document.getElementById('videoPlayPauseCtrl');
    const iconPlay = playPauseCtrl?.querySelector('.rp-video__icon-play');
    const iconPause = playPauseCtrl?.querySelector('.rp-video__icon-pause');
    const progressBar = document.getElementById('videoProgressBar');
    const progressFill = document.getElementById('videoProgressFill');
    const timeDisplay = document.getElementById('videoTimeDisplay');
    const muteCtrl = document.getElementById('videoMuteCtrl');
    const iconVol = muteCtrl?.querySelector('.rp-video__icon-vol');
    const iconMute = muteCtrl?.querySelector('.rp-video__icon-mute');
    const fsCtrl = document.getElementById('videoFullscreenCtrl');
    const playDirectBtn = document.getElementById('videoPlayDirectBtn');
    const downloadBtn = document.getElementById('videoDownloadBtn');

    let wasMusicPlayingBeforeVideo = false;
    let isToggling = false;

    function formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function updateVideoPlayState(isPlaying) {
      if (isPlaying) {
        videoFrame?.classList.add('is-playing');
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = 'block';
      } else {
        videoFrame?.classList.remove('is-playing');
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';
      }
    }

    function toggleVideoPlay() {
      if (isToggling) return;
      isToggling = true;
      setTimeout(() => { isToggling = false; }, 350);

      if (video.paused) {
        if (isMusicPlaying) {
          wasMusicPlayingBeforeVideo = true;
          pauseAudio(true);
        }
        const p = video.play();
        if (p !== undefined) {
          p.then(() => {
            updateVideoPlayState(true);
          }).catch(err => {
            console.warn('Video play error, attempting muted playback:', err);
            video.muted = true;
            if (iconVol) iconVol.style.display = 'none';
            if (iconMute) iconMute.style.display = 'block';
            video.play().then(() => {
              updateVideoPlayState(true);
            }).catch(e => console.error('Fallback play error:', e));
          });
        }
      } else {
        video.pause();
        updateVideoPlayState(false);
        if (wasMusicPlayingBeforeVideo) {
          playAudio();
          wasMusicPlayingBeforeVideo = false;
        }
      }
    }

    video.addEventListener('play', () => {
      updateVideoPlayState(true);
      if (isMusicPlaying) {
        wasMusicPlayingBeforeVideo = true;
        pauseAudio(true);
      }
    });

    video.addEventListener('pause', () => {
      updateVideoPlayState(false);
      if (wasMusicPlayingBeforeVideo) {
        playAudio();
        wasMusicPlayingBeforeVideo = false;
      }
    });

    video.addEventListener('ended', () => {
      updateVideoPlayState(false);
      if (wasMusicPlayingBeforeVideo) {
        playAudio();
        wasMusicPlayingBeforeVideo = false;
      }
    });

    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        if (progressFill) progressFill.style.width = percent + '%';
        if (progressBar) progressBar.setAttribute('aria-valuenow', Math.round(percent));
        if (timeDisplay) timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      }
    });

    video.addEventListener('loadedmetadata', () => {
      if (timeDisplay && video.duration) {
        timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
      }
    });

    let controlsHideTimer = null;
    function showControlsTemporarily() {
      if (!videoFrame) return;
      videoFrame.classList.add('show-controls');
      if (controlsHideTimer) clearTimeout(controlsHideTimer);
      controlsHideTimer = setTimeout(() => {
        if (!video.paused) {
          videoFrame.classList.remove('show-controls');
        }
      }, 3500);
    }

    // Unified Click Handler on video frame (handles video, big play button, and frame without double-triggering)
    if (videoFrame) {
      videoFrame.addEventListener('click', (e) => {
        if (e.target.closest('#videoControls')) return;
        e.preventDefault();
        showControlsTemporarily();
        toggleVideoPlay();
      });
    }

    // Bottom Controls Play / Pause
    if (playPauseCtrl) {
      playPauseCtrl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleVideoPlay();
      });
    }

    // Scrubber Progress Bar
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pos = Math.max(0, Math.min(1, clickX / rect.width));
        if (video.duration) {
          video.currentTime = pos * video.duration;
        }
      });
    }

    // Mute / Unmute Toggle
    if (muteCtrl) {
      muteCtrl.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        if (video.muted) {
          if (iconVol) iconVol.style.display = 'none';
          if (iconMute) iconMute.style.display = 'block';
        } else {
          if (iconVol) iconVol.style.display = 'block';
          if (iconMute) iconMute.style.display = 'none';
        }
      });
    }

    // Fullscreen Expansion
    if (fsCtrl) {
      fsCtrl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else if (video.requestFullscreen) {
          video.requestFullscreen().catch(() => {});
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      });
    }

    // Button: "PLAY VIDEO DIRECTLY"
    if (playDirectBtn) {
      playDirectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        videoFrame?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (isMusicPlaying) {
          wasMusicPlayingBeforeVideo = true;
          pauseAudio(true);
        }
        video.muted = false;
        const p = video.play();
        if (p !== undefined) {
          p.then(() => {
            updateVideoPlayState(true);
            if (window.innerWidth <= 768) {
              if (video.requestFullscreen) {
                video.requestFullscreen().catch(() => {});
              } else if (video.webkitEnterFullscreen) {
                video.webkitEnterFullscreen();
              }
            }
          }).catch(() => {
            video.muted = true;
            if (iconVol) iconVol.style.display = 'none';
            if (iconMute) iconMute.style.display = 'block';
            video.play().then(() => {
              updateVideoPlayState(true);
            }).catch(() => {
              window.open('assets/invitation-video.mp4', '_blank');
            });
          });
        }
      });
    }

    // Button: "DOWNLOAD VIDEO" (Enhanced for guaranteed file download across mobile and desktop)
    if (downloadBtn) {
      downloadBtn.addEventListener('click', (e) => {
        const label = downloadBtn.querySelector('.rp-video__download-label') || downloadBtn;
        const origText = 'Download Video';

        if (downloadBtn.dataset.downloading === 'true') {
          return;
        }

        if (window.location.protocol.startsWith('http')) {
          e.preventDefault();
          downloadBtn.dataset.downloading = 'true';
          label.textContent = 'Downloading...';

          fetch('assets/invitation-video.mp4')
            .then(res => {
              if (!res.ok) throw new Error('Download failed');
              return res.blob();
            })
            .then(blob => {
              const blobUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.style.display = 'none';
              a.href = blobUrl;
              a.download = 'Ravi-Sowjanya-Wedding-Invitation.mp4';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(blobUrl), 20000);

              label.textContent = 'Saved to Downloads!';
              setTimeout(() => {
                label.textContent = origText;
                downloadBtn.dataset.downloading = 'false';
              }, 4000);
            })
            .catch(err => {
              console.warn('Blob download fallback:', err);
              downloadBtn.dataset.downloading = 'false';
              label.textContent = 'Opening Video...';
              window.open('assets/invitation-video.mp4', '_blank');
              setTimeout(() => {
                label.textContent = origText;
              }, 3000);
            });
        } else {
          label.textContent = 'Downloading...';
          setTimeout(() => {
            label.textContent = origText;
          }, 3500);
        }
      });
    }
  }

  initVideoPlayer();
});
