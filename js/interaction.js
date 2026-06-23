// ── Hit testing ───────────────────────────────────────────────────────────────
function hitTest(selector, x, y) {
  for (const el of document.querySelectorAll(selector)) {
    const r = el.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return el;
  }
  return null;
}

function getPhotoUnderCursor(x, y)     { return hitTest('.photo-card.selectable', x, y); }
function getGnBtnUnderCursor(x, y)     { return hitTest('.gn-btn', x, y); }
function getDeleteBtnUnderCursor(x, y) { return hitTest('#btn-delete', x, y); }
function getPopupBtnUnderCursor(x, y)  { return hitTest('#delete-actions button', x, y); }
function getGalleryTabUnderCursor(x, y){ return hitTest('.nav-tab:not(.disabled-tab)', x, y); }

// Mercado
function getMktFilterUnderCursor(x, y) { return hitTest('.mkt-filter', x, y); }
function getMktCatUnderCursor(x, y)    { return hitTest('.mkt-cat-card', x, y); }
function getMktItemUnderCursor(x, y)   { return hitTest('.mkt-item-card', x, y); }
function getMktBackUnderCursor(x, y)   { return hitTest('#market-back-btn', x, y); }

function clearHovers() {
  if (hoveredCard)      { hoveredCard.classList.remove('hovered');      hoveredCard      = null; }
  if (hoveredTab)       { hoveredTab.classList.remove('hovered');       hoveredTab       = null; }
  if (hoveredGnBtn)     { hoveredGnBtn.classList.remove('hovered');     hoveredGnBtn     = null; }
  if (hoveredDeleteBtn) { hoveredDeleteBtn.classList.remove('hovered'); hoveredDeleteBtn = null; }
  if (hoveredPopupBtn)  { hoveredPopupBtn.classList.remove('hovered');  hoveredPopupBtn  = null; }
  if (hoveredMktFilter) { hoveredMktFilter.classList.remove('hovered'); hoveredMktFilter = null; }
  if (hoveredMktCat)    { hoveredMktCat.classList.remove('hovered');    hoveredMktCat    = null; }
  if (hoveredMktItem)   { hoveredMktItem.classList.remove('hovered');   hoveredMktItem   = null; }
  if (hoveredMktBack)   { hoveredMktBack.classList.remove('hovered');   hoveredMktBack   = null; }
}

