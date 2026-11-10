import type { Ref } from "react";
import Brand from "./brand";
import MainMenu from "./main-menu/main-menu";

export default function Header({ ref }: { ref?: Ref<HTMLElement> }) {
  return (
    <header
      ref={ref}
      className="sticky top-0 z-50 flex w-full flex-col bg-white border-b border-gray-100 shadow-lg"
    >
      <div className="relative flex w-full mx-auto flex-row items-center justify-between gap-2 bg-white px-2 py-2 min-[921px]:flex-col min-[921px]:items-stretch min-[921px]:justify-start min-[921px]:gap-0 min-[921px]:px-0 min-[921px]:py-0 xl:flex-row xl:items-center xl:justify-between xl:gap-4 xl:px-6 xl:py-1">
        <div className="flex shrink-0 justify-start px-0 py-0 min-[921px]:justify-center min-[921px]:px-4 min-[921px]:py-2 xl:justify-start xl:p-0">
          <Brand />
        </div>
        <div className="flex w-32 min-w-0 shrink-0 justify-end border-0 p-0 min-[921px]:w-full min-[921px]:shrink min-[921px]:border-t min-[921px]:border-gray-100 min-[921px]:px-4 min-[921px]:py-1 xl:w-auto xl:flex-1 xl:border-0 xl:p-0">
          <MainMenu />
        </div>
      </div>
    </header>
  );
}
