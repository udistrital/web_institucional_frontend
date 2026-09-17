import AudienceNav from "./audience-nav";
import Brand from "./brand";
import MainMenu from "./main-menu/main-menu";

export default function Header() {
  return (
    <header className="w-full">
      <AudienceNav />
      <div className="flex items-end justify-between bg-ud-gris px-6 py-3">
        <Brand />
        <div className="flex items-end">
          <MainMenu />
        </div>
      </div>
    </header>
  );
}
