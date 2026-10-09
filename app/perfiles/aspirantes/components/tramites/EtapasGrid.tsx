"use client";

import { motion } from "framer-motion";
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

      <label htmlFor="etapa-mobile" className="sr-only">
        Selecciona una etapa
      </label>
      <select
        id="etapa-mobile"
        value={activeStepIndex}
        onChange={(event) => onSelect(Number(event.target.value))}
        className="mb-4 w-full rounded-xl border-2 border-[#fdb400] bg-[#fdb400]/15 px-5 py-4 text-lg font-extrabold text-[#8c1919] shadow-sm outline-none focus:border-[#8c1919] focus:ring-4 focus:ring-[#fdb400]/25 md:hidden"
      >
        {etapas.map((etapa, index) => (
          <option key={etapa.id} value={index}>
            {etapa.titulo}: {etapa.subtitulo}
          </option>
        ))}
      </select>

      <motion.div
        className={`hidden grid-cols-1 gap-3 md:grid ${etapasColumns}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {etapas.map((etapa, index) => {
          const isStepSelected = activeStepIndex === index;
          return (
            <motion.button
              key={etapa.id}
              onClick={() => onSelect(index)}
              aria-pressed={isStepSelected}
              className={`text-left rounded-lg border-l-4 p-4 flex flex-col justify-between min-h-[104px] transition-colors cursor-pointer ${
                isStepSelected
                  ? "border-l-[#8c1919] bg-[#8c1919]/5 text-[#1a1a1a] shadow-sm border-y border-r border-transparent"
                  : "border-l-gray-200 bg-white text-gray-500 border border-gray-100 hover:border-l-[#8c1919]/40 hover:bg-gray-50 hover:text-[#1a1a1a]"
              }`}
            >
              <span
                className={`text-[length:var(--fs-2xs)] font-bold uppercase tracking-wider block mb-1 ${
                  isStepSelected ? "text-[#8c1919]" : "text-gray-400"
                }`}
              >
                {etapa.titulo}
              </span>
              <h4 className="font-bold text-[length:var(--fs-sm)] leading-[var(--lh-snug)]">
                {etapa.subtitulo}
              </h4>
            </motion.button>
          );
        })}
      </motion.div>
    </>
  );
}
