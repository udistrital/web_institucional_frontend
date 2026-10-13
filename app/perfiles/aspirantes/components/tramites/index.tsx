"use client";

import React, { useEffect, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { tramitesData } from "@/navegation/tramites-admisiones";
import { TramitesTabs } from "./TramitesTabs";
import { EtapasGrid } from "./EtapasGrid";
import { DetalleEtapa } from "./DetalleEtapa";
import { FichaDerecha } from "./FichaDerecha";
import { Fechas } from "./Fechas";

export const TramitesSection: React.FC = () => {
  const [tabId, setTabId] = useState<string>(tramitesData[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeTab =
    tramitesData.find((tramite) => tramite.id === tabId) ?? tramitesData[0];

  const currentStep = activeTab.etapas[activeStepIndex] || activeTab.etapas[0];

  const handleTabChange = (tramiteId: string) => {
    setTabId(tramiteId);
    setActiveStepIndex(0);
  };

  useEffect(() => {
    const selectPrimerIngreso = () => {
      if (window.location.hash === "#tramites") {
        setTabId("primer-ingreso");
        setActiveStepIndex(0);
      }
    };

    const handleHeroClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank") return;

      const url = new URL(link.href, window.location.href);
      if (
        url.pathname !== window.location.pathname ||
        url.hash !== "#tramites"
      ) {
        return;
      }

      event.preventDefault();
      selectPrimerIngreso();
      window.history.replaceState(null, "", "#tramites");
      document.getElementById("tramites")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    selectPrimerIngreso();
    window.addEventListener("click", handleHeroClick, { capture: true });
    window.addEventListener("hashchange", selectPrimerIngreso);

    return () => {
      window.removeEventListener("click", handleHeroClick, { capture: true });
      window.removeEventListener("hashchange", selectPrimerIngreso);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="tramites"
        className="w-full scroll-mt-32 border-y border-gray-200 bg-gray-50/80 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <header className="flex flex-col gap-2 mb-8">
            <h2 className="font-extrabold tracking-tight text-[#1a1a1a] text-[length:var(--fs-h2)] leading-[var(--lh-tight)]">
              Trámites de admisión
            </h2>
            <p className="text-[length:var(--fs-md)] leading-[var(--lh-normal)] text-gray-600 max-w-3xl">
              Selecciona el trámite que necesitas consultar, revisa sus etapas y
              ten presente las fechas límite.
            </p>
          </header>

          <TramitesTabs
            tramites={tramitesData}
            activeTabId={tabId}
            onChange={handleTabChange}
          />

          <motion.div
            layout
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,380px)] gap-8 lg:gap-10 items-start rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:p-10"
          >
            <div className="order-2 lg:order-1 min-w-0">
              <Fechas tramite={activeTab} />
              <EtapasGrid
                etapas={activeTab.etapas}
                activeStepIndex={activeStepIndex}
                onSelect={setActiveStepIndex}
              />
              <DetalleEtapa currentStep={currentStep} />
            </div>

            <FichaDerecha tramite={activeTab} />
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
};
