# Handoff: Rediseño Agenda Capoeiragem (web pública)

> Para Claude Code · trabajando en `capoeira-web/` (Next.js 15 + next-intl + Tailwind v4)
> Fecha: abril 2026

---

## 1 · Qué es esto

Este bundle es el **rediseño visual completo** de la web pública de Agenda Capoeiragem.
Es el front-door público (sin login) del directorio: núcleos, grupos, educadores. La app
móvil es la "cocina" donde se publican los datos; la web es solo descubrimiento.

**Los archivos `.html`/`.jsx`/`.css` son MAQUETAS de referencia, no código de producción.**
Tu trabajo es **recrear estas maquetas dentro del codebase existente**
(`capoeira-web/`) usando Next.js 15 + Tailwind v4 + next-intl, no copiar este HTML literal.

## 2 · Fidelidad

**Hi-fi.** Pixel-perfect en colores, tipografía, espaciados y tono de copy.
Hay que respetar:

- Paleta exacta (ver `tokens.css`).
- Tipografía Poppins (700/800) para encabezados + Inter (400/500/600) para texto.
- La voz editorial del copy (ES). En `pt`/`en` traducir manteniendo el mismo tono.
- La línea berimbau (degradé oro→brick) como elemento sistémico, no decorativo.
- La barra `corda` como graduación visual de cada educador.

Lo que está mockeado y debe reemplazarse por lo real:

- **Mapa**: hoy es un SVG estilizado (`MapStub` en `cap-atoms.jsx`). En producción
  va con el provider que ya esté integrado en la web (Google Maps / Mapbox).
  Mantén la **línea visual** (gratícula sobria, pin acento, controles minimalistas).
- **Imágenes**: hay placeholders con clase `.img-ph`. Reemplazar con las imágenes
  reales subidas vía ImgBB (ya integrado en la app móvil).
- **Datos**: todos los números, nombres y ciudades son ejemplos. Vienen de Firestore.

## 3 · Arquitectura objetivo

Mantén la estructura actual de `capoeira-web/app/[locale]/`:

```
/[locale]/
├── page.tsx          ← Home (artboard 01)
├── map/page.tsx      ← Mapa + Lista (02)
├── educators/        ← Directorio educadores (03)
├── app/page.tsx      ← Companion móvil (04)
├── group/[id]/       ← Detalle grupo (05)
├── educator/[id]/    ← Detalle educador (06)
└── nucleo/[groupId]/[id]/  ← Detalle núcleo (07)
```

Las 9 maquetas (7 desktop + 3 mobile) cubren todo el flujo público.
**No hay sección de eventos en la web.** Los eventos son privados y viven solo en la app.

## 4 · Sistema de diseño

### 4.1 · Color (light por defecto, dark variant lista en `tokens.css`)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#F4EFE6` | Crema base — fondo de página |
| `--bg-elev` | `#FBF7EE` | Papel — cards secundarias |
| `--surface` | `#FFFFFF` | Cards principales |
| `--surface-muted` | `#EDE6D8` | Fondos sutiles, tags mono |
| `--ink` | `#1A1814` | Texto principal · negro cálido |
| `--ink-2` | `#3D3833` | Texto secundario |
| `--ink-3` | `#6B645A` | Labels, metadata |
| `--ink-4` | `#9A9388` | Texto deshabilitado |
| `--line` | `#D9CFBE` | Bordes |
| `--line-soft` | `#E8DFCD` | Separadores |
| `--accent` | `#D9542B` | Brick / berimbau · CTAs, links activos |
| `--accent-ink` | `#B23E1A` | Texto sobre accent-soft |
| `--accent-soft` | `#FBE7DC` | Chips, highlights |
| `--gold` | `#C99A3A` | Punta de berimbau, cordas |
| `--green` | `#2F5D3B` | Verificado, activo |
| `--green-soft` | `#DDE8DD` | Chip verificado |

**Regla del acento:** el `--accent` aparece poco. Solo en CTA principal,
estado seleccionado, link hover, y la línea berimbau. No usarlo como fondo de cards.

