import type { PedidoGuardado, Producto } from "./types";

const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) } });
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.error ?? "No se pudo comunicar con el servidor"); }
  return response.status === 204 ? (undefined as T) : response.json();
}

export const api = {
  listar: () => request<Producto[]>("/api/productos"),
  login: (usuario: string, password: string) => request<{ token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ usuario, password }) }),
  crear: (datos: Omit<Producto, "id" | "createdAt">, token: string) => request<Producto>("/api/productos", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(datos) }),
  actualizar: (id: number, datos: Partial<Omit<Producto, "id" | "createdAt">>, token: string) => request<Producto>(`/api/productos/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(datos) }),
  eliminar: (id: number, token: string) => request<void>(`/api/productos/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }),
  listarPedidos: () => request<PedidoGuardado[]>("/api/pedidos"),
  crearPedido: (datos: { cliente: string; telefono?: string; notas?: string; items: { productoId: number; cantidad: number }[] }) =>
    request<PedidoGuardado>("/api/pedidos", { method: "POST", body: JSON.stringify(datos) }),
  cancelarPedido: (id: number, token: string) => request<PedidoGuardado>(`/api/pedidos/${id}/cancelar`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }),
};
