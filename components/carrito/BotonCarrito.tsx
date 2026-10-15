"use client";

import { useCarrito } from "./CarritoProvider";

export default function BotonCarrito() {
  const { unidades, abrir } = useCarrito();

  return (
    <button
      type="button"
      onClick={abrir}
      aria-label={`Abrir pedido${unidades ? `, ${unidades} artículos` : " vacío"}`}
      className="relative rounded-full border border-tinta/20 px-4 py-2 text-sm font-semibold transition-colors hover:border-tomate hover:text-tomate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tomate"
    >
      🧺 Pedido
      {unidades > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-tomate px-1 text-xs font-bold text-white">
          {unidades}
        </span>
      )}
    </button>
  );
}