# 💜 3 Meses Contigo — Página de Aniversario

Página web romántica y personalizada para celebrar 3 meses de noviazgo.  
Tema morado, personajes favoritos animados, Creepers de Minecraft, sección de LoL y video especial.

---

## 📁 Estructura del proyecto

```
amor-3meses/
├── index.html              ← Página principal (edita aquí los textos)
├── css/
│   └── style.css           ← Todos los estilos
├── js/
│   ├── main.js             ← Lógica principal, música, galería, contadores
│   └── creepers.js         ← Animación de Creepers de Minecraft
└── assets/
    ├── audio/
    │   └── cancion.mp3     ← PON AQUÍ tu canción (ej: Steal the Show)
    ├── images/
    │   ├── kuromi.png      ← Imagen de Kuromi
    │   ├── rapunzel.png    ← Imagen de Rapunzel
    │   ├── ember.png       ← Imagen de Ember (Elementos)
    │   ├── wade.png        ← Imagen de Wade (Elementos)
    │   └── flynn.png       ← Imagen de Flynn Rider
    └── video/
        └── mi-video.mp4    ← PON AQUÍ tu video romántico (opcional)
```

---

## ✏️ Cómo personalizar

Abre `index.html` y busca los comentarios `══ EDITA ... AQUÍ ══`:

| Qué cambiar | Dónde en index.html |
|---|---|
| Sus nombres | Sección `HERO` → `<strong>TU NOMBRE</strong>` |
| Carta de amor | Sección `CARTA DE AMOR` → el párrafo `<p>` |
| Firma | `<p class="letter-sig">` |
| Mensaje del footer | `<p>Felices 3 Meses...` |
| Textos de Minecraft/LoL | Sección `GAMING` |
| Eventos de la línea de tiempo | `js/main.js` → array `timelineEvents` |
| Razones por las que te amo | `js/main.js` → array `reasons` |
| Captions de las fotos | `js/main.js` → array `photos` |

---

## 🎵 Agregar la música

1. Descarga "Steal the Show" (Liam Payne) u otra canción en formato MP3.
2. Renómbrala `cancion.mp3`.
3. Colócala en `assets/audio/cancion.mp3`.
4. ¡Listo! La música comenzará automáticamente al abrir la página.

> **Nota:** Los navegadores modernos bloquean el autoplay hasta que el usuario
> interactúa con la página. La música iniciará en el primer clic/toque.

---

## 🎬 Agregar el video romántico

### Opción A — Video local (archivo MP4)
1. Copia tu video a `assets/video/mi-video.mp4`.
2. En `index.html`, busca la sección `VIDEO ROMÁNTICO`.
3. Descomenta el bloque `OPCIÓN A` y elimina el bloque `.video-placeholder`.

### Opción B — YouTube
1. Sube tu video a YouTube (puede ser privado o no listado).
2. Copia el ID del video (la parte después de `v=` en la URL).
3. En `index.html`, busca `OPCIÓN B` y reemplaza `XXXXXXXXXXX` con el ID.
4. Elimina el bloque `.video-placeholder`.

---

## 🖼️ Agregar las imágenes de los personajes

Guarda las imágenes PNG (con fondo transparente idealmente) en `assets/images/`:

- `kuromi.png`
- `rapunzel.png`
- `ember.png`
- `wade.png`
- `flynn.png`

Puedes buscarlas en Google como "Kuromi PNG sin fondo" o en sitios como PNGWing, PNGTree, etc.

---

## 🚀 Subir a GitHub Pages

1. Crea un repositorio en [github.com](https://github.com).
2. Sube todos los archivos (mantén la estructura de carpetas).
3. Ve a **Settings → Pages → Branch: main → Save**.
4. ¡Tu página estará en `https://tu-usuario.github.io/nombre-repo/`!

---

## 🎮 Funciones interactivas

- **Creepers de Minecraft** — aparecen, caminan y explotan dejando un 💜. ¡Haz clic en ellos!
- **Galería de fotos** — haz clic en cada cuadro para subir una foto desde tu dispositivo.
- **Contadores animados** — se animan al hacer scroll hasta esa sección.
- **Línea de tiempo** — aparece con animación al hacer scroll.
- **Música de fondo** — el botón 🎵 pausa/reproduce la canción.

---

*Hecho con 💜 para celebrar 3 meses de amor*
