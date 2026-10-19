"use client";

import Brand from "./brand";
import MainMenu from "./main-menu/main-menu";

export default function Header() {
  return (
    <header className="flex w-full flex-col bg-white border-b border-gray-100">
      <div className="relative flex w-full mx-auto items-center justify-between gap-2 md:gap-4 px-4 md:px-6 bg-white py-2">
        <div className="shrink-0">
          <Brand />
        </div>
        <div className="flex-1 flex justify-end min-w-0">
          <MainMenu />
        </div>
      </div>
    </header>
  );
}
