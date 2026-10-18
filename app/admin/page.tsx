"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useEsCliente } from "@/lib/use-es-cliente";
import type { PedidoGuardado, Producto } from "@/lib/types";

const CLAVE_TOKEN = "admin-token";

export default function AdminPage() {
  const esCliente = useEsCliente();
  // El token se lee de sessionStorage. Durante la hidratacion `esCliente` es false y se
  // muestra "Cargando...", asi que el HTML prerenderizado y el primer render coinciden.
  const [token, setToken] = useState(() => (typeof window === "undefined" ? "" : sessionStorage.getItem(CLAVE_TOKEN) ?? ""));
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<PedidoGuardado[]>([]);
  const [error, setError] = useState("");
  const [credenciales, setCredenciales] = useState({ usuario: "", password: "" });

  const cargar = () => {
    api.listar().then(setProductos).catch((e) => setError(e.message));
    api.listarPedidos().then(setPedidos).catch((e) => setError(e.message));
  };

  useEffect(() => {
    if (token) cargar();
    // Solo al cambiar la sesion: recargar datos en cada renderacion haria bucles
  }, [token]);

  const salir = () => {
    sessionStorage.removeItem(CLAVE_TOKEN);
    setToken("");
    setProductos([]);
    setPedidos([]);
  };

  async function login() {
    setError("");
    try {
      const r = await api.login(credenciales.usuario, credenciales.password);
      sessionStorage.setItem(CLAVE_TOKEN, r.token);
      setCredenciales({ usuario: "", password: "" });
      setToken(r.token);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function guardar(e: React.FormEvent<HTMLFormElement>, id?: number) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = {
      nombre: String(new FormData(form).get("nombre")),
      precio: Number(new FormData(form).get("precio")),
      stock: Number(new FormData(form).get("stock")),
    };
    try {
      if (id) await api.actualizar(id, datos, token);
      else await api.crear(datos, token);
      form.reset();
      cargar();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const eliminar = (id: number) => api.eliminar(id, token).then(cargar).catch((e) => setError(e.message));
  const cancelarPedido = (id: number) => api.cancelarPedido(id, token).then(cargar).catch((e) => setError(e.message));

  if (!esCliente) {
    return (
      <div className="container-resto py-20">
        <h1 className="titulo-seccion">Administración</h1>
        <p role="status" className="mt-8 text-tinta/70">Cargando…</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container-resto py-20">
        <h1 className="titulo-seccion">Administración</h1>
        <div className="card mx-auto mt-8 grid max-w-md gap-4 p-6">
          <label className="grid gap-1">
            <span>Usuario</span>
            <input
              aria-label="Usuario"
              value={credenciales.usuario}
              onChange={(e) => setCredenciales({ ...credenciales, usuario: e.target.value })}
              required
              className="campo"
            />
          </label>
          <label className="grid gap-1">
            <span>Contraseña</span>
            <input
              aria-label="Contraseña"
              type="password"
              value={credenciales.password}
              onChange={(e) => setCredenciales({ ...credenciales, password: e.target.value })}
              required
              className="campo"
            />
          </label>
          <button type="button" onClick={login} className="btn-primario">
            Entrar
          </button>
          {/* Pista para quien no tiene las credenciales */}
          <p className="text-center text-xs text-tinta/45">para los curiosos, datos de acceso en README de backend</p>
          {error && <p role="alert">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="container-resto py-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="titulo-seccion">Administrar productos</h1>
        <button type="button" onClick={salir} className="rounded-full border border-tinta/20 px-4 py-2 text-sm">
          Cerrar sesión
        </button>
      </div>

      <h2 className="titulo-seccion mt-10">Crear producto</h2>
      <form onSubmit={(e) => guardar(e)} className="card mt-4 grid gap-3 p-6 sm:grid-cols-4">
        <input name="nombre" required placeholder="Nombre" className="campo" />
        <input name="precio" required type="number" min="0" step="0.01" placeholder="Precio" className="campo" />
        <input name="stock" required type="number" min="0" placeholder="Stock" className="campo" />
        <button className="btn-primario">Crear</button>
      </form>

      <ul className="mt-8 grid gap-4">
        {productos.map((p) => (
          <li key={p.id} className="card flex flex-wrap items-center gap-3 p-4">
            <form onSubmit={(e) => guardar(e, p.id)} className="flex flex-1 flex-wrap gap-3">
              <input aria-label={`Nombre de ${p.nombre}`} name="nombre" defaultValue={p.nombre} className="campo flex-1" />
              <input
                aria-label={`Precio de ${p.nombre}`}
                name="precio"
                defaultValue={p.precio}
                type="number"
                min="0"
                step="0.01"
                className="campo w-28"
              />
              <input aria-label={`Stock de ${p.nombre}`} name="stock" defaultValue={p.stock} type="number" min="0" className="campo w-24" />
              <button className="btn-primario">Guardar</button>
            </form>
            <button
              type="button"
              onClick={() => eliminar(p.id)}
              className="rounded-full bg-tomate px-4 py-2 text-white"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <h2 className="titulo-seccion mt-14">Pedidos</h2>
      {pedidos.length === 0 && <p className="mt-4 text-tinta/70">Todavía no hay pedidos.</p>}
      <ul className="mt-4 grid gap-3">
        {pedidos.map((p) => (
          <li key={p.id} className="card flex flex-wrap items-center gap-3 p-4">
            <strong>Pedido #{p.id}</strong>
            <span className="text-sm text-tinta/70">
              {`${p.cliente} · ${p.total.toFixed(2)} € · ${p.estado === "cancelado" ? "Cancelado" : "Confirmado"}`}
            </span>
            {p.estado === "confirmado" && (
              <button
                type="button"
                onClick={() => cancelarPedido(p.id)}
                className="ml-auto rounded-full bg-tomate px-4 py-2 text-white"
              >
                Cancelar
              </button>
            )}
          </li>
        ))}
      </ul>

      {error && (
        <p role="alert" className="mt-4">
          {error}
        </p>
      )}
    </div>
  );
}