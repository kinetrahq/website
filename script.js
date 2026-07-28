/* script.js
   Handles:
   - IntersectionObserver reveal animations for cards and timeline
   - Subtle mouse parallax effect in hero area
   - Simple progressive enhancement and accessibility considerations
*/

/* Utility: safe query */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ======= Reveal on scroll (cards, timeline items) ======= */
function initRevealOnScroll() {
  const reveals = $$('.reveal').concat($$('.reveal-quiet'));

  if (!('IntersectionObserver' in window) || reveals.length === 0) {
    // If unsupported, reveal all for accessibility
    reveals.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  reveals.forEach(el => observer.observe(el));
}

/* ======= Hero mouse parallax ======= */
function initHeroParallax() {
  const hero = $('#hero-content');
  if (!hero) return;

  // Limits and smoothing
  const movement = 14; // px
  let mouseX = 0, mouseY = 0;
  let rafId = null;

  function onPointerMove(e) {
    const rect = hero.getBoundingClientRect();
    // Normalize -1..1
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseX = Math.max(-1, Math.min(1, x));
    mouseY = Math.max(-1, Math.min(1, y));
    requestTick();
  }

  function requestTick() {
    if (!rafId) rafId = requestAnimationFrame(update);
  }

  function update() {
    rafId = null;
    // small translate & rotate to emulate depth
    const tx = -mouseX * movement;
    const ty = -mouseY * (movement * 0.55);
    const r = mouseX * 1.2;
    hero.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${r}deg)`;
  }

  // Reset when leaving
  function reset() {
    mouseX = 0; mouseY = 0;
    hero.style.transform = '';
  }

  // Pointer vs touch detection
  if (window.PointerEvent) {
    window.addEventListener('pointermove', onPointerMove, {passive:true});
    window.addEventListener('pointerleave', reset);
  } else {
    window.addEventListener('mousemove', onPointerMove, {passive:true});
    window.addEventListener('mouseleave', reset);
  }

  // Respect reduced motion preference
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  function handleReduceMotion() {
    if (media.matches) {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onPointerMove);
      hero.style.transform = '';
    }
  }
  media.addEventListener('change', handleReduceMotion);
  handleReduceMotion();
}

/* ======= Init: run enhancements when DOM is ready ======= */
document.addEventListener('DOMContentLoaded', () => {
  initRevealOnScroll();
  initHeroParallax();

  // Improve reduced-motion behavior: short-circuit animations if user prefers reduced motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduced-motion');
  }

  // Accessibility: ensure tab focus order for cards is clear
  const cards = $$('.card');
  cards.forEach((card, i) => {
    // ensure only meaningful interactive elements are tab-able; card itself has tabindex for keyboard users
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (ev) => {
      // Enter or Space can open mailto as a gentle CTA for this prototype
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        window.location.href = 'mailto:hello@gokinetra.com';
      }
    });
  });
});
