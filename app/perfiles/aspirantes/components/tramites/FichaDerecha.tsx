"use client";

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
    <aside className="order-1 lg:order-2 w-full rounded-2xl bg-[#8c1919] text-white shadow-xl overflow-hidden">
      <div className="bg-black/25 px-6 py-4 border-b border-white/20">
        <h3 className="font-extrabold text-[length:var(--fs-lg)] leading-[var(--lh-tight)] mt-1">
          {tramite.tituloFicha}
        </h3>
      </div>

      <div className="px-6 py-6 flex flex-col gap-6">
        <div className="bg-white rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-4">
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
            <span className="w-4 h-4 text-[#fdb400] shrink-0">
              <UserIcon />
            </span>
            <h4 className="font-bold text-[length:var(--fs-sm)] text-[#fdb400]">
              ¿Quién puede aplicar?
            </h4>
          </div>
          {QuienPuedeContent ? (
            <div className="admisiones-contenido text-[length:var(--fs-sm)] leading-[var(--lh-normal)] text-white/90">
              <QuienPuedeContent />
            </div>
          ) : (
            <p className="text-[length:var(--fs-sm)] leading-[var(--lh-normal)] text-white/90">
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
    </aside>
  );
}
