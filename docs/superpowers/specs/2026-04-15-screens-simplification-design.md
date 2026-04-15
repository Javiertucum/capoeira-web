# Simplificación de pantallas — consistencia con el home

**Fecha:** 2026-04-15
**Estado:** Aprobado

## El problema

Las pantallas de lista de educadores, perfil de educador, perfil de grupo y detalle de núcleo tienen elementos que no encajan con el home simplificado: texto editorial (eyebrows, párrafos descriptivos), headers con card grande y gradientes decorativos, y un orden de secciones que no responde a cómo busca el usuario. Además todas tienen el bug de `<main>` anidado dentro del `<main>` del layout.

## Objetivo

Hacer que las 4 pantallas sean visualmente coherentes con el nuevo home: sin texto editorial, datos directos, layout responsive mobile-first, y el orden de información pensado desde la perspectiva del buscador.

---

## Pantalla 1 — Lista de educadores (`/educators`)

**Archivo:** `app/[locale]/educators/EducatorsListShell.tsx`

### Qué se quita

- El `<section>` grande con `rounded-[30px]`, `border`, gradientes decorativos (`aria-hidden` radiales), `overflow-hidden`
- El eyebrow `{copy.eyebrow}` ("Directorio público")
- El párrafo `{copy.intro}` ("Maestros y profesores de capoeira con perfiles públicos...")
- El panel de conteo lateral (`div` con `xl:flex-col`, el número grande de educadores y la etiqueta "Resultados")

### Qué queda

```
h1: "Educadores"                        ← a la izquierda, tipografía directa
[ 🔍  Nombre, país, grupo... ]  [Buscar] ← mismo form, sin wrapper card
248 educadores                           ← count inline pequeño, texto muted

[Card] [Card] [Card]                     ← grid responsive igual que ahora
[Card] [Card] [Card]
```

La lógica de filtrado (`useDeferredValue`, `useMemo`, URL sync) no cambia. Solo se elimina el wrapper visual del header.

### Responsividad

- Header: columna única en todos los breakpoints (h1 → búsqueda → count)
- Grid de cards: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3` (verificar que sea así o ajustar)
- El form de búsqueda: full width en móvil, con botón a la derecha en `sm:`

---

## Pantalla 2 — Perfil de educador (`/educator/[id]`)

**Archivo:** `app/[locale]/educator/[id]/page.tsx`

### Fix obligatorio

Cambiar `<main className="relative mx-auto ...">` por `<div className="relative mx-auto ...">` (el layout ya envuelve todo en `<main>`).

### Qué se quita

- El gradiente decorativo fijo (`fixed inset-x-0 top-0 h-[500px] bg-[radial-gradient...]`) — no existe en el home, no encaja

### Reordenamiento de secciones

El layout de dos columnas (sticky izquierda + derecha) se mantiene en desktop. Lo que cambia es el **orden dentro de la columna derecha** en móvil y el contenido que sube:

**Orden actual (columna derecha):**
1. Botón CTA de contacto principal (WhatsApp o Instagram)
2. Biografía
3. Links sociales (sección "Contacto")
4. Núcleos con horarios

**Orden nuevo:**
1. Redes sociales — fila de todos los links disponibles (WhatsApp, Instagram, Facebook, YouTube, TikTok, web) como botones pequeños, sin título de sección, directamente visibles
2. Núcleos — sección completa con nombre, ubicación, dirección, horarios (chips), botón WhatsApp por núcleo, link "Ver núcleo"
3. Biografía — sección secundaria al fondo

**Nota:** El botón CTA grande "Contactar — WhatsApp" que ocupa ancho completo desaparece. Las redes sociales se muestran como fila de chips/botones, igual que están ahora en la sección "Contacto" pero subidas al primer lugar.

### Núcleos — sin cambios de contenido

Los núcleos ya muestran todo lo necesario:
- Nombre del núcleo
- Ubicación (ciudad, país)
- Dirección
- Horarios como chips
- Botón WhatsApp con mensaje preescrito
- Link "Ver núcleo"

Solo cambia su posición en el orden de secciones.

### Responsividad

- En móvil (`< md`): columna única. Orden: avatar+nombre+rol+graduación+grupo+ubicación → redes sociales → núcleos → bio
- En desktop (`md:`): dos columnas. Izquierda sticky: avatar+nombre+rol+graduación+grupo+ubicación. Derecha: redes sociales → núcleos → bio

---

## Pantalla 3 — Perfil de grupo (`/group/[id]`)

**Archivo:** `app/[locale]/group/[id]/page.tsx`

### Fix obligatorio

Cambiar `<main className="relative mx-auto ...">` por `<div className="relative mx-auto ...">`.

### Qué se quita

- El objeto `COPY` (líneas ~20-37) con `eyebrow` y `summary`
- La función `getCopy` y la variable `copy` en el componente
- El renderizado de `copy.eyebrow` y `copy.summary` en el JSX (si existen en el header)
- El gradiente decorativo fijo (`fixed inset-x-0 top-0 h-[520px] bg-[radial-gradient...]`)

### Qué queda

El nombre del grupo como encabezado principal + todos los datos actuales sin cambios:
- Stats (miembros, núcleos, países, ciudades, sistema de graduación)
- Lista de núcleos
- Sistema de graduación
- Educadores del grupo
- Link/admin

### Responsividad

Sin cambios en el layout existente — verificar que funciona correctamente en móvil sin el gradiente fijo.

---

## Pantalla 4 — Detalle de núcleo (`/nucleo/[groupId]/[id]`)

**Archivo:** `app/[locale]/nucleo/[groupId]/[id]/page.tsx`

### Fix obligatorio

Cambiar `<main className="relative mx-auto ...">` por `<div className="relative mx-auto ...">`.

### Qué se quita

- El gradiente decorativo fijo (`fixed inset-x-0 top-0 h-[500px] bg-[radial-gradient...]`)

### Sin cambios de contenido

Esta página ya no tiene texto editorial (sin COPY eyebrow/summary). El header ya es directo:
- Nombre del grupo como label pequeño
- Nombre del núcleo como `h1`
- Ciudad/país
- Dirección

Los datos (horarios, mapa embed, miembros, educador responsable, co-educadores, link al grupo) se mantienen tal cual.

---

## Resumen de cambios por archivo

| Archivo | Cambios |
|---|---|
| `EducatorsListShell.tsx` | Quitar header editorial (section card + eyebrow + intro + count panel) |
| `educator/[id]/page.tsx` | Fix `<main>`, quitar gradiente fijo, reordenar columna derecha (redes → núcleos → bio) |
| `group/[id]/page.tsx` | Fix `<main>`, quitar COPY + gradiente fijo |
| `nucleo/[groupId]/[id]/page.tsx` | Fix `<main>`, quitar gradiente fijo |

## Fuera de alcance

- Cambios en la lógica de datos o queries
- Cambios en el mapa (`/map`)
- Cambios en el home (ya hecho)
- Nuevas funcionalidades
- Cambios en los componentes `EducatorCard`, `CordaVisual`, `NucleoListItem`
