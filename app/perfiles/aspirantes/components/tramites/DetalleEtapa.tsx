"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Etapa } from "@/navegation/tramites-admisiones";

interface DetalleEtapaProps {
  currentStep: Etapa;
}

export function DetalleEtapa({ currentStep }: DetalleEtapaProps) {
  const Content = currentStep.Content;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={currentStep.id}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mt-8 pt-6 border-t border-gray-100 overflow-hidden"
      >
          <span className="block text-[length:var(--fs-2xs)] font-bold uppercase tracking-wider text-[#8c1919] mb-1">
            {currentStep.titulo} · {currentStep.subtitulo}
          </span>
          <div
            aria-live="polite"
            className="admisiones-contenido text-[#1a1a1a] text-[length:var(--fs-sm)] md:text-[length:var(--fs-base)] leading-[var(--lh-normal)] mt-2"
          >
            <Content />
          </div>
      </motion.div>
    </AnimatePresence>
  );
}
