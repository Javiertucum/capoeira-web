# capoeira-web — Agenda Capoeiragem Web

Landing page pública y panel de administración para la plataforma Agenda Capoeiragem.

## Qué hace

| Sección | URL | Para quién |
|---|---|---|
| Landing page | `/` | Educadores y alumnos (discovery) |
| Panel admin | `/[locale]/admin/` | Administradores de la plataforma |
| API REST | `/api/admin/` | Uso interno del panel admin |

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16.2.3 | Framework (App Router) |
| React | 19.2.4 | UI |
| TypeScript | 5 strict | Tipos |
| Tailwind CSS | 4 | Estilos |
| next-intl | 4.9.1 | i18n ES/PT/EN |
| Firebase | 12 + Admin 13 | Auth, Firestore, Storage |
| @react-google-maps/api | 2.20 | Mapas |
| Vercel | — | Deploy |

## Desarrollo local

```bash
cd capoeira-web
npm install
npm run dev       # http://localhost:3000
npm run build     # Verificar que compila sin errores
npm run start     # Servir build de producción
```

## Variables de entorno

Crear `.env.local` en `capoeira-web/` con:

```env
# Firebase (cliente)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Admin — UID del superadmin
ADMIN_UID=
```

## Estructura del proyecto

```
src/
  app/
    [locale]/              # Routing con idioma (es/pt/en)
      page.tsx             # Landing page
      admin/
        login/             # Auth portal
        (protected)/       # Rutas protegidas del panel admin
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
      admin/               # 30+ endpoints REST (server-side)
  components/
    admin/                 # Componentes del panel admin
    ui/                    # Componentes reutilizables
  i18n/                    # Config de next-intl
```

## Internacionalización

3 idiomas: `es` (español), `pt` (portugués), `en` (inglés).  
Los archivos de mensajes viven en `messages/es.json`, `messages/pt.json`, `messages/en.json`.  
Las rutas tienen el locale como primer segmento: `/es/admin/dashboard`.

## Deploy

Vercel detecta automáticamente el push a `main`.

```bash
git push origin main
```

Para deploy manual o forzar rebuild:
```bash
vercel --prod
```

El proyecto está configurado en `.vercel/project.json`. No modificar sin coordinación.

## Guía para AI

Ver [CLAUDE.md](CLAUDE.md) para instrucciones detalladas de cómo trabajar en este proyecto.

## Checklist antes de hacer deploy

Ver [docs/RELEASE.md](../docs/RELEASE.md) — sección "Deploy Web".
