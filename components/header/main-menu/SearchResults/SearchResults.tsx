import Link from "next/link"
import { motion } from "framer-motion"
import { searchResultsVariants } from "../../dropdown-motion"
import type { SearchResultsProps } from "./SearchResults.types"

export type { SearchResult } from "./SearchResults.types"

const baseClassName =
  "absolute right-0 top-14 z-30 max-h-80 w-[500px] max-w-[90vw] overflow-y-auto rounded-lg bg-white p-4 text-left shadow-lg ring-1 ring-black/10"

export default function SearchResults({ results, onSelect, className }: SearchResultsProps) {
  const trimmedClassName = className?.trim()
  const rootClassName = trimmedClassName ? `${baseClassName} ${trimmedClassName}` : baseClassName

  return (
    <motion.div
      className={rootClassName}
      variants={searchResultsVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ transformOrigin: "top right" }}
    >
      {results.length > 0 ? (
        <ul className="space-y-1">
          {results.map(({ item, parents }) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onSelect}
                className="block rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-ud-rojo"
              >
                <span className="font-medium">{item.label}</span>
                {parents.length > 0 && (
                  <span className="ml-2 text-xs text-gray-400">
                    {parents.join(" / ")}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-3 py-2 text-sm text-gray-500">
          No se encontraron resultados.
        </p>
      )}
    </motion.div>
  )
}
