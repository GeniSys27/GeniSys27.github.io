const printButton = document.getElementById('print-poster');
printButton?.addEventListener('click', () => {
  window.print();
});

const header = document.querySelector('.site-header');
if (header && 'ResizeObserver' in window) {
  const headerSize = new ResizeObserver(() => {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
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
  const updateNavigation = () => {
    updatePending = false;
    const readingLine = (header?.getBoundingClientRect().bottom ?? 0) + 60;
    const current = sections.find(section => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= readingLine && bounds.bottom > readingLine;
    })?.id;
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
