"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function PortalLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="font-bold text-[#8c1919] underline decoration-[#fdb400] decoration-2 underline-offset-2">{children}</a>;
}

export function Acordeon({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-5 rounded-lg border border-[#8c1919]/20 bg-white">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="w-full flex items-center justify-between cursor-pointer px-4 py-3 text-left font-bold text-[#8c1919]"
      >
        <span>{titulo}</span>
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden border-t border-[#8c1919]/10"
          >
            <div className="px-4 py-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Nota({ children }: { children: ReactNode }) {
  return <div className="my-5 rounded-lg border-l-4 border-[#fdb400] bg-[#fdb400]/20 px-4 py-3">{children}</div>;
}
