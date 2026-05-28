/* ═══════════════════════════════════════════════
   main.js — Lógica principal
   ═══════════════════════════════════════════════ */
import { initCreepers } from './creepers.js';

/* ────────────────────────────────────────────
   1. MÚSICA — arranca sola al primer gesto
   ──────────────────────────────────────────── */
const audio      = document.getElementById('bgMusic');
const musicBtn   = document.getElementById('musicBtn');
const musicLabel = document.getElementById('musicLabel');

audio.volume = 0.45;
let started = false;

function setPlaying(on) {
  started = on;
  musicBtn.classList.toggle('playing', on);
  musicLabel.textContent = on ? 'Pausar música' : '▶ Reproducir música';
}

function tryPlay() {
  audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
}

/* Intento inmediato (funciona en algunos navegadores con video muted previo) */
window.addEventListener('load', tryPlay);

/* Fallback: primer gesto del usuario */
const firstGesture = () => {
  if (!started) tryPlay();
  document.removeEventListener('click',      firstGesture);
  document.removeEventListener('keydown',    firstGesture);
  document.removeEventListener('touchstart', firstGesture);
};
document.addEventListener('click',      firstGesture);
document.addEventListener('keydown',    firstGesture);
document.addEventListener('touchstart', firstGesture);

/* Botón manual */
window.toggleMusic = function () {
  if (audio.paused) { audio.play().then(() => setPlaying(true)); }
  else              { audio.pause(); setPlaying(false); }
};

/* ────────────────────────────────────────────
   2. ESTRELLAS PIXEL & PÉTALOS DE FONDO
   ──────────────────────────────────────────── */
(function spawnBg() {
  const bg     = document.getElementById('pixelBg');
  if (!bg) return;
  const stars  = ['#c4b5fd','#a855f7','#7c3aed','#e879f9','#818cf8','#ffffff'];
  const petals = ['#a855f7','#7c3aed','#c4b5fd','#818cf8','#e879f9'];

  for (let i = 0; i < 70; i++) {
    const s = document.createElement('div');
    s.className = 'pixel-star';
    const sz = 2 + Math.random() * 4;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}vw;top:${Math.random()*100}vh;background:${stars[i%stars.length]};animation-duration:${1.5+Math.random()*4}s;animation-delay:${Math.random()*6}s;`;
    bg.appendChild(s);
  }
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const sz = 6 + Math.random() * 8;
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}vw;background:${petals[i%petals.length]};animation-duration:${9+Math.random()*12}s;animation-delay:${Math.random()*20}s;`;
    bg.appendChild(p);
  }
})();

/* ────────────────────────────────────────────
   3. NUBES PIXEL en la zona de Creepers
   ──────────────────────────────────────────── */
