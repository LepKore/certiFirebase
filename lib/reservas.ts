"use client";

import { obtenerFirestore, firebaseConfigurado } from "./firebase";
import type { Reserva } from "./types";

const COLECCION = "reservas";
const CLAVE_LOCAL = "ratatouille-reservas";

export type ResultadoEnvio =
  | { ok: true; guardadoEn: "firestore" | "local" }
  | { ok: false; error: string };

/**
 * Envia una reserva a Firestore. Sin configuracion de Firebase se guarda
 * en localStorage para que la demo siga siendo utilizable.
 */
export async function enviarReserva(datos: Reserva): Promise<ResultadoEnvio> {
  const db = obtenerFirestore();

  if (!db) {
    try {
      const previas = JSON.parse(window.localStorage.getItem(CLAVE_LOCAL) ?? "[]") as unknown[];
      window.localStorage.setItem(
        CLAVE_LOCAL,
        JSON.stringify([...previas, { ...datos, createdAt: new Date().toISOString() }]),
      );
      return { ok: true, guardadoEn: "local" };
    } catch {
      return { ok: false, error: "No se ha podido guardar la reserva en este navegador." };
    }
  }

  try {
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    await addDoc(collection(db, COLECCION), { ...datos, createdAt: serverTimestamp() });
    return { ok: true, guardadoEn: "firestore" };
  } catch {
    return {
      ok: false,
      error: "No se ha podido registrar la reserva. Intentalo de nuevo o llamanos por telefono.",
    };
  }
}

export const firebaseActivo = firebaseConfigurado;