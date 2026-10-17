"use client";

import { useSyncExternalStore } from "react";

const suscribir = () => () => {};
const enServidor = () => false;
const enCliente = () => true;

/**
 * `false` durante el prerenderizado y la hidratacion, `true` despues.
 * Permite leer `localStorage` o `sessionStorage` sin provocar errores de hidratacion:
 * React usa el valor del servidor durante la hidratacion y actualiza despues.
 */
export function useEsCliente() {
  return useSyncExternalStore(suscribir, enCliente, enServidor);
}