(function spawnClouds() {
  const zone = document.getElementById('creeperZone');
  if (!zone) return;

  /* Paleta de nube Minecraft: blanco + gris claro */
  function makeCloud(widthU, heightU, pxSz) {
    const W = widthU  * pxSz;
    const H = heightU * pxSz;
    /* Mapa de nube simple (1=blanco, 2=gris, 0=transp) */
    const maps = [
      /* Nube tipo A: 8×4 */
      [
        [0,0,1,1,1,1,0,0],
        [1,1,2,2,2,2,1,1],
        [1,2,2,2,2,2,2,1],
        [1,1,1,1,1,1,1,1],
      ],
      /* Nube tipo B: 10×4 */
      [
        [0,0,0,1,1,1,1,0,0,0],
        [0,1,1,2,2,2,2,1,1,0],
        [1,1,2,2,2,2,2,2,1,1],
        [1,1,1,1,1,1,1,1,1,1],
      ],
      /* Nube tipo C: 6×3 */
      [
        [0,1,1,1,1,0],
        [1,2,2,2,2,1],
        [1,1,1,1,1,1],
      ],
    ];
    const map   = maps[Math.floor(Math.random()*maps.length)];
    const cols  = map[0].length;
    const rows  = map.length;
    const cW    = cols * pxSz;
    const cH    = rows * pxSz;
    let rects   = '';
    map.forEach((row, ry) => {
      row.forEach((cell, rx) => {
        if (!cell) return;
        const fill = cell === 1 ? '#e8e8e8' : '#b0b0b0';
        rects += `<rect x="${rx*pxSz}" y="${ry*pxSz}" width="${pxSz}" height="${pxSz}" fill="${fill}"/>`;
      });
    });
    return { svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${cW}" height="${cH}" viewBox="0 0 ${cW} ${cH}" style="image-rendering:pixelated;display:block">${rects}</svg>`, w:cW, h:cH };
  }

  const CLOUD_COUNT = window.innerWidth < 600 ? 3 : 5;
  const zoneW = zone.offsetWidth || window.innerWidth;

  for (let i = 0; i < CLOUD_COUNT; i++) {
    const pxSz  = 8 + Math.floor(Math.random() * 8); // 8-16px por pixel
    const cloud = makeCloud(10, 4, pxSz);
    const el    = document.createElement('div');
    el.className = 'pixel-cloud';
    el.innerHTML  = cloud.svg;
    const yPos   = 10 + Math.random() * 80; // % height de la zona
    const xStart = -cloud.w - 20;
    const dur    = 18 + Math.random() * 25; // segundos para cruzar
    const delay  = i * (dur / CLOUD_COUNT);
    el.style.cssText = `
      position:absolute;
      top:${yPos}px;
      left:${xStart}px;
      opacity:${0.55 + Math.random()*0.35};
      pointer-events:none;
      z-index:3;
      animation: cloudMove${i} ${dur}s ${delay}s linear infinite;
    `;
    const kf = document.createElement('style');
    kf.textContent = `@keyframes cloudMove${i}{
      from { transform: translateX(0); }
      to   { transform: translateX(${zoneW + cloud.w + 60}px); }
    }`;
    document.head.appendChild(kf);
    zone.appendChild(el);
  }
})();

/* ────────────────────────────────────────────
   4. GALERÍA DE FOTOS — solo lectura
   ── EDITA EL ARRAY photos PARA AGREGAR IMÁGENES ──
   ──────────────────────────────────────────── */
const photos = [
  /*
   * Para agregar fotos pon la ruta relativa en src:
   *   { caption: 'Texto aquí', src: 'assets/images/foto1.jpg' }
   * Si no hay src la tarjeta muestra el emoji de placeholder.
   */
  { caption: 'Nuestra primera aventura 💜', src: '..assets/images/foto2.jpeg' },
  { caption: 'Ese día especial ✨',          src: '..assets/images/foto1.jpeg' },
  { caption: 'Juntos siempre 🌸',            src: '..assets/images/foto5.jpeg' },
  { caption: 'Mi favorito contigo 💜',       src: '..assets/images/foto4.jpeg' },
  { caption: 'Momentos que atesoro 🌷',      src: '..assets/images/foto6.jpeg' },
  { caption: 'Felicidad pura 🥰',            src: '..assets/images/foto3.jpeg' },
];

(function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  photos.forEach((ph) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    const imgHTML = ph.src
      ? `<img src="${ph.src}" alt="${ph.caption}" loading="lazy">`
      : `<div class="photo-placeholder"><span>🖼️</span><p>Foto próximamente</p></div>`;
    card.innerHTML = `
      <div class="photo-slot">${imgHTML}</div>
      <div class="photo-caption">${ph.caption}</div>`;
    grid.appendChild(card);
  });
})();

/* ────────────────────────────────────────────
   5. RAZONES
   ── EDITA EL ARRAY reasons ──
   ──────────────────────────────────────────── */
const reasons = [
  { emoji:'😂', text:'Por tu risa contagiosa que ilumina hasta mis días más grises.' },
  { emoji:'🎮', text:'Por ser mi compañero de juego favorito, en Minecraft, en LoL y en la vida.' },
  { emoji:'🌟', text:'Por inspirarme a ser mejor persona cada día que pasa.' },
  { emoji:'💬', text:'Por escucharme siempre con el corazón, nunca solo con los oídos.' },
  { emoji:'🤗', text:'Por tus abrazos que se sienten como el hogar más seguro del mundo.' },
  { emoji:'💜', text:'Por todo lo que eres, sin pretender ser nadie más.' },
];

