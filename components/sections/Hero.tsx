import Link from "next/link";
import { restaurante, valoracion } from "@/lib/restaurant";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-crema-oscuro to-crema"
    >
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-tomate/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-provenza/10 blur-2xl"
      />

      <div className="container-resto relative flex flex-col items-center gap-8 py-20 text-center sm:py-28">
        <p className="etiqueta">Cocina francesa · Madrid</p>
        <h1 className="text-5xl font-black tracking-tight text-tinta sm:text-6xl">
          {restaurante.nombre}
        </h1>
        <p className="max-w-2xl text-lg text-tinta/75 sm:text-xl">{restaurante.lema}</p>
        <p className="max-w-xl text-base text-tinta/65">{restaurante.descripcionCorta}</p>

        <p className="flex items-center gap-2 text-sm text-tinta/70">
          <span aria-hidden="true" className="text-tomate">
            ★★★★★
          </span>
          <strong>{valoracion.estrellas}</strong>
          <span>({valoracion.resenas} reseñas)</span>
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <a href="#menu" className="btn-primario">
            Ver el menú
          </a>
          <Link href="/pedidos" className="btn-secundario">
            Ver mis pedidos
          </Link>
        </div>
      </div>
    </section>
  );
}