(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progress');
  const counter = document.getElementById('counter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const overview = document.getElementById('overview');
  const overviewGrid = document.getElementById('overviewGrid');
  const deck = document.getElementById('deck');
  let current = 0;

  // Scale the fixed 1600x900 canvas to the window.
  function fitDeck() {
    const topbar = document.fullscreenElement ? 0 : 48;
    const scale = Math.min(window.innerWidth / 1600, Math.max(320, window.innerHeight - topbar) / 900);
    document.documentElement.style.setProperty('--fit-scale', scale.toFixed(5));
  }
  fitDeck();
  window.addEventListener('resize', fitDeck);
  document.addEventListener('fullscreenchange', fitDeck);

  function goTo(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
      slide.classList.toggle('before', i < current);
      slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });
    history.replaceState(null, '', `#${slides[current].id}`);
    deck.scrollLeft = 0;
    deck.scrollTop = 0;
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
    counter.textContent = `${current + 1} / ${slides.length}`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => goTo(Number(b.dataset.go))));

  document.addEventListener('keydown', event => {
    if (overview.open && event.key !== 'Escape') return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); goTo(current + 1); }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); goTo(current - 1); }
    if (event.key.toLowerCase() === 'o') overview.showModal();
    if (event.key.toLowerCase() === 'f') toggleFullscreen();
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);

  slides.forEach((slide, index) => {
    const button = document.createElement('button');
    const title = slide.querySelector('h1, h2')?.textContent.replace(/\s+/g, ' ').trim() || '';
    button.innerHTML = `<strong>${String(index + 1).padStart(2, '0')} · ${slide.dataset.title}</strong><span>${title}</span>`;
    button.addEventListener('click', () => { overview.close(); goTo(index); });
    overviewGrid.appendChild(button);
  });
  document.getElementById('overviewBtn').addEventListener('click', () => overview.showModal());
  document.getElementById('closeOverview').addEventListener('click', () => overview.close());
  overview.addEventListener('click', event => { if (event.target === overview) overview.close(); });

  const start = slides.findIndex(slide => `#${slide.id}` === location.hash);
  goTo(start >= 0 ? start : 0);
})();
