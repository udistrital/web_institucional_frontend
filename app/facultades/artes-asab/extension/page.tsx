import type { Metadata } from "next";
import Link from "next/link";

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
      <p className="mt-4 text-lg text-gray-700">
        Esta sección se encuentra en construcción.
      </p>
      <Link
        className="mt-8 inline-block border border-[#8c1919] px-5 py-3 text-sm font-bold text-[#8c1919] transition-colors hover:bg-[#8c1919] hover:text-white"
        href="/facultades/artes-asab"
      >
        Volver a la Facultad de Artes ASAB
      </Link>
    </section>
  );
}
