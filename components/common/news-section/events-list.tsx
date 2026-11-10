import Link from "next/link";
import type { EventItem } from "@/types/domain";
import { rutaContenido } from "@/app/noticias-eventos/lib/contenido";
import { formatearFechaCorta } from "@/lib/fechas";

const formatDate = (date: string) => formatearFechaCorta(date);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

/** Máximo de eventos a mostrar en la columna lateral. */
const MAX_EVENTS = 5;

type EventsListProps = {
  events: EventItem[];
};

export default function EventsList({ events }: EventsListProps) {
  // Solo se listan los primeros eventos (ya vienen del más cercano al más
  // lejano).
  const visibleEvents = events.slice(0, MAX_EVENTS);

  return (
    <aside
      className="flex h-full flex-col border border-black/5 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,.18)] sm:p-6 xl:h-[560px]"
      aria-label="Próximos eventos"
    >
      {/* Encabezado de la columna de eventos. */}
      <div className="mb-5 flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-[var(--institutional-gold)]" />
        <h3 className="font-[var(--font-montserrat)] text-[length:var(--fs-lg)] font-bold leading-tight text-[#1a1a1a]">
          Próximos eventos
        </h3>
      </div>

      {visibleEvents.length ? (
        // Lista con scroll propio: en la barra lateral (xl) queda a la misma
        // altura que el carrusel; en pantallas menores se expande en grilla.
        <ul className="-mr-2 m-0 grid min-h-0 flex-1 list-none grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] content-start gap-3 overflow-y-auto overscroll-contain p-0 pr-2 [scrollbar-color:var(--institutional-gold)_transparent] [scrollbar-width:thin] xl:grid-cols-1">
          {visibleEvents.map((event) => {
            const hasRange =
              Boolean(event.endDate) && event.endDate !== event.startDate;

            return (
              <li key={event.id}>
                <Link
                  className="group flex flex-col gap-1.5 rounded-xl border border-black/5 bg-white p-3.5 transition-colors hover:border-[var(--institutional-gold)] hover:bg-[#faf7f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--institutional-gold)]"
                  href={rutaContenido({ kind: "evento", title: event.title })}
                >
                  <span className="inline-flex w-fit items-center gap-1.5 text-[length:var(--fs-2xs)] font-bold uppercase tracking-[.06em] text-[var(--institutional-red)]">
                    <CalendarIcon className="h-[.8rem] w-[.8rem]" />
                    Evento
                  </span>
                  <span className="text-[length:var(--fs-sm)] font-semibold leading-snug text-[#1a1a1a] transition-colors group-hover:text-[var(--institutional-red)]">
                    {event.title}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[length:var(--fs-2xs)] font-semibold text-[#6a6a6a]">
                    <time dateTime={event.startDate}>
                      {formatDate(event.startDate)}
                    </time>
                    {hasRange && (
                      <>
                        <span
                          aria-hidden="true"
                          className="text-[var(--institutional-gold)]"
                        >
                          →
                        </span>
                        <time dateTime={event.endDate}>
                          {formatDate(event.endDate)}
                        </time>
                      </>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        // Estado vacío: la columna se mantiene presente pero discreta.
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-black/15 bg-white/60 px-6 py-10 text-center">
          <p className="text-[length:var(--fs-sm)] font-semibold text-[#555]">
            No hay eventos programados por el momento.
          </p>
          <p className="mt-1 text-[length:var(--fs-2xs)] text-[#8a8a8a]">
            Vuelve pronto para conocer las próximas actividades.
          </p>
        </div>
      )}
    </aside>
  );
}
