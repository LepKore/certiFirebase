# Contexto del proyecto

> Última verificación: 2026-10-17

## 1. Propósito del proyecto
App de pedidos anticipados para un restaurante (proyecto académico): catálogo desde la API, carrito, creación de pedidos e historial, conectada al backend Express mediante `NEXT_PUBLIC_API_URL`.
Audiencia / uso: demostración académica.

## 2. Stack tecnológico y arquitectura
Frontend: Next.js 16.4.1, React 19, TypeScript y Tailwind CSS v4.
Tests: Vitest 3 + Testing Library (`vitest run`).
Backend remoto: API Express + PostgreSQL.
Hosting: Firebase Hosting mediante export estático en `out/`.

## 3. Estructura del proyecto
/app/page.tsx: inicio (hero + pedidos).
/app/pedidos/page.tsx: historial de pedidos guardados en el backend.
/app/admin/page.tsx: login, administración CRUD de productos y listado de pedidos con cancelación.
/components/pedidos/PedidoSection.tsx: catálogo, carrito (persistido en `localStorage`, clave `ratatouille-carrito`, solo `productoId` y `cantidad`) y formulario de pedido controlado.
/lib/use-es-cliente.ts: hook que devuelve `false` durante el prerenderizado y la hidratación; permite leer almacenamiento del navegador sin errores de hidratación.
/lib/api.ts: cliente HTTP con manejo de errores (`api.listarPedidos`, `api.crearPedido`, `api.cancelarPedido`).
/components/sections/Hero.tsx: cabecera de la portada con los datos del restaurante.
/components/Navigation.tsx: navegación con enlaces a Inicio, Carta, Mis pedidos y Administración.
/lib/restaurant.ts: nombre, dirección, contacto y valoración del restaurante.
/app/not-found.tsx: página 404 en español.
/tests/: tests de `lib/api.ts`, `PedidoSection`, historial y panel administrativo (31 casos).
/lib/types.ts: tipos `Producto`, `PedidoGuardado`, `LineaPedidoGuardado` y `LineaCarrito`.
/hooks/verificar-tests-antes-de-push.ts: hook de OpenCode que bloquea `git push` si `npm test` falla; se registra en `opencode.jsonc`.
/.github/workflows: build, tests, lint y deploy a Firebase; inyecta `NEXT_PUBLIC_API_URL` desde GitHub Secrets.
Nota para IA: no almacenar credenciales ni secretos en el bundle, en este archivo ni en los tests.

## 4. Comandos críticos
Desarrollo: `npm run dev`.
Tests: `npm test`.
Build: `npm run build`.
Lint: `npm run lint`.
Typecheck: `npx tsc --noEmit`.
Deploy: push a `main` (informativo; requiere confirmación).

## 5. Reglas y convenciones estrictas
`output: "export"` debe mantenerse: no usar SSR, Server Actions ni rutas dinámicas.
`hooks/` está excluido de `tsconfig.json` porque usa la API de plugins de OpenCode.
La URL `NEXT_PUBLIC_API_URL` es pública por necesidad del navegador; los secretos pertenecen al backend.
Ningún test debe usar datos reales de la base de datos: se sustituyen `pool` y repositorio en la caché de módulos.
Todo campo de formulario debe tener `id` y `name`: Chrome avisa en las DevTools cuando falta alguno y el autocompletado deja de funcionar. Los datos del pedido se envían con un `<form>` real, no con un `div` y un `onClick`.
No leer `localStorage` ni `sessionStorage` durante el render: usar `useEsCliente` o React reporta error de hidratación. Por eso el token de admin y el carrito se leen en el inicializador del `useState` y solo se pintan cuando `esCliente` es `true`.
El formulario de pedido es controlado: nunca usar `evento.currentTarget` después de un `await` (React lo anula) ni `form.reset()`.
Cada página aporta su propio `<main>`: el layout solo envuelve en un `div`.
Ficheros en UTF-8 sin BOM y con tildes correctas; comprobado con un barrido de mojibake (`Ã` + byte alto).

## 6. Estado actual y registro de cambios
Completado: catálogo + carrito + creación de pedidos (`/api/pedidos`), historial (`/pedidos`), panel administrativo con CRUD y cancelación, 404 en español, corrección de los 12 hallazgos de la evaluación con Playwright (`playwright/EVALUACION-Y-PLAN.md`), `id`/`name`/`autocomplete` en todos los campos, formulario de pedido como `<form>` real, limpieza del código heredado del diseño de landing y de la dependencia `firebase`, 31 tests, hook anti-push y workflows con tests.
En progreso: configurar `NEXT_PUBLIC_API_URL` de producción como GitHub Secret.
Pendiente: sustituir los textos ficticios del restaurante si se publica como negocio real.