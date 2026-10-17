import type { Categoria, MenuItem } from "./types";

export const categorias: { id: Categoria; label: string }[] = [
  { id: "entrantes", label: "Entrantes" },
  { id: "pastas", label: "Pastas" },
  { id: "principales", label: "Principales" },
  { id: "postres", label: "Postres" },
  { id: "bebidas", label: "Bebidas" },
];

export const menu: MenuItem[] = [
  // Entrantes
  {
    id: "sopa-lentejas",
    nombre: "Sopa de lentejas de la casa",
    descripcion: "Lentejas du Puy estofadas con verduras de temporada y hoja de laurel.",
    precio: 7.5,
    categoria: "entrantes",
    emoji: "🥣",
    vegetariano: true,
  },
  {
    id: "tartar-tomate",
    nombre: "Tartar de tomate y albahaca",
    descripcion: "Tomate de temporada, albahaca fresca, aceite de oliva y pan de masa madre.",
    precio: 9,
    categoria: "entrantes",
    emoji: "🍅",
    vegetariano: true,
    popular: true,
  },
  {
    id: "ratatouille-verduras",
    nombre: "La Famous Ratatouille",
    descripcion: "Berenjena, calabacin, pimiento y tomate confitados a fuego lento.",
    precio: 9.5,
    categoria: "entrantes",
    emoji: "🍆",
    vegetariano: true,
    popular: true,
  },
  {
    id: "gambas-a-la-plancha",
    nombre: "Gambas a la plancha",
    descripcion: "Gambas de Huelva, ajo, guindilla y un toque de vino blanco.",
    precio: 12.5,
    categoria: "entrantes",
    emoji: "🍤",
  },

  // Pastas
  {
    id: "carbonara",
    nombre: "Spaghetti alla Carbonara",
    descripcion: "Guanciale, yema de huevo, pecorino romano y pimienta negra recien molida.",
    precio: 14.5,
    categoria: "pastas",
    emoji: "🍝",
    popular: true,
  },
  {
    id: "bolognesa",
    nombre: "Tagliatelle alla Bolognese",
    descripcion: "Ragù de ternera cocinada 6 horas con tomate San Marzano y parmesano.",
    precio: 15,
    categoria: "pastas",
    emoji: "🍝",
  },
  {
    id: "trufada",
    nombre: "Pasta alla Trufada",
    descripcion: "Tajarines con crema de trufa negra, ajo, mantecado y mucho parmesano.",
    precio: 18,
    categoria: "pastas",
    emoji: "🍝",
    vegetariano: true,
    popular: true,
  },
  {
    id: "vongole",
    nombre: "Linguine alle Vongole",
    descripcion: "Almejas, vino blanco, ajo, perejil y un hilo de aceite de oliva virgen extra.",
    precio: 16.5,
    categoria: "pastas",
    emoji: "🐚",
  },
  {
    id: "pesto-genovese",
    nombre: "Trofiette al Pesto Genovese",
    descripcion: "Pesto de albahaca y piñones, trofie, patata cocida y queso Grana Padano.",
    precio: 14,
    categoria: "pastas",
    emoji: "🌿",
    vegetariano: true,
  },
  {
    id: "cacio-e-pepe",
    nombre: "Cacio e Pepe",
    descripcion: "Tonnarelli, pecorino romano y pimienta. Tres ingredientes, nada mas.",
    precio: 13.5,
    categoria: "pastas",
    emoji: "🧀",
    vegetariano: true,
  },

  // Principales
  {
    id: "entrecot",
    nombre: "Entrecot de vacuno a la parrilla",
    descripcion: "400g de entrecot, guarnicion de patatas y mantequilla de montura.",
    precio: 26,
    categoria: "principales",
    emoji: "🥩",
  },
  {
    id: "lubina",
    nombre: "Lubina a la provencal",
    descripcion: "Lubina al horno con tomate confitado, hinojo y aceitunas.",
    precio: 24,
    categoria: "principales",
    emoji: "🐟",
  },
  {
    id: "confit-pato",
    nombre: "Magret de pato confitado",
    descripcion: "Pechuga de pato con guiso de vino tinto, col lombarda y pure de apionabo.",
    precio: 23,
    categoria: "principales",
    emoji: "🦆",
  },
  {
    id: "berenjenas-rellenas",
    nombre: "Berenjenas rellenas de verduras",
    descripcion: "Berenjena asada rellena de verduras asadas, gratinadas y tomillo.",
    precio: 19,
    categoria: "principales",
    emoji: "🍆",
    vegetariano: true,
  },

  // Postres
  {
    id: "tiramisu",
    nombre: "Tiramisù de la casa",
    descripcion: "Mascarpone, cafe espresso y cacao amargo. Receta de la nonna.",
    precio: 7.5,
    categoria: "postres",
    emoji: "🍰",
    popular: true,
  },
  {
    id: "creme-brulee",
    nombre: "Crema catalana quemada",
    descripcion: "Crema de huevo con caramelo duro de azucar quemado.",
    precio: 7,
    categoria: "postres",
    emoji: "🍮",
  },
  {
    id: "tarta-limón",
    nombre: "Tarta de limon de Menton",
    descripcion: "Masa sablée, merengue italiano y ralladura de limón.",
    precio: 7,
    categoria: "postres",
    emoji: "🍋",
    vegetariano: true,
  },

  // Bebidas
  {
    id: "vino-tinto",
    nombre: "Vino tinto de la casa",
    descripcion: "Copa de Bordeaux o Syrah de Sipena, segun el plato.",
    precio: 5.5,
    categoria: "bebidas",
    emoji: "🍷",
  },
  {
    id: "vino-blanco",
    nombre: "Vino blanco",
    descripcion: "Copa de blanco seco o verdejo bien frio.",
    precio: 5.5,
    categoria: "bebidas",
    emoji: "🥂",
  },
  {
    id: "refresco",
    nombre: "Refresco de temporada",
    descripcion: "Zumo de naranja natural, limonada casera o agua con gas.",
    precio: 3.5,
    categoria: "bebidas",
    emoji: "🥤",
  },
];

export const menuPorCategoria = (categoria: Categoria) =>
  menu.filter((item) => item.categoria === categoria);

export const total = (lineas: { item: MenuItem; cantidad: number }[]) =>
  lineas.reduce((suma, l) => suma + l.item.precio * l.cantidad, 0);

export const euros = (valor: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(valor);