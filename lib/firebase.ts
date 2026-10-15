"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Indica si hay configuracion de Firebase disponible en el entorno.
 * Sin ella el sitio sigue funcionando: los formularios avisan al usuario.
 */
export const firebaseConfigurado = Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

/** Devuelve Firestore o `null` si el proyecto no esta configurado. */
export function obtenerFirestore(): Firestore | null {
  if (!firebaseConfigurado) return null;
  if (!db) {
    app = getApps()[0] ?? initializeApp(config);
    db = getFirestore(app);
  }
  return db;
}