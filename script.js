/* Portfolio interactions
   - Scrolled-state on nav
   - Hero reveal on load
   - Section reveal on scroll (IntersectionObserver)
   - Mobile menu toggle
*/

(() => {
  const nav = document.getElementById('nav');
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const heroReveals = document.querySelectorAll('#hero .reveal');
  const sections = document.querySelectorAll('section');
  const projectCards = document.querySelectorAll('.project-card');
  const skillGroups = document.querySelectorAll('.skills-group');
  const certs = document.querySelectorAll('.certs-list li');

  // Nav: toggle scrolled class once user has scrolled past a small threshold.
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hero reveals: stagger via small timeouts (CSS transition handles motion).
  // Doing this in JS instead of pure CSS so it triggers AFTER fonts paint.
  window.addEventListener('load', () => {
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 80 + i * 110);
    });
  });

  // Section reveals on scroll
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    sections.forEach((s) => obs.observe(s));

    // Per-card observer for the projects + skills + certs grids so each
    // reveals only when actually scrolled to (not when its parent does).
    const cardObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            cardObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    [...projectCards, ...skillGroups, ...certs].forEach((c) => cardObs.observe(c));
  } else {
    // Fallback: just show everything.
    sections.forEach((s) => s.classList.add('in-view'));
  }

  // Mobile menu
  const closeMenu = () => {
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  burger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });
  mobileMenu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', closeMenu)
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
})();
