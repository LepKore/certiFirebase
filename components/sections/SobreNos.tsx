import { destacadas, restaurante } from "@/lib/restaurant";

export default function SobreNos() {
  return (
    <section id="sobre" className="container-resto py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="etiqueta">Sobre el restaurante</p>
          <h2 className="titulo-seccion mt-2">Un rinconcito de la Provenza</h2>
          <p className="mt-5 leading-relaxed text-tinta/75">
            Nacimos con una idea sencilla: cocinar como lo haria un abuelo en su pueblo, con un
            cuidado exquisito y sin prisa. Cada dia elegimos el producto en el mercado y lo
            cocinamos al momento. Por eso nuestra carta es corta y cambia con frecuencia.
          </p>
          <p className="mt-4 leading-relaxed text-tinta/75">
            El nombre no es casualidad: {restaurante.nombre} es tambien esa receta de verduras
            confitadas que es nuestra firma de la casa. Te recomendamos empezar por ahi.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {destacadas.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-tinta/75">
                <span aria-hidden="true" className="text-provenza">
                  ✓
                </span>
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="card items-center gap-3 bg-provenza px-8 py-14 text-center text-crema">
          <span aria-hidden="true" className="text-6xl">
            🍝
          </span>
          <p className="text-3xl font-black tracking-tight">Ratatouille</p>
          <p className="max-w-xs text-sm text-crema/80">
            &laquo;Cocinar es una forma de saber a quien quieres&raquo;
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-crema/60">
            {restaurante.direccion.calle} · {restaurante.direccion.ciudad}
          </p>
        </div>
      </div>
    </section>
  );
}