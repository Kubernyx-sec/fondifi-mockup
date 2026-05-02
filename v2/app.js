// FONDiFi mockup v2 — minimal interaction layer
(function () {
  document.body.classList.remove('no-js');
  document.body.classList.add('js-ready');

  // ---- Theme toggle (persists) ----
  const root = document.documentElement;
  const stored = localStorage.getItem('fondifi-theme');
  if (stored) root.setAttribute('data-theme', stored);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const cur = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', cur);
      localStorage.setItem('fondifi-theme', cur);
    });
  }

  // ---- Reveal on scroll ----
  const targets = document.querySelectorAll('.section-head, .service-card, .member, .plan, .process__steps li, .trust-card, .checklist');
  targets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(el => el.classList.add('is-visible'));
  }
})();
