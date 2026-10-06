"use client";

import React, { useState } from "react";
import { tramitesData } from "@/navegation/tramites-admisiones";
import { TramitesTabs } from "./TramitesTabs";
import { EtapasGrid } from "./EtapasGrid";
import { DetalleEtapa } from "./DetalleEtapa";
import { FichaDerecha } from "./FichaDerecha";

export const TramitesSection: React.FC = () => {
  const [tabId, setTabId] = useState<string>(tramitesData[2].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeTab =
    tramitesData.find((tramite) => tramite.id === tabId) ?? tramitesData[2];

  const currentStep = activeTab.etapas[activeStepIndex] || activeTab.etapas[0];

  const handleTabChange = (tramiteId: string) => {
    setTabId(tramiteId);
    setActiveStepIndex(0);
  };

  return (
    <section className="w-full bg-white py-12">
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

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,380px)] gap-6 lg:gap-8 items-start">
          <div className="order-2 lg:order-1 min-w-0">
            <EtapasGrid
              etapas={activeTab.etapas}
              activeStepIndex={activeStepIndex}
              onSelect={setActiveStepIndex}
            />
            <DetalleEtapa currentStep={currentStep} />
          </div>

          <FichaDerecha tramite={activeTab} />
        </div>
      </div>
    </section>
  );
};