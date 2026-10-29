"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BreadCrumbsProps = {
  /**
   * Variante visual. "default" (claro, sobre fondo blanco) o "onDark" para
   * usarse dentro de un banner de fondo oscuro.
   */
  variant?: "default" | "onDark";
};

export default function BreadCrumbs({ variant = "default" }: BreadCrumbsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const formatLabel = (segment: string) => {
    return segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  };

  if (segments.length === 0) return null;

  const onDark = variant === "onDark";

  // "onDark": barra de fondo negro con texto claro encima.
  const navClass = onDark
    ? "py-3 px-4 text-sm text-white bg-black"
    : "py-3 px-4 text-sm text-gray-600 bg-white border-b border-gray-100";

  const linkClass = onDark
    ? "font-medium text-white/80 transition-colors hover:text-white hover:underline"
    : "font-medium text-gray-600 transition-colors hover:text-ud-rojo hover:underline";

  const separatorClass = onDark ? "text-white/50" : "text-gray-400";

  const currentClass = onDark
    ? "font-semibold text-white"
    : "font-semibold text-gray-800";

  return (
    <nav aria-label="BreadCrumbs" className={navClass}>
      <ol className="flex items-center space-x-2 max-w-7xl mx-auto">
        <li>
          <Link href="/" className={linkClass}>
            Inicio
          </Link>
        </li>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="flex items-center space-x-2">
              <span className={separatorClass}> / </span>
              {isLast ? (
                <span className={currentClass} aria-current="page">
                  {formatLabel(segment)}
                </span>
              ) : (
                <Link href={href} className={linkClass}>
                  {formatLabel(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
