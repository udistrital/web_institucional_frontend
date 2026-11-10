import type { Metadata } from "next";
import Button from "@/components/common/button/button";

export const metadata: Metadata = {
  title: "Extensión - Facultad de Artes ASAB",
};

export default function ExtensionAsabPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-[#8c1919]">
        Facultad de Artes ASAB
      </p>
      <h1 className="mt-3 text-4xl font-extrabold text-gray-900">
        Extensión
      </h1>
      <p className="mt-4 mb-8 text-lg text-gray-700">
        Esta sección se encuentra en construcción.
      </p>
      <Button href="/facultades/artes-asab" variant="white">
        Volver a la Facultad de Artes ASAB
      </Button>
    </section>
  );
}
