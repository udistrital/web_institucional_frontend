"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Tramite } from "@/navegation/tramites-admisiones";

interface FechasProps {
  tramite: Tramite;
}

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="w-full h-full">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export function Fechas({ tramite }: FechasProps) {
  return (
    <section
      aria-labelledby="tramite-fechas-titulo"
      className="relative mb-8 border-b border-gray-200 pb-8 after:absolute after:-bottom-px after:left-0 after:h-0.5 after:w-12 after:bg-[#fdb400] after:content-['']"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8c1919]/10 text-[#8c1919]">
          <span className="h-5 w-5">
            <CalendarIcon />
          </span>
        </span>
        <h3
          id="tramite-fechas-titulo"
          className="font-extrabold uppercase tracking-wide text-[#8c1919] text-[length:var(--fs-sm)]"
        >
          Fechas · {tramite.tituloFicha}
        </h3>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={tramite.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
        >
          {tramite.fechas.map((fecha, i) => {
            const separator = fecha.indexOf(":");
            const etiqueta =
              separator > -1 ? fecha.slice(0, separator).trim() : null;
            const valor =
              separator > -1 ? fecha.slice(separator + 1).trim() : fecha;

            return (
              <li
                key={i}
                className="rounded-xl border border-gray-200 border-t-[3px] border-t-[#fdb400] bg-white p-4 transition-all hover:border-[#fdb400] hover:shadow-md"
              >
                {etiqueta && (
                  <span className="block text-[length:var(--fs-2xs)] font-bold uppercase tracking-wide text-gray-500">
                    {etiqueta}
                  </span>
                )}
                <span className="block mt-1 font-extrabold text-[#8c1919] text-[length:var(--fs-md)] leading-[var(--lh-snug)]">
                  {valor}
                </span>
              </li>
            );
          })}
        </motion.ul>
      </AnimatePresence>
    </section>
  );
}
