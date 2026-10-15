"use client";

import { motion } from "framer-motion";
import { Etapa } from "@/navegation/tramites-admisiones";

const etapasItemClass: Record<number, string> = {
  1: "w-full",
  2: "w-full sm:w-[calc(50%-0.375rem)]",
  3: "w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]",
  4: "w-full sm:w-[calc(50%-0.375rem)] xl:w-[calc(33.333%-0.5rem)]",
  5: "w-full sm:w-[calc(50%-0.375rem)] xl:w-[calc(33.333%-0.5rem)]",
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
  const etapasItem =
    etapasItemClass[etapas.length] ?? "w-full sm:w-[calc(50%-0.375rem)]";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-[#1F2937] text-[length:var(--fs-lg)] leading-[var(--lh-snug)]">
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
        className="mb-4 w-full rounded-xl border-2 border-[#8c1919] bg-white px-5 py-4 text-lg font-extrabold text-[#8c1919] shadow-sm outline-none focus:ring-4 focus:ring-[#fdb400]/50 md:hidden"
      >
        {etapas.map((etapa, index) => (
          <option key={etapa.id} value={index}>
            {etapa.titulo}: {etapa.subtitulo}
          </option>
        ))}
      </select>

      <motion.div
        className="hidden flex-wrap justify-center gap-3 md:flex"
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
              aria-label={`${etapa.titulo}: ${etapa.subtitulo}${
                isStepSelected ? " (seleccionada)" : ""
              }`}
              className={`relative flex min-h-[104px] shrink-0 cursor-pointer items-start gap-3 rounded-xl border-2 p-3 text-left transition-colors active:scale-[0.99] sm:p-4 ${etapasItem} ${
                isStepSelected
                  ? "border-[#8c1919] bg-[#8c1919]/5 text-[#1F2937] shadow-sm"
                  : "border-gray-200 bg-white text-[#64748B] hover:border-[#8c1919]/50 hover:text-[#1F2937]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isStepSelected
                    ? "bg-[#8c1919] text-white"
                    : "bg-gray-100 text-[#64748B]"
                }`}
              >
                {isStepSelected && (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="m5 12 5 5 9-10"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`mb-1 block text-[length:var(--fs-2xs)] font-bold uppercase tracking-wider ${
                    isStepSelected ? "text-[#8c1919]" : "text-[#64748B]"
                  }`}
                >
                  {etapa.titulo}
                </span>
                <span className="block font-bold text-[length:var(--fs-sm)] leading-[var(--lh-snug)]">
                  {etapa.subtitulo}
                </span>
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </>
  );
}
