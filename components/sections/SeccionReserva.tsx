"use client";

import { useMemo, useState, type FormEvent } from "react";
import { enviarReserva } from "@/lib/reservas";
import { franjasReserva, maxComensales, restaurante } from "@/lib/restaurant";

type Estado = "idle" | "enviando" | "ok" | "error";

/** Fecha minima seleccionable: hoy, en formato yyyy-mm-dd (hora local). */
function hoyISO() {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

export default function SeccionReserva() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensaje, setMensaje] = useState("");
  const [soloLocal, setSoloLocal] = useState(false);
  const [resumen, setResumen] = useState("");

  const minimo = useMemo(() => hoyISO(), []);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formulario = e.currentTarget;
    const datos = new FormData(formulario);

    const reserva = {
      fecha: String(datos.get("fecha")),
      hora: String(datos.get("hora")),
      comensales: Number(datos.get("comensales")),
      nombre: String(datos.get("nombre") ?? "").trim(),
      telefono: String(datos.get("telefono") ?? "").trim(),
      email: String(datos.get("email") ?? "").trim() || undefined,
      notas: String(datos.get("notas") ?? "").trim() || undefined,
    };

    setEstado("enviando");
    const resultado = await enviarReserva(reserva);

    if (resultado.ok) {
      const [, mes, dia] = reserva.fecha.split("-");
      setResumen(
        `${dia}/${mes} a las ${reserva.hora} para ${reserva.comensales} ${
          reserva.comensales === 1 ? "persona" : "personas"
        }`,
      );
      setSoloLocal(resultado.guardadoEn === "local");
      setEstado("ok");
      formulario.reset();
    } else {
      setMensaje(resultado.error);
      setEstado("error");
    }
  }

  return (
    <section id="reserva" className="bg-provenza py-20">
      <div className="container-resto">
        <div className="mx-auto max-w-2xl text-center">
          <p className="etiqueta !text-crema/80">Reservas</p>
          <h2 className="titulo-seccion mt-2 !text-crema">Reservar mesa</h2>
          <p className="mt-4 text-crema/80">
            Para grupos de mas de 10 personas, llámanos al{" "}
            <a href={restaurante.telefonoHref} className="underline">
              {restaurante.telefono}
            </a>
            .
          </p>
        </div>

        <form
          onSubmit={enviar}
          className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2"
        >
          <div>
            <label htmlFor="reserva-fecha" className="etiqueta-campo !text-crema/90">
              Fecha
            </label>
            <input
              id="reserva-fecha"
              name="fecha"
              type="date"
              required
              min={minimo}
              className="campo"
            />
          </div>

          <div>
            <label htmlFor="reserva-hora" className="etiqueta-campo !text-crema/90">
              Hora
            </label>
            <select id="reserva-hora" name="hora" required defaultValue="" className="campo">
              <option value="" disabled>
                Elige una hora
              </option>
              {franjasReserva.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reserva-comensales" className="etiqueta-campo !text-crema/90">
              Comensales
            </label>
            <select
              id="reserva-comensales"
              name="comensales"
              required
              defaultValue={2}
              className="campo"
            >
              {maxComensales.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reserva-nombre" className="etiqueta-campo !text-crema/90">
              Nombre
            </label>
            <input
              id="reserva-nombre"
              name="nombre"
              required
              autoComplete="name"
              className="campo"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="reserva-telefono" className="etiqueta-campo !text-crema/90">
              Telefono
            </label>
            <input
              id="reserva-telefono"
              name="telefono"
              type="tel"
              required
              autoComplete="tel"
              className="campo"
              placeholder="600 000 000"
            />
          </div>

          <div>
            <label htmlFor="reserva-email" className="etiqueta-campo !text-crema/90">
              Email (opcional)
            </label>
            <input
              id="reserva-email"
              name="email"
              type="email"
              autoComplete="email"
              className="campo"
              placeholder="tu@email.com"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="reserva-notas" className="etiqueta-campo !text-crema/90">
              Notas (opcional)
            </label>
            <textarea
              id="reserva-notas"
              name="notas"
              rows={3}
              className="campo resize-none"
              placeholder="Mesa junto a la ventana, celebracion, silla de bebe..."
            />
          </div>

          {estado === "error" && (
            <p
              role="alert"
              className="rounded-lg bg-crema/15 p-3 text-sm text-crema sm:col-span-2"
            >
              {mensaje}
            </p>
          )}

          {estado === "ok" && (
            <div
              role="status"
              className="rounded-lg bg-crema/15 p-4 text-sm text-crema sm:col-span-2"
            >
              <p className="font-semibold">¡Reserva registrada!</p>
              <p className="mt-1">
                Te esperamos el {resumen}. Te confirmaremos por telefono a la mayor brevedad.
              </p>
              {soloLocal && (
                <p className="mt-2 text-xs opacity-80">
                  Nota: Firebase no esta configurado, la reserva se ha guardado solo en este
                  navegador.
                </p>
              )}
            </div>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={estado === "enviando"}
              className="btn w-full bg-crema text-provenza hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {estado === "enviando" ? "Enviando..." : "Confirmar reserva"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}