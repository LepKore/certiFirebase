import Hero from "@/components/sections/Hero";
import SobreNos from "@/components/sections/SobreNos";
import MenuSection from "@/components/sections/MenuSection";
import SeccionPedido from "@/components/sections/SeccionPedido";
import SeccionReserva from "@/components/sections/SeccionReserva";
import Informacion from "@/components/sections/Informacion";

export default function Home() {
  return (
    <>
      <Hero />
      <SobreNos />
      <MenuSection />
      <SeccionPedido />
      <SeccionReserva />
      <Informacion />
    </>
  );
}