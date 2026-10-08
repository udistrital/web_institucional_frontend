"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Campus from "./submenus/campus";
import OfertaAcademica from "./submenus/oferta-academica";
import NuestraUniversidad from "./submenus/nuestra-universidad";
import Aspirantes from "./submenus/aspirantes";
import Internacionalizacion from "./submenus/internacionalizacion";
import { SearchIcon } from "./shared/icons";

type OpenMenu = "universidad" | "campus" | "oferta" | "vida" | null;

type DesktopNavProps = {
  onOpenSearch: () => void;
};

export default function DesktopNav({ onOpenSearch }: DesktopNavProps) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  // Hover intent: retardo de cierre para que el recorrido del mouse
  // (botón → panel, columnas) no cierre el submenú en la zona muerta.
  const closeMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelCloseMenu = useCallback(() => {
    if (closeMenuTimeout.current) {
      clearTimeout(closeMenuTimeout.current);
      closeMenuTimeout.current = null;
    }
  }, []);

  const handleMenuEnter = useCallback(
    (menu: OpenMenu) => {
      cancelCloseMenu();
      setOpenMenu(menu);
    },
    [cancelCloseMenu],
  );

  const handleMenuLeave = useCallback(() => {
    cancelCloseMenu();
    closeMenuTimeout.current = setTimeout(() => setOpenMenu(null), 180);
  }, [cancelCloseMenu]);

  const closeMenu = () => {
    cancelCloseMenu();
    setOpenMenu(null);
  };

  useEffect(() => {
    const closeMenusOnScroll = () => {
      cancelCloseMenu();
      setOpenMenu(null);
    };
    window.addEventListener("scroll", closeMenusOnScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", closeMenusOnScroll);
      cancelCloseMenu();
    };
  }, [cancelCloseMenu]);

  return (
    <>
      {/* ── Nav DESKTOP ── */}
      <nav
        aria-label="Menú principal de navegación"
        className="hidden flex-1 items-center justify-center gap-4 font-extrabold text-black md:flex"
      >
        <NuestraUniversidad
          onMouseEnter={() => handleMenuEnter("universidad")}
          onMouseLeave={handleMenuLeave}
          isOpen={openMenu === "universidad"}
          onClose={closeMenu}
        />

        <OfertaAcademica
          onMouseEnter={() => handleMenuEnter("oferta")}
          onMouseLeave={handleMenuLeave}
          isOpen={openMenu === "oferta"}
          onClose={closeMenu}
        />
        <Internacionalizacion onClose={closeMenu} />
        <Aspirantes onClose={closeMenu} />
        <Campus
          onMouseEnter={() => handleMenuEnter("campus")}
          onMouseLeave={handleMenuLeave}
          isOpen={openMenu === "campus"}
          onClose={closeMenu}
        />
      </nav>

      {/* ── Botón de búsqueda DESKTOP ── */}
      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="Buscar en el sitio"
        className="hidden h-15 w-15 shrink-0 items-center justify-center rounded-full bg-ud-rojo text-white shadow-md transition-all hover:bg-[#b40024] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-rojo active:scale-95 md:flex"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </>
  );
}
