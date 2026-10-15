import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import { CarritoProvider } from "@/components/carrito/CarritoProvider";
import { restaurante } from "@/lib/restaurant";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${restaurante.nombre} — ${restaurante.lema}`,
  description: restaurante.descripcionCorta,
  openGraph: {
    title: restaurante.nombre,
    description: restaurante.descripcionCorta,
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CarritoProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <footer className="mt-20 border-t border-tinta/10 bg-crema-oscuro">
            <div className="container-resto flex flex-col gap-2 py-8 text-sm text-tinta/70 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} {restaurante.nombre} ·{" "}
                {restaurante.direccion.calle}, {restaurante.direccion.ciudad}
              </p>
              <p>
                <a className="hover:text-tomate" href={restaurante.telefonoHref}>
                  {restaurante.telefono}
                </a>
                {" · "}
                <a className="hover:text-tomate" href={`mailto:${restaurante.email}`}>
                  {restaurante.email}
                </a>
              </p>
            </div>
          </footer>
        </CarritoProvider>
      </body>
    </html>
  );
}