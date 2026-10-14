"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Buscador from "./buscador";
import { searchNavigation } from "./busqueda-utils";
import type { NavigationItem } from "../shared/navigation";

type BusquedaGlobalProps = {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
};

export default function BusquedaGlobal({
  isOpen,
  onClose,
  navigationItems,
}: BusquedaGlobalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchNavigation(navigationItems, searchQuery);
  }, [navigationItems, searchQuery]);

  // Bloquear scroll del body mientras el overlay está abierto
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Cerrar con Escape y limpiar query
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchQuery("");
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <div className="flex items-center justify-end p-4">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar búsqueda"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="mx-auto w-full max-w-2xl px-4 pb-10">
            <Buscador
              value={searchQuery}
              onChange={setSearchQuery}
              autoFocus
            />

            {searchQuery.trim().length > 0 && (
              <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-2xl bg-white/95 p-2 shadow-xl">
                {searchResults.length > 0 ? (
                  <ul className="space-y-1">
                    {searchResults.map(({ item, parents }) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={handleClose}
                          className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-ud-rojo"
                        >
                          <span className="font-medium">{item.label}</span>
                          {parents.length > 0 && (
                            <span className="ml-2 text-xs text-gray-400">
                              {parents.join(" / ")}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-3 py-2 text-sm text-gray-500">
                    No se encontraron resultados.
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
