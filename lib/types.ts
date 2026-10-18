/**
 * Tipos compartidos por toda la aplicacion.
 */

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  createdAt?: string;
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