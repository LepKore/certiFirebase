"use client";

import { obtenerFirestore, firebaseConfigurado } from "./firebase";
import type { Pedido } from "./types";

const COLECCION = "pedidos";
const CLAVE_LOCAL = "ratatouille-pedidos";

export type ResultadoEnvio =
  | { ok: true; guardadoEn: "firestore" | "local" }
  | { ok: false; error: string };

/**
 * Envia un pedido a Firestore. Si Firebase no esta configurado, se guarda
 * en localStorage para que la demo siga siendo utilizable.
 */
export async function enviarPedido(datos: Omit<Pedido, "createdAt">): Promise<ResultadoEnvio> {
  const db = obtenerFirestore();

  if (!db) {
    try {
      const previos = JSON.parse(window.localStorage.getItem(CLAVE_LOCAL) ?? "[]") as unknown[];
      window.localStorage.setItem(
        CLAVE_LOCAL,
        JSON.stringify([...previos, { ...datos, createdAt: new Date().toISOString() }]),
      );
      return { ok: true, guardadoEn: "local" };
    } catch {
      return { ok: false, error: "No se ha podido guardar el pedido en este navegador." };
    }
  }

  try {
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    await addDoc(collection(db, COLECCION), { ...datos, createdAt: serverTimestamp() });
    return { ok: true, guardadoEn: "firestore" };
  } catch {
    return {
      ok: false,
      error: "No se ha podido registrar el pedido. Intentalo de nuevo o llamanos por telefono.",
    };
  }
}

export const firebaseActivo = firebaseConfigurado;