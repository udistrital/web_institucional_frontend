import type { Metadata } from "next";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import TablerosExplorer from "@/components/ti/TablerosExplorer";
import { getTablerosData } from "@/services/tableros";

export const metadata: Metadata = {
  title: "Tableros de Inteligencia Institucional",
  description:
    "Tableros e indicadores institucionales de la Universidad Distrital Francisco José de Caldas, organizados por categoría.",
};

export default async function TablerosPage() {
  const { categories, uncategorized, hasError } = await getTablerosData();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[var(--content-width)] px-4 py-10 sm:py-14">
        <header className="mb-8">
          <h1 className="text-[length:var(--fs-h2)] font-bold leading-[var(--lh-tight)] text-[color:var(--institutional-red)]">
            Tableros institucionales
          </h1>
          <p className="mt-3 max-w-3xl text-[length:var(--fs-md)] text-neutral-600">
            Indicadores y tableros de Inteligencia Institucional. Selecciona un
            tablero del menú para visualizarlo.
          </p>
        </header>

        {hasError ? (
          <div
            role="alert"
            className="rounded-lg border border-[color:var(--institutional-red)]/30 bg-[color:var(--institutional-red)]/5 px-4 py-3 text-sm text-[color:var(--institutional-red)]"
          >
            No fue posible cargar los tableros en este momento. Intenta nuevamente
            más tarde.
          </div>
        ) : (
          <TablerosExplorer categories={categories} uncategorized={uncategorized} />
        )}
      </main>
      <Footer />
    </>
  );
}
