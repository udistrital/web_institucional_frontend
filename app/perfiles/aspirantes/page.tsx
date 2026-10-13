import type { Metadata } from "next";
import Tarjet from "@/components/tarjet/tarjet";
import { mainNavigation } from "@/navegation/audience_services";
import Hero from "@/components/hero/hero";
import BreadCrumbs from "@/components/bread-crumbs/bread-crumbs";
import InfoCard from "./components/InfoCard";
import { TramitesSection } from "./components/tramites";

export const metadata: Metadata = {
  title: "Servicios - Aspirantes",
};

export default function ServiciosAspirantesPage() {
  return (
    <main>
      <Hero
        title="Aspirantes"
        subtitle="Conoce los procesos para aspirantes a la UD"
        backGroundImage="/image/image-aspirantes/primer ingreso.jpg"
        height="medium"
        alignment="right"
        primaryButton={{
          text: "Primer ingreso",
          href: "#tramites",
        }}
        secundaryButton={{
          text: "Resultados de admisiones",
          href: "/",
        }}
      />
      <BreadCrumbs />
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-wide text-[#1a1a1a]">
          Conoce nuestros programas
        </h2>
        <div className="relative hidden sm:block h-px flex-1 ml-6 bg-gray-200">
          <span className="absolute left-0 top-0 h-0.5 w-12 -translate-y-1/4 bg-[#fdb400]" />
        </div>
      </div>
      <div className=" grid-cols-1 max-w-7xl mx-auto flex lg:grid-cols-2 gap-6 py-8 items-center justify-between">
        <InfoCard
          iconSrc="/logotipos-ud/UD-red-white.svg"
          title="Programas de pregrado"
          subtitle="Oferta, requisitos y perfiles de egreso."
          buttonText="Ver ofertas de pregrado"
          buttonHref="/programas/pregrado"
        />
        <InfoCard
          iconSrc="/logotipos-ud/UD-black-white.svg"
          title="Programas de posgrado"
          subtitle="Especializaciones, maestrías y doctorados."
          buttonText="Ver ofertas de posgrado"
          buttonHref="/programas/posgrado"
        />
      </div>
      <TramitesSection />
      <div className="grid items-center py-8 max-w-7xl mx-auto">
        <InfoCard
          iconSrc="/image/image-aspirantes/graduacion oportuna.jpg"
          iconAlt="Graduación oportuna"
          title="Graduacion oportuna"
          subtitle="Conoce esta alternativa y termina tus estudios!"
          buttonText="Conocer mas"
          buttonHref="/programas/pregrado"
          variant="image"
        />
      </div>
    </main>
  );
}