(function buildReasons() {
  const grid = document.getElementById('reasonsGrid');
  if (!grid) return;
  grid.innerHTML = reasons.map(r =>
    `<div class="reason-card">
       <span class="reason-emoji">${r.emoji}</span>
       <p class="reason-text">${r.text}</p>
     </div>`
  ).join('');
})();

/* ────────────────────────────────────────────
   6. LÍNEA DE TIEMPO
   ── EDITA EL ARRAY timelineEvents ──
   ──────────────────────────────────────────── */
const timelineEvents = [
  { date:'El primer día',     event:'Cuando nos conocimos',    desc:'Un momento que cambió todo. Sin saberlo entonces, comenzaba lo más bonito.' },
  { date:'Primera semana',    event:'Nuestra primera cita',    desc:'Los nervios, la sonrisa, el descubrir que quería pasar más tiempo contigo.' },
  { date:'El primer mes',     event:'El primero de muchos',    desc:'Ya sabía que esto era especial. Que tú eras especial.' },
  { date:'Segundo mes',       event:'Aventuras y complicidad', desc:'Cada plan juntos se volvía una historia que contar.' },
  { date:'Hoy — 3 meses 🎉', event:'¡Tres meses contigo!',   desc:'Y solo quiero que sean el comienzo de muchísimos más a tu lado.' },
];

(function buildTimeline() {
  const tl = document.getElementById('timelineList');
  if (!tl) return;
  tl.innerHTML = timelineEvents.map(t =>
    `<div class="timeline-item">
       <div class="timeline-dot"></div>
       <div class="timeline-date">${t.date}</div>
       <div class="timeline-event">${t.event}</div>
       <div class="timeline-desc">${t.desc}</div>
     </div>`
  ).join('');
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.2 }
  );
  tl.querySelectorAll('.timeline-item').forEach(el => obs.observe(el));
})();

/* ────────────────────────────────────────────
   7. CONTADORES ANIMADOS
   ──────────────────────────────────────────── */
(function initCounters() {
  const container = document.getElementById('counters');
  if (!container) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      container.querySelectorAll('.counter-num').forEach(el => {
        if (el.dataset.special) { setTimeout(() => el.textContent = '∞', 800); return; }
        const target = +el.dataset.target;
        let t0 = 0;
        const step = ts => {
          if (!t0) t0 = ts;
          const p = Math.min((ts-t0)/1800, 1);
          el.textContent = Math.floor(p*target).toLocaleString();
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      obs.disconnect();
    });
  }, { threshold: 0.3 });
  obs.observe(container);
})();

/* ────────────────────────────────────────────
   8. DECORACIÓN MINECRAFT (corazón pixel + bloques)
   ──────────────────────────────────────────── */
(function buildMcDeco() {
  const heartEl  = document.getElementById('mcHeart');
  const blocksEl = document.getElementById('mcBlocks');
  const fpEl     = document.getElementById('footerPixels');

  const purples = ['#7c3aed','#a855f7','#c4b5fd','#6d28d9','#5b21b6'];

  if (heartEl) {
    const map = ['0110110','1111111','1111111','0111110','0011100','0001000'];
    map.forEach(row => {
      row.split('').forEach(cell => {
        const d = document.createElement('div');
        d.className = 'mc-pixel';
        d.style.background = cell === '1'
          ? purples[Math.floor(Math.random()*purples.length)]
          : 'transparent';
        heartEl.appendChild(d);
      });
    });
  }
  if (blocksEl) {
    for (let i = 0; i < 16; i++) {
      const d = document.createElement('div');
      d.className = 'mc-pixel';
      d.style.background = purples[Math.floor(Math.random()*purples.length)];
      d.style.width = d.style.height = '14px';
      blocksEl.appendChild(d);
    }
  }
  if (fpEl) {
    for (let i = 0; i < 24; i++) {
      const d = document.createElement('div');
      d.className = 'footer-pixel';
      d.style.background = purples[Math.floor(Math.random()*purples.length)];
      d.style.opacity = (0.3 + Math.random()*0.7);
      fpEl.appendChild(d);
    }
  }
})();

/* ────────────────────────────────────────────
   9. CREEPERS
   ──────────────────────────────────────────── */
initCreepers();
