// Mobile nav toggle
const menuBtn = document.getElementById('menuBtn');
const drawer = document.getElementById('mobileDrawer');
if (menuBtn && drawer) {
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.classList.toggle('nav-locked');
  });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    drawer.classList.remove('open');
    document.body.classList.remove('nav-locked');
  }));
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll reveals
const revealEls = document.querySelectorAll('.reveal');
if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('in-view'));
} else if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
}

// Stat count-up
const statEls = document.querySelectorAll('.stat-num[data-target]');
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.target.includes('.') ? 1 : 0;
  const pad = el.dataset.pad === 'true';
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    let display = decimals ? value.toFixed(1) : Math.round(value).toString();
    if (pad && display.length < 2) display = '0' + display;
    el.textContent = display + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
if (prefersReducedMotion) {
  statEls.forEach(el => {
    const decimals = el.dataset.target.includes('.') ? 1 : 0;
    let display = decimals ? parseFloat(el.dataset.target).toFixed(1) : el.dataset.target;
    if (el.dataset.pad === 'true' && display.length < 2) display = '0' + display;
    el.textContent = display + (el.dataset.suffix || '');
  });
} else if (statEls.length) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statEls.forEach(el => statObserver.observe(el));
}
