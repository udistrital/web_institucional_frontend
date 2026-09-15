"use client"

import Link from "next/link"
import { useState } from "react"
import { mainNavigation } from "@/config/navigation"

export default function MainMenu() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <div className="relative flex flex-col items-end gap-3">
      <form
        role="search"
        className="mt-2 flex h-10 w-64 items-center rounded-full border-2 border-ud-rojo bg-white px-3"
      >
        <label htmlFor="header-search" className="sr-only">
          Buscar en el sitio
        </label>
        <input
          id="header-search"
          type="search"
          name="q"
          placeholder="Buscar"
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-black outline-none"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="flex h-7 w-7 items-center justify-center text-ud-rojo"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </button>
      </form>

      <nav aria-label="Navegación principal" className="mr-15 mt-6">
        <ul className="flex items-center justify-end gap-10">
          {mainNavigation.map((item) => (
            <li key={item.href} className="relative">
              {item.children?.length ? (
                <>
                  <button
                    type="button"
                    aria-expanded={openItem === item.href}
                    onClick={() => setOpenItem((current) => current === item.href ? null : item.href)}
                    className="flex items-center gap-1 font-medium text-gray-800 transition-colors hover:text-ud-rojo"
                  >
                    {item.label}
                    <svg
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform ${openItem === item.href ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {openItem === item.href && (
                    <div className="absolute left-1/2 top-full z-20 mt-3 w-max max-w-[90vw] -translate-x-1/2 bg-white p-8 text-right shadow-lg ring-1 ring-black/10">
                      <span
                        aria-hidden="true"
                        className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white ring-1 ring-gray-200"
                      />
                      <div
                        className="grid items-stretch gap-8"
                        style={{
                          gridTemplateColumns: `repeat(${item.children.length}, minmax(180px, max-content))`,
                        }}
                      >
                        {item.children.map((section, index) => (
                          <section
                            key={section.href}
                            className={`p-4 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                          >
                            <Link
                              href={section.href}
                              onClick={() => setOpenItem(null)}
                              className="block text-lg font-semibold text-gray-900 transition-colors hover:text-ud-rojo"
                            >
                              {section.label}
                            </Link>

                            {section.children?.length ? (
                              <ul className="mt-3 space-y-2">
                                {section.children.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      onClick={() => setOpenItem(null)}
                                      className="block text-sm text-gray-600 transition-colors hover:text-ud-rojo"
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </section>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium text-gray-800 transition-colors hover:text-ud-rojo"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

    </div>
  )
}
