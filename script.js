const printButton = document.getElementById('print-poster');
printButton?.addEventListener('click', () => {
  window.print();
});

// Preserve direct links to the embedded upload form while keeping it compact by default.
const uploadPanel = document.getElementById('poster-upload');
if (uploadPanel instanceof HTMLDetailsElement) {
  const revealUpload = () => {
    if (window.location.hash !== '#poster-upload') return;
    uploadPanel.open = true;
    requestAnimationFrame(() => uploadPanel.scrollIntoView({ block: 'start' }));
  };
  window.addEventListener('hashchange', revealUpload);
  revealUpload();
}

const header = document.querySelector('.site-header');
if (header && 'ResizeObserver' in window) {
  let previousHeight = 0;
  const headerSize = new ResizeObserver(() => {
    const height = header.offsetHeight;
    if (height === previousHeight) return;
    previousHeight = height;
    document.documentElement.style.setProperty('--header-height', `${height}px`);
  });
  headerSize.observe(header);
}

// Observe only local section links; preserve aria-current="page" on standalone pages.
const navigation = [...document.querySelectorAll('.section-nav a')].filter(link =>
  link.getAttribute('href')?.startsWith('#') && link.hash.length > 1
);
if (navigation.length) {
  const sections = navigation.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  let updatePending = false;
  let previousSection;
  const updateNavigation = () => {
    updatePending = false;
    const readingLine = Math.max(0, header?.getBoundingClientRect().bottom ?? 0) + 60;
    const current = sections.find(section => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= readingLine && bounds.bottom > readingLine;
    })?.id;
    if (current === previousSection) return;
    previousSection = current;
    navigation.forEach(link => {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const queueNavigationUpdate = () => {
    if (updatePending) return;
    updatePending = true;
    requestAnimationFrame(updateNavigation);
  };
  window.addEventListener('scroll', queueNavigationUpdate, { passive: true });
  window.addEventListener('resize', queueNavigationUpdate);
  window.addEventListener('load', queueNavigationUpdate);
  updateNavigation();
}