### 4.2 · Tipografía

```
--font-display: "Poppins", system-ui, sans-serif;   (700, 800)
--font-body:    "Inter", system-ui, sans-serif;      (400, 500, 600)
--font-mono:    "JetBrains Mono", ui-monospace, monospace;  (400, 500)
```

**Escala (desktop):**

| Uso | Tamaño | Peso | Tracking |
|---|---|---|---|
| Hero h1 | 80–92px | Poppins 800 | -0.035em |
| Section h2 | 28–32px | Poppins 700 | -0.03em |
| Card h3 | 22–32px | Poppins 700 | -0.02em |
| Body | 14–18px | Inter 400 | -0.005em |
| Eyebrow | 11px | Mono 500 uppercase | 0.18em |
| Tag-mono | 11px | Mono 500 uppercase | 0.04em |

**Mobile:** baja el hero a 32–40px, mantén la jerarquía.

**Énfasis:** los `<em>` dentro de h1 son brick (`--accent`) y peso 800, no itálica.

### 4.3 · Radios

| Token | px | Uso |
|---|---|---|
| `--radius-xs` | 6 | Tags pequeños |
| `--radius-sm` | 10 | Inputs, chips |
| `--radius-md` | 16 | Cards pequeñas |
| `--radius-lg` | 22 | Cards principales, mapa |
| `--radius-xl` | 28 | Hero containers |
| `--radius-2xl` | 36 | Marco de teléfono mockup |

Botones y chips son `border-radius: 999px` (pill).

### 4.4 · Sombras

```css
--shadow-sm: 0 1px 2px rgba(40,28,12,0.05);
--shadow-md: 0 4px 16px rgba(40,28,12,0.06), 0 1px 3px rgba(40,28,12,0.05);
--shadow-lg: 0 18px 46px rgba(40,28,12,0.1), 0 2px 6px rgba(40,28,12,0.05);
```

Sombras cálidas (tinte café), nunca grises neutras.

### 4.5 · Componentes base

Implementados en `cap-atoms.jsx` (referencia, no producción):

- **`<NavBar>`** — sticky, blur, pill nav central, switcher es/pt/en.
- **`<NavBarMobile>`** — header simple con logo + menú hamburguesa.
- **`<BottomTabs>`** — tab bar flotante para mobile (Home, Mapa, Grupos, Perfil).
- **`<HeroSearchBar>`** — input grande con CTA brick.
- **`<Stat n label>`** — número Poppins display + label mono uppercase.
- **`<Corda c1 c2 tip>`** — barra de graduación bicolor con puntas.
- **`<MapStub>`** — placeholder SVG del mapa (a reemplazar).
- **`<BerimbauRule>`** — línea-divisor de degradé oro→brick.
- **`<Logo>`** — marca tipográfica (no SVG).

### 4.6 · Patrones de card

| Clase | Background | Border | Uso |
|---|---|---|---|
| `.card` | `--surface` | `--line` | Default |
| `.card-paper` | `--bg-elev` | `--line` | Variación cálida |
| `.card-ink` | `--ink` (texto crema) | none | CTA destacado / "Para educadores" |

### 4.7 · Chips

```
.chip          — surface + line, default
.chip.active   — ink invertido
.chip.acc      — accent-soft + accent-ink
.chip.green    — green-soft + green
.chip.sm       — versión compacta (24px)
```

### 4.8 · Imágenes placeholder

```css
.img-ph {
  background: repeating-linear-gradient(135deg, transparent 0 7px, rgba(26,24,20,0.04) 7px 8px), var(--surface-muted);
  display: grid; place-items: center;
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink-4);
}
```

Mantén este patrón mientras no haya imagen real.

## 5 · Páginas (artboards)

Cada página tiene un `.jsx` de referencia en `artboards/`. Léelo para ver
estructura exacta de secciones, espaciados y copy. Resumen:

### 01 · Home (`artboards/home.jsx` · 1280×1860)

