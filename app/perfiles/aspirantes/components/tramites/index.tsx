"use client";

import React, { useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { tramitesData } from "@/navegation/tramites-admisiones";
import { TramitesTabs } from "./TramitesTabs";
import { EtapasGrid } from "./EtapasGrid";
import { DetalleEtapa } from "./DetalleEtapa";
import { FichaDerecha } from "./FichaDerecha";

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

  return (
    <MotionConfig reducedMotion="user">
      <section className="w-full border-y border-gray-200 bg-gray-50/80 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <header className="flex flex-col gap-2 mb-8">
          <h2 className="font-extrabold tracking-tight text-[#1a1a1a] text-[length:var(--fs-h2)] leading-[var(--lh-tight)]">
            Trámites de admisión
          </h2>
          <p className="text-[length:var(--fs-md)] leading-[var(--lh-normal)] text-gray-600 max-w-3xl">
            Selecciona el trámite que necesitas consultar, revisa sus etapas y ten
            presente las fechas límite.
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
