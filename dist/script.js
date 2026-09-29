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

const navigation = [...document.querySelectorAll('.section-nav a')];
if (navigation.length && 'IntersectionObserver' in window) {
  const sections = navigation.map(link => document.querySelector(link.hash)).filter(Boolean);
  const home = document.getElementById('home');
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    if (!visible.length) return;
    const current = visible[visible.length - 1].target.id;
    navigation.forEach(link => {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
  [...sections, home].filter(Boolean).forEach(section => observer.observe(section));
}
