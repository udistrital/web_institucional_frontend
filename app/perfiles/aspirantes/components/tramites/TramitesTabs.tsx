"use client";

import { motion } from "framer-motion";
import { Tramite } from "@/navegation/tramites-admisiones";

interface TramitesTabsProps {
  tramites: Tramite[];
  activeTabId: string;
  onChange: (tramiteId: string) => void;
}

export function TramitesTabs({
  tramites,
  activeTabId,
  onChange,
}: TramitesTabsProps) {
  return (
    <>
      <div className="md:hidden">
        <label
          htmlFor="tramite-mobile"
          className="mb-3 block text-[length:var(--fs-md)] font-extrabold text-[#1a1a1a]"
        >
          Selecciona un trámite
        </label>
        <select
          id="tramite-mobile"
          value={activeTabId}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border-2 border-[#fdb400] bg-[#fdb400]/15 px-5 py-4 text-lg font-extrabold text-[#8c1919] shadow-sm outline-none focus:border-[#8c1919] focus:ring-4 focus:ring-[#fdb400]/25"
        >
          {tramites.map((tramite) => (
            <option key={tramite.id} value={tramite.id}>
              {tramite.nombreTab}
              {tramite.id === "primer-ingreso" ? " - Nuevo ingreso" : ""}
            </option>
          ))}
        </select>
      </div>

      <div
        role="tablist"
        aria-label="Tipos de trámite"
        className="hidden w-full gap-2 overflow-x-auto border-b-2 border-gray-200 pb-1 md:flex"
      >
        {tramites.map((tramite) => {
        const isSelected = activeTabId === tramite.id;
        return (
          <motion.button
            key={tramite.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(tramite.id)}
            className={`relative shrink-0 px-6 py-4 -mb-[2px] uppercase tracking-wide text-[length:var(--fs-md)] font-extrabold cursor-pointer transition-colors ${
              isSelected
                ? "text-[#8c1919]"
                : "text-gray-500 hover:text-[#8c1919] hover:bg-gray-50"
            }`}
          >
            {isSelected && (
              <motion.span
                layoutId="tramites-active-pill"
                className="absolute inset-0 bg-[#8c1919]/10 rounded-t-md border-b-[3px] border-[#8c1919]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tramite.nombreTab}
              {tramite.id === "primer-ingreso" && (
                <span
                  title="Nuevo ingreso"
                  aria-label="Nuevo ingreso"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fdb400]/25 text-[#8c1919]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="h-5 w-5"
                  >
                    <path
                      d="m3 9 9-5 9 5-9 5-9-5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 11.2V15c0 1.7 2.2 3 5 3s5-1.3 5-3v-3.8M21 10v5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 3v3M17.5 4.5h3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              )}
            </span>
          </motion.button>
        );
        })}
      </div>
    </>
  );
}
