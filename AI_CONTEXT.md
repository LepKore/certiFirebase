# AI_CONTEXT.md

Contexto para agentes de IA que trabajan en este repositorio.
Todo lo que aquí afirma es **verificable en el código** salvo que esté marcado como
`PENDIENTE: requiring user input`.

## 1. Project Overview

- **Qué es**: una aplicación Next.js (App Router) creada con `create-next-app`, preparada
  para desplegarse como sitio estático en **Firebase Hosting**.
- **Estado actual**: es el andamiaje por defecto de Next.js. No hay todavía lógica de
  negocio ni integración con los servicios de Firebase.
- **Idioma de la UI**: inglés (plantilla original de Next.js).
- **Idioma de las skills / agentes**: español.

## 2. Tech Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js `16.4.1` (App Router, Turbopack) |
| UI | React `19.3.0` |
| Estilos | Tailwind CSS v4 vía `@tailwindcss/turbopack` (cargado con reglas de Turbopack en `next.config.ts`) |
| Lenguaje | TypeScript `^5` |
| Lint | ESLint 9 (`eslint-config-next` 16.4.1), flat config en `eslint.config.mjs` |
| Hosting | Firebase Hosting (`firebase.json`) |

## 3. Architecture

```
app/
  layout.tsx   # RootLayout, tipado como LayoutProps<"/"> (tipos globales de Next 16)
  page.tsx     # Home, contenido estático de ejemplo de create-next-app
  globals.css  # estilos base de Tailwind v4
public/        # assets estáticos servidos desde /
out/           # artefacto de `next build` (ignorado por git)
```

- **No hay** `app/api/`, ni Server Actions, ni middleware, ni rutas dinámicas: solo existen
  `/` y `/_not-found`.
- Todas las rutas se prerenderizan como estáticas (`○ (Static)`).

## 4. Conventions & Constraints

### Restricción crítica: `output: "export"`

`next.config.ts` fija `output: "export"`. Esto implica:

- El build debe ser **100 % estático**: nada de SSR, ISR, Server Actions ni rutas dinámicas.
- **`cacheComponents: true` (PPR) es incompatible** con export; falla con
  `Invariant: PPR cannot be enabled in export mode`. Por eso está comentado en
  `next.config.ts`, junto con `partialPrefetching` (que solo aplica con cache components).
  No volver a activarlos mientras `output: "export"` siga activo.
- El resultado del build se publica desde `out/`, que es el `public` de Firebase Hosting.
- `firebase.json` define un catch-all rewrite `** -> /index.html`, es decir una SPA.
  `PENDIENTE: requiring user input` — ¿es intencional ese rewrite, o se prefiere 404 real?

### Reglas de Firebase

- **Nunca commitear** claves de servicio: `*.runtimeconfig.json`, `serviceAccountKey*.json`,
  `.firebase/`, ni logs `firebase-debug.log*`. Ya están en `.gitignore`.
- Las variables de Firebase del cliente irán en `.env*` (ignorado por git).
  `PENDIENTE: requiring user input` — falta decidir el nombre del proyecto de Firebase y
  confirmar si se usan variables de entorno o un `firebase-config.ts` versionado.
- `.firebaserc` sí está versionado (apunta al proyecto activo).
- CI: `.github/workflows/firebase-hosting-merge.yml` (despliega en push a main) y
  `firebase-hosting-pull-request.yml` (channel de preview en PR).

## 5. Key Commands

```bash
npm run dev     # servidor de desarrollo (Turbopack)
npm run build   # build de producción -> genera out/  (validar siempre antes de commitear)
npm run lint    # eslint
npx tsc --noEmit  # comprobación de tipos (build ya la ejecuta)
```

## 6. Open Questions

1. `PENDIENTE` — ¿Cuál es el objetivo del proyecto (qué servicios de Firebase: Auth,
   Firestore, Storage, Hosting, Functions)? No se deduce del código.
2. `PENDIENTE` — ¿Se mantiene `output: "export"` o se pasa a Firebase App Hosting / SSR?
   La decisión condiciona qué APIs de Next están disponibles.
3. `PENDIENTE` — El `AGENTS.md` de la raíz es un bloque autogenerado por `next dev`
   (reglas de agentes de Next.js). Se deja versionado a propósito para no ensuciar el árbol.
4. `PENDIENTE` — `.agents/skills/` y `.claude/skills/` están staged. Decidir si las skills
   se versionan en el repo o se ignoran (hoy ninguna regla las excluye).