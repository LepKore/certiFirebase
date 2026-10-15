"use client";

import { useState, type FormEvent } from "react";
import { useCarrito } from "@/components/carrito/CarritoProvider";
import { enviarPedido } from "@/lib/pedidos";
import { euros } from "@/lib/menu";
import { restaurante } from "@/lib/restaurant";

type Estado = "idle" | "enviando" | "ok" | "error";

export default function SeccionPedido() {
  const { lineas, total, vaciar } = useCarrito();
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensaje, setMensaje] = useState("");
  const [soloLocal, setSoloLocal] = useState(false);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lineas.length === 0) return;

    const datos = new FormData(e.currentTarget);
    setEstado("enviando");

    const resultado = await enviarPedido({
      lineas,
      total,
      nombre: String(datos.get("nombre") ?? "").trim(),
      telefono: String(datos.get("telefono") ?? "").trim(),
      notas: String(datos.get("notas") ?? "").trim() || undefined,
    });

    if (resultado.ok) {
      setSoloLocal(resultado.guardadoEn === "local");
      setEstado("ok");
      vaciar();
      e.currentTarget.reset();
    } else {
      setMensaje(resultado.error);
      setEstado("error");
    }
  }

  return (
    <section id="pedido" className="container-resto py-20">
      <div className="text-center">
        <p className="etiqueta">Haz tu pedido</p>
        <h2 className="titulo-seccion mt-2">Pedir a domicilio o para recoger</h2>
        <p className="mx-auto mt-4 max-w-2xl text-tinta/70">
          Anade platos desde el menu y confirma aqui. Te llamamos para cerrar el pedido y la forma
          de pago.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Resumen */}
        <div className="card gap-4 p-6">
          <h3 className="text-lg font-bold">Resumen del pedido</h3>

          {lineas.length === 0 ? (
            <p className="rounded-xl bg-crema-oscuro p-6 text-center text-sm text-tinta/60">
              Tu pedido esta vacio. Ve al{" "}
              <a href="#menu" className="font-semibold text-tomate underline">
                menu
              </a>{" "}
              y anade lo que te apetezca.
            </p>
          ) : (
            <>
              <ul className="flex flex-col divide-y divide-tinta/10">
                {lineas.map(({ item, cantidad }) => (
                  <li key={item.id} className="flex items-center gap-3 py-2.5 text-sm">
                    <span aria-hidden="true">{item.emoji}</span>
                    <span className="flex-1">
                      {cantidad} × {item.nombre}
                    </span>
                    <span className="text-tinta/70">{euros(item.precio * cantidad)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t-2 border-tinta/10 pt-4 text-lg">
                <span>Total</span>
                <strong>{euros(total)}</strong>
              </div>
            </>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={enviar} className="card gap-4 p-6">
          <h3 className="text-lg font-bold">Datos de contacto</h3>

          <div>
            <label htmlFor="pedido-nombre" className="etiqueta-campo">
              Nombre
            </label>
            <input
              id="pedido-nombre"
              name="nombre"
              required
              autoComplete="name"
              className="campo"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="pedido-telefono" className="etiqueta-campo">
              Telefono
            </label>
            <input
              id="pedido-telefono"
              name="telefono"
              type="tel"
              required
              autoComplete="tel"
              className="campo"
              placeholder="600 000 000"
            />
          </div>

          <div>
            <label htmlFor="pedido-notas" className="etiqueta-campo">
              Notas para la cocina (opcional)
            </label>
            <textarea
              id="pedido-notas"
              name="notas"
              rows={3}
              className="campo resize-none"
              placeholder="Sin picante, allergy a la lactosa..."
            />
          </div>

          {estado === "error" && (
            <p role="alert" className="rounded-lg bg-tomate/10 p-3 text-sm text-tomate">
              {mensaje}
            </p>
          )}

          {estado === "ok" && (
            <div role="status" className="rounded-lg bg-provenza/10 p-4 text-sm text-provenza">
              <p className="font-semibold">¡Pedido recibido!</p>
              <p className="mt-1">
                Te llamamos en breve al telefono indicado para confirmarlo. Si prefieres hablar
                ahora, marca el{" "}
                <a href={restaurante.telefonoHref} className="underline">
                  {restaurante.telefono}
                </a>
                .
              </p>
              {soloLocal && (
                <p className="mt-2 text-xs opacity-80">
                  Nota: Firebase no esta configurado, el pedido se ha guardado solo en este
                  navegador.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={lineas.length === 0 || estado === "enviando"}
            className="btn-primario w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            {estado === "enviando" ? "Enviando..." : "Confirmar pedido"}
          </button>
          <p className="text-center text-xs text-tinta/55">
            No se cobra nada ahora. Confirmamos el pedido por telefono.
          </p>
        </form>
      </div>
    </section>
  );
}