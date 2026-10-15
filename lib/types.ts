/**
 * Tipos compartidos por toda la aplicacion.
 */

export type Categoria = "entrantes" | "pastas" | "principales" | "postres" | "bebidas";

export interface MenuItem {
  id: string;
  nombre: string;
  descripcion: string;
  /** Precio en euros. */
  precio: number;
  categoria: Categoria;
  emoji: string;
  popular?: boolean;
  vegetariano?: boolean;
}

export interface LineaPedido {
  item: MenuItem;
  cantidad: number;
}

export interface Pedido {
  lineas: LineaPedido[];
  total: number;
  nombre: string;
  telefono: string;
  notas?: string;
  /** Momento en que el cliente confirma el pedido. */
  createdAt?: unknown;
}

export interface Reserva {
  fecha: string; // yyyy-mm-dd
  hora: string; // hh:mm
  comensales: number;
  nombre: string;
  telefono: string;
  email?: string;
  notas?: string;
  createdAt?: unknown;
}