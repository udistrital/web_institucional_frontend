"use client";

import { motion } from "framer-motion";
import { Tramite } from "@/navegation/tramites-admisiones";

interface FichaDerechaProps {
  tramite: Tramite;
}

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="w-full h-full">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="w-full h-full">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export function FichaDerecha({ tramite }: FichaDerechaProps) {
  const QuienPuedeContent = tramite.QuienPuedeContent;

  return (
    <motion.aside
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="order-1 lg:order-2 w-full border-t border-gray-100 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
    >
      <div className="px-0 pb-4 border-b border-gray-100">
        <h3 className="font-extrabold text-[length:var(--fs-lg)] leading-[var(--lh-tight)] mt-1">
          {tramite.tituloFicha}
        </h3>
      </div>

      <div className="px-0 pt-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 text-[#8c1919] shrink-0">
              <CalendarIcon />
            </span>
            <h4 className="font-extrabold uppercase tracking-wide text-[#8c1919] text-[length:var(--fs-sm)]">
              Fechas
            </h4>
          </div>
          <ul className="flex flex-col gap-3">
            {tramite.fechas.map((fecha, i) => {
              const separator = fecha.indexOf(":");
              const etiqueta =
                separator > -1 ? fecha.slice(0, separator).trim() : null;
              const valor =
                separator > -1 ? fecha.slice(separator + 1).trim() : fecha;

              return (
                <li key={i} className="border-l-4 border-[#fdb400] pl-3 py-0.5">
                  {etiqueta && (
                    <span className="block text-[length:var(--fs-2xs)] font-bold uppercase tracking-wide text-gray-500">
                      {etiqueta}
                    </span>
                  )}
                  <span className="block font-bold text-[#8c1919] text-[length:var(--fs-base)] leading-[var(--lh-snug)]">
                    {valor}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-4 h-4 text-[#8c1919] shrink-0">
              <UserIcon />
            </span>
            <h4 className="font-bold text-[length:var(--fs-sm)] text-[#8c1919]">
              ¿Quién puede aplicar?
            </h4>
          </div>
          {QuienPuedeContent ? (
            <div className="admisiones-contenido text-[length:var(--fs-sm)] leading-[var(--lh-normal)] text-gray-600">
              <QuienPuedeContent />
            </div>
          ) : (
            <p className="text-[length:var(--fs-sm)] leading-[var(--lh-normal)] text-gray-600">
              {tramite.quienPuedeAplicar}
            </p>
          )}
        </div>

        <a
          href="https://funcionarios.portaloas.udistrital.edu.co/admisiones/"
          target="_blank"
          rel="noreferrer"
          className="w-full bg-[#fdb400] hover:bg-[#ffd75e] text-black font-extrabold text-[length:var(--fs-base)] py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          Iniciar {tramite.nombreTab.toLowerCase()} →
        </a>
      </div>
    </motion.aside>
  );
}
