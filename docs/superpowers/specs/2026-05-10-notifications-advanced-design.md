# Notificaciones Admin — Filtros avanzados, deep links y tracking

**Fecha:** 2026-05-10  
**Estado:** Aprobado

---

## Resumen

Mejora del sistema de notificaciones push en el panel admin con tres ejes:

1. **Filtros avanzados de audiencia** — grupos, sin grupo, búsqueda individual de usuarios
2. **Pantalla de destino (deep link)** — pantalla genérica o contenido específico al presionar la notificación
3. **Tracking de entrega y apertura** — subcolección por campaña + endpoint que llama la app al abrir + vista de detalle con tabla por usuario

---

## Arquitectura general

```
Admin Panel (UI)
├── AdminNotificationSendForm       → filtros avanzados + deep link selector
├── AdminNotificationCampaignDetail → nueva vista de detalle por campaña
└── UserSearchCombobox              → búsqueda de usuarios con sugerencias

API Routes
├── POST /api/admin/notifications                         → crear campaña (sin cambios mayores)
├── POST /api/admin/notifications/send                    → enviar + escribir recipients + deep link payload
├── GET  /api/admin/notifications/[campaignId]/recipients → lista paginada de recipients
├── GET  /api/admin/notifications/estimate                → estimación de audiencia sin enviar
└── POST /api/notifications/opened                        → llamado por la app al abrir notificación

App Móvil (Expo)
└── notification open handler → navega a pantalla destino + llama /api/notifications/opened

Firestore
├── adminNotificationCampaigns/{id}
│   ├── segment: { roles, countries, plans, groupIds, noGroup, userIds }
│   ├── metrics: { targeted, sent, failed, opened }
│   └── deepLink: { screen, entityId?, entityType? }
└── adminNotificationCampaigns/{id}/recipients/{userId}
    ├── displayName: string
    ├── email: string
    ├── sent: boolean
    ├── opened: boolean
    └── openedAt: Timestamp | null
```

---

## Sección 1: Filtros avanzados de audiencia

### Nuevos controles en `AdminNotificationSendForm`

**Segmentación por grupo**
- Dropdown multi-select con todos los grupos cargados desde Firestore `groups`
- Toggle "Sin grupo" — al activarse incluye usuarios sin `groupId`, combinable con todos los demás filtros
- Si hay grupos seleccionados Y toggle "sin grupo" activo → audiencia incluye ambos conjuntos (unión)

**Búsqueda individual de usuarios**
- Input con debounce 300ms → llama a `/api/admin/users/search?q=...`
- Resultados: dropdown con avatar + nombre + email
- Al seleccionar → chip con nombre + X para eliminar
- Múltiples usuarios seleccionables
- Se suman (unión) a la audiencia de los demás filtros

**Estimación de audiencia**
- Contador "~47 usuarios alcanzados" que recalcula con debounce al cambiar filtros
- Llama a `/api/admin/notifications/estimate` (misma lógica que `send` pero sin enviar)

### Lógica de combinación en el servidor

```
audiencia_base = usuarios que cumplen (roles ∩ países ∩ planes)
               ∩ (en grupos seleccionados ∪ usuarios_sin_grupo si noGroup=true)

audiencia_final = audiencia_base ∪ usuarios añadidos individualmente (userIds)
```

### Endpoint de búsqueda de usuarios

`GET /api/admin/users/search?q={query}`
- Requiere rol admin
- Busca por `displayName` y `email` en Firestore `users` (case-insensitive con índice o query range)
- Devuelve máximo 10 resultados: `[{ uid, displayName, email, photoURL? }]`

---

## Sección 2: Pantalla de destino (deep link)

### Selector en el formulario admin

**Paso 1 — Tipo de pantalla** (dropdown obligatorio)

| Valor | Label |
|-------|-------|
| `home` | Inicio |
| `events` | Eventos (lista) |
| `feed` | Noticias / Feed |
| `profile` | Mi perfil |
| `event` | Evento concreto |
| `post` | Post / noticia |
| `userProfile` | Perfil de usuario |

**Paso 2 — Selector de contenido** (solo para `event`, `post`, `userProfile`)
- Input de búsqueda con debounce → dropdown de resultados del tipo correspondiente
- Al seleccionar → chip con nombre/título visible
- Endpoints de búsqueda:
  - `/api/admin/search/events?q=...`
  - `/api/admin/search/posts?q=...`
  - `/api/admin/users/search?q=...` (reutiliza el de audiencia)

### Payload FCM

Se añade en el campo `data` (no `notification`) para que la app lo controle:

