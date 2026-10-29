import styles from "../page.module.css";

type OpcionFiltro = { valor: string; etiqueta: string };
type SimboloFiltro = "filtros" | "nivel" | "facultad" | "modalidad" | "jornada" | "buscar" | "limpiar";

function IconoFiltro({ nombre }: { nombre: SimboloFiltro }) {
  const iconos = {
    filtros: (
      <>
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="7" x2="17" y1="12" y2="12" />
        <line x1="10" x2="14" y1="18" y2="18" />
      </>
    ),
    nivel: (
      <>
        <path d="m2 10 10-5 10 5-10 5-10-5Z" />
        <path d="M6 12v5c3.5 2.5 8.5 2.5 12 0v-5" />
        <path d="M22 10v6" />
      </>
    ),
    facultad: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11" />
        <path d="M19 9v11" />
        <path d="M3 21h18" />
        <path d="M9 12v5" />
        <path d="M15 12v5" />
      </>
    ),
    modalidad: (
      <>
        <rect height="14" rx="2" width="18" x="3" y="3" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </>
    ),
    jornada: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    buscar: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    limpiar: (
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={styles.filterIcon}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {iconos[nombre]}
    </svg>
  );
}

type FiltrosOfertaAcademicaProps = {
  facultad: string;
  nivel: string;
  modalidad: string;
  jornada: string;
  busqueda: string;
  facultades: OpcionFiltro[];
  niveles: OpcionFiltro[];
  modalidades: OpcionFiltro[];
  jornadas: OpcionFiltro[];
  onFacultadChange: (valor: string) => void;
  onNivelChange: (valor: string) => void;
  onModalidadChange: (valor: string) => void;
  onJornadaChange: (valor: string) => void;
  onBusquedaChange: (valor: string) => void;
  onLimpiar: () => void;
};

export default function FiltrosOfertaAcademica({
  facultad,
  nivel,
  modalidad,
  jornada,
  busqueda,
  facultades,
  niveles,
  modalidades,
  jornadas,
  onFacultadChange,
  onNivelChange,
  onModalidadChange,
  onJornadaChange,
  onBusquedaChange,
  onLimpiar,
}: FiltrosOfertaAcademicaProps) {
  const hayFiltros = Boolean(facultad || nivel || modalidad || jornada || busqueda);

  return (
    <section aria-labelledby="filtros-oferta-title" className={styles.filters}>
      <div className={styles.filtersHeading}>
        <div className={styles.filtersTitleGroup}>
          <span className={styles.filtersTitleIcon}>
            <IconoFiltro nombre="filtros" />
          </span>
          <div>
            <p className={styles.sectionKicker}>Oferta académica</p>
            <h1 id="filtros-oferta-title">Encuentra tu programa</h1>
          </div>
        </div>
        <button
          className={styles.clearFilters}
          disabled={!hayFiltros}
          onClick={onLimpiar}
          type="button"
        >
          <IconoFiltro nombre="limpiar" />
          Limpiar filtros
        </button>
      </div>

      <div className={styles.filtersGrid}>
        <label className={styles.filterField}>
          <span className={styles.filterLabel}>
            <IconoFiltro nombre="nivel" />
            Nivel académico
          </span>
          <select value={nivel} onChange={(event) => onNivelChange(event.target.value)}>
            <option value="">Todos los niveles</option>
            {niveles.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterField}>
          <span className={styles.filterLabel}>
            <IconoFiltro nombre="facultad" />
            Facultad
          </span>
          <select
            value={facultad}
            onChange={(event) => onFacultadChange(event.target.value)}
          >
            <option value="">Todas las facultades</option>
            {facultades.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterField}>
          <span className={styles.filterLabel}>
            <IconoFiltro nombre="modalidad" />
            Modalidad
          </span>
          <select
            value={modalidad}
            onChange={(event) => onModalidadChange(event.target.value)}
          >
            <option value="">Todas las modalidades</option>
            {modalidades.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterField}>
          <span className={styles.filterLabel}>
            <IconoFiltro nombre="jornada" />
            Jornada
          </span>
          <select
            value={jornada}
            onChange={(event) => onJornadaChange(event.target.value)}
          >
            <option value="">Todas las jornadas</option>
            {jornadas.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </label>

        <label className={`${styles.filterField} ${styles.searchField}`}>
          <span className={styles.filterLabel}>
            Buscar programa
          </span>
          <span className={styles.searchInputWrap}>
            <IconoFiltro nombre="buscar" />
            <input
              autoComplete="off"
              onChange={(event) => onBusquedaChange(event.target.value)}
              placeholder="Nombre del programa"
              type="search"
              value={busqueda}
            />
          </span>
        </label>
      </div>
    </section>
  );
}
