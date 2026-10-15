"use client";

import { useCarrito } from "./CarritoProvider";
import { euros } from "@/lib/menu";

export default function PanelCarrito() {
  const { lineas, abierto, cerrar, restar, establecer, total, vaciar } = useCarrito();

  return (
    <>
      {/* Capa oscura de fondo */}
      <div
        onClick={cerrar}
        aria-hidden={!abierto}
        className={`fixed inset-0 z-40 bg-tinta/40 transition-opacity duration-300 ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Pedido"
        aria-hidden={!abierto}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-crema shadow-2xl transition-transform duration-300 ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-tinta/10 px-6 py-5">
          <h2 className="text-xl font-bold">Tu pedido</h2>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar pedido"
            className="rounded-full p-2 text-2xl leading-none text-tinta/60 hover:bg-tinta/5 hover:text-tinta"
          >
            &times;
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lineas.length === 0 ? (
            <p className="mt-10 text-center text-sm text-tinta/60">
              Todavia no has anadido nada.{" "}
              <span className="text-tomate">Abre el menu</span> y elige tu pasta favorita.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {lineas.map(({ item, cantidad }) => (
                <li key={item.id} className="flex items-start gap-3 border-b border-tinta/10 pb-4">
                  <span className="text-2xl" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{item.nombre}</p>
                    <p className="text-sm text-tinta/60">{euros(item.precio * cantidad)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => restar(item.id)}
                        aria-label={`Quitar una unidad de ${item.nombre}`}
                        className="h-8 w-8 rounded-full border border-tinta/20 font-bold hover:border-tomate hover:text-tomate"
                      >
                        &minus;
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={cantidad}
                        onChange={(e) =>
                          establecer(item.id, Math.max(0, Number(e.target.value) || 0))
                        }
                        aria-label={`Cantidad de ${item.nombre}`}
                        className="w-14 rounded-lg border border-tinta/20 px-2 py-1 text-center text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => establecer(item.id, cantidad + 1)}
                        aria-label={`Anadir una unidad de ${item.nombre}`}
                        className="h-8 w-8 rounded-full border border-tinta/20 font-bold hover:border-tomate hover:text-tomate"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-tinta/10 px-6 py-5">
          <div className="mb-4 flex items-center justify-between text-lg">
            <span>Total</span>
            <strong>{euros(total)}</strong>
          </div>
          <a
            href="#pedido"
            onClick={cerrar}
            className={`btn-primario w-full ${lineas.length === 0 ? "pointer-events-none opacity-40" : ""}`}
          >
            Continuar con el pedido
          </a>
          {lineas.length > 0 && (
            <button
              type="button"
              onClick={vaciar}
              className="mt-3 w-full text-sm text-tinta/60 underline hover:text-tomate"
            >
              Vaciar pedido
            </button>
          )}
        </footer>
      </aside>
    </>
  );
}