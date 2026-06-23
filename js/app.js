// ── Overlay helpers ──────────────────────────────────────────────────────────
const overlay     = document.getElementById('cam-overlay');
const overlayMsg  = document.getElementById('overlay-msg');
const overlayBtn  = document.getElementById('overlay-btn');
const overlayHint = document.getElementById('overlay-hint');

function setOverlay(msg, { btn = false, hint = '', error = false } = {}) {
  overlayMsg.textContent  = msg;
  overlayHint.textContent = hint;
  overlayBtn.style.display = btn ? '' : 'none';
  document.getElementById('overlay-icon').textContent = error ? '🚫' : '📷';
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

// ── Camera + MediaPipe init ──────────────────────────────────────────────────
async function startCamera() {
  overlayBtn.style.display = 'none';
  setOverlay('Esperando permiso de cámara…', {
    hint: 'Cuando el navegador pregunte, hacé clic en "Permitir"'
  });
  setStatus('Iniciando cámara…', '');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    cam.srcObject = stream;
    await cam.play();
    cam.classList.add('ready');

    setTimeout(() => {
      hideOverlay();
      navigateTo('home');
    }, 400);

    const hands = new Hands({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
    });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.75,
      minTrackingConfidence: 0.6
    });
    hands.onResults(onResults);

    const camera = new Camera(cam, {
      onFrame: async () => { await hands.send({ image: cam }); },
      width: 1280,
      height: 720
    });
    camera.start();
    setStatus('Mostrá tu mano', '');

  } catch (e) {
    const denied = e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError';
    setOverlay(
      denied
        ? 'Permiso de cámara denegado'
        : 'No se encontró ninguna cámara',
      {
        btn: true,
        hint: denied
          ? 'Hacé clic en el ícono de cámara en la barra de tu navegador y seleccioná "Permitir siempre"'
          : 'Verificá que tu cámara esté conectada y no esté siendo usada por otra app',
        error: true
      }
    );
    setStatus('Sin acceso a la cámara', 'off');
    navigateTo('home');
  }
}

// ── MediaPipe scripts loader ─────────────────────────────────────────────────
let libsLoaded = 0;

function libReady() {
  libsLoaded++;
  if (libsLoaded >= 3) {
    startCamera();
  }
}

setOverlay('Cargando MediaPipe…', { hint: 'Esto tarda unos segundos la primera vez' });

['camera_utils', 'drawing_utils', 'hands'].forEach(name => {
  const s = document.createElement('script');
  s.src = `https://cdn.jsdelivr.net/npm/@mediapipe/${name}/${name}.js`;
  s.crossOrigin = 'anonymous';
  s.onload = libReady;
  s.onerror = () => {
    setOverlay('Error cargando MediaPipe', {
      btn: true,
      hint: 'Verificá tu conexión a internet e intentá de nuevo',
      error: true
    });
  };
  document.head.appendChild(s);
});

overlayBtn.onclick = startCamera;

// Fallback si las libs tardan más de 6s
setTimeout(() => {
  if (libsLoaded < 3) { libsLoaded = 2; libReady(); }
}, 6000);
