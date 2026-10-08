type BuscadorProps = {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
  placeholder?: string
  id?: string
  className?: string
}

export default function Buscador({
  value,
  onChange,
  autoFocus = false,
  placeholder = "Buscar en el sitio",
  id = "header-search",
  className,
}: BuscadorProps) {
  return (
    <div
      role="search"
      className={
        className ??
        "flex h-14 items-center gap-3 rounded-full border-2 border-white bg-white px-6 shadow-xl"
      }
    >
      <svg
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-ud-rojo"
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
      <label htmlFor={id} className="sr-only">
        Buscar en el sitio
      </label>
      <input
        id={id}
        type="search"
        name="q"
        placeholder={placeholder}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-black outline-none"
      />
    </div>
  )
}
