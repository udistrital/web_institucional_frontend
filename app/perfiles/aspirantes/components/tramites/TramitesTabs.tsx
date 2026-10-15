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
          className="mb-3 block text-[length:var(--fs-md)] font-extrabold text-[#1F2937]"
        >
          Selecciona un trámite
        </label>
        <select
          id="tramite-mobile"
          value={activeTabId}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border-2 border-[#8c1919] bg-white px-5 py-4 text-lg font-extrabold text-[#8c1919] shadow-sm outline-none focus:ring-4 focus:ring-[#fdb400]/50"
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
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          const current = tramites.findIndex((t) => t.id === activeTabId);
          const step = event.key === "ArrowRight" ? 1 : -1;
          const next = tramites[(current + step + tramites.length) % tramites.length];
          onChange(next.id);
          requestAnimationFrame(() =>
            document.getElementById(`tab-${next.id}`)?.focus(),
          );
        }}
        className="hidden w-full gap-2 overflow-x-auto pb-2 md:flex"
      >
        {tramites.map((tramite) => {
        const isSelected = activeTabId === tramite.id;
        return (
          <motion.button
            key={tramite.id}
            id={`tab-${tramite.id}`}
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(tramite.id)}
            className={`relative shrink-0 rounded-xl px-5 py-3 uppercase tracking-wide text-[length:var(--fs-sm)] font-extrabold cursor-pointer transition-colors active:scale-[0.98] ${
              isSelected
                ? "bg-[#8c1919] text-white shadow-sm"
                : "bg-white border border-gray-200 text-[#1F2937] hover:border-[#8c1919] hover:text-[#8c1919]"
            }`}
          >
            {isSelected && (
              <motion.span
                layoutId="tramites-active-pill"
                aria-hidden="true"
                className="absolute inset-x-4 -bottom-0.5 h-1 rounded-full bg-[#fdb400]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tramite.nombreTab}
              {tramite.id === "primer-ingreso" && (
                <span
                  title="Nuevo ingreso"
                  aria-label="Nuevo ingreso"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fdb400] text-[#1F2937]"
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
