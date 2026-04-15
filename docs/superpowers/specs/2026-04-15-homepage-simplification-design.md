# Rediseño de la página de inicio

**Fecha:** 2026-04-15
**Estado:** Aprobado

## El problema

La página de inicio actual tiene demasiadas cosas para ser un directorio. Tiene un bloque principal con dos columnas, un panel con puntos, estadísticas, tarjetas de categorías, educadores destacados, una sección para promocionar la app con un mockup de teléfono y anuncios. Todo eso complica la experiencia para alguien que solo quiere encontrar un núcleo, un grupo o un educador.

## Lo que queremos lograr

Que la página de inicio funcione como la entrada real a un directorio: lo primero que ve el usuario es el buscador, la página es corta, no hay que hacer scroll, y desde ahí se puede ir directamente a cualquier sección.

## Cómo va a quedar

### Estructura visual

```
NAV: Logo · Mapa · Educadores · Grupos · [ES/PT/EN]

─────────────────────────────────────────────────

  Agenda Capoeiragem
  Directorio global de capoeira

  [ 🔍  Ciudad, país, grupo...         ]

  842 Núcleos  ·  64 Grupos  ·  1.2k Educadores

  [ Ver mapa ]  [ Educadores ]  [ Grupos ]

─────────────────────────────────────────────────

FOOTER: © 2026 · Privacy · Terms
```

### Bloque principal (la parte central de la página)

- Nombre de la app: "Agenda Capoeiragem" en letra pequeña y color verde
- Título principal (invisible para el usuario pero importante para Google): "Agenda Capoeiragem"
- Subtítulo: una frase corta según el idioma — español, portugués o inglés
- Barra de búsqueda: la misma que ya existe, sin cambios
- Fila de números reales: cuántos núcleos, grupos y educadores hay en la base de datos
- Tres botones de acción:
  - **Ver mapa** (botón verde, el más destacado) → va al mapa de núcleos
  - **Educadores** (botón secundario) → va a la lista de educadores
  - **Grupos** (botón secundario) → va al mapa con filtro de grupos

La página no tiene scroll. Después del bloque principal viene directo el pie de página.

### Menú de navegación

Se elimina el botón "App Preview" que aparece en la esquina superior derecha — añade ruido sin ser útil para el visitante. Se mantiene:
- El logo con el nombre
- Los tres links: Mapa · Educadores · Grupos
- El selector de idioma (ES / PT / EN)
- El menú hamburguesa en móvil (con los mismos links, sin el botón de la app)

### Qué se elimina de la página

| Sección | Se elimina |
|---|---|
| Bloque hero con dos columnas y panel de texto | ✓ |
| Barra de estadísticas separada | ✓ — los números pasan al bloque principal |
| Tarjetas de categorías (Núcleos / Grupos / Educadores) | ✓ |
| Grid de educadores destacados | ✓ |
| Sección de la app con mockup de teléfono | ✓ |
| Bloque de anuncios | ✓ |

### Qué se mantiene

- La barra de búsqueda existente — sin cambios
- La consulta que trae los números del directorio — se sigue usando
- Los datos para Google (JSON-LD) — se mantienen en la página
- El pie de página — sin cambios
- Todo el sistema de idiomas — sin cambios

### Textos de la página

Los textos cortos del bloque principal (subtítulo, etiquetas de los botones, etiquetas de las estadísticas) reutilizan las traducciones que ya existen en los archivos de idioma. Solo se añaden claves nuevas si hace falta algo que no existe todavía. Se elimina el objeto grande de textos editoriales que ya no tiene razón de estar.

## Qué no cambia con este rediseño

- La página del mapa
- Las páginas de educadores, grupos y núcleos
- El comportamiento de la búsqueda
- El contenido del pie de página
- El SEO y el sitemap
- Ninguna funcionalidad nueva
