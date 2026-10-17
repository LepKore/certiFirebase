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

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  createdAt?: string;
}

/** Tipos del carrito antiguo (lib/pedidos.ts y components/carrito), ya no se usan en las pantallas. */
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
  createdAt?: unknown;
}

export interface LineaPedidoGuardado {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

/** Pedido guardado en el backend (historial). */
export interface PedidoGuardado {
  id: number;
  cliente: string;
  telefono: string | null;
  notas: string | null;
  estado: "confirmado" | "cancelado";
  total: number;
  createdAt?: string;
  items: LineaPedidoGuardado[];
}

/**
 * Linea del carrito en curso. Solo guarda el id del producto: el nombre, el precio
 * y el stock se toman siempre del catalogo cargado, para no mostrar datos obsoletos.
 */
export interface LineaCarrito {
  productoId: number;
  cantidad: number;
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
