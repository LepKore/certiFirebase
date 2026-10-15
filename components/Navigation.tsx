"use client";

import { useState } from "react";
import BotonCarrito from "./carrito/BotonCarrito";
import PanelCarrito from "./carrito/PanelCarrito";

const enlaces = [
  { href: "#menu", label: "Menu" },
  { href: "#pedido", label: "Pedido" },
  { href: "#reserva", label: "Reservar" },
  { href: "#info", label: "Informacion" },
];

export default function Navigation() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-tinta/10 bg-crema/90 backdrop-blur">
        <div className="container-resto flex items-center justify-between py-3">
          <a href="#top" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span aria-hidden="true">🍝</span>
            Ratatouille
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-7 text-sm font-medium md:flex">
            {enlaces.map((e) => (
              <a key={e.href} href={e.href} className="hover:text-tomate">
                {e.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <BotonCarrito />
            <button
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
              aria-expanded={menuAbierto}
              aria-controls="menu-movil"
              aria-label="Desplegar menu de navegacion"
              className="rounded-full border border-tinta/20 px-3 py-2 text-sm md:hidden"
            >
              ☰
            </button>
          </div>
        </div>

        {menuAbierto && (
          <nav
            id="menu-movil"
            aria-label="Principal movil"
            className="border-t border-tinta/10 bg-crema md:hidden"
          >
            <ul className="container-resto flex flex-col py-2 text-sm font-medium">
              {enlaces.map((e) => (
                <li key={e.href}>
                  <a
                    href={e.href}
                    onClick={() => setMenuAbierto(false)}
                    className="block py-2.5 hover:text-tomate"
                  >
                    {e.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <PanelCarrito />
    </>
  );
}