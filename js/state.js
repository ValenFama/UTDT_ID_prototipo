// ── DOM refs ──────────────────────────────────────────────────────────────────
const cam           = document.getElementById('cam');
const hud           = document.getElementById('hud');
const hudCtx        = hud.getContext('2d');
const panel         = document.getElementById('panel');
const grid          = document.getElementById('grid');
const cursor        = document.getElementById('cursor');
const statusDot     = document.getElementById('status-dot');
const statusTxt     = document.getElementById('status-txt');
const toast         = document.getElementById('gesture-toast');

// Pantallas
const screenHome    = document.getElementById('screen-home');
const screenGallery = document.getElementById('screen-gallery');
const screenEdit    = document.getElementById('screen-edit');
const marketPanel   = document.getElementById('market-panel');

// Edición
const editPhoto     = document.getElementById('edit-photo');
const btnDelete     = document.getElementById('btn-delete');

// Popup borrado
const deletePopup      = document.getElementById('delete-popup');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');
const btnCancelDelete  = document.getElementById('btn-cancel-delete');

// ── Estado de la app ──────────────────────────────────────────────────────────
let currentScreen = 'home';   // 'home' | 'gallery' | 'edit' | 'market'
let popupOpen     = false;

// Hand tracking
let handX = 0, handY = 0;
let pinching = false, lastPinch = false;
let handVisible = false;

// Hovers por contexto
let hoveredCard      = null;
let hoveredTab       = null;
let hoveredGnBtn     = null;
let hoveredDeleteBtn = null;
let hoveredPopupBtn  = null;

// Hovers mercado
let hoveredMktFilter = null;
let hoveredMktCat    = null;
let hoveredMktItem   = null;
let hoveredMktBack   = null;

// Estado mercado
let currentMarketView   = 'home';   // 'home' | 'category'
let selectedMarketCatId = null;
let syncActive          = false;

let toastTimer  = null;
let currentTab  = 'días';
