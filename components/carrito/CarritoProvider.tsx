"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { LineaPedido, MenuItem } from "@/lib/types";
import { total as calcularTotal } from "@/lib/menu";

const CLAVE = "ratatouille-carrito";

interface Estado {
  lineas: LineaPedido[];
}

type Accion =
  | { tipo: "añadir"; item: MenuItem }
  | { tipo: "restar"; id: string }
  | { tipo: "establecer"; id: string; cantidad: number }
  | { tipo: "vaciar" }
  | { tipo: "cargar"; lineas: LineaPedido[] };

function reducer(estado: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case "añadir": {
      const existente = estado.lineas.find((l) => l.item.id === accion.item.id);
      if (existente) {
        return {
          lineas: estado.lineas.map((l) =>
            l.item.id === accion.item.id ? { ...l, cantidad: l.cantidad + 1 } : l,
          ),
        };
      }
      return { lineas: [...estado.lineas, { item: accion.item, cantidad: 1 }] };
    }
    case "restar":
      return {
        lineas: estado.lineas
          .map((l) => (l.item.id === accion.id ? { ...l, cantidad: l.cantidad - 1 } : l))
          .filter((l) => l.cantidad > 0),
      };
    case "establecer":
      return {
        lineas: estado.lineas
          .map((l) => (l.item.id === accion.id ? { ...l, cantidad: accion.cantidad } : l))
          .filter((l) => l.cantidad > 0),
      };
    case "vaciar":
      return { lineas: [] };
    case "cargar":
      return { lineas: accion.lineas };
  }
}

interface ContextoCarrito {
  lineas: LineaPedido[];
  unidades: number;
  total: number;
  abierto: boolean;
  añadir: (item: MenuItem) => void;
  restar: (id: string) => void;
  establecer: (id: string, cantidad: number) => void;
  vaciar: () => void;
  abrir: () => void;
  cerrar: () => void;
}

const Contexto = createContext<ContextoCarrito | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducer, { lineas: [] });
  const [abierto, setAbierto] = useState(false);
  // Ref, no estado: solo evita persistir antes de leer el carrito guardado.
  const cargado = useRef(false);

  // Recupera el carrito guardado en localStorage.
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE);
      if (guardado) {
        const lineas = JSON.parse(guardado) as LineaPedido[];
        if (Array.isArray(lineas)) dispatch({ tipo: "cargar", lineas });
      }
    } catch {
      // localStorage no disponible o JSON invalido: empezamos vacios.
    }
    cargado.current = true;
  }, []);

  useEffect(() => {
    if (!cargado.current) return;
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(estado.lineas));
    } catch {
      // Sin persistencia no es un error bloqueante.
    }
  }, [estado.lineas]);

  const añadir = useCallback((item: MenuItem) => dispatch({ tipo: "añadir", item }), []);
  const restar = useCallback((id: string) => dispatch({ tipo: "restar", id }), []);
  const establecer = useCallback(
    (id: string, cantidad: number) => dispatch({ tipo: "establecer", id, cantidad }),
    [],
  );
  const vaciar = useCallback(() => dispatch({ tipo: "vaciar" }), []);
  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  const valor = useMemo<ContextoCarrito>(
    () => ({
      lineas: estado.lineas,
      unidades: estado.lineas.reduce((n, l) => n + l.cantidad, 0),
      total: calcularTotal(estado.lineas),
      abierto,
      añadir,
      restar,
      establecer,
      vaciar,
      abrir,
      cerrar,
    }),
    [estado.lineas, abierto, añadir, restar, establecer, vaciar, abrir, cerrar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarrito() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  }
  return contexto;
}