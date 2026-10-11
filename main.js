// Animaciones al hacer scroll
const elements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  elements.forEach((element) => observer.observe(element));
} else {
  elements.forEach((element) => element.classList.add('visible'));
}

// Menú móvil
const toggle = document.getElementById('menuToggle');
const links = document.getElementById('navLinks');

if (toggle && links) {
  const setMenu = (opened) => {
    links.classList.toggle('open', opened);
    toggle.setAttribute('aria-expanded', String(opened));
    toggle.setAttribute('aria-label', opened ? 'Cerrar menú' : 'Abrir menú');
    toggle.firstElementChild.textContent = opened ? '✕' : '☰';
  };

  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
}

// Navbar al desplazarse
const navbar = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 20
    ? 'rgba(145,118,110,.98)'
    : 'rgba(145,118,110,.94)';
}, { passive: true });

// Consentimiento de cookies
// Guarda la elección en localStorage (almacenamiento técnico necesario).
// Si en el futuro se añaden estadísticas, cargarlas solo cuando consent.analytics sea true.
const CONSENT_KEY = 'ulef-consent';
const CONSENT_VERSION = 1;
const banner = document.getElementById('cookieBanner');

const readConsent = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CONSENT_KEY));
    return saved && saved.version === CONSENT_VERSION ? saved : null;
  } catch (error) {
    return null;
  }
};

const saveConsent = (analytics) => {
  const consent = { version: CONSENT_VERSION, analytics, date: new Date().toISOString() };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); } catch (error) { /* modo privado */ }
  window.ulefConsent = consent;
  document.dispatchEvent(new CustomEvent('ulef:consent', { detail: consent }));
};

if (banner) {
  const options = document.getElementById('cookieOptions');
  const analyticsBox = document.getElementById('cookieAnalytics');
  const button = (name) => banner.querySelector(`[data-cookie="${name}"]`);

  const openBanner = (showOptions) => {
    const current = readConsent();
    analyticsBox.checked = Boolean(current && current.analytics);
    options.hidden = !showOptions;
    button('settings').hidden = showOptions;
    button('save').hidden = !showOptions;
    banner.hidden = false;
  };

  const closeBanner = (analytics) => {
    saveConsent(analytics);
    banner.hidden = true;
  };

  button('accept').addEventListener('click', () => closeBanner(true));
  button('reject').addEventListener('click', () => closeBanner(false));
  button('save').addEventListener('click', () => closeBanner(analyticsBox.checked));
  button('settings').addEventListener('click', () => openBanner(true));

  document.querySelectorAll('[data-cookie-settings]').forEach((link) => {
    link.addEventListener('click', () => openBanner(true));
  });

  const current = readConsent();
  if (current) {
    window.ulefConsent = current;
  } else {
    openBanner(false);
  }
}
