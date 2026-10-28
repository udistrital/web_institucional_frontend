import type { Metadata } from "next";
import Hero from "@/components/ui/hero/hero";
import { getHero } from "@/lib/drupal/hero";

export const metadata: Metadata = {
  title: "Facultad de Medio Ambiente y Recursos Naturales",
};

export default async function MedioAmbienteRecursosNaturalesPage() {
  const hero = await getHero("HERO_FMYRN");
  return (
    <main>
      {hero && <Hero {...hero} />}
    </main>
  );
}
