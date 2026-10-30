"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BreadCrumbsProps = {
  /**
   * Variante visual. "default" (claro, sobre fondo blanco) o "onDark" para
   * usarse dentro de un banner de fondo oscuro.
   */
  variant?: "default" | "onDark" | "faculty";
};

export default function BreadCrumbs({ variant = "default" }: BreadCrumbsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const formatLabel = (segment: string) => {
    return segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  };

  if (segments.length === 0) return null;

  if (variant === "faculty") {
    const facultySlug = segments[segments.length - 1];

    return (
      <nav aria-label="Breadcrumb" className="bg-[#1a1a1a] px-4 py-3 text-sm text-white">
        <ol className="mx-auto flex max-w-7xl items-center gap-2">
          <li>
            <Link
              aria-label="Inicio"
              className="inline-flex items-center gap-2 font-medium text-white transition-colors hover:text-[#f04b4b] focus-visible:text-[#f04b4b]"
              href="/"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
              Inicio
            </Link>
          </li>
          <li aria-hidden="true" className="text-white/50">/</li>
          <li>
            <Link
              className="font-medium text-white transition-colors hover:text-[#f04b4b] focus-visible:text-[#f04b4b]"
              href="/facultades"
            >
              Facultades
            </Link>
          </li>
          <li aria-hidden="true" className="text-white/50">/</li>
          <li
            aria-current="page"
            className="font-semibold text-[#f04b4b]"
          >
            {formatLabel(facultySlug)}
          </li>
        </ol>
      </nav>
    );
  }

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
