import type { Ref } from "react";
import Brand from "./brand";
import MainMenu from "./main-menu/main-menu";

export default function Header({ ref }: { ref?: Ref<HTMLElement> }) {
  return (
    <header
      ref={ref}
      className="sticky top-0 z-50 flex w-full flex-col bg-white border-b border-gray-100"
    >
      <div className="relative flex w-full mx-auto flex-col md:flex-row md:items-center md:justify-between md:gap-4 md:px-6 bg-white md:py-1">
        <div className="shrink-0 px-4 py-2 md:p-0 flex justify-center md:justify-start">
          <Brand />
        </div>
        <div className="flex w-full min-w-0 justify-end border-t border-gray-100 px-4 py-1 md:flex-1 md:w-auto md:border-0 md:p-0">
          <MainMenu />
        </div>
      </div>
    </header>
  );
}
