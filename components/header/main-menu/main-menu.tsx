"use client";

import { useCallback, useState } from "react";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";
import BusquedaGlobal from "./search/busqueda-global";
import {
  type NavigationItem,
  campusNavigation,
  nuestraUniversidadNavigation,
  ofertaAcademicaNavigation,
} from "./shared/navigation";

// Todos los menús para búsqueda
const allNavigationItems: NavigationItem[] = [
  nuestraUniversidadNavigation,
  campusNavigation,
  ofertaAcademicaNavigation,
];

export default function MainMenu() {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  return (
    <>
      <DesktopNav onOpenSearch={openSearch} />
      <MobileNav onOpenSearch={openSearch} />

      {/* ── Búsqueda a pantalla completa (overlay difuminado) ── */}
      <BusquedaGlobal
        isOpen={searchOpen}
        onClose={closeSearch}
        navigationItems={allNavigationItems}
      />
    </>
  );
}
