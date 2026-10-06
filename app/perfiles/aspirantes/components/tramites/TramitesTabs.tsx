"use client";

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
    <div
      role="tablist"
      aria-label="Tipos de trámite"
      className="flex w-full gap-2 overflow-x-auto pb-1 border-b-2 border-gray-200"
    >
      {tramites.map((tramite) => {
        const isSelected = activeTabId === tramite.id;
        return (
          <button
            key={tramite.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(tramite.id)}
            className={`shrink-0 px-6 py-4 -mb-[2px] border-b-[3px] uppercase tracking-wide text-[length:var(--fs-md)] font-extrabold cursor-pointer transition-colors ${
              isSelected
                ? "border-[#8c1919] text-[#8c1919] bg-[#8c1919]/10"
                : "border-transparent text-gray-500 hover:text-[#8c1919] hover:bg-gray-50"
            }`}
          >
            {tramite.nombreTab}
          </button>
        );
      })}
    </div>
  );
}