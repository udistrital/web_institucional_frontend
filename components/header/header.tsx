import AudienceNav from "./audience-nav";
import Brand from "./brand";
import MainMenuPruv from "./main-menu/main-menu-pruv";

export default function Header() {
  return (
    <header className="w-full">
      <AudienceNav />
      <div className="flex items-end justify-between bg-ud-gris px-6 py-3">
        <Brand />
        <div className="flex items-end">
          <MainMenuPruv />
        </div>
      </div>
    </header>
  );
}
