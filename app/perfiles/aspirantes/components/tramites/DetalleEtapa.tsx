"use client";

import { Etapa } from "@/navegation/tramites-admisiones";

interface DetalleEtapaProps {
  currentStep: Etapa;
}

export function DetalleEtapa({ currentStep }: DetalleEtapaProps) {
  const Content = currentStep.Content;

  return (
    <div className="mt-6 rounded-lg border-l-4 border-[#fdb400] bg-[#fdb400]/15 p-5">
      <span className="block text-[length:var(--fs-2xs)] font-bold uppercase tracking-wider text-[#8c1919] mb-1">
        {currentStep.titulo} · {currentStep.subtitulo}
      </span>
      <div
        aria-live="polite"
        className="admisiones-contenido text-[#1a1a1a] text-[length:var(--fs-sm)] md:text-[length:var(--fs-base)] leading-[var(--lh-normal)] mt-2"
      >
        <Content />
      </div>
    </div>
  );
}
