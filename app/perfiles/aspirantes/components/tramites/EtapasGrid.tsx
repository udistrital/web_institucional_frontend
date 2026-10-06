"use client";

import { Etapa } from "@/navegation/tramites-admisiones";

const etapasGridClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
};

interface EtapasGridProps {
  etapas: Etapa[];
  activeStepIndex: number;
  onSelect: (index: number) => void;
}

export function EtapasGrid({
  etapas,
  activeStepIndex,
  onSelect,
}: EtapasGridProps) {
  const etapasColumns =
    etapasGridClass[etapas.length] ?? "grid-cols-1 sm:grid-cols-2";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-[#1a1a1a] text-[length:var(--fs-lg)] leading-[var(--lh-snug)]">
          Etapas del trámite
        </h3>
      </div>

      <div className={`grid ${etapasColumns} gap-3`}>
        {etapas.map((etapa, index) => {
          const isStepSelected = activeStepIndex === index;
          return (
            <button
              key={etapa.id}
              onClick={() => onSelect(index)}
              aria-pressed={isStepSelected}
              className={`text-left rounded-lg border-l-4 p-4 flex flex-col justify-between min-h-[104px] transition-colors cursor-pointer ${
                isStepSelected
                  ? "border-l-[#8c1919] bg-[#8c1919] text-white shadow-md"
                  : "border-l-gray-300 bg-white text-[#1a1a1a] border-y border-r border-gray-200 hover:border-l-[#fdb400] hover:bg-[#fdb400]/10"
              }`}
            >
              <span
                className={`text-[length:var(--fs-2xs)] font-bold uppercase tracking-wider block mb-1 ${
                  isStepSelected ? "text-[#fdb400]" : "text-[#8c1919]"
                }`}
              >
                {etapa.titulo}
              </span>
              <h4 className="font-bold text-[length:var(--fs-sm)] leading-[var(--lh-snug)]">
                {etapa.subtitulo}
              </h4>
            </button>
          );
        })}
      </div>
    </>
  );
}