type BuscadorProps = {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  className?: string
}

export default function Buscador({ value, onChange, onSearch, className }: BuscadorProps) {
  return (
    <form
      role="search"
      onClick={onSearch}
      onSubmit={(event) => {
        event.preventDefault()
        onSearch()
      }}
      className={className ?? "flex h-10 w-90 items-center rounded-full border-2 border-ud-rojo bg-white px-6"}
    >
      <label htmlFor="header-search" className="sr-only">
        Buscar en el sitio
      </label>
      <input
        id="header-search"
        type="search"
        name="q"
        placeholder="Buscar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-black outline-none"
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
  )
}
