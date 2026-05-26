/* ═══════════════════════════════════════════════════
   creepers.js — Creepers de Minecraft tiernos
   Aparecen, caminan, parpadean y explotan dejando 💜
   ═══════════════════════════════════════════════════ */

// ── Palette de colores del Creeper pixel art ──
// Usamos la paleta clásica de Minecraft con toque morado
const C = {
  // cara
  dark:   '#1a3a1a',
  mid:    '#2d6a2d',
  light:  '#4a9a4a',
  bright: '#6abf6a',
  skin:   '#5aa85a',
  // detalles oscuros (ojos, boca)
  black:  '#0d0d0d',
  // highlight morado para hacerlo tiernito
  purple: '#c4b5fd',
  purpleD:'#7c3aed',
};

// ── SVG del Creeper (pixel art fiel al juego) ──
function makeCreeperSVG(scale = 1) {
  const s = scale;
  const u = 8 * s; // unidad de pixel = 8px
  const W = 10 * u, H = 16 * u;

  // Mapa de pixels de la cara del creeper (10x12 grid)
  // Cada fila = array de colores, null = transparente
  const D = C.dark, M = C.mid, L = C.light, B = C.bright, S = C.skin, K = C.black;
  const face = [
    //  0    1    2    3    4    5    6    7    8    9
    [  D,   D,   D,   D,   D,   D,   D,   D,   D,   D], // 0
    [  D,   M,   M,   M,   M,   M,   M,   M,   M,   D], // 1
    [  D,   M,   L,   L,   M,   M,   L,   L,   M,   D], // 2
    [  D,   M,   L,   K,   L,   L,   K,   L,   M,   D], // 3  ojos
    [  D,   M,   L,   L,   M,   M,   L,   L,   M,   D], // 4
    [  D,   M,   M,   M,   M,   M,   M,   M,   M,   D], // 5
    [  D,   M,   M,   K,   K,   K,   K,   M,   M,   D], // 6  boca
    [  D,   M,   K,   M,   K,   K,   M,   K,   M,   D], // 7
    [  D,   M,   K,   M,   K,   K,   M,   K,   M,   D], // 8
    [  D,   M,   M,   K,   K,   K,   K,   M,   M,   D], // 9
    [  D,   M,   M,   M,   M,   M,   M,   M,   M,   D], // 10
    [  D,   D,   D,   D,   D,   D,   D,   D,   D,   D], // 11
  ];

  let rects = '';
  face.forEach((row, ry) => {
    row.forEach((col, rx) => {
      if (!col) return;
      rects += `<rect x="${rx*u}" y="${ry*u}" width="${u}" height="${u}" fill="${col}"/>`;
    });
  });

  // cuerpo (debajo de la cara, filas 12-15)
  const body = [
    [D,M,M,M,M,M,M,M,M,D],
    [D,S,S,S,S,S,S,S,S,D],
    [D,S,S,S,S,S,S,S,S,D],
    [D,D,D,D,D,D,D,D,D,D],
  ];
  body.forEach((row, ry) => {
    row.forEach((col, rx) => {
      if (!col) return;
      rects += `<rect x="${rx*u}" y="${(12+ry)*u}" width="${u}" height="${u}" fill="${col}"/>`;
    });
  });

  // patitas (2 izq + 2 der)
  // izquierda
  rects += `<rect x="${1*u}" y="${16*u}" width="${2*u}" height="${3*u}" fill="${M}"/>`;
  rects += `<rect x="${1*u}" y="${18*u}" width="${2*u}" height="${1*u}" fill="${D}"/>`;
  // derecha
  rects += `<rect x="${7*u}" y="${16*u}" width="${2*u}" height="${3*u}" fill="${M}"/>`;
  rects += `<rect x="${7*u}" y="${18*u}" width="${2*u}" height="${1*u}" fill="${D}"/>`;

  // estrellita morada encima de la cabeza (tiernito ✨)
  rects += `<text x="${W/2}" y="${-u}" text-anchor="middle" font-size="${u*2}" style="user-select:none">💜</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg"
    width="${W}" height="${H + 3*u}"
    viewBox="0 0 ${W} ${H + 3*u}"
    style="image-rendering:pixelated;overflow:visible">
    ${rects}
  </svg>`;
}

// ── Sonido de explosion simulado con Web Audio API ──
function playExplosionSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // ruido blanco corto
    const bufLen = ctx.sampleRate * 0.35;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + 0.35);
  } catch(e) {}
}

