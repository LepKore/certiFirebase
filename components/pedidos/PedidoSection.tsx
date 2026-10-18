"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useEsCliente } from "@/lib/use-es-cliente";
import type { LineaCarrito, PedidoGuardado, Producto } from "@/lib/types";

const CLAVE_CARRITO = "ratatouille-carrito";

const leerCarrito = (): LineaCarrito[] => {
  if (typeof window === "undefined") return [];
  try {
    const crudo: unknown = JSON.parse(localStorage.getItem(CLAVE_CARRITO) ?? "[]");
    if (!Array.isArray(crudo)) return [];
    return crudo.filter(
      (linea): linea is LineaCarrito =>
        !!linea && Number.isInteger(linea.productoId) && Number.isInteger(linea.cantidad) && linea.cantidad > 0
    );
  } catch {
    return [];
  }
};

const DATOS_INICIALES = { cliente: "", telefono: "", notas: "" };

export default function PedidoSection() {
  const esCliente = useEsCliente();
  const [productos, setProductos] = useState<Producto[]>([]);
  // El carrito se guarda solo con id y cantidad: nombre, precio y stock salen del catalogo
  const [carrito, setCarrito] = useState<LineaCarrito[]>(leerCarrito);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("Cargando productos...");
  const [error, setError] = useState("");
  const [confirmado, setConfirmado] = useState<PedidoGuardado | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [datos, setDatos] = useState(DATOS_INICIALES);

  const cargarProductos = () => api.listar().then(setProductos).catch((e) => setError(e.message));
  useEffect(() => {
    cargarProductos().finally(() => setEstado(""));
  }, []);

  const guardarCarrito = (lineas: LineaCarrito[]) => {
    setCarrito(lineas);
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(lineas));
  };

  // Descarta lineas cuyo producto ya no existe o cuyo stock cambio mientras tanto
  const lineasVivas = useMemo(
    () =>
      carrito
        .map((linea) => {
          const producto = productos.find((p) => p.id === linea.productoId);
          if (!producto) return null;
          return { producto, cantidad: Math.min(linea.cantidad, producto.stock) };
        })
        .filter((linea): linea is { producto: Producto; cantidad: number } => !!linea && linea.cantidad > 0),
    [carrito, productos]
  );

  const guardarLineasVivas = (lineas: { producto: Producto; cantidad: number }[]) =>
    guardarCarrito(lineas.map((l) => ({ productoId: l.producto.id, cantidad: l.cantidad })));

  const anadir = (producto: Producto) => {
    setConfirmado(null);
    const existente = lineasVivas.find((l) => l.producto.id === producto.id);
    const cantidad = (existente?.cantidad ?? 0) + 1;
    if (cantidad > producto.stock) {
      setError(`No quedan más unidades de ${producto.nombre}`);
      return;
    }
    guardarLineasVivas(
      existente ? lineasVivas.map((l) => (l.producto.id === producto.id ? { ...l, cantidad } : l)) : [...lineasVivas, { producto, cantidad }]
    );
    setError("");
  };

  const cambiarCantidad = (id: number, delta: number) => {
    const linea = lineasVivas.find((l) => l.producto.id === id);
    if (!linea) return;
    const cantidad = linea.cantidad + delta;
    if (cantidad < 1) return guardarLineasVivas(lineasVivas.filter((l) => l.producto.id !== id));
    if (cantidad > linea.producto.stock) {
      setError(`No quedan más unidades de ${linea.producto.nombre}`);
      return;
    }
    guardarLineasVivas(lineasVivas.map((l) => (l.producto.id === id ? { ...l, cantidad } : l)));
    setError("");
  };

  const total = useMemo(() => lineasVivas.reduce((suma, l) => suma + l.producto.precio * l.cantidad, 0), [lineasVivas]);
  const visibles = useMemo(() => productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase())), [productos, busqueda]);

  async function confirmar() {
    if (lineasVivas.length === 0 || datos.cliente.trim() === "") return;
    setEnviando(true);
    setError("");
    try {
      const pedido = await api.crearPedido({
        cliente: datos.cliente.trim(),
        telefono: datos.telefono.trim() || undefined,
        notas: datos.notas.trim() || undefined,
        items: lineasVivas.map((l) => ({ productoId: l.producto.id, cantidad: l.cantidad })),
      });
      setConfirmado(pedido);
      guardarCarrito([]);
      setDatos(DATOS_INICIALES);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      // Siempre se recarga el catalogo: el pedido descuenta stock y el cliente debe verlo
      await cargarProductos();
      setEnviando(false);
    }
  }

  return (
    <section id="menu" className="bg-crema-oscuro py-20">
      <div className="container-resto">
        <div className="text-center">
          <p className="etiqueta">Catálogo</p>
          <h2 className="titulo-seccion mt-2">Pide por adelantado</h2>
          <p className="mx-auto mt-4 max-w-2xl text-tinta/70">Añade platos, confirma el pedido y queda registrado en tu historial.</p>
        </div>

        <input
          id="busqueda-platos"
          name="busqueda"
          type="search"
          aria-label="Buscar productos"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar un plato..."
          className="campo mx-auto mt-10 max-w-md text-center"
        />

        {estado && (
          <p role="status" className="mt-10 text-center text-tinta/70">
            {estado}
          </p>
        )}
        {!estado && visibles.length === 0 && <p className="mt-10 text-center text-tinta/70">No hay platos disponibles.</p>}

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((producto) => (
            <li key={producto.id} className="card flex flex-col gap-2 p-5">
              <h3 className="font-bold">{producto.nombre}</h3>
              <strong className="text-lg">{`${producto.precio.toFixed(2)} €`}</strong>
              <p className="text-sm text-tinta/65">Stock disponible: {producto.stock}</p>
              <button
                type="button"
                onClick={() => anadir(producto)}
                disabled={producto.stock === 0}
                className="btn-primario mt-2 disabled:opacity-40"
              >
                {producto.stock === 0 ? "Agotado" : "Añadir al pedido"}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg font-bold">Tu pedido</h3>
            {/* El carrito vive en localStorage: solo se pinta despues de hidratar para no romper la hidratacion */}
            {!esCliente && <p className="mt-4 text-tinta/70">Cargando tu pedido…</p>}
            {esCliente && lineasVivas.length === 0 && <p className="mt-4 text-tinta/70">Tu pedido está vacío.</p>}
            <ul className="mt-4 grid gap-3">
              {esCliente && lineasVivas.map(({ producto, cantidad }) => (
                <li key={producto.id} className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex-1 font-medium">{producto.nombre}</span>
                  <span className="text-tinta/70">{`${(producto.precio * cantidad).toFixed(2)} €`}</span>
                  <button
                    type="button"
                    aria-label={`Quitar una unidad de ${producto.nombre}`}
                    onClick={() => cambiarCantidad(producto.id, -1)}
                    className="rounded-full border border-tinta/20 px-3"
                  >
                    -
                  </button>
                  <span>{cantidad}</span>
                  <button
                    type="button"
                    aria-label={`Añadir una unidad de ${producto.nombre}`}
                    onClick={() => cambiarCantidad(producto.id, 1)}
                    className="rounded-full border border-tinta/20 px-3"
                  >
                    +
                  </button>
                </li>
              ))}
            </ul>
            {esCliente && lineasVivas.length > 0 && (
              <p className="mt-5 flex justify-between border-t border-tinta/10 pt-4 font-bold">
                <span>Total</span>
                <span>{`${total.toFixed(2)} €`}</span>
              </p>
            )}
          </div>

          <form
            className="card grid content-start gap-3 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              confirmar();
            }}
          >
            <h3 className="text-lg font-bold">Datos del pedido</h3>
            <input
              id="pedido-cliente"
              name="cliente"
              aria-label="Nombre"
              autoComplete="name"
              required
              className="campo"
              placeholder="Nombre"
              value={datos.cliente}
              onChange={(e) => setDatos({ ...datos, cliente: e.target.value })}
            />
            <input
              id="pedido-telefono"
              name="telefono"
              aria-label="Teléfono (opcional)"
              type="tel"
              autoComplete="tel"
              className="campo"
              placeholder="Teléfono (opcional)"
              value={datos.telefono}
              onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
            />
            <textarea
              id="pedido-notas"
              name="notas"
              aria-label="Notas (opcional)"
              rows={3}
              placeholder="Notas (opcional)"
              className="campo"
              value={datos.notas}
              onChange={(e) => setDatos({ ...datos, notas: e.target.value })}
            />
            <button
              type="submit"
              className="btn-primario"
              disabled={enviando || lineasVivas.length === 0 || datos.cliente.trim() === ""}
            >
              {enviando ? "Enviando..." : "Confirmar pedido"}
            </button>
            {confirmado && (
              <p role="status" className="font-semibold">
                Pedido #{confirmado.id} guardado en tu historial.
              </p>
            )}
            {error && <p role="alert">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}