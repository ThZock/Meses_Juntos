/* ═══════════════════════════════════════════════
   main.js — Lógica principal de la página
   ═══════════════════════════════════════════════ */
import { initCreepers } from './creepers.js';

// ────────────────────────────────────────────────
// 1. MÚSICA — autoplay al primer click del usuario
// ────────────────────────────────────────────────
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicLabel = document.getElementById('musicLabel');
const musicNote = document.getElementById('musicNote');

audio.volume = 0.45;

let musicStarted = false;

// Intenta reproducir inmediatamente (puede fallar por autoplay policy)
function tryAutoplay() {
  audio.play().then(() => {
    musicStarted = true;
    musicBtn.classList.add('playing');
    musicLabel.textContent = 'Pausar música';
  }).catch(() => {
    // El navegador bloqueó el autoplay — esperamos la interacción del usuario
    musicBtn.classList.remove('playing');
    musicLabel.textContent = '▶ Reproducir música';
  });
}

// Cuando el usuario interactúa por primera vez, arrancamos la música
function onFirstInteraction() {
  if (musicStarted) return;
  audio.play().then(() => {
    musicStarted = true;
    musicBtn.classList.add('playing');
    musicLabel.textContent = 'Pausar música';
  }).catch(() => {});
  document.removeEventListener('click', onFirstInteraction);
  document.removeEventListener('keydown', onFirstInteraction);
  document.removeEventListener('touchstart', onFirstInteraction);
}

document.addEventListener('click', onFirstInteraction);
document.addEventListener('keydown', onFirstInteraction);
document.addEventListener('touchstart', onFirstInteraction);

// Botón manual de pausa/play
function toggleMusic() {
  if (audio.paused) {
    audio.play().then(() => {
      musicStarted = true;
      musicBtn.classList.add('playing');
      musicLabel.textContent = 'Pausar música';
    });
  } else {
    audio.pause();
    musicBtn.classList.remove('playing');
    musicLabel.textContent = '▶ Reproducir música';
  }
}

// Exponer al HTML (onclick="toggleMusic()")
window.toggleMusic = toggleMusic;

// Intentar autoplay al cargar
window.addEventListener('load', tryAutoplay);

// ────────────────────────────────────────────────
// 2. PIXEL STARS & PETALS de fondo
// ────────────────────────────────────────────────
(function spawnBackground() {
  const bg = document.getElementById('pixelBg');
  if (!bg) return;
  const starColors = ['#c4b5fd','#a855f7','#7c3aed','#e879f9','#818cf8','#ffffff'];
  for (let i = 0; i < 70; i++) {
    const s = document.createElement('div');
    s.className = 'pixel-star';
    const sz = 2 + Math.random() * 4;
    s.style.cssText = `
      width:${sz}px;height:${sz}px;
      left:${Math.random()*100}vw;top:${Math.random()*100}vh;
      background:${starColors[Math.floor(Math.random()*starColors.length)]};
      animation-duration:${1.5+Math.random()*4}s;
      animation-delay:${Math.random()*6}s;
    `;
    bg.appendChild(s);
  }
  // Pétalos pixel (cuadrados morados)
  const petalColors = ['#a855f7','#7c3aed','#c4b5fd','#818cf8','#e879f9'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const sz = 6 + Math.random() * 8;
    p.style.cssText = `
      width:${sz}px;height:${sz}px;
      left:${Math.random()*100}vw;
      background:${petalColors[Math.floor(Math.random()*petalColors.length)]};
      animation-duration:${9+Math.random()*12}s;
      animation-delay:${Math.random()*20}s;
    `;
    bg.appendChild(p);
  }
})();

// ────────────────────────────────────────────────
// 3. GALERÍA DE FOTOS
// ────────────────────────────────────────────────
// ══ CONFIGURA TUS FOTOS AQUÍ ══
// Para pre-cargar una foto, pon la ruta relativa en src:
// { caption: 'Texto', src: 'assets/images/foto1.jpg' }
const photos = [
  { caption: 'Nuestra primera aventura 💜' },
  { caption: 'Ese día especial ✨'         },
  { caption: 'Juntos siempre 🌸'           },
  { caption: 'Mi favorito contigo 💜'      },
  { caption: 'Momentos que atesoro 🌷'     },
  { caption: 'Felicidad pura 🥰'           },
];

