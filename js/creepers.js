python3 << 'PYEOF'
content = r"""/* ═══════════════════════════════════════════════════
   creepers.js — Creeper tiernito pixel art
   Fiel al diseño chibi: cabeza grande, cuerpo corto,
   patas trapezoidales, cara clásica de Minecraft
   ═══════════════════════════════════════════════════ */

/**
 * Genera el SVG del Creeper tiernito.
 * Cada "pixel" mide `p` píxeles reales.
 * Diseño en rejilla de 18 cols × 30 rows:
 *   rows  0-13  → cabeza cuadrada grande (con bordes redondeados via clip)
 *   rows 14-15  → cuello
 *   rows 16-20  → cuerpo corto
 *   rows 21-29  → dos patas trapezoidales
 */
function makeCreeperSVG(scale = 1) {
  const p = Math.round(scale * 7); // tamaño de un "pixel"

  // ── Paleta ──
  const BG  = 'none';
  const BK  = '#1e1e1e';   // negro borde / ojos / boca
  const G1  = '#4cb84c';   // verde principal (cara, cuerpo)
  const G2  = '#3d9e3d';   // verde medio (sombras leves)
  const G3  = '#2e7a2e';   // verde oscuro (bordes internos)
  const G4  = '#256325';   // verde muy oscuro (contorno exterior)
  const TE  = '#1a7a5e';   // teal (detalle patas)
  const WH  = '#f0f0f0';   // blanco brillo ojos

  // ── Mapa de la CABEZA (14 cols × 14 rows) ──
  // Cada caracter representa un "pixel":
  // ' '=transparente, 'X'=borde exterior, 'D'=verde oscuro,
  // 'G'=verde principal, 'g'=verde medio, 'K'=negro, 'W'=blanco brillo
  const HEAD = [
  //  0123456789abcd
    '  XXXXXXXXXX  ',  // 0  borde top
    ' XGGGGGGGGGGx ',  // 1
    ' XGGGGGGGGGGx ',  // 2  — zona ojos
    ' XGKKKKGKKKKX ',  // 3  ojo izq y der (top)
    ' XGKWKgGKWKGX ',  // 4  brillo blanco
    ' XGKKKKGKKKKX ',  // 5  ojo (bot)
    ' XGGGGGGGGGGX ',  // 6
    ' XGGgKKKKgGGX ',  // 7  boca (barra sup)
    ' XGGKGGGGKgGX ',  // 8  boca (dientes)
    ' XGGKGGGGKgGX ',  // 9  boca (dientes)
    ' XGGgKKKKgGGX ',  // 10 boca (barra inf)
    ' XGGGGGGGGGGX ',  // 11
    ' XGGGGGGGGGgX ',  // 12
    '  XXXXXXXXXX  ',  // 13 borde bot
  ];

  // ── Mapa del CUERPO (10 cols × 5 rows, centrado) ──
  const BODY = [
    'XXXXXXXXXX',
    'XGGGGGGGGX',
    'XGGGgGGGGX',  // manchita decorativa
    'XGGGGGGGGX',
    'XXXXXXXXXX',
  ];

  // ── Función helper: rect ──
  const rc = (x, y, w, h, fill) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;

  let rects = '';

  // ── Resolver color de caracter ──
  function col(ch) {
    switch(ch) {
      case 'X': return G4;
      case 'x': return G3;
      case 'G': return G1;
      case 'g': return G2;
      case 'D': return G3;
      case 'K': return BK;
      case 'W': return WH;
      default:  return null;
    }
  }

  // ── Dibujar CABEZA ──
  const HW = 14, HH = 14;
  for (let ry = 0; ry < HEAD.length; ry++) {
    for (let rx = 0; rx < HEAD[ry].length; rx++) {
      const c = col(HEAD[ry][rx]);
      if (!c) continue;
      rects += rc(rx * p, ry * p, p, p, c);
    }
  }

  // ── Cuello (2 cols centradas, 2 rows) ──
  const neckOffX = Math.floor((HW - 2) / 2);
  const neckY    = HH * p;
  rects += rc(neckOffX * p,         neckY,     2 * p, 2 * p, G4);
  rects += rc((neckOffX + 0.5) * p, neckY + p * 0.25, p, p * 1.5, G1);

  // ── Cuerpo (10 cols × 5 rows) ──
  const bodyOffX = Math.floor((HW - 10) / 2);
  const bodyY    = (HH + 2) * p;
  for (let ry = 0; ry < BODY.length; ry++) {
    for (let rx = 0; rx < BODY[ry].length; rx++) {
      const c = col(BODY[ry][rx]);
      if (!c) continue;
      rects += rc((bodyOffX + rx) * p, bodyY + ry * p, p, p, c);
    }
  }

  // ── Manchitas teal en cuerpo (detalle referencia) ──
  rects += rc((bodyOffX + 5) * p, bodyY + 1 * p, 2 * p, 2 * p, TE);
  rects += rc((bodyOffX + 2) * p, bodyY + 3 * p, p, p, '#2aad8a');

  // ── Patas ──
  // Cada pata: forma trapezoidal, más ancha abajo
  // Pata izquierda: col 1..5, Pata derecha: col 8..12
  const legY = bodyY + 5 * p + p; // un pequeño gap
  const legH = 5 * p;

  // Pata izquierda
  // top: cols 1-4 (4u ancho), bot: cols 0-5 (6u ancho) → trapecio
  // Simulamos con rects apilados
  for (let row = 0; row < 5; row++) {
    const expand = row >= 3 ? 1 : 0; // ensanche solo en filas bajas
    const lx = (1 - expand) * p;
    const lw = (4 + expand * 2) * p;
    const c  = row === 0 || row === 4 ? G4 : (row === 1 ? G4 : G1);
    rects += rc(lx, legY + row * p, lw, p, row === 0 || row === 4 ? G4 : G1);
    if (row > 0 && row < 4) {
      // borde izq y der
      rects += rc(lx, legY + row * p, p, p, G4);
      rects += rc(lx + lw - p, legY + row * p, p, p, G4);
    }
  }
  // teal en base pata izq
  rects += rc(1.5 * p, legY + 4 * p, 2 * p, p, TE);

  // Pata derecha
  const rpx = HW - 5; // col inicio
  for (let row = 0; row < 5; row++) {
    const expand = row >= 3 ? 1 : 0;
    const lx = (rpx - expand) * p;
    const lw = (4 + expand * 2) * p;
    rects += rc(lx, legY + row * p, lw, p, row === 0 || row === 4 ? G4 : G1);
    if (row > 0 && row < 4) {
      rects += rc(lx, legY + row * p, p, p, G4);
      rects += rc(lx + lw - p, legY + row * p, p, p, G4);
    }
  }
  rects += rc((rpx + 0.5) * p, legY + 4 * p, 2 * p, p, TE);

  const totalW = HW * p;
  const totalH = legY + 5 * p;

  return `<svg xmlns="http://www.w3.org/2000/svg"
    width="${totalW}" height="${totalH}"
    viewBox="0 0 ${totalW} ${totalH}"
    style="image-rendering:pixelated;overflow:visible;display:block">
    ${rects}
  </svg>`;
}


// ── Sonido de explosión sintético ──
function playExplosionSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const len = Math.floor(ctx.sampleRate * 0.4);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.8);
    const src  = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.45, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + 0.4);
  } catch(e) {}
}


// ── Clase Creeper ──
class Creeper {
  constructor(field, onDone) {
    this.field  = field;
    this.onDone = onDone;
    this.state  = 'walking';

    const isMobile = window.innerWidth < 600;
    const scale    = isMobile ? 0.85 : 1.1;

    this.wrap = document.createElement('div');
    this.wrap.className = 'creeper-wrap';
    this.wrap.innerHTML = makeCreeperSVG(scale);
    this.wrap.title = '¡Haz clic para explotar! 💥';

    const fw = this.field.offsetWidth || 800;
    const cw = 14 * Math.round(scale * 7);         // ancho aprox del SVG
    this.x   = 20 + Math.random() * Math.max(60, fw - cw - 40);
    this.dir = Math.random() > 0.5 ? 1 : -1;
    this.spd = 0.3 + Math.random() * 0.55;

    this.wrap.style.left    = this.x + 'px';
    this.wrap.style.opacity = '0';
    this.wrap.style.transition = 'opacity 0.5s';

    this.wrap.addEventListener('click', () => this.startFlash());
    field.appendChild(this.wrap);

    // Aparecer con fade
    requestAnimationFrame(() => {
      this.wrap.style.opacity = '1';
      this.wrap.classList.add('creeper-walk');
      this._walkLoop();
    });

    // Auto-explosión: 9–22 segundos
    this._auto = setTimeout(
      () => this.startFlash(),
      9000 + Math.random() * 13000
    );
  }

  _walkLoop() {
    if (this.state !== 'walking') return;
    const fw = this.field.offsetWidth || 800;
    const cw = this.wrap.offsetWidth  || 100;
    this.x += this.spd * this.dir;
    if (this.x <= 10)             { this.x = 10;             this.dir =  1; }
    if (this.x >= fw - cw - 10)   { this.x = fw - cw - 10;  this.dir = -1; }
    // Voltear según dirección
    this.wrap.style.transform = this.dir < 0 ? 'scaleX(-1)' : 'scaleX(1)';
    this.wrap.style.left = this.x + 'px';
    this._raf = requestAnimationFrame(() => this._walkLoop());
  }

  startFlash() {
    if (this.state !== 'walking') return;
    this.state = 'flashing';
    clearTimeout(this._auto);
    cancelAnimationFrame(this._raf);
    this.wrap.classList.remove('creeper-walk');
    this.wrap.classList.add('creeper-flash');
    setTimeout(() => this.explode(), 750);
  }

  explode() {
    this.state = 'exploded';
    playExplosionSound();

    const frect = this.field.getBoundingClientRect();
    const wrect = this.wrap.getBoundingClientRect();
    const cx = wrect.left - frect.left + wrect.width  / 2;
    const cy = wrect.top  - frect.top  + wrect.height / 2;

    // Esconder
    this.wrap.style.opacity = '0';

    // Anillo de explosión
    const boom = document.createElement('div');
    boom.className = 'c-explosion';
    boom.style.left = cx + 'px';
    boom.style.top  = cy + 'px';
    this.field.appendChild(boom);

    // Partículas pixeladas
    const partColors = ['#4cb84c','#2e7a2e','#7c3aed','#a855f7','#c4b5fd','#fbbf24'];
    for (let i = 0; i < 12; i++) {
      const sz  = 6 + Math.floor(Math.random() * 10);
      const vx  = (Math.random() - 0.5) * 140;
      const vy  = -(40 + Math.random() * 90);
      const col = partColors[Math.floor(Math.random() * partColors.length)];
      const el  = document.createElement('div');
      el.style.cssText = `
        position:absolute;left:${cx}px;top:${cy}px;
        width:${sz}px;height:${sz}px;
        background:${col};image-rendering:pixelated;border-radius:0;
        pointer-events:none;
        animation:partFly_${i} 0.95s ease-out forwards;
      `;
      const kf = document.createElement('style');
      kf.textContent = `@keyframes partFly_${i}{
        0%  {transform:translate(0,0) rotate(0deg);opacity:1}
        100%{transform:translate(${vx}px,${vy + 90}px) rotate(${(Math.random()-0.5)*720}deg);opacity:0}
      }`;
      document.head.appendChild(kf);
      this.field.appendChild(el);
      setTimeout(() => { el.remove(); kf.remove(); }, 1000);
    }

    // Regalo corazón morado
    const egg = document.createElement('div');
    egg.className = 'c-egg';
    egg.textContent = '💜';
    egg.style.left = (cx - 18) + 'px';
    egg.style.top  = (cy - 20) + 'px';
    this.field.appendChild(egg);

    // Limpiar y renacer
    setTimeout(() => {
      boom.remove();
      this.wrap.remove();
      egg.style.transition = 'opacity 2s';
      egg.style.opacity    = '0';
      setTimeout(() => egg.remove(), 2000);
      this.state = 'dead';
      if (this.onDone) this.onDone();
    }, 1600);
  }
}


// ── Controlador principal ──
export function initCreepers() {
  const field = document.getElementById('creeperField');
  if (!field) return;

  const MAX     = window.innerWidth < 500 ? 3 : 5;
  let   active  = 0;

  function spawn() {
    if (active >= MAX) return;
    active++;
    new Creeper(field, () => {
      active--;
      setTimeout(spawn, 1000 + Math.random() * 2800);
    });
  }

  // Spawn inicial escalonado
  const initial = Math.min(MAX, 4);
  for (let i = 0; i < initial; i++) {
    setTimeout(spawn, 300 + i * 1000);
  }
}
"""

with open('/mnt/user-data/outputs/amor-3meses/js/creepers.js', 'w') as f:
    f.write(content)
print("creepers.js OK:", len(content), "chars")
PYEOFs
