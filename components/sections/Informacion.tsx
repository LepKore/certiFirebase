import { horarios, restaurante, valoracion } from "@/lib/restaurant";

export default function Informacion() {
  return (
    <section id="info" className="container-resto py-20">
      <div className="text-center">
        <p className="etiqueta">Informacion</p>
        <h2 className="titulo-seccion mt-2">Donde encontrarnos</h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="card gap-3 p-6">
          <h3 className="text-lg font-bold">📍 Ubicacion</h3>
          <address className="not-italic leading-relaxed text-tinta/70">
            {restaurante.direccion.calle}
            <br />
            {restaurante.direccion.ciudad}
          </address>
          <a
            href={restaurante.direccion.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm font-semibold text-tomate underline"
          >
            Ver en el mapa
          </a>
        </div>

        <div className="card gap-3 p-6">
          <h3 className="text-lg font-bold">🕐 Horarios</h3>
          <table className="w-full text-sm">
            <caption className="sr-only">Horario de apertura por dia</caption>
            <tbody>
              {horarios.map((h) => (
                <tr key={h.dia} className="border-b border-tinta/10 last:border-0">
                  <th scope="row" className="py-1.5 text-left font-medium">
                    {h.dia}
                  </th>
                  <td className="py-1.5 text-right text-tinta/70">{h.horario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card gap-3 p-6">
          <h3 className="text-lg font-bold">📞 Contacto</h3>
          <p className="text-sm leading-relaxed text-tinta/70">
            Telefono:{" "}
            <a href={restaurante.telefonoHref} className="font-semibold text-tomate underline">
              {restaurante.telefono}
            </a>
          </p>
          <p className="text-sm leading-relaxed text-tinta/70">
            Email:{" "}
            <a
              href={`mailto:${restaurante.email}`}
              className="font-semibold text-tomate underline"
            >
              {restaurante.email}
            </a>
          </p>
          <p className="text-sm text-tinta/70">Instagram: {restaurante.instagram}</p>

          <div className="mt-2 rounded-xl bg-crema-oscuro p-4 text-center">
            <p aria-hidden="true" className="text-tomate">
              ★★★★★
            </p>
            <p className="mt-1 font-bold">{valoracion.estrellas} / 5</p>
            <p className="text-xs text-tinta/60">{valoracion.resenas} resenas de clientes</p>
          </div>
        </div>
      </div>
    </section>
  );
}