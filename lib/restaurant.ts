/**
 * Datos del restaurante. Inventados: edita este archivo para cambiar
 * nombre, ubicación, horarios o datos de contacto en todo el sitio.
 */

export const restaurante = {
  nombre: "Ratatouille",
  lema: "Cocina francesa de autor en el corazón de Madrid",
  descripcionCorta:
    "Un pequeño corner inspired en la Provenza francesa donde cada plato se cocina al fuego y con producto de mercado.",
  direccion: {
    calle: "Calle de Lepaute 42",
    ciudad: "28001 Madrid",
    maps: "https://www.google.com/maps/search/?api=1&query=Lepaute+42+Madrid",
  },
  telefono: "+34 910 123 456",
  telefonoHref: "tel:+34910123456",
  email: "hola@ratatouille.example",
  instagram: "@ratatouille.madrid",
  valoracion: 4.8,
  resenas: 412,
} as const;

export const valoracion = {
  estrellas: restaurante.valoracion,
  resenas: restaurante.resenas,
} as const;

/** Días con la cocina abierta. `cerrado` = no abrimos. */
export const horarios: { dia: string; horario: string }[] = [
  { dia: "Lunes", horario: "13:00 - 16:00 / 20:00 - 23:00" },
  { dia: "Martes", horario: "13:00 - 16:00 / 20:00 - 23:00" },
  { dia: "Miércoles", horario: "13:00 - 16:00 / 20:00 - 23:00" },
  { dia: "Jueves", horario: "13:00 - 16:00 / 20:00 - 23:00" },
  { dia: "Viernes", horario: "13:00 - 16:00 / 20:00 - 00:00" },
  { dia: "Sábado", horario: "13:00 - 00:00" },
  { dia: "Domingo", horario: "13:00 - 17:00" },
];

/** Franjas que se ofrecen en el formulario de reserva. */
export const franjasReserva = [
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
];

export const maxComensales = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const destacadas = [
  "Producto de mercado de temporada",
  "Pasta fresca preparada cada mañana",
  "Vinos naturales de pequeñas bodegas",
  "Terraza disponible en verano",
];