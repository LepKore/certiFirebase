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