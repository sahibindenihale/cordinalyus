const state = { segment: 'all' };
const grid = document.getElementById('carsGrid');
const resultCount = document.getElementById('resultCount');
const searchInput = document.getElementById('searchInput');
const bodyFilter = document.getElementById('bodyFilter');
const priceFilter = document.getElementById('priceFilter');
const resetBtn = document.getElementById('resetFilters');

function waLinkForCar(carName) {
  const msg = `${SITE_CONFIG.whatsappMessage} Araç: ${carName}`;
  return `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${encodeURIComponent(msg)}`;
}

function applyConfig() {
  document.title = `${SITE_CONFIG.companyName} | Araç Kiralama`;
  document.querySelectorAll('[data-company-name]').forEach(el => el.textContent = SITE_CONFIG.companyName);
  document.querySelectorAll('[data-phone-display]').forEach(el => el.textContent = SITE_CONFIG.phoneDisplay);
  document.querySelectorAll('[data-working-hours]').forEach(el => el.textContent = SITE_CONFIG.workingHours);
  document.querySelectorAll('[data-phone-link]').forEach(el => el.href = `tel:+${SITE_CONFIG.phoneRaw}`);
  document.querySelectorAll('[data-wa-link]').forEach(el => {
    el.href = `https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`;
  });
}

function segmentLabel(segment) {
  return segment === 'luks' ? 'Lüks' : segment === 'ortasegment' ? 'Orta Segment' : 'Ekonomik';
}

function bodyLabel(body) {
  return body === 'suv' ? 'SUV' : body === 'panelvan' ? 'Panelvan' : body === 'hatchback' ? 'Hatchback' : 'Sedan';
}

function getFilteredCars() {
  const q = searchInput.value.trim().toLowerCase();
  const body = bodyFilter.value;
  const priceVal = priceFilter.value;
  const [min, max] = priceVal === 'all' ? [0, Infinity] : priceVal.split('-').map(Number);

  return [...window.CARS]
    .sort((a, b) => a.price - b.price)
    .filter(car => {
      const matchText = !q || car.name.toLowerCase().includes(q);
      const matchBody = body === 'all' || car.body === body;
      const matchSegment = state.segment === 'all' || car.segment === state.segment;
      const matchPrice = car.price >= min && car.price <= max;
      return matchText && matchBody && matchSegment && matchPrice;
    });
}

function renderCars() {
  const cars = getFilteredCars();
  resultCount.textContent = `${cars.length} araç listeleniyor`;

  grid.innerHTML = cars.map(car => `
    <article class="card card-bayram">
      <div class="card-inner">
        <div class="card-media">
          <div class="promo-badges" aria-label="Kampanya bilgisi">
            <span class="promo-badge promo-left">Sınırsız Km</span>
            <span class="promo-badge promo-right">Avis</span>
          </div>
          <img class="car-photo" src="${car.image}" alt="${car.name}" loading="lazy" decoding="async">
        </div>

        <div class="price-row">
          <div class="price">${car.price.toLocaleString('tr-TR')} TL <small>Günlük kiralama</small></div>
          <div class="pill">Depozito ${car.deposit.toLocaleString('tr-TR')} TL</div>
        </div>

        <h3 class="card-title">${car.name}</h3>
        <div class="meta-pills">
          <span class="pill">${segmentLabel(car.segment)}</span>
          <span class="pill">${bodyLabel(car.body)}</span>
          <span class="pill">${car.year} Model</span>
        </div>

        <div class="specs">
          <div class="spec"><strong>Yakıt Türü</strong><span>${car.fuel}</span></div>
          <div class="spec"><strong>Vites</strong><span>${car.transmission}</span></div>
        </div>

        <div class="features-box">
          <div class="features-title">Özellikler</div>
          <div class="features">
            ${car.features.map(f => `<span class="feature">${f}</span>`).join('')}
          </div>
        </div>

        <div class="cta-row">
          <a class="btn btn-primary" href="tel:+${SITE_CONFIG.phoneRaw}">Hemen Ara</a>
          <a class="btn btn-outline" href="${waLinkForCar(car.name)}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </article>
  `).join('');
}

document.getElementById('segmentChips').addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(btn => btn.classList.remove('active'));
  chip.classList.add('active');
  state.segment = chip.dataset.segment;
  renderCars();
});

[searchInput, bodyFilter, priceFilter].forEach(el => el.addEventListener('input', renderCars));
[bodyFilter, priceFilter].forEach(el => el.addEventListener('change', renderCars));
resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  bodyFilter.value = 'all';
  priceFilter.value = 'all';
  state.segment = 'all';
  document.querySelectorAll('.chip').forEach(btn => btn.classList.toggle('active', btn.dataset.segment === 'all'));
  renderCars();
});

applyConfig();
renderCars();


window.addEventListener('load', () => {
  const videos = document.querySelectorAll('video[autoplay]');
  videos.forEach(video => {
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) tryPlay();
          else video.pause();
        });
      }, { threshold: 0.15 });
      observer.observe(video);
    }
  });
});
