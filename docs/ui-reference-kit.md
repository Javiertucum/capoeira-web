# UI Reference Kit

## Objetivo

Esta web necesita verse menos "demo oscura generica" y mas "directorio vivo de comunidad + herramienta util".
La direccion recomendada es:

- energia editorial
- busqueda muy clara
- tarjetas con mas contexto real
- mapa/lista pensados primero para uso movil
- CTA final de app honesto y creible

## Stack recomendado

Para implementar el rediseno en este repo:

- `shadcn/ui` para bloques base y velocidad de ejecucion
- `Radix Primitives` para navegacion, sheet, tabs y accesibilidad
- `Tailwind v4` para sistema visual y tokens del proyecto

## Referencias por bloque

### 1. Hero + busqueda

- Airbnb homepage
  - https://www.airbnb.com/
  - Referencia util: hero orientado a accion, con la busqueda como protagonista y categorias claras.
- Land-book
  - https://land-book.com/
  - Util para explorar heroes `Community`, `Mobile App`, `Bright Colors`, `Big Type`.
- Godly
  - https://godly.website/website/eindhoven-design-district-889
  - Referencia de tono visual: `Colourful`, `Large Type`, `Light`.

Aplicado a Agenda Capoeiragem:

- titular corto y fuerte
- subtitulo con promesa util, no poetica
- buscador con mas peso visual que el resto del hero
- chips debajo del input: `Grupos`, `Educadores`, `Nucleos`, `Eventos`
- fondo mas vivo: textura, degradado o composicion editorial, no solo plano oscuro

### 2. Menu desktop + drawer movil

- Radix Navigation Menu
  - https://www.radix-ui.com/primitives/docs/components/navigation-menu
  - Muy bueno para una navbar solida y accesible.
- shadcn Sheet
  - https://ui.shadcn.com/docs/components/sheet
  - Base perfecta para rehacer el menu movil sin inventar comportamiento.

Aplicado a Agenda Capoeiragem:

- navbar mas limpia y con mejor jerarquia
- CTA principal visible siempre
- drawer movil con 1 accion primaria y 3-4 enlaces maximo
- evitar que el idioma compita visualmente con el CTA

### 3. Vista mapa + lista

- Airbnb search results
  - https://www.airbnb.com/s/homes
  - Referencia fuerte para resultados con tarjetas claras, filtros y toggle de mapa.
- shadcn Tabs
  - https://ui.shadcn.com/docs/components/tabs
  - Muy util para resolver `Lista | Mapa` en movil sin friccion.

Aplicado a Agenda Capoeiragem:

- en movil: tabs `Lista` y `Mapa`, con `Lista` por defecto
- en desktop: lista a la izquierda, mapa sticky a la derecha
- filtros mas legibles y menos "pill demo"
- tarjeta de resultado con 2-3 datos utiles antes del click

### 4. Cards y fichas de grupos

- Airbnb listing cards
  - https://www.airbnb.com/s/homes
  - Buen ejemplo de jerarquia: imagen, nombre, meta data, rating, info breve.
- ClassPass studio pages
  - https://classpass.com/studios/sculpt-studio-group-classes-quezon-city
  - Muy buena referencia para detalles de estudio: amenidades, horarios, reviews, preparacion.
- shadcn Card + Badge
  - https://ui.shadcn.com/docs/components/card
  - https://ui.shadcn.com/docs/components/badge

Aplicado a Agenda Capoeiragem:

- mostrar ciudad, pais, estilo, idioma o nivel
- agregar badges reales: `Infantil`, `Adultos`, `Batizado`, `Roda`, `Verificado`
- usar una imagen/logo con mejor tratamiento visual
- convertir la ficha de grupo en una pagina con:
  - resumen
  - ubicacion
  - responsables
  - horarios o eventos cercanos
  - redes
  - nucleos asociados

### 5. CTA final + pagina de app

- Linear Mobile
  - https://linear.app/mobile
  - Muy buena referencia para CTA de app: mensaje simple, mockup, QR, badges reales, lenguaje directo.

Aplicado a Agenda Capoeiragem:

- si no hay links reales de App Store / Play Store, no fingirlos
- usar CTA honesto: `Unete a la beta`, `Pide acceso`, `Recibe novedades`
- si si existen stores, entonces mostrar:
  - badges oficiales
  - QR
  - 3 beneficios concretos

## Herramientas que si nos sirven

### Inspiracion

- Mobbin
  - https://mobbin.com/
  - Para flujos moviles reales: onboarding, perfiles, search, filtros.
- Land-book
  - https://land-book.com/
  - Para hero, layout, tipografia y direccion visual.
- Godly
  - https://godly.website/
  - Para ideas con mas personalidad y menos look SaaS generico.

### Implementacion

- shadcn/ui
  - https://github.com/shadcn-ui/ui
- Radix Primitives
  - https://github.com/radix-ui/primitives

### Auditoria

- Lighthouse
  - https://developer.chrome.com/docs/lighthouse
- axe-core
  - https://github.com/dequelabs/axe-core
- WebAIM Contrast Checker
  - https://webaim.org/resources/contrastchecker/

## Lo que copiaria y lo que no

Copiaria:

- busqueda protagonista
- cards con mejor jerarquia
- mapa/lista con comportamiento claro
- CTA final muy concreto
- tipografia con mas caracter

No copiaria:

- gradientes oscuros genericos por todos lados
- exceso de glassmorphism
- layouts de SaaS intercambiables
- cards vacias con datos placeholder

## Prioridad recomendada

1. Hero + navbar
2. Mapa/lista en movil
3. Cards de educadores y grupos
4. Fichas de detalle
5. CTA final de app

## Siguiente paso

Si seguimos con esto, el siguiente bloque con mejor retorno es:

1. rehacer `Nav`
2. redibujar el `hero`
3. convertir `/map` en una experiencia `Lista | Mapa` mas clara en movil
