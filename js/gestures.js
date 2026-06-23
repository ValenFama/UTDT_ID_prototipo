// ── Geometry helpers ─────────────────────────────────────────────────────────
function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// ── Gesture recognizers ──────────────────────────────────────────────────────
function isPeaceSign(lm) {
  const indexUp   = lm[8].y  < lm[6].y;
  const middleUp  = lm[12].y < lm[10].y;
  const ringDown  = lm[16].y > lm[14].y;
  const pinkyDown = lm[20].y > lm[18].y;
  return indexUp && middleUp && ringDown && pinkyDown;
}

function isOpenHand(lm) {
  return [8, 12, 16, 20].every(i => lm[i].y < lm[i - 2].y);
}

// ── HUD draw ──────────────────────────────────────────────────────────────────
// hands[0] = cursor (mano de movimiento) — dibuja solo la punta del índice
// hands[1] = click  (mano de acción)     — dibuja pulgar + índice + línea de pinch
function drawHud(hands) {
  const W = hud.width, H = hud.height;
  hudCtx.clearRect(0, 0, W, H);
  if (!hands || hands.length === 0) return;

  // Mano cursor: punto verde en la punta del índice
  const lm0 = hands[0];
  hudCtx.beginPath();
  hudCtx.arc((1 - lm0[8].x) * W, lm0[8].y * H, 7, 0, Math.PI * 2);
  hudCtx.fillStyle = '#1D9E75';
  hudCtx.globalAlpha = 0.85;
  hudCtx.fill();
  hudCtx.globalAlpha = 1;

  // Mano click: pulgar (azul) + índice (naranja) + línea de pinch
  if (hands.length >= 2) {
    const lm1 = hands[1];
    const dots = [{ i: 4, color: '#378ADD' }, { i: 8, color: '#E0783A' }];
    dots.forEach(({ i, color }) => {
      hudCtx.beginPath();
      hudCtx.arc((1 - lm1[i].x) * W, lm1[i].y * H, pinching ? 10 : 6, 0, Math.PI * 2);
      hudCtx.fillStyle = color;
      hudCtx.globalAlpha = 0.85;
      hudCtx.fill();
      hudCtx.globalAlpha = 1;
    });

    if (pinching) {
      hudCtx.beginPath();
      hudCtx.moveTo((1 - lm1[4].x) * W, lm1[4].y * H);
      hudCtx.lineTo((1 - lm1[8].x) * W, lm1[8].y * H);
      hudCtx.strokeStyle = 'rgba(255,200,50,0.7)';
      hudCtx.lineWidth = 2.5;
      hudCtx.stroke();
    }
  }
}