- **Hero split** (60/40): titular grande izquierda + card de stats live derecha.
- **Hero search bar** + chips de atajos (ciudades + filtros con conteo).
- **Línea berimbau** como divisor de sección.
- **Tres puertas** (Mapa / Grupos / Educadores) en cards con número grande
  y burbuja de color tonal. Cada card linkea a su directorio.
- **Mapa teaser + sidebar** (1.4fr / 1fr): preview del mapa global a la izquierda,
  card "Ciudad de la semana" + card-ink "Para educadores · Descargar app".
- **Footer**: logo + claim + links legales + copyright mono.

Copy del hero (ES): "Encuentra **capoeira** cerca de tu casa." (em en brick 800).

### 02 · Mapa + Lista (`artboards/map.jsx` · 1280×1100)

- Header con título + filter chips activos (con × removible) + chip "+ filtro".
- Layout split (520px panel · resto mapa). Panel scrollable de núcleos,
  mapa a la derecha con pin activo destacado.
- Cada item de la lista: thumbnail, nombre, grupo, ciudad, schedule, badges, distancia.
- Mapa: usar provider real respetando estilo cálido. Pin activo brick + ring blanco.

### 03 · Educadores (`artboards/educators-group.jsx` · 1280×1240)

- Header con título + 4 stats (Educadores totales, Maestros, Países, Grupos).
- Filter row: search + 5 chips (Todos, Mestres, Profesores, Verificados, Cerca).
- Grid 3 columnas de `EducatorCard`:
  - Foto cuadrada 280×280 placeholder
  - Nombre + grado (Mestre / Professor / Aluno)
  - Ciudad + grupo
  - Barra `Corda` con su graduación
  - Badge "Verificado" si aplica
  - CTA "Ver perfil →"

### 04 · App / Companion móvil (`artboards/app-page.jsx` · 1280×1320)

- Hero split: titular + mockup de teléfono inclinado con sticker "v1.0 · gratis".
- Botones store: Google Play (disponible) + App Store (próximamente).
- Sección **"Una sola base de datos, dos puertas"**: card surface (Web pública,
  para encontrar) + card-ink (App, para participar). Lista de features con check.
- **Grid 2×2 de features de la app**: gestión de núcleos, sistema de cordas,
  agenda de eventos privada, mensajes/perfil.
- CTA strip final: "¿Tu núcleo todavía no aparece? → Descargar app".

### 05 · Grupo detail (`artboards/details.jsx` → `GroupArtboard` · 1280×1280)

- Hero del grupo con escudo placeholder + nombre + linaje + chips.
- Tabs: Resumen · Núcleos · Educadores · Graduación.
- Sección graduación: visualización de cordas del grupo (barra por nivel).
- Lista de núcleos con miniatura de mapa.
- Sidebar con Mestre fundador + ciudad sede + país.

### 06 · Educador detail (`artboards/details.jsx` → `EducatorDetailArtboard` · 1280×1180)

- Hero con foto grande + nombre + grado + ciudad + corda.
- CTAs: WhatsApp (primario) + Instagram (ghost).
- Sección "Donde enseña": cards de núcleos donde da clase.
- Bio + linaje + año de inicio.

### 07 · Núcleo detail (`artboards/details.jsx` → `NucleoDetailArtboard` · 1280×1100)

- Hero con foto + nombre + dirección + chips (Verificado, Adultos, Infantil…).
- Schedule en grid: días × horarios × tipo de clase.
- Sidebar con responsable (educador), grupo, contacto WhatsApp.
- Card-ink "Próximo treino · Sábado 10:00" abierta a visitantes.
- Mapa pequeño con la ubicación.

### M-01 · Mobile Home (`artboards/mobile.jsx` · 390×780)

- NavBar mobile + greeting eyebrow.
- Hero h1 40px: "Encuentra **capoeira** cerca."
- Search bar pill + lista "Hoy en tu ciudad" (cards de horarios).
- Bottom tab bar flotante (Inicio activo).

### M-02 · Mobile Mapa (`artboards/mobile.jsx` · 390×780)

