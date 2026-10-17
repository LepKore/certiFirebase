"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PedidoGuardado } from "@/lib/types";

// La hora se muestra en la del restaurante (Madrid), no en la del navegador del cliente
const fecha = (valor?: string) =>
  valor ? new Date(valor).toLocaleString("es-ES", { timeZone: "Europe/Madrid" }) : "";

export default function HistorialPage() {
  const [pedidos, setPedidos] = useState<PedidoGuardado[]>([]);
  const [estado, setEstado] = useState("Cargando pedidos...");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listarPedidos()
      .then((data) => {
        setPedidos(data);
        setEstado("");
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <main className="container-resto py-20">
      <h1 className="titulo-seccion">Historial de pedidos</h1>
      <p className="mt-3 text-tinta/70">Todos los pedidos guardados, del más reciente al más antiguo.</p>

      {estado && <p role="status" className="mt-8 text-tinta/70">{estado}</p>}
      {error && <p role="alert" className="mt-8">{error}</p>}
      {!estado && !error && pedidos.length === 0 && <p className="mt-8 text-tinta/70">Todavía no has realizado ningún pedido.</p>}

      <ul className="mt-8 grid gap-5">
        {pedidos.map((pedido) => (
          <li key={pedido.id} className="card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold">Pedido #{pedido.id}</h2>
              <span className={pedido.estado === "cancelado" ? "text-sm font-semibold text-tomate" : "text-sm font-semibold"}>
                {pedido.estado === "cancelado" ? "Cancelado" : "Confirmado"}
              </span>
            </div>
            <p className="mt-1 text-sm text-tinta/65">
              {pedido.cliente}
              {pedido.telefono && ` · ${pedido.telefono}`} · {fecha(pedido.createdAt)}
            </p>
            <ul className="mt-3 grid gap-1 text-sm">
              {pedido.items.map((item) => (
                <li key={`${pedido.id}-${item.productoId}`} className="flex justify-between gap-3">
                  <span>
                    {item.cantidad} x {item.nombre}
                  </span>
                  <span className="text-tinta/70">{`${item.subtotal.toFixed(2)} €`}</span>
                </li>
              ))}
            </ul>
            {pedido.notas && <p className="mt-3 text-sm text-tinta/70">Notas: {pedido.notas}</p>}
            <p className="mt-3 flex justify-between border-t border-tinta/10 pt-3 font-bold">
              <span>Total</span>
              <span>{`${pedido.total.toFixed(2)} €`}</span>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}