(function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  photos.forEach((ph, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <div class="photo-slot${ph.src ? ' has-photo' : ''}" id="slot-${i}">
        ${ph.src ? `<img src="${ph.src}" alt="foto ${i+1}">` : ''}
        <div class="upload-hint">
          <div class="upload-icon">🖼️</div>
          <div>Toca para agregar<br>una foto nuestra</div>
        </div>
        <input type="file" accept="image/*" class="upload-btn"
               onchange="loadPhoto(event,${i})">
      </div>
      <div class="photo-caption">${ph.caption}</div>`;
    grid.appendChild(card);
  });
})();

window.loadPhoto = function(e, idx) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    photos[idx].src = ev.target.result;
    const slot = document.getElementById('slot-' + idx);
    let img = slot.querySelector('img');
    if (!img) { img = document.createElement('img'); slot.prepend(img); }
    img.src = ev.target.result;
    slot.classList.add('has-photo');
  };
  reader.readAsDataURL(file);
};

// ────────────────────────────────────────────────
// 4. RAZONES POR LAS QUE TE AMO
// ────────────────────────────────────────────────
// ══ PERSONALIZA LAS RAZONES AQUÍ ══
const reasons = [
  { emoji: '😂', text: 'Por tu risa contagiosa que ilumina hasta mis días más grises.' },
  { emoji: '🎮', text: 'Por ser mi compañero de juego favorito, en Minecraft, en LoL y en la vida.' },
  { emoji: '🌟', text: 'Por inspirarme a ser mejor persona cada día que pasa.' },
  { emoji: '💬', text: 'Por escucharme siempre con el corazón, nunca solo con los oídos.' },
  { emoji: '🤗', text: 'Por tus abrazos que se sienten como el hogar más seguro del mundo.' },
  { emoji: '💜', text: 'Por todo lo que eres, sin pretender ser nadie más.' },
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

// ────────────────────────────────────────────────
// 5. LÍNEA DE TIEMPO
// ────────────────────────────────────────────────
// ══ PERSONALIZA LOS EVENTOS AQUÍ ══
const timelineEvents = [
  { date: 'El primer día',       event: 'Cuando nos conocimos',      desc: 'Un momento que cambió todo. Sin saberlo entonces, comenzaba lo más bonito.' },
  { date: 'Primera semana',      event: 'Nuestra primera cita',      desc: 'Los nervios, la sonrisa, el descubrir que quería pasar más tiempo contigo.' },
  { date: 'El primer mes',       event: 'El primero de muchos',      desc: 'Ya sabía que esto era especial. Que tú eras especial.' },
  { date: 'Segundo mes',         event: 'Aventuras y complicidad',   desc: 'Cada plan juntos se volvía una historia que contar.' },
  { date: 'Hoy — 3 meses 🎉',   event: '¡Tres meses contigo!',      desc: 'Y solo quiero que sean el comienzo de muchísimos más a tu lado.' },
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

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.2 });
  tl.querySelectorAll('.timeline-item').forEach(el => obs.observe(el));
})();

// ────────────────────────────────────────────────
// 6. CONTADORES ANIMADOS
// ────────────────────────────────────────────────
(function initCounters() {
  const container = document.getElementById('counters');
  if (!container) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      container.querySelectorAll('.counter-num').forEach(el => {
        if (el.dataset.special) {
          setTimeout(() => { el.textContent = '∞'; }, 800);
          return;
        }
        const target = +el.dataset.target;
        let start = 0;
        const step = ts => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / 1800, 1);
          el.textContent = Math.floor(p * target).toLocaleString();
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      obs.disconnect();
    });
  }, { threshold: 0.3 });
  obs.observe(container);
})();

// ────────────────────────────────────────────────
// 7. DECORACIÓN MINECRAFT (pixeles de corazón y bloques)
// ────────────────────────────────────────────────
(function buildMcDecorations() {
  // Corazón pixel art
  const heartEl = document.getElementById('mcHeart');
  if (heartEl) {
    const heartMap = [
      '0110110','1111111','1111111','0111110','0011100','0001000'
    ];
    const colors = ['#7c3aed','#a855f7','#c4b5fd','#6d28d9','#5b21b6'];
    heartMap.forEach(row => {
      row.split('').forEach(cell => {
        const d = document.createElement('div');
        d.className = 'mc-pixel';
        d.style.background = cell === '1' ? colors[Math.floor(Math.random()*colors.length)] : 'transparent';
        heartEl.appendChild(d);
      });
    });
  }

  // Bloques decorativos
  const blocksEl = document.getElementById('mcBlocks');
  if (blocksEl) {
    const bc = ['#7c3aed','#a855f7','#6d28d9','#4c1d95','#c4b5fd','#5b21b6'];
    for (let i = 0; i < 16; i++) {
      const d = document.createElement('div');
      d.className = 'mc-pixel';
      d.style.background = bc[Math.floor(Math.random()*bc.length)];
      d.style.width = d.style.height = '14px';
      blocksEl.appendChild(d);
    }
  }

  // Footer pixel strip
  const fp = document.getElementById('footerPixels');
  if (fp) {
    const fc = ['#7c3aed','#a855f7','#c4b5fd','#4c1d95','#818cf8'];
    for (let i = 0; i < 24; i++) {
      const d = document.createElement('div');
      d.className = 'footer-pixel';
      d.style.background = fc[Math.floor(Math.random()*fc.length)];
      d.style.opacity = (0.3 + Math.random() * 0.7);
      fp.appendChild(d);
    }
  }
})();

// ────────────────────────────────────────────────
// 8. CREEPERS
// ────────────────────────────────────────────────
initCreepers();
