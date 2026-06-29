// ── Navegación de pantallas ───────────────────────────────────────────────────
function navigateTo(screen) {
  currentScreen = screen;

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.add('active');

  document.querySelectorAll('.gn-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.screen === screen)
  );

  if (screen === 'gallery') {
    setTimeout(() => panel.classList.add('show'), 80);
  } else {
    panel.classList.remove('show');
  }

  if (screen === 'market') {
    openMarketHome();
    setTimeout(() => marketPanel.classList.add('show'), 80);
  } else {
    marketPanel.classList.remove('show');
  }
}

// ── Grilla de fotos (vista Días) ──────────────────────────────────────────────
function buildPhotosGrid() {
  grid.innerHTML = '';
  PHOTOS.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card' + (p.selectable ? ' selectable' : '');
    card.dataset.index = i;

    const img = document.createElement('img');
    img.src = p.file;
    img.alt = p.date;
    img.loading = 'lazy';

    const dateLabel = document.createElement('div');
    dateLabel.className = 'photo-date';
    dateLabel.textContent = p.date;

    card.appendChild(img);
    card.appendChild(dateLabel);
    grid.appendChild(card);
  });
}

// ── Pantalla de edición ───────────────────────────────────────────────────────
function openEditScreen(photoIndex) {
  currentEditIndex = photoIndex;
  editPhoto.src = PHOTOS[photoIndex].file;
  navigateTo('edit');
}

// ── Popup de borrado ──────────────────────────────────────────────────────────
function openDeletePopup() {
  deletePopup.classList.add('open');
  popupOpen = true;
}

function closeDeletePopup() {
  deletePopup.classList.remove('open');
  popupOpen = false;
}

// ── Mercado: home (categorías) ────────────────────────────────────────────────
function buildMarketCatGrid() {
  const catGrid = document.getElementById('market-cat-grid');
  catGrid.innerHTML = '';
  MARKET_CATEGORIES.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'mkt-cat-card';
    card.dataset.catId = cat.id;

    const wrap = document.createElement('div');
    wrap.className = 'mkt-cat-emoji-wrap';
    wrap.style.background = `linear-gradient(135deg, ${cat.gradient[0]}, ${cat.gradient[1]})`;
    wrap.textContent = cat.emoji;

    const name = document.createElement('div');
    name.className = 'mkt-cat-name';
    name.textContent = cat.name;

    const count = document.createElement('div');
    count.className = 'mkt-cat-items';
    count.textContent = MARKET_ITEMS[cat.id].length + ' recuerdos';

    card.appendChild(wrap);
    card.appendChild(name);
    card.appendChild(count);
    catGrid.appendChild(card);
  });
}

function openMarketHome() {
  currentMarketView = 'home';
  selectedMarketCatId = null;
  document.getElementById('market-view-home').style.display = '';
  document.getElementById('market-view-cat').classList.remove('active');
}

// ── Mercado: vista de categoría ───────────────────────────────────────────────
function openMarketCategory(catId) {
  const cat = MARKET_CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  currentMarketView = 'category';
  selectedMarketCatId = catId;

  document.getElementById('market-view-home').style.display = 'none';
  document.getElementById('market-view-cat').classList.add('active');
  document.getElementById('mkt-cat-name').textContent = cat.name;
  document.getElementById('mkt-cat-count').textContent =
    MARKET_ITEMS[catId].length + ' recuerdos disponibles';

  const itemsGrid = document.getElementById('market-items-grid');
  itemsGrid.innerHTML = '';
  MARKET_ITEMS[catId].forEach(item => {
    const card = document.createElement('div');
    card.className = 'mkt-item-card';
    card.dataset.itemId = item.id;
    card.innerHTML = `
      <div class="mkt-item-emoji">${item.emoji}</div>
      <div class="mkt-item-title">${item.title}</div>
      <div class="mkt-item-subtitle">${item.subtitle}</div>
      <div class="mkt-item-price">$${item.price}</div>
    `;
    itemsGrid.appendChild(card);
  });
}