// ── updateInteraction (cada frame) ───────────────────────────────────────────
function updateInteraction() {
  if (!handVisible) {
    cursor.style.display = 'none';
    clearHovers();
    return;
  }

  cursor.style.display = 'block';
  cursor.style.left = handX + 'px';
  cursor.style.top  = handY + 'px';
  cursor.classList.toggle('pinching', pinching);

  // ── Sync activo: bloquear toda interacción ────────────────────────────────
  if (syncActive) return;

  // ── Popup abierto: solo botones del popup ─────────────────────────────────
  if (popupOpen) {
    const popBtn = getPopupBtnUnderCursor(handX, handY);
    if (hoveredPopupBtn !== popBtn) {
      if (hoveredPopupBtn) hoveredPopupBtn.classList.remove('hovered');
      hoveredPopupBtn = popBtn;
      if (hoveredPopupBtn) hoveredPopupBtn.classList.add('hovered');
    }
    if (pinching && !lastPinch && popBtn) {
      popBtn.classList.add('pinched');
      setTimeout(() => popBtn.classList.remove('pinched'), 250);
      if (popBtn.id === 'btn-confirm-delete') {
        closeDeletePopup();
        navigateTo('gallery');
        showToast('Recuerdo eliminado');
      } else {
        closeDeletePopup();
        showToast('Cancelado');
      }
    }
    return;
  }

  // ── Nav global (siempre disponible) ──────────────────────────────────────
  const gnBtn = getGnBtnUnderCursor(handX, handY);
  if (hoveredGnBtn !== gnBtn) {
    if (hoveredGnBtn) hoveredGnBtn.classList.remove('hovered');
    hoveredGnBtn = gnBtn;
    if (hoveredGnBtn) hoveredGnBtn.classList.add('hovered');
  }
  if (pinching && !lastPinch && gnBtn) {
    gnBtn.classList.add('pinched');
    setTimeout(() => gnBtn.classList.remove('pinched'), 250);
    const dest = gnBtn.dataset.screen;
    if (dest === 'home' || dest === 'gallery' || dest === 'market') navigateTo(dest);
    return;
  }

  // ── Galería ───────────────────────────────────────────────────────────────
  if (currentScreen === 'gallery') {
    const photo = getPhotoUnderCursor(handX, handY);
    if (hoveredCard !== photo) {
      if (hoveredCard) hoveredCard.classList.remove('hovered');
      hoveredCard = photo;
      if (hoveredCard) hoveredCard.classList.add('hovered');
    }
    if (pinching && !lastPinch && photo) {
      photo.classList.add('pinched');
      setTimeout(() => photo.classList.remove('pinched'), 300);
      openEditScreen(parseInt(photo.dataset.index));
    }
    return;
  }

  // ── Edición ───────────────────────────────────────────────────────────────
  if (currentScreen === 'edit') {
    const delBtn = getDeleteBtnUnderCursor(handX, handY);
    if (hoveredDeleteBtn !== delBtn) {
      if (hoveredDeleteBtn) hoveredDeleteBtn.classList.remove('hovered');
      hoveredDeleteBtn = delBtn;
      if (hoveredDeleteBtn) hoveredDeleteBtn.classList.add('hovered');
    }
    if (pinching && !lastPinch && delBtn) {
      delBtn.classList.add('pinched');
      setTimeout(() => delBtn.classList.remove('pinched'), 250);
      openDeletePopup();
    }
    return;
  }

  // ── Mercado ───────────────────────────────────────────────────────────────
  if (currentScreen === 'market') {

    // Sidebar: filtros (solo visual)
    const mktFilter = getMktFilterUnderCursor(handX, handY);
    if (hoveredMktFilter !== mktFilter) {
      if (hoveredMktFilter) hoveredMktFilter.classList.remove('hovered');
      hoveredMktFilter = mktFilter;
      if (hoveredMktFilter) hoveredMktFilter.classList.add('hovered');
    }
    if (pinching && !lastPinch && mktFilter) {
      document.querySelectorAll('.mkt-filter').forEach(f => f.classList.remove('active'));
      mktFilter.classList.add('active');
      return;
    }

    // Vista home: categorías
    if (currentMarketView === 'home') {
      const cat = getMktCatUnderCursor(handX, handY);
      if (hoveredMktCat !== cat) {
        if (hoveredMktCat) hoveredMktCat.classList.remove('hovered');
        hoveredMktCat = cat;
        if (hoveredMktCat) hoveredMktCat.classList.add('hovered');
      }
      if (pinching && !lastPinch && cat) {
        cat.classList.add('pinched');
        setTimeout(() => cat.classList.remove('pinched'), 300);
        openMarketCategory(cat.dataset.catId);
      }
      return;
    }

    // Vista categoría: botón volver + items
    if (currentMarketView === 'category') {
      const backBtn = getMktBackUnderCursor(handX, handY);
      if (hoveredMktBack !== backBtn) {
        if (hoveredMktBack) hoveredMktBack.classList.remove('hovered');
        hoveredMktBack = backBtn;
        if (hoveredMktBack) hoveredMktBack.classList.add('hovered');
      }
      if (pinching && !lastPinch && backBtn) {
        backBtn.classList.add('pinched');
        setTimeout(() => backBtn.classList.remove('pinched'), 250);
        openMarketHome();
        return;
      }

      const item = getMktItemUnderCursor(handX, handY);
      if (hoveredMktItem !== item) {
        if (hoveredMktItem) hoveredMktItem.classList.remove('hovered');
        hoveredMktItem = item;
        if (hoveredMktItem) hoveredMktItem.classList.add('hovered');
      }
      if (pinching && !lastPinch && item) {
        item.classList.add('pinched');
        setTimeout(() => item.classList.remove('pinched'), 300);
        const itemData = MARKET_ITEMS[selectedMarketCatId]
          .find(i => i.id === item.dataset.itemId);
        if (itemData) startSyncAnimation(itemData);
      }
      return;
    }
  }
}

// ── MediaPipe results ─────────────────────────────────────────────────────────
function onResults(results) {
  const hands = results.multiHandLandmarks || [];

  if (hands.length > 0) {
    handVisible = true;
    const lm0 = hands[0];
    handX = (1 - lm0[8].x) * window.innerWidth;
    handY = lm0[8].y * window.innerHeight;
    pinching = hands.length >= 2 ? dist(hands[1][4], hands[1][8]) < 0.07 : false;

    if (!popupOpen && !syncActive && hands.some(lm => isPeaceSign(lm))) {
      if (currentScreen === 'edit') {
        navigateTo('gallery'); showToast('✌️ Volviendo a galería');
      } else if (currentScreen === 'market' && currentMarketView === 'category') {
        openMarketHome(); showToast('✌️ Volviendo al mercado');
      }
    }

    drawHud(hands);
    setStatus(hands.length >= 2 ? 'Dos manos listas' : 'Mostrá la segunda mano para hacer click', hands.length >= 2 ? 'on' : '');
  } else {
    handVisible = false;
    pinching    = false;
    drawHud([]);
    setStatus('Mostrá tus manos', '');
  }

  updateInteraction();
  lastPinch = pinching;
}
