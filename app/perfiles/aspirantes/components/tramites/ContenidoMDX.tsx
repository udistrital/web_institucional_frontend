import type { ReactNode } from "react";

export function PortalLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="font-bold text-[#8c1919] underline decoration-[#fdb400] decoration-2 underline-offset-2">{children}</a>;
}

export function Acordeon({ titulo, children }: { titulo: string; children: ReactNode }) {
  return <details className="my-5 rounded-lg border border-[#8c1919]/20 bg-white"><summary className="cursor-pointer px-4 py-3 font-bold text-[#8c1919]">{titulo}</summary><div className="border-t border-[#8c1919]/10 px-4 py-3">{children}</div></details>;
}

export function Nota({ children }: { children: ReactNode }) {
  return <div className="my-5 rounded-lg border-l-4 border-[#fdb400] bg-[#fdb400]/20 px-4 py-3">{children}</div>;
}
