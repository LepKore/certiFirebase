import Link from "next/link";

export default function NoEncontrada() {
  return (
    <main className="container-resto py-24 text-center">
      <p className="etiqueta">Error 404</p>
      <h1 className="titulo-seccion mt-2">No hemos encontrado esta página</h1>
      <p className="mx-auto mt-4 max-w-md text-tinta/70">
        Puede que el enlace esté mal escrito o que la página ya no exista.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primario">
          Ir a la carta
        </Link>
        <Link href="/pedidos" className="rounded-full border border-tinta/20 px-5 py-2.5">
          Ver mis pedidos
        </Link>
      </div>
    </main>
  );
}