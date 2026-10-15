"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BreadCrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const formatLabel = (segment: string) => {
    return segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  };

  if (segments.length === 0) return null;
  const currentTitle = formatLabel(segments[segments.length - 1]);
  return (
    <>
      <nav
        aria-label="BreadCrumbs"
        className="py-3 px-4 text-sm text-gray-600 bg-white border-b border-gray-100"
      >
        <ol className="flex items-center space-x-2 max-w-7xl  mx-auto">
          <li>
            <Link
              href="/"
              className="font-medium text-gray-600 transition-colors hover:text-ud-rojo hover:underline"
            >
              Inicio
            </Link>
          </li>

          {segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            const isLast = index === segments.length - 1;

            return (
              <li key={href} className="flex items-center space-x-2">
                <span className="text-gray-400"> / </span>
                {isLast ? (
                  <span
                    className="font-semibold text-gray-800"
                    aria-current="page"
                  >
                    {formatLabel(segment)}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="text-gray-600 transition-colors hover:text-ud-rojo hover:underline"
                  >
                    {formatLabel(segment)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="max-w-7xl mx-auto px-4 md:py-4 flex flex-row items-center justify-start gap-2">
        <img
          src="/logotipos-ud/UD-black-white.svg"
          alt="Logo Universidad Distrital en negro"
          className="w-12 md:w-34 h-auto"
        />
        <div>
          <h1 className="flex-2 columns-1">servicios</h1>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            {currentTitle}
          </h1>
        </div>
      </div>
    </>
  );
}
