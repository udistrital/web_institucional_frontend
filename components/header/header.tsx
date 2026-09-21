import AudienceNav from "./audience-nav";
import Brand from "./brand";
import MainMenu from "./main-menu/main-menu";

export default function Header() {
  return (
    <header className="grid w-full grid-cols-[1fr_auto]">
      <AudienceNav />
      <Brand />
      <MainMenu />
    </header>
  );
}
