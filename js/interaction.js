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
function getBuyBtnUnderCursor(x, y)    { return hitTest('#buy-actions button', x, y); }
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
  if (hoveredBuyBtn)    { hoveredBuyBtn.classList.remove('hovered');    hoveredBuyBtn    = null; }
  if (hoveredMktFilter) { hoveredMktFilter.classList.remove('hovered'); hoveredMktFilter = null; }
  if (hoveredMktCat)    { hoveredMktCat.classList.remove('hovered');    hoveredMktCat    = null; }
  if (hoveredMktItem)   { hoveredMktItem.classList.remove('hovered');   hoveredMktItem   = null; }
  if (hoveredMktBack)   { hoveredMktBack.classList.remove('hovered');   hoveredMktBack   = null; }
}

// ── updateInteraction (cada frame) ───────────────────────────────────────────
function updateInteraction() {
  // Tutorial activo: bloquear toda interacción
  if (tutorialActive) {
    cursor.style.display = 'none';
    clearHovers();
    return;
  }

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

  // ── Delete popup abierto ──────────────────────────────────────────────────
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
        if (currentEditIndex !== null) {
          PHOTOS.splice(currentEditIndex, 1);
          currentEditIndex = null;
          buildPhotosGrid();
        }
        navigateTo('gallery');
        showToast('Recuerdo eliminado');
      } else {
        closeDeletePopup();
        showToast('Cancelado');
      }
    }
    return;
  }

  // ── Buy popup abierto ─────────────────────────────────────────────────────
  if (buyPopupOpen) {
    const buyBtn = getBuyBtnUnderCursor(handX, handY);
    if (hoveredBuyBtn !== buyBtn) {
      if (hoveredBuyBtn) hoveredBuyBtn.classList.remove('hovered');
      hoveredBuyBtn = buyBtn;
      if (hoveredBuyBtn) hoveredBuyBtn.classList.add('hovered');
    }
    if (pinching && !lastPinch && buyBtn) {
      buyBtn.classList.add('pinched');
      setTimeout(() => buyBtn.classList.remove('pinched'), 250);
      if (buyBtn.id === 'btn-confirm-buy') {
        const itemToSync = pendingPurchaseItem;
        closeBuyPopup();
        if (itemToSync) startSyncAnimation(itemToSync);
      } else {
        closeBuyPopup();
        showToast('Compra cancelada');
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
        if (itemData) openBuyPopup(itemData);
      }
      return;
    }
  }
}

// ── MediaPipe results ─────────────────────────────────────────────────────────
function onResults(results) {
  const landmarks  = results.multiHandLandmarks  || [];
  const handedness = results.multiHandedness     || [];

  // Identificar mano izquierda (click) y derecha (cursor) del usuario
  // MediaPipe: 'Left' = mano izquierda del usuario, 'Right' = mano derecha
  let leftHand  = null;
  let rightHand = null;

  landmarks.forEach((lm, i) => {
    const label = handedness[i]?.label;
    if (label === 'Left')  leftHand  = lm;
    else if (label === 'Right') rightHand = lm;
  });

  leftHandDetected  = leftHand  !== null;
  rightHandDetected = rightHand !== null;

  const bothVisible = leftHandDetected && rightHandDetected;

  // Tutorial: mostrar mientras no estén ambas manos
  if (bothVisible) {
    updateTutorialState(true, true);
    if (tutorialActive) hideTutorial();
  } else {
    if (!tutorialActive) showTutorial();
    updateTutorialState(leftHandDetected, rightHandDetected);
  }

  // Cursor = mano derecha (índice)
  handVisible = rightHandDetected;
  if (rightHand) {
    handX = (1 - rightHand[8].x) * window.innerWidth;
    handY = rightHand[8].y * window.innerHeight;
  }

  // Click = pinch de mano izquierda (umbral reducido)
  pinching = leftHand ? dist(leftHand[4], leftHand[8]) < 0.05 : false;

  // Gesto de paz para volver (cualquier mano)
  if (!popupOpen && !buyPopupOpen && !syncActive && !tutorialActive) {
    const allHands = [leftHand, rightHand].filter(Boolean);
    if (allHands.some(lm => isPeaceSign(lm))) {
      if (currentScreen === 'edit') {
        navigateTo('gallery'); showToast('✌️ Volviendo a galería');
      } else if (currentScreen === 'market' && currentMarketView === 'category') {
        openMarketHome(); showToast('✌️ Volviendo al mercado');
      }
    }
  }

  drawHud(leftHand, rightHand);

  if (tutorialActive) {
    setStatus(
      !rightHandDetected ? 'Mostrá tu mano derecha (cursor)' :
      !leftHandDetected  ? 'Mostrá tu mano izquierda (click)' :
                           'Manos detectadas',
      bothVisible ? 'on' : ''
    );
  } else {
    setStatus(bothVisible ? 'Dos manos listas' : 'Mostrá tus manos', bothVisible ? 'on' : '');
  }

  updateInteraction();
  lastPinch = pinching;
}