```json
{
  "campaignId": "abc123",
  "screen": "event",
  "entityId": "eventId456",
  "entityType": "event"
}
```

Para pantallas genéricas, `entityId` y `entityType` se omiten.

### Almacenamiento en Firestore

Campo `deepLink` en el documento de campaña:
```json
{
  "screen": "event",
  "entityId": "eventId456",
  "entityType": "event"
}
```

---

## Sección 3: Tracking de entrega y apertura

### Escritura al enviar

Por cada usuario en la audiencia, el endpoint `/api/admin/notifications/send` crea:

```
adminNotificationCampaigns/{campaignId}/recipients/{userId}
{
  displayName: string,
  email: string,
  sent: boolean,      // true si FCM aceptó el token
  opened: false,
  openedAt: null
}
```

El campo `metrics.opened` se inicializa a `0` en el documento padre.

### Endpoint de apertura

`POST /api/notifications/opened`

- **Auth:** token Firebase de usuario normal (no admin) — el `userId` se extrae del token
- **Body:** `{ campaignId: string }`
- **Lógica:**
  1. Verificar que existe `recipients/{userId}` y que `sent: true`
  2. Si `opened` ya es `true`, ignorar (idempotente)
  3. Update: `opened: true`, `openedAt: serverTimestamp()`
  4. `FieldValue.increment(1)` en `metrics.opened` del documento padre

### Vista de detalle de campaña

**Nueva página:** `app/[locale]/admin/(protected)/notifications/[campaignId]/page.tsx`

**Bloque superior — métricas agregadas**
```
Objetivo: 120 | Enviadas: 118 | Fallidas: 2 | Abiertas: 34 | Tasa: 29%
```

**Bloque inferior — tabla paginada (20 por página)**

| Usuario | Email | Recibida | Abierta | Fecha apertura |
|---------|-------|----------|---------|----------------|
| Ana López | ana@... | ✓ | ✓ | 10 may, 14:32 |
| Pedro Gómez | pedro@... | ✓ | — | — |

**Filtros rápidos sobre la tabla:**
- Todos
- Solo recibieron (sent=true)
- Solo abrieron (opened=true)
- Fallidas (sent=false)

**Endpoint:** `GET /api/admin/notifications/[campaignId]/recipients?filter=all|sent|opened|failed&page=1`

---

## Cambios en la app móvil (Expo)

En el handler de notificación abierta (Notifications.addNotificationResponseReceivedListener):

```typescript
const { campaignId, screen, entityId } = response.notification.request.content.data;

// 1. Navegar a la pantalla destino
const routes = {
  home: '/',
  events: '/events',
  feed: '/feed',
  profile: '/profile',
  event: `/events/${entityId}`,
  post: `/feed/${entityId}`,
  userProfile: `/users/${entityId}`,
};
router.push(routes[screen] ?? '/');

// 2. Reportar apertura
if (campaignId) {
  fetch('/api/notifications/opened', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaignId }),
  }).catch(() => {}); // silencioso, no bloquea navegación
}
```

---

## Archivos a crear / modificar

| Archivo | Acción |
|---------|--------|
| `components/admin/AdminNotificationSendForm.tsx` | Modificar — añadir filtros avanzados y deep link selector |
| `components/admin/UserSearchCombobox.tsx` | Crear |
| `components/admin/AdminNotificationCampaignDetail.tsx` | Crear |
| `app/[locale]/admin/(protected)/notifications/[campaignId]/page.tsx` | Crear |
| `app/api/admin/notifications/send/route.ts` | Modificar — escribir recipients, añadir deep link al payload FCM |
| `app/api/admin/notifications/estimate/route.ts` | Crear |
| `app/api/admin/users/search/route.ts` | Crear |
| `app/api/admin/search/events/route.ts` | Crear |
| `app/api/admin/search/posts/route.ts` | Crear |
| `app/api/admin/notifications/[campaignId]/recipients/route.ts` | Crear |
| `app/api/notifications/opened/route.ts` | Crear |
| App móvil — notification handler | Modificar |

---

## Consideraciones de rendimiento

- La subcolección `recipients` puede ser grande. La vista de detalle pagina de 20 en 20 con cursor de Firestore.
- El endpoint `estimate` usa la misma lógica de query que `send` pero solo cuenta documentos (`count()` de Firestore si disponible, o tamaño del array antes de enviar).
- La búsqueda de usuarios en Firestore usa query range (`>=` / `<=`) sobre `displayName`. Si el volumen crece, considerar Algolia o Typesense en el futuro.
- El reporte de apertura es fire-and-forget desde la app — no bloquea la navegación.
