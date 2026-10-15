"use client";

import { useMemo, useState } from "react";
import { categorias, euros, menu } from "@/lib/menu";
import { useCarrito } from "@/components/carrito/CarritoProvider";
import type { Categoria, MenuItem } from "@/lib/types";

function TarjetaPlato({ item }: { item: MenuItem }) {
  const { añadir } = useCarrito();
  const [añadido, setAñadido] = useState(false);

  function agregar() {
    añadir(item);
    setAñadido(true);
    window.setTimeout(() => setAñadido(false), 1200);
  }

  return (
    <li className="card gap-2 p-5">
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden="true" className="text-3xl">
          {item.emoji}
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {item.popular && (
            <span className="rounded-full bg-tomate/10 px-2 py-0.5 text-[11px] font-semibold text-tomate">
              Popular
            </span>
          )}
          {item.vegetariano && (
            <span className="rounded-full bg-provenza/10 px-2 py-0.5 text-[11px] font-semibold text-provenza">
              Vegetariano
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-1 font-bold leading-snug">{item.nombre}</h3>
      <p className="flex-1 text-sm leading-relaxed text-tinta/65">{item.descripcion}</p>

      <div className="mt-3 flex items-center justify-between">
        <strong className="text-lg">{euros(item.precio)}</strong>
        <button
          type="button"
          onClick={agregar}
          className="rounded-full bg-tinta px-4 py-2 text-sm font-semibold text-crema transition-colors hover:bg-tomate"
        >
          {añadido ? "✓ Añadido" : "Añadir"}
        </button>
      </div>
    </li>
  );
}

export default function MenuSection() {
  const [categoria, setCategoria] = useState<Categoria | "todas">("todas");
  const [busqueda, setBusqueda] = useState("");

  const platos = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return menu.filter((item) => {
      const coincideCategoria = categoria === "todas" || item.categoria === categoria;
      const coincideTexto =
        texto.length === 0 ||
        item.nombre.toLowerCase().includes(texto) ||
        item.descripcion.toLowerCase().includes(texto);
      return coincideCategoria && coincideTexto;
    });
  }, [categoria, busqueda]);

  return (
    <section id="menu" className="bg-crema-oscuro py-20">
      <div className="container-resto">
        <div className="text-center">
          <p className="etiqueta">Nuestra carta</p>
          <h2 className="titulo-seccion mt-2">Menu</h2>
          <p className="mx-auto mt-4 max-w-2xl text-tinta/70">
            Cocinamos al momento, asi que la carta puede variar. Todo lo que ves esta disponible
            hoy.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <label htmlFor="buscar-menu" className="sr-only">
            Buscar en el menu
          </label>
          <input
            id="buscar-menu"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar un plato... (carbonara, trufa, vino)"
            className="campo max-w-md text-center"
          />

          <div role="group" aria-label="Categorias del menu" className="flex flex-wrap justify-center gap-2">
            <Pestaña activa={categoria === "todas"} onClick={() => setCategoria("todas")}>
              Todo
            </Pestaña>
            {categorias.map((c) => (
              <Pestaña
                key={c.id}
                activa={categoria === c.id}
                onClick={() => setCategoria(c.id)}
              >
                {c.label}
              </Pestaña>
            ))}
          </div>
        </div>

        {platos.length === 0 ? (
          <p className="mt-12 text-center text-tinta/60">
            No hay platos que coincidan con tu busqueda.
          </p>
        ) : (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {platos.map((item) => (
              <TarjetaPlato key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Pestaña({
  activa,
  onClick,
  children,
}: {
  activa: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activa}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        activa
          ? "bg-tomate text-white"
          : "bg-white text-tinta/70 hover:bg-tinta hover:text-crema"
      }`}
    >
      {children}
    </button>
  );
}