// ── Animación de sincronización ───────────────────────────────────────────────
function startSyncAnimation(item) {
  syncActive = true;
  const overlay  = document.getElementById('sync-overlay');
  const bar      = document.getElementById('sync-bar');
  const statusEl = document.getElementById('sync-status');

  document.getElementById('sync-emoji').textContent = item.emoji;
  document.getElementById('sync-title').textContent = item.title;
  bar.style.transition = 'none';
  bar.style.width = '0%';
  statusEl.textContent = 'Conectando…';

  overlay.classList.add('open');

  const phases = [
    { delay: 100,  pct: 15, msg: 'Verificando autenticidad…' },
    { delay: 900,  pct: 42, msg: 'Transfiriendo recuerdo…' },
    { delay: 1700, pct: 72, msg: 'Vinculando con tu perfil…' },
    { delay: 2500, pct: 100, msg: '¡Recuerdo adquirido!' },
  ];

  phases.forEach(({ delay, pct, msg }) => {
    setTimeout(() => {
      bar.style.transition = 'width 0.65s cubic-bezier(.4,0,.2,1)';
      bar.style.width = pct + '%';
      statusEl.textContent = msg;
    }, delay);
  });

  setTimeout(() => {
    overlay.classList.remove('open');
    syncActive = false;
    navigateTo('market');
  }, 3900);
}

// ── Tutorial ──────────────────────────────────────────────────────────────────
function showTutorial() {
  if (tutorialActive) return;
  tutorialActive = true;
  updateTutorialState(leftHandDetected, rightHandDetected);
  document.getElementById('tutorial-overlay').classList.add('show');
}

function hideTutorial() {
  if (!tutorialActive) return;
  tutorialActive = false;
  document.getElementById('tutorial-overlay').classList.remove('show');
}

function updateTutorialState(leftDetected, rightDetected) {
  const stepLeft  = document.getElementById('tut-step-left');
  const stepRight = document.getElementById('tut-step-right');
  const badgeLeft  = document.getElementById('tut-badge-left');
  const badgeRight = document.getElementById('tut-badge-right');

  stepLeft.classList.toggle('detected', leftDetected);
  stepRight.classList.toggle('detected', rightDetected);
  badgeLeft.querySelector('span').textContent  = leftDetected  ? '✓ Detectada' : 'Esperando…';
  badgeRight.querySelector('span').textContent = rightDetected ? '✓ Detectada' : 'Esperando…';
}

// ── Buy popup ─────────────────────────────────────────────────────────────────
function openBuyPopup(item) {
  pendingPurchaseItem = item;
  buyPopupOpen = true;
  document.getElementById('buy-item-emoji').textContent = item.emoji;
  document.getElementById('buy-card-msg').textContent   = item.title;
  document.getElementById('buy-card-price').textContent = '$' + item.price;
  document.getElementById('buy-popup').classList.add('open');
}

function closeBuyPopup() {
  buyPopupOpen = false;
  pendingPurchaseItem = null;
  document.getElementById('buy-popup').classList.remove('open');
}

// ── Helpers de UI ─────────────────────────────────────────────────────────────
function showToast(msg, ms = 1600) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
}

function setStatus(msg, dotClass) {
  statusTxt.textContent = msg;
  statusDot.className   = dotClass;
}

function resizeHud() {
  hud.width  = window.innerWidth;
  hud.height = window.innerHeight;
}

// ── Init ──────────────────────────────────────────────────────────────────────
window.addEventListener('resize', resizeHud);
resizeHud();
buildPhotosGrid();
buildMarketCatGrid();

// Tabs de galería: solo "días" es seleccionable
document.querySelectorAll('.nav-tab').forEach(tab => {
  if (tab.dataset.tab !== 'días') tab.classList.add('disabled-tab');
});