// ── Clase Creeper ──
class Creeper {
  constructor(field, onDone) {
    this.field = field;
    this.onDone = onDone;
    this.state = 'spawning'; // spawning → walking → flashing → exploded → dead

    const scale = window.innerWidth < 600 ? 0.55 : 0.75;
    this.wrap = document.createElement('div');
    this.wrap.className = 'creeper-wrap';
    this.wrap.innerHTML = makeCreeperSVG(scale);
    this.svg = this.wrap.querySelector('svg');

    // Posición aleatoria horizontal
    const fw = field.offsetWidth;
    const cw = 10 * 8 * scale;
    this.x = 20 + Math.random() * Math.max(40, fw - cw - 40);
    this.wrap.style.left = this.x + 'px';
    this.wrap.style.opacity = '0';
    this.wrap.style.transition = 'opacity .4s';

    // Dirección y velocidad de caminata
    this.dir = Math.random() > .5 ? 1 : -1;
    this.speed = 0.4 + Math.random() * 0.5; // px por frame

    this.wrap.title = '¡Haz clic para explotar! 💥';
    this.wrap.addEventListener('click', () => this.startFlash());

    field.appendChild(this.wrap);

    // Aparecer suavemente
    requestAnimationFrame(() => {
      this.wrap.style.opacity = '1';
      this.svg.classList.add('creeper-walk');
      this.state = 'walking';
      this._walk();
    });

    // Auto-explota después de un tiempo aleatorio (7-18s)
    this._autoTimer = setTimeout(() => this.startFlash(), 7000 + Math.random() * 11000);
  }

  _walk() {
    if (this.state !== 'walking') return;
    const fw = this.field.offsetWidth;
    const cw = this.wrap.offsetWidth;
    this.x += this.speed * this.dir;

    if (this.x <= 10) { this.x = 10; this.dir = 1; }
    if (this.x >= fw - cw - 10) { this.x = fw - cw - 10; this.dir = -1; }

    // Voltear el SVG según dirección
    this.wrap.style.transform = this.dir < 0 ? 'scaleX(-1)' : 'scaleX(1)';
    this.wrap.style.left = this.x + 'px';
    this._raf = requestAnimationFrame(() => this._walk());
  }

  startFlash() {
    if (this.state !== 'walking') return;
    this.state = 'flashing';
    clearTimeout(this._autoTimer);
    cancelAnimationFrame(this._raf);
    this.svg.classList.remove('creeper-walk');
    this.svg.classList.add('creeper-flash');

    // Fases de flash: 3 flashes de 200ms → explota
    setTimeout(() => this.explode(), 650);
  }

  explode() {
    this.state = 'exploded';
    playExplosionSound();

    // Posición central del creeper en el campo
    const rect = this.wrap.getBoundingClientRect();
    const frect = this.field.getBoundingClientRect();
    const cx = rect.left - frect.left + rect.width / 2;
    const cy = rect.top - frect.top + rect.height / 2;

    // Esconder creeper
    this.wrap.style.opacity = '0';

    // Anillo de explosión
    const expl = document.createElement('div');
    expl.className = 'c-explosion';
    expl.style.left = cx + 'px';
    expl.style.top = cy + 'px';
    this.field.appendChild(expl);

    // Huevo (emoji corazón morado = regalo del creeper tiernito)
    const egg = document.createElement('div');
    egg.className = 'c-egg';
    egg.textContent = '💜';
    egg.style.left = (cx - 15) + 'px';
    egg.style.top = (cy - 30) + 'px';
    this.field.appendChild(egg);

    // Limpiar y regenerar
    setTimeout(() => {
      expl.remove();
      this.wrap.remove();
      // El huevo desaparece con fade
      egg.style.transition = 'opacity 1.5s';
      egg.style.opacity = '0';
      setTimeout(() => egg.remove(), 1500);
      this.state = 'dead';
      if (this.onDone) this.onDone();
    }, 1400);
  }
}

// ── Controlador principal ──
export function initCreepers() {
  const field = document.getElementById('creeperField');
  if (!field) return;

  const MAX = window.innerWidth < 500 ? 3 : 5;
  let active = 0;

  function spawnOne() {
    if (active >= MAX) return;
    active++;
    new Creeper(field, () => {
      active--;
      // Regenerar tras una pequeña pausa
      setTimeout(spawnOne, 1000 + Math.random() * 2000);
    });
  }

  // Lanzar el primer lote escalonado
  const initialCount = Math.min(MAX, 4);
  for (let i = 0; i < initialCount; i++) {
    setTimeout(spawnOne, i * 800);
  }
}
