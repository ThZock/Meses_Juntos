/* ═══════════════════════════════════════════════════════════
   creepers.js  —  Creeper chibi fiel a Minecraft
   Cabeza grande cuadrada, ojos negros con brillo, boca en T,
   cuerpo pequeño, dos patitas trapezoidales, detalle teal
   ═══════════════════════════════════════════════════════════ */

/* ── Paleta ── */
const P = {
  bg:     'transparent',
  border: '#1c2e1c',   // borde oscuro exterior
  dark:   '#2d5a2d',   // verde sombra
  mid:    '#3d8b3d',   // verde medio
  base:   '#4ab54a',   // verde principal
  light:  '#5fd45f',   // verde claro / highlight
  black:  '#111111',   // ojos y boca
  white:  '#e0e0e0',   // brillo ojos
  teal:   '#1abc9c',   // detalle patas y pecho
  tealD:  '#148a72',   // teal oscuro
};

/* ── Genera el SVG del creeper ──
   Diseño: 18×28 unidades (u = pixelSize)
   Cabeza: cols 1-16, rows 0-13   (16×14 u)
   Cuello: cols 6-11, rows 13-15  ( 6×2 u)
   Cuerpo: cols 3-14, rows 15-20  (12×5 u)
   PataIzq: cols 2-7, rows 20-27  ( 6×7 u)
   PataDer: cols 10-15, rows 20-27 ( 6×7 u)
*/
function makeCreeperSVG(pixelSize) {
  const u = pixelSize;
  const W = 18 * u;
  const H = 28 * u;

  /* helper rect */
  const R = (x,y,w,h,c) =>
    `<rect x="${x*u}" y="${y*u}" width="${w*u}" height="${h*u}" fill="${c}"/>`;

  let s = '';

  /* ════════════════ CABEZA ════════════════
     16×14, esquinas redondeadas simuladas con recorte de esquinas */
  const hx = 1;  // head x start
  const hy = 0;  // head y start
  const hw = 16; // head width
  const hh = 14; // head height

  // fondo verde base cabeza (sin las 4 esquinas)
  // bordes exteriores (1u)
  s += R(hx+1, hy,   hw-2, 1,   P.border);  // top
  s += R(hx+1, hy+hh-1, hw-2, 1, P.border); // bottom
  s += R(hx,   hy+1, 1,   hh-2, P.border);  // left
  s += R(hx+hw-1, hy+1, 1, hh-2, P.border); // right
  // esquinas redondeadas (borde en diagonal)
  s += R(hx+1, hy+1, 1, 1, P.border);       // top-left corner
  s += R(hx+hw-2, hy+1, 1, 1, P.border);    // top-right corner
  s += R(hx+1, hy+hh-2, 1, 1, P.border);    // bot-left corner
  s += R(hx+hw-2, hy+hh-2, 1, 1, P.border); // bot-right corner

  // relleno verde interior
  s += R(hx+1, hy+1, hw-2, hh-2, P.base);

  // tira de sombra top (más oscura)
  s += R(hx+2, hy+1, hw-4, 1, P.dark);
  // tira de sombra left
  s += R(hx+1, hy+2, 1, hh-4, P.dark);
  // highlight interior (esquina sup-izq)
  s += R(hx+2, hy+2, 3, 3, P.light);

  /* ── OJOS ──
     Cada ojo = 4×4 negro con brillo 1×1 blanco arriba-der */
  // Ojo izquierdo: centrado en cols 3-6, rows 3-6
  const eyeLx = hx+3, eyeRx = hx+9, eyeY = hy+3, eyeW = 4, eyeH = 4;
  // ojo izq
  s += R(eyeLx, eyeY, eyeW, eyeH, P.black);
  s += R(eyeLx+eyeW-2, eyeY+1, 1, 1, P.white);  // brillo
  // ojo der
  s += R(eyeRx, eyeY, eyeW, eyeH, P.black);
  s += R(eyeRx+eyeW-2, eyeY+1, 1, 1, P.white);  // brillo

  /* ── BOCA (en T / característica del Creeper) ──
     Barra horizontal + barra vertical hacia abajo con "dientes" */
  const mxStart = hx+3, myTop = hy+8;
  // barra horizontal superior (10u ancho, 2u alto)
  s += R(mxStart, myTop, 10, 2, P.black);
  // barra vertical izq (2u ancho, 3u alto)
  s += R(mxStart, myTop+2, 2, 3, P.black);
  // barra vertical der (2u ancho, 3u alto)
  s += R(mxStart+8, myTop+2, 2, 3, P.black);

  /* ════════════════ CUELLO ════════════════ */
  s += R(hx+5, hy+hh, 6, 2, P.border);  // borde cuello
  s += R(hx+6, hy+hh, 4, 2, P.dark);   // relleno

  /* ════════════════ CUERPO ════════════════
     12×5, filas 15-19 */
  const bx = hx+2, by = hy+hh+2, bw = 12, bh = 5;
  s += R(bx+1, by,   bw-2, 1,   P.border); // top borde
  s += R(bx+1, by+bh-1, bw-2, 1, P.border);// bot borde
  s += R(bx,   by+1, 1,   bh-2, P.border); // left borde
  s += R(bx+bw-1, by+1, 1, bh-2, P.border);// right borde
  s += R(bx+1, by+1, bw-2, bh-2, P.base); // relleno verde
  s += R(bx+2, by+1, 1,   bh-2, P.dark);  // sombra left
  s += R(bx+1, by+1, bw-2, 1,   P.dark);  // sombra top
  // manchas teal en el pecho (detalle de la imagen)
  s += R(bx+7, by+2, 2, 2, P.teal);  // mancha derecha
  s += R(bx+3, by+3, 2, 1, P.light); // mancha izq clara

  /* ════════════════ PATA IZQUIERDA ════════════════
     Trapezoide: 6u arriba, 7u abajo, 7u alto
     Simulado: parte superior 6u, parte inferior 7u con un pixel extra */
  const legY = by + bh;   // y donde empiezan las patas
  const legH = 7;

  // Pata izquierda — x = bx-1 = hx+1
  const plx = hx+1;
  // borde exterior
  s += R(plx,   legY,   6, legH, P.border);
  // relleno verde
  s += R(plx+1, legY+1, 4, legH-2, P.base);
  // highlight top
  s += R(plx+1, legY+1, 2, 1, P.light);
  // sombra izq
  s += R(plx+1, legY+1, 1, legH-2, P.dark);
  // ensanche trapezoide abajo
  s += R(plx-1, legY+legH-3, 1, 3, P.border); // pixel extra izq
  s += R(plx+6, legY+legH-3, 1, 3, P.border); // pixel extra der
  s += R(plx,   legY+legH-2, 6, 1, P.base);   // ensanche base
  // detalle teal en base
  s += R(plx+1, legY+legH-2, 4, 2, P.teal);
  s += R(plx+1, legY+legH-1, 4, 1, P.tealD);

  // Pata derecha — x = bx+bw-7+2 = hx+9
  const prx = hx+9;
  s += R(prx,   legY,   6, legH, P.border);
  s += R(prx+1, legY+1, 4, legH-2, P.base);
  s += R(prx+1, legY+1, 2, 1, P.light);
  s += R(prx+1, legY+1, 1, legH-2, P.dark);
  s += R(prx-1, legY+legH-3, 1, 3, P.border);
  s += R(prx+6, legY+legH-3, 1, 3, P.border);
  s += R(prx,   legY+legH-2, 6, 1, P.base);
  s += R(prx+1, legY+legH-2, 4, 2, P.teal);
  s += R(prx+1, legY+legH-1, 4, 1, P.tealD);

  const totalH = (legY + legH + 1) * u;

  return `<svg xmlns="http://www.w3.org/2000/svg"
    width="${W}" height="${totalH}"
    viewBox="0 0 ${W} ${totalH}"
    style="image-rendering:pixelated;display:block;overflow:visible">
    ${s}
  </svg>`;
}

