import type { OpcionMes } from "../lib/contenido";
import styles from "../page.module.css";

type SimboloFiltro =
  | "filtros"
  | "tipo"
  | "anio"
  | "mes"
  | "fuente"
  | "buscar"
  | "limpiar";

function IconoFiltro({ nombre }: { nombre: SimboloFiltro }) {
  const iconos = {
    filtros: (
      <>
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="7" x2="17" y1="12" y2="12" />
        <line x1="10" x2="14" y1="18" y2="18" />
      </>
    ),
    tipo: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    anio: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    mes: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),
    fuente: (
      <>
        <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
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

type FiltrosContenidoProps = {
  tipo: string;
  anio: string;
  mes: string;
  fuente: string;
  busqueda: string;
  anios: string[];
  meses: OpcionMes[];
  fuentes: string[];
  onTipoChange: (valor: string) => void;
  onAnioChange: (valor: string) => void;
  onMesChange: (valor: string) => void;
  onFuenteChange: (valor: string) => void;
  onBusquedaChange: (valor: string) => void;
  onLimpiar: () => void;
};

export default function FiltrosContenido({
  tipo,
  anio,
  mes,
  fuente,
  busqueda,
  anios,
  meses,
  fuentes,
  onTipoChange,
  onAnioChange,
  onMesChange,
  onFuenteChange,
  onBusquedaChange,
  onLimpiar,
}: FiltrosContenidoProps) {
  const hayFiltros = Boolean(tipo || anio || mes || fuente || busqueda);

  return (
    <section aria-labelledby="filtros-contenido-title" className={styles.filters}>
      <div className={styles.filtersHeading}>
        <div className={styles.filtersTitleGroup}>
          <span className={styles.filtersTitleIcon}>
            <IconoFiltro nombre="filtros" />
          </span>
          <div>
            <p className={styles.sectionKicker}>Actualidad UD</p>
            <h1 id="filtros-contenido-title">Noticias y eventos</h1>
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
            <IconoFiltro nombre="tipo" />
            Tipo de contenido
          </span>
          <select value={tipo} onChange={(event) => onTipoChange(event.target.value)}>
            <option value="">Todo el contenido</option>
            <option value="noticia">Noticias</option>
            <option value="evento">Eventos</option>
          </select>
        </label>

        <label className={styles.filterField}>
          <span className={styles.filterLabel}>
            <IconoFiltro nombre="anio" />
            Año
          </span>
          <select value={anio} onChange={(event) => onAnioChange(event.target.value)}>
            <option value="">Todos los años</option>
            {anios.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterField}>
          <span className={styles.filterLabel}>
            <IconoFiltro nombre="mes" />
            Mes
          </span>
          <select value={mes} onChange={(event) => onMesChange(event.target.value)}>
            <option value="">Todos los meses</option>
            {meses.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterField}>
          <span className={styles.filterLabel}>
            <IconoFiltro nombre="fuente" />
            Fuente
          </span>
          <select
            value={fuente}
            onChange={(event) => onFuenteChange(event.target.value)}
          >
            <option value="">Todas las fuentes</option>
            {fuentes.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterField}>
          <span className={styles.filterLabel}>Buscar</span>
          <span className={styles.searchInputWrap}>
            <IconoFiltro nombre="buscar" />
            <input
              autoComplete="off"
              onChange={(event) => onBusquedaChange(event.target.value)}
              placeholder="Título de la noticia o evento"
              type="search"
              value={busqueda}
            />
          </span>
        </label>
      </div>
    </section>
  );
}
