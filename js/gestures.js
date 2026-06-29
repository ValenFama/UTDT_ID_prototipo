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
// leftHand  = mano izquierda (click)  — pulgar + índice + línea de pinch
// rightHand = mano derecha (cursor)   — punto verde en índice
function drawHud(leftHand, rightHand) {
  const W = hud.width, H = hud.height;
  hudCtx.clearRect(0, 0, W, H);

  // Mano derecha = cursor: punto verde en la punta del índice
  if (rightHand) {
    hudCtx.beginPath();
    hudCtx.arc((1 - rightHand[8].x) * W, rightHand[8].y * H, 7, 0, Math.PI * 2);
    hudCtx.fillStyle = '#1D9E75';
    hudCtx.globalAlpha = 0.85;
    hudCtx.fill();
    hudCtx.globalAlpha = 1;
  }

  // Mano izquierda = click: pulgar (azul) + índice (naranja) + línea de pinch
  if (leftHand) {
    const dots = [{ i: 4, color: '#378ADD' }, { i: 8, color: '#E0783A' }];
    dots.forEach(({ i, color }) => {
      hudCtx.beginPath();
      hudCtx.arc((1 - leftHand[i].x) * W, leftHand[i].y * H, pinching ? 10 : 6, 0, Math.PI * 2);
      hudCtx.fillStyle = color;
      hudCtx.globalAlpha = 0.85;
      hudCtx.fill();
      hudCtx.globalAlpha = 1;
    });

    if (pinching) {
      hudCtx.beginPath();
      hudCtx.moveTo((1 - leftHand[4].x) * W, leftHand[4].y * H);
      hudCtx.lineTo((1 - leftHand[8].x) * W, leftHand[8].y * H);
      hudCtx.strokeStyle = 'rgba(255,200,50,0.7)';
      hudCtx.lineWidth = 2.5;
      hudCtx.stroke();
    }
  }
}