/* ── Sonido explosión Web Audio ── */
function playBoom() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const len = Math.floor(ctx.sampleRate * 0.38);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random()*2-1) * Math.pow(1 - i/len, 1.6);
    const src  = ctx.createBufferSource(); src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.38, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
    src.connect(gain); gain.connect(ctx.destination);
    src.start(); src.stop(ctx.currentTime + 0.38);
  } catch(e) {}
}

/* ── Clase Creeper ── */
class Creeper {
  constructor(field, onDone) {
    this.field  = field;
    this.onDone = onDone;
    this.state  = 'walking';

    const scale = window.innerWidth < 600 ? 5 : 7; // pixelSize
    this.wrap = document.createElement('div');
    this.wrap.className = 'creeper-wrap';
    this.wrap.innerHTML = makeCreeperSVG(scale);
    this.wrap.title = '¡Haz clic para explotar! 💥';

    const fw  = field.offsetWidth || 800;
    const cw  = 18 * scale;
    this.x    = 20 + Math.random() * Math.max(60, fw - cw - 40);
    this.dir  = Math.random() > 0.5 ? 1 : -1;
    this.spd  = 0.38 + Math.random() * 0.52;

    this.wrap.style.cssText = `
      position:absolute; bottom:24px;
      left:${this.x}px;
      cursor:pointer; user-select:none;
      opacity:0; transition:opacity 0.5s;
      filter:drop-shadow(0 4px 6px rgba(0,0,0,0.5));
    `;
    this.wrap.addEventListener('click', () => this.startFlash());
    field.appendChild(this.wrap);

    requestAnimationFrame(() => {
      this.wrap.style.opacity = '1';
      this.wrap.classList.add('creeper-walk');
      this._loop();
    });
    this._auto = setTimeout(() => this.startFlash(), 7000 + Math.random()*13000);
  }

