/* Per-ticket prices match the fixed amounts on the branded Razorpay pages. */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  const heroVideo = document.querySelector('.rr-hero-video video');
  const soundButton = document.querySelector('.rr-video-unmute');
  const soundNote = document.querySelector('.rr-video-sound-note');

  if (heroVideo) {
    // Sound is unmuted by default
    heroVideo.muted = false;
    heroVideo.volume = 1;

    const syncSound = () => {
      const isAudible = !heroVideo.muted && heroVideo.volume > 0;
      if (soundButton) soundButton.hidden = isAudible;
      if (soundNote) {
        soundNote.textContent = isAudible
          ? 'Sound is on. Use player controls to adjust volume.'
          : 'Tap the video or button for sound.';
      }
    };

    heroVideo.addEventListener('volumechange', syncSound);

    const enableSound = () => {
      heroVideo.muted = false;
      heroVideo.volume = 1;
      heroVideo.play().catch(() => {});
      syncSound();
    };

    if (soundButton) {
      soundButton.addEventListener('click', enableSound);
    }
    heroVideo.addEventListener('click', enableSound);

    // Attempt unmuted playback immediately
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        syncSound();
      }).catch(() => {
        // Browser policy restricted unmuted playback before interaction.
        // Start muted, and immediately unmute on first gesture anywhere on the page
        heroVideo.muted = true;
        heroVideo.play().catch(() => {});
        syncSound();

        const onFirstInteraction = () => {
          enableSound();
          ['click', 'touchstart', 'pointerdown', 'scroll', 'keydown'].forEach(evt => {
            window.removeEventListener(evt, onFirstInteraction, { capture: true });
          });
        };

        ['click', 'touchstart', 'pointerdown', 'scroll', 'keydown'].forEach(evt => {
          window.addEventListener(evt, onFirstInteraction, { capture: true, once: true });
        });
      });
    }

    // Ensure video loops smoothly when finished
    heroVideo.addEventListener('ended', () => {
      heroVideo.currentTime = 0;
      heroVideo.play().catch(() => {});
    });
  }

  const config = window.RRPayments;
  if (!config) return;
  const sticky = document.getElementById('rr-sticky');
  const ticketSection = document.getElementById('participate');
  const mobileLayout = matchMedia('(max-width: 767px)');
  const showSticky = () => {
    const bounds = ticketSection?.getBoundingClientRect();
    const viewingTickets = mobileLayout.matches && bounds && bounds.top < innerHeight && bounds.bottom > 0;
    const visible = scrollY >= 500 && !viewingTickets;
    sticky?.classList.toggle('translate-y-full', !visible);
    document.body.classList.toggle('rr-booking-visible', visible);
    if (sticky) sticky.inert = !visible;
  };
  addEventListener('scroll', showSticky, {passive: true});
  addEventListener('resize', showSticky, {passive: true}); showSticky();
  const cards = [...document.querySelectorAll('.rr-pass-card')].map(card => ({
    tier: card.querySelector('h3').textContent.trim().toLowerCase(),
    price: card.querySelector('.rr-pass-price strong, .rr-pass-banner strong'), link: card.querySelector('a')
  })).filter(card => config.passes[card.tier]);
  const money = value => '₹' + (value / 100).toLocaleString('en-IN', {
    minimumFractionDigits: value % 100 ? 2 : 0, maximumFractionDigits: 2
  });
  for (const c of cards) {
    const pass = config.passes[c.tier];
    c.link.href = pass.url;
    const discounted = Math.round(pass.amount * (100 - pass.discountPercent) / 100);
    c.price.innerHTML = pass.discountPercent > 0
      ? '<del class="rr-old-price">' + money(pass.amount) + '</del>' + money(discounted)
      : money(pass.amount);
    c.link.addEventListener('click', event => {
      if (Date.now() / 1000 >= config.eventEnd) event.preventDefault();
    });
  }
  document.querySelectorAll('a').forEach(link => {
    if (link.textContent.trim() === 'Book My Seat' && !link.closest('.rr-pass-card')) link.href = '#participate';
  });
  function render() {
    const now = Date.now() / 1000;
    const closed = now >= config.eventEnd;
    for (const c of cards) {
      c.link.textContent = closed ? 'Bookings closed' : (config.passes[c.tier].discountPercent > 0 ? 'Book with 30% Off' : 'Book ' + config.passes[c.tier].name + ' · ' + money(config.passes[c.tier].amount) + ' →');
      c.link.setAttribute('aria-disabled', String(closed));
    }
  }
  render();
  setInterval(render, 60000);
  document.addEventListener('visibilitychange', render);
});
