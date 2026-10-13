"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Tramite } from "@/navegation/tramites-admisiones";

interface FichaDerechaProps {
  tramite: Tramite;
}

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
      className="relative order-1 lg:order-2 w-full h-[560px] lg:h-[640px] shrink-0 overflow-hidden rounded-2xl bg-[#1a1a1a] text-white"
    >
      {/* Imagen de fondo del trámite ocupando toda la ficha */}
      <AnimatePresence initial={false}>
        <motion.div
          key={tramite.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={tramite.imagen}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Difuminado inferior para garantizar la legibilidad del texto */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[65%] bg-linear-to-t from-black/95 via-black/70 to-transparent"
      />

      {/* Difuminado superior para el título */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[40%] bg-linear-to-b from-black/80 via-black/40 to-transparent"
      />

      <div className="absolute inset-x-0 top-0 z-10 p-6 lg:p-8">
        <span aria-hidden="true" className="mb-3 block h-1 w-12 bg-[#fdb400]" />
        <h3 className="line-clamp-3 font-extrabold uppercase tracking-tight text-[length:var(--fs-h3)] leading-[var(--lh-tight)] drop-shadow-lg">
          {tramite.tituloFicha}
        </h3>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end gap-5 p-6 lg:p-8">

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
    </motion.aside>
  );
}