  _loop() {
    if (this.state !== 'walking') return;
    const fw = this.field.offsetWidth || 800;
    const cw = this.wrap.offsetWidth  || 126;
    this.x += this.spd * this.dir;
    if (this.x <= 10)           { this.x = 10;           this.dir =  1; }
    if (this.x >= fw - cw - 10) { this.x = fw - cw - 10; this.dir = -1; }
    this.wrap.style.left      = this.x + 'px';
    this.wrap.style.transform = this.dir < 0 ? 'scaleX(-1)' : 'scaleX(1)';
    this._raf = requestAnimationFrame(() => this._loop());
  }

  startFlash() {
    if (this.state !== 'walking') return;
    this.state = 'flashing';
    clearTimeout(this._auto);
    cancelAnimationFrame(this._raf);
    this.wrap.classList.remove('creeper-walk');
    this.wrap.classList.add('creeper-flash');
    setTimeout(() => this.explode(), 700);
  }

  explode() {
    this.state = 'exploded';
    playBoom();

    const fr = this.field.getBoundingClientRect();
    const wr = this.wrap.getBoundingClientRect();
    const cx = wr.left - fr.left + wr.width  / 2;
    const cy = wr.top  - fr.top  + wr.height / 2;

    this.wrap.style.opacity = '0';

    /* Anillo explosión */
    const boom = document.createElement('div');
    boom.className = 'c-explosion';
    boom.style.left = cx + 'px';
    boom.style.top  = cy + 'px';
    this.field.appendChild(boom);

    /* Partículas pixel */
    const colors = ['#4ab54a','#2d5a2d','#7c3aed','#a855f7','#c4b5fd','#1abc9c','#fbbf24'];
    for (let i = 0; i < 12; i++) {
      const vx = (Math.random() - 0.5) * 140;
      const vy = -(35 + Math.random() * 90);
      const sz = 6 + Math.floor(Math.random() * 8);
      const kf = `cpf${Date.now()}${i}`;
      const st = document.createElement('style');
      st.textContent = `@keyframes ${kf}{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(${vx}px,${vy+100}px) rotate(${(Math.random()-0.5)*720}deg);opacity:0}}`;
      document.head.appendChild(st);
      const pt = document.createElement('div');
      pt.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;background:${colors[i%colors.length]};left:${cx}px;top:${cy}px;pointer-events:none;image-rendering:pixelated;animation:${kf} 0.9s ease-out forwards;`;
      this.field.appendChild(pt);
      setTimeout(() => { pt.remove(); st.remove(); }, 950);
    }

    /* Regalo 💜 */
    const egg = document.createElement('div');
    egg.className = 'c-egg';
    egg.textContent = '💜';
    egg.style.left = (cx - 18) + 'px';
    egg.style.top  = (cy - 20) + 'px';
    this.field.appendChild(egg);

    setTimeout(() => {
      boom.remove();
      this.wrap.remove();
      egg.style.transition = 'opacity 2s';
      egg.style.opacity    = '0';
      setTimeout(() => egg.remove(), 2000);
      this.state = 'dead';
      if (this.onDone) this.onDone();
    }, 1500);
  }
}

/* ── Inicializar ── */
export function initCreepers() {
  const field = document.getElementById('creeperField');
  if (!field) return;
  const MAX = window.innerWidth < 500 ? 3 : 5;
  let active = 0;

  function spawn() {
    if (active >= MAX) return;
    active++;
    new Creeper(field, () => {
      active--;
      setTimeout(spawn, 1000 + Math.random() * 2800);
    });
  }

  for (let i = 0; i < Math.min(MAX, 4); i++)
    setTimeout(spawn, i * 900 + 200);
}
