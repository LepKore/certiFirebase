"use client";

import Link from "next/link";
import { useState } from "react";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/#menu", label: "Carta" },
  { href: "/pedidos", label: "Mis pedidos" },
  { href: "/admin", label: "Administracion" },
];

export default function Navigation() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cerrar = () => setMenuAbierto(false);

  return (
    <header className="sticky top-0 z-30 border-b border-tinta/10 bg-crema/90 backdrop-blur">
      <div className="container-resto flex items-center justify-between py-3">
        <Link href="/" onClick={cerrar} className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span aria-hidden="true">🍝</span>
          Ratatouille
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 text-sm font-medium md:flex">
          {enlaces.map((e) => (
            <Link key={e.href} href={e.href} className="hover:text-tomate">
              {e.label}
            </Link>
          ))}
        </nav>

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

      {menuAbierto && (
        <nav id="menu-movil" aria-label="Principal movil" className="border-t border-tinta/10 bg-crema md:hidden">
          <ul className="container-resto flex flex-col py-2 text-sm font-medium">
            {enlaces.map((e) => (
              <li key={e.href}>
                <Link href={e.href} onClick={cerrar} className="block py-2.5 hover:text-tomate">
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}