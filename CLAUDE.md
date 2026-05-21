# CLAUDE.md — capoeira-web

Guía para cualquier AI que trabaje en este repositorio.

---

# Stack y Arquitectura

## Tecnologías principales

| Tecnología | Versión | Notas |
|---|---|---|
| Next.js | 16.2.3 | App Router. **No usar Pages Router.** |
| React | 19.2.4 | Concurrent features activas |
| TypeScript | 5 strict | `strict: true` en tsconfig |
| Tailwind CSS | 4 | API diferente a Tailwind 3 — leer antes de usar |
| next-intl | 4.9.1 | i18n con routing por locale |
| Firebase | 12 (cliente) + Admin 13 (server) | Auth, Firestore, Storage |

## Estructura de rutas

```
app/
  [locale]/                   # Todos los idiomas (es/pt/en)
    page.tsx                  # Landing page pública
    admin/
      login/page.tsx          # Login de administrador
      (protected)/            # Route group — requiere auth
        dashboard/
        events/
        finances/
        graduations/
        groups/
        users/
        notifications/
        moderation/
        bug-reports/
  api/
    admin/                    # Endpoints REST — solo server-side
      auth/, events/, finances/, exports/, ...
```

## Forma de trabajo

Seguir las mismas reglas de `../capoeira-app/CLAUDE.md`:
- Mínimo cambio que resuelve el problema real
- No agregar abstracciones especulativas
- Verificar con `npm run build` antes de declarar completo
- Actualizar este CLAUDE.md si se agregan patrones o gotchas nuevos

---

# Comandos

```bash
npm run dev      # Servidor de desarrollo — http://localhost:3000
npm run build    # Build de producción (verifica TypeScript + estilos)
npm run start    # Servir build local
```

---

# Internacionalización

3 idiomas: **es** (fallback), **pt**, **en**.  
Archivos en `messages/{es,pt,en}.json`.  
Usar `useTranslations()` en componentes cliente, `getTranslations()` en server components.  
Nunca construir claves dinámicamente.

Las rutas tienen el locale como primer segmento: `/es/admin/dashboard`.  
El middleware en `middleware.ts` redirige `/admin/*` a `/{defaultLocale}/admin/*`.

---

# Firebase

## Cliente (browser)
```typescript
// lib/firebase/client.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
```
Usar para operaciones en componentes cliente y API routes que no necesitan privilegios.

## Admin SDK (server)
```typescript
// lib/firebase/admin.ts
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
```
Usar **solo en API routes y Server Components**. Nunca en componentes cliente.  
Requiere las variables `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.

## Autenticación del panel admin
- Login vía Firebase Auth (`signInWithEmailAndPassword`)
- Middleware verifica el ID token en cada request protegido
- La sesión se guarda en cookie httpOnly
- Solo UIDs en la lista de admins (`process.env.ADMIN_UID`) pueden acceder

---

# API Routes

Todas las rutas del panel admin viven en `app/api/admin/`.  
Patrón: verificar auth al inicio de cada handler antes de operar.

```typescript
// Patrón estándar de auth en API route
export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    // ... lógica
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
```

---

# Tailwind CSS 4

Tailwind 4 tiene cambios de API respecto a v3:
- La config ya no es `tailwind.config.js` — se define en el CSS con `@theme`
- Los colores y tokens del tema van en `app/globals.css`
- Verificar la [documentación de Tailwind 4](https://tailwindcss.com) antes de usar cualquier utility que no reconozcas

---

# Gotchas conocidos

- **Next.js 16 + React 19**: algunos patrones de React 18 no funcionan. Si algo parece raro con Suspense o server components, leer el changelog de Next.js 16.
- **`FIREBASE_PRIVATE_KEY`**: en Vercel, el `\n` de la clave privada se escapa. El código debe hacer `replace(/\\n/g, '\n')` al leer la variable.
- **Locale en rutas**: siempre usar `useRouter()` de `next-intl` (no de `next/navigation`) para navegar preservando el locale.
- **Server vs Client components**: los componentes que usan Firebase Admin SDK deben ser Server Components o API routes. Nunca importar `firebase-admin` en el cliente.
- **Build con variables de entorno faltantes**: `npm run build` falla silenciosamente si faltan vars de Firebase. Verificar `.env.local` antes.

---

# Deploy

Vercel detecta el push a `main` automáticamente.  
Variables de entorno configuradas en el dashboard de Vercel — no en archivos.  
Ver [docs/RELEASE.md](../docs/RELEASE.md) — sección "Deploy Web" para el checklist completo.

---

# Contexto del producto

Ver [PRODUCT.md](PRODUCT.md) para entender los usuarios, la marca y los principios estratégicos.

**Resumen:** Agenda Capoeiragem es la plataforma de gestión para la comunidad global de capoeira. La web tiene dos partes: la landing page pública (discovery para educadores y alumnos) y el panel admin interno (gestión de eventos, finanzas, graduaciones, usuarios). El tono es directo, comunitario, arraigado culturalmente — no corporativo ni genérico.
