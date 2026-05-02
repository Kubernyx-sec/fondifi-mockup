// FONDiFi mockup v3 — interaction layer (theme, reveal, hamburger, ROI calc)
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

  // ---- Hamburger / mobile menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  function closeMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    mobileMenu.setAttribute('hidden', '');
    document.body.classList.remove('menu-open');
  }
  function openMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    mobileMenu.removeAttribute('hidden');
    document.body.classList.add('menu-open');
  }
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu(); else openMenu();
    });
    // Close menu on any link click inside
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    // Close on resize back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeMenu();
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ---- ROI calculator ----
  const fmtUSD = (n) => n.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  });
  const doors = document.getElementById('doors');
  const doorsVal = document.getElementById('doorsVal');
  const modAmt = document.getElementById('modAmt');
  const fondAmt = document.getElementById('fondAmt');
  const saveAmt = document.getElementById('saveAmt');
  const savePct = document.getElementById('savePct');
  const MOD_MONTHLY = 1988; // MyOutDesk avg per VA per month

  function recalc() {
    if (!doors) return;
    const d = parseInt(doors.value, 10) || 0;
    const fond = d * 5;
    const save = MOD_MONTHLY - fond;
    const pct = Math.round((save / MOD_MONTHLY) * 100);
    if (doorsVal) doorsVal.textContent = d.toLocaleString('en-US');
    if (modAmt) modAmt.textContent = fmtUSD(MOD_MONTHLY);
    if (fondAmt) fondAmt.textContent = fmtUSD(fond);
    if (saveAmt) {
      if (save >= 0) {
        saveAmt.textContent = fmtUSD(save);
        if (savePct) savePct.textContent = pct + '% lower per month';
      } else {
        saveAmt.textContent = fmtUSD(Math.abs(save));
        if (savePct) savePct.textContent = 'higher than MyOutDesk at this scale';
      }
    }
  }
  if (doors) {
    doors.addEventListener('input', recalc);
    recalc();
  }

  // ---- Reveal on scroll ----
  const targets = document.querySelectorAll(
    '.section-head, .service-card, .member, .plan, .process__steps li, .trust-card, .checklist, .why-card, .compare-table, .roi'
  );
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