- Header + título "312 núcleos cerca".
- Search bar con icono de filter al final.
- Chip row scrolleable horizontal.
- Mapa stub fijo arriba.
- Bottom sheet con núcleo seleccionado (handle, nombre, distancia, chips).

### M-03 · Mobile Educador (`artboards/mobile.jsx` · 390×780)

- Hero foto cuadrada + nombre + grado + corda.
- Botones grid 2 col: WhatsApp + Instagram.
- Sección "Donde enseña" con card de núcleo.

## 6 · Interacciones y comportamiento

- **Nav links**: estado activo = pill ink con texto bg.
- **Cards clicables**: `transition: box-shadow .15s, transform .15s` en hover.
- **Hover botones primario**: cambia a `--accent` (sutil reveal del brick).
- **Sticky header** con backdrop-filter blur(10px) y bg crema 88% opacidad.
- **Filter chips removibles** (× al final) que se quitan al click.
- **Bottom sheet mobile**: handle drag-able (en producción), por ahora estático.
- **Mapa**: pin activo se agranda 18→24px con ring blanco al click.

## 7 · i18n

La web ya usa `next-intl` con es/pt/en. **Añadir/actualizar keys**:

- Quitar todas las strings de `events` / "Eventos" (ya no hay sección).
- Añadir keys para la página /app (companion móvil).
- Hero key: "Encuentra capoeira cerca de tu casa" (no "una roda").
- Mantener tono editorial cálido en todos los locales.

## 8 · Lo que NO hay que copiar de las maquetas

- React 18 UMD + Babel inline → usa los Server/Client Components reales del codebase.
- `window.CapAtoms` global → conviértelo en imports de `components/ui/`.
- DesignCanvas + DCArtboard → solo es el contenedor de presentación, descártalo.
- Estilos en `style={{}}` inline → llévalos a Tailwind classes y/o CSS modules.
- `MapStub` → reemplazar con el provider real ya integrado.

## 9 · Lo que SÍ hay que copiar literal

- `tokens.css` → traducir 1:1 a `app/globals.css` y `tailwind.config` (extender colors).
- Las clases `.berimbau-line`, `.corda`, `.img-ph`, `.tag-mono`, `.section-head` → utilities.
- Estructura de cada artboard (orden de secciones, jerarquía, copy).
- Iconos del set `I` en `cap-atoms.jsx` (stroke 1.6, size 16 default).

## 10 · Archivos en este bundle

```
design_handoff_capoeiragem_redesign/
├── README.md                          ← este archivo
├── Capoeiragem Redesign.html          ← entry point — abrir en navegador para ver todo
├── tokens.css                         ← sistema de diseño completo
├── design-canvas.jsx                  ← solo presentación, no portar
├── cap-atoms.jsx                      ← componentes compartidos (referencia)
└── artboards/
    ├── home.jsx                       ← 01 Home
    ├── map.jsx                        ← 02 Mapa
    ├── educators-group.jsx            ← 03 Educadores + 05 Grupo
    ├── details.jsx                    ← 06 Educador + 07 Núcleo
    ├── app-page.jsx                   ← 04 Companion móvil
    └── mobile.jsx                     ← M-01, M-02, M-03 mobile
```

## 11 · Orden sugerido de implementación

1. **Tokens + tipografía + globals.css** (sin esto nada se ve bien).
2. **Componentes base**: NavBar, Logo, Footer, Card variants, Chip, Button, Stat, Corda.
3. **Home** (es la cara más vista).
4. **Mapa** (con provider real).
5. **Educadores listing** + **Educador detail**.
6. **Grupos listing** + **Grupo detail**.
7. **Núcleo detail**.
8. **/app companion page**.
9. **Mobile responsive** (bottom tabs aparecen <768px).
10. **i18n pt/en** completo.

## 12 · Contacto

Si algo de este documento es ambiguo, la fuente de verdad es el HTML.
Abre `Capoeiragem Redesign.html` en un navegador, usa el canvas para
inspeccionar cualquier artboard fullscreen (icono ⤢ arriba-derecha de cada card).
