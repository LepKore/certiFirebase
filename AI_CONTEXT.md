# AI_CONTEXT.md

Contexto para agentes de IA que trabajan en este repositorio.
Todo lo que aquí afirma es **verificable en el código** salvo que esté marcado como
`PENDIENTE: requiring user input`.

## 1. Project Overview

- **Qué es**: landing page de una sola página para el restaurante ficticio **Ratatouille**
  (Next.js App Router, export estático a Firebase Hosting). Permite **ver el menú** con filtros y
  búsqueda, **añadir platos al carrito y hacer un pedido**, **reservar mesa** e **información**
  del restaurante (ubicación, horarios, contacto).
- **Funcionalidades**: menú filtrable, carrito persistido en `localStorage`, formulario de pedido,
  formulario de reserva y ficha del restaurante.
- **Sin** autenticación, panel de admin, pagos ni backend propio: es una demo.
- **Idioma de la UI**: español. **Idioma de skills/agentes**: español.

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
  layout.tsx                     # metadata, Navigation, CarritoProvider y footer
  page.tsx                       # compone las secciones de la landing
  globals.css                    # tema Tailwind v4 (@theme) + componentes (.btn, .card, .campo)
components/
  Navigation.tsx                 # cabecera fija con anclas y menú móvil
  carrito/
    CarritoProvider.tsx          # contexto + useReducer + persistencia en localStorage
    BotonCarrito.tsx             # botón con contador de unidades
    PanelCarrito.tsx             # drawer lateral con líneas y total
  sections/
    Hero.tsx  SobreNos.tsx  MenuSection.tsx
    SeccionPedido.tsx  SeccionReserva.tsx  Informacion.tsx
lib/
  restaurant.ts                  # datos del restaurante y horarios (editar aquí)
  menu.ts                        # carta de platos y helpers (euros, total)
  types.ts                       # MenuItem, LineaPedido, Pedido, Reserva
  firebase.ts                    # init perezosa del SDK + flag firebaseConfigurado
  pedidos.ts / reservas.ts       # addDoc a Firestore, con fallback a localStorage
public/
out/                             # artefacto de `next build` (ignorado por git)
```

- **Rutas**: solo `/` y `/_not-found`, ambas estáticas (`○ (Static)`).
- `MenuSection`, `SeccionPedido`, `SeccionReserva` y el carrito son **Client Components**
  (el sitio es 100 % estático, no hay servidor al que llamar).
- **Cambiar el contenido del restaurante** se hace en `lib/restaurant.ts` (nombre, dirección,
  horarios, teléfono) y en `lib/menu.ts` (carta). No hay CMS.
- `CarritoProvider` vive en `app/layout.tsx` para que todo el árbol de la página acceda al
  contexto (si se deja dentro de `Navigation`, las secciones que están fuera fallarían).

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
- El SDK web se inicializa en `lib/firebase.ts` con variables `NEXT_PUBLIC_FIREBASE_*`.
  Copia `.env.example` a `.env.local` para activarlo. **Sin esas variables el sitio sigue
  funcionando**: pedidos y reservas se guardan solo en `localStorage` y la UI avisa al usuario.
- `firestore.rules` permite `create` (nada más) en `pedidos` y `reservas` con validación mínima
  de tipos. Aceptable para una demo; **en producción** la escritura debe moverse a Cloud
  Functions y protegerse con App Check.
- `.firebaserc` sí está versionado (apunta a `certiserver-42d9b`).
- CI: `.github/workflows/firebase-hosting-merge.yml` (despliega en push a main) y
  `firebase-hosting-pull-request.yml` (channel de preview en PR). Ambos hacen
  `setup-node` + `npm ci` antes del build.

## 5. Key Commands

```bash
npm run dev     # servidor de desarrollo (Turbopack)
npm run build   # build de producción -> genera out/  (validar siempre antes de commitear)
npm run serve   # sirve out/ localmente para probar el export estático
npm run lint    # eslint
npx tsc --noEmit  # comprobación de tipos (build ya la ejecuta)
```

## 6. Open Questions

1. `PENDIENTE` — Los datos del restaurante son inventados. Hay que sustituirlos por los reales
   en `lib/restaurant.ts` (dirección, horarios, teléfono) y en `lib/menu.ts` (carta y precios).
2. `PENDIENTE` — ¿Se mantiene `output: "export"` o se pasa a Firebase App Hosting / SSR?
   La decisión condiciona qué APIs de Next están disponibles.
3. `PENDIENTE` — ¿Se configura Firebase real (`.env.local` + `firestore.rules`) o se deja la
   demo con el fallback a `localStorage`?
4. `PENDIENTE` — El texto de la UI está **sin tildes ni caracteres especiales** (p. ej.
   "Informacion", "resenas") para evitar problemas de codificación. Hay que revisar la
   acentuación antes de publicar en un sitio real.
5. `PENDIENTE` — No hay fotos reales: los platos usan emoji como marcador de posición.
6. `PENDIENTE` — El `AGENTS.md` de la raíz es un bloque autogenerado por `next dev`
   (reglas de agentes de Next.js). Se deja versionado a propósito para no ensuciar el árbol.