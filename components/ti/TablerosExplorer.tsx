"use client";

import { useEffect, useMemo, useState } from "react";
import type { CategoryNode, Tablero } from "@/components/ti/tableros";
import TableroIframe from "./TableroIframe";

type TablerosExplorerProps = {
  categories: CategoryNode[];
  uncategorized: Tablero[];
};

/** Tablero acompañado de la ruta jerárquica de su categoría. */
type FlatTablero = {
  tablero: Tablero;
  /** Ruta completa (p. ej. ["Académica", "Docencia", "Población estudiantil"]). */
  path: string[];
};

/** Grupo de tableros bajo una misma categoría (con su jerarquía). */
type Group = {
  key: string;
  path: string[];
  tableros: Tablero[];
};

// Recorre el árbol en orden y produce grupos planos por categoría con contenido.
// Cada grupo corresponde a una categoría (hoja) que tiene tableros directos y
// conserva su ruta jerárquica completa para mostrarla en la lista de categorías.
function flattenCategories(categories: CategoryNode[]): Group[] {
  const groups: Group[] = [];

  const walk = (node: CategoryNode) => {
    if (node.tableros.length > 0) {
      groups.push({
        key: `cat-${node.tid}`,
        path: node.path,
        tableros: node.tableros,
      });
    }
    for (const child of node.children) walk(child);
  };

  for (const root of categories) walk(root);
  return groups;
}

export default function TablerosExplorer({
  categories,
  uncategorized,
}: TablerosExplorerProps) {
  const groups = useMemo(() => {
    const base = flattenCategories(categories);
    if (uncategorized.length > 0) {
      base.push({
        key: "cat-uncategorized",
        path: ["Sin categoría"],
        tableros: uncategorized,
      });
    }
    return base;
  }, [categories, uncategorized]);

  // Lista plana de todos los tableros con su ruta, para la búsqueda del seleccionado.
  const flatTableros = useMemo<FlatTablero[]>(
    () =>
      groups.flatMap((group) =>
        group.tableros.map((tablero) => ({ tablero, path: group.path })),
      ),
    [groups],
  );

  const [selectedId, setSelectedId] = useState<string>(
    () => flatTableros[0]?.tablero.id ?? "",
  );

  const selected = useMemo(
    () => flatTableros.find((item) => item.tablero.id === selectedId) ?? flatTableros[0],
    [flatTableros, selectedId],
  );

  // Categoría (grupo) que contiene el tablero seleccionado: alimenta la segunda lista.
  const groupOfSelected = useMemo(
    () => groups.find((g) => g.tableros.some((t) => t.id === selectedId)) ?? groups[0],
    [groups, selectedId],
  );

  // Conjunto de tableros cuyo iframe ya está montado (y por tanto cargado o
  // cargándose). El seleccionado se monta de inmediato; el resto se van
  // montando en segundo plano tras el render inicial para "precalentarlos",
  // de modo que al seleccionarlos se muestren al instante sin recargar.
  const [mountedIds, setMountedIds] = useState<Set<string>>(() =>
    selectedId ? new Set([selectedId]) : new Set(),
  );

  // El tablero seleccionado siempre se considera montado (aunque la precarga
  // en segundo plano aún no haya llegado a él).
  const effectiveMounted = useMemo(() => {
    if (!selectedId || mountedIds.has(selectedId)) return mountedIds;
    return new Set(mountedIds).add(selectedId);
  }, [mountedIds, selectedId]);

  // Precarga en segundo plano: monta progresivamente el resto de iframes cuando
  // el navegador está inactivo, sin bloquear la interacción ni recargar los ya montados.
  useEffect(() => {
    const pending = flatTableros
      .map((item) => item.tablero.id)
      .filter((id) => !effectiveMounted.has(id));
    if (!pending.length) return;

    const idleWindow = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    let timer: number | undefined;
    let idleHandle: number | undefined;

    // Monta el siguiente iframe pendiente y reprograma hasta agotarlos.
    const mountNext = () => {
      setMountedIds((prev) => {
        const next = flatTableros
          .map((item) => item.tablero.id)
          .find((id) => !prev.has(id) && id !== selectedId);
        const withSelected = prev.has(selectedId) ? prev : new Set(prev).add(selectedId);
        if (!next) return withSelected;
        return new Set(withSelected).add(next);
      });
    };

    const schedule = () => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(mountNext, { timeout: 2000 });
      } else {
        timer = window.setTimeout(mountNext, 600);
      }
    };

    schedule();

    return () => {
      if (idleHandle !== undefined && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle);
      }
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [flatTableros, effectiveMounted, selectedId]);

  if (!flatTableros.length) {
    return <p className="text-neutral-500">Aún no hay tableros disponibles.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Navegación por dos listas en cascada: categoría → tablero */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="dual-categoria"
            className="mb-2 block text-sm font-semibold text-neutral-700"
          >
            1. Categoría
          </label>
          <select
            id="dual-categoria"
            value={groupOfSelected?.key}
            onChange={(event) => {
              const group = groups.find((g) => g.key === event.target.value);
              const first = group?.tableros[0];
              if (first) setSelectedId(first.id);
            }}
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-base text-neutral-900 shadow-sm focus:border-[color:var(--institutional-red)] focus:outline-none"
          >
            {groups.map((group) => (
              <option key={group.key} value={group.key}>
                {group.path.join(" › ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="dual-tablero"
            className="mb-2 block text-sm font-semibold text-neutral-700"
          >
            2. Tablero
          </label>
          <select
            id="dual-tablero"
            value={selected?.tablero.id}
            onChange={(event) => setSelectedId(event.target.value)}
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-base text-neutral-900 shadow-sm focus:border-[color:var(--institutional-red)] focus:outline-none"
          >
            {(groupOfSelected?.tableros ?? []).map((tablero) => (
              <option key={tablero.id} value={tablero.id}>
                {tablero.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Panel del tablero seleccionado */}
      <section aria-live="polite" className="min-w-0 flex-1">
        {selected && (
          <header className="mb-3 flex flex-col gap-2">
            {/* Breadcrumb jerárquico de la categoría del tablero activo */}
            <nav aria-label="Jerarquía de la categoría">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500">
                {selected.path.map((name, index) => {
                  const isLast = index === selected.path.length - 1;
                  return (
                    <li key={`${name}-${index}`} className="flex items-center gap-2">
                      <span className={isLast ? "font-semibold text-neutral-700" : undefined}>
                        {name}
                      </span>
                      {!isLast && (
                        <span aria-hidden="true" className="text-neutral-300">
                          ›
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[length:var(--fs-xl)] font-bold text-[color:var(--institutional-red)]">
                {selected.tablero.title}
              </h2>
              {selected.tablero.platform && (
                <span className="rounded-full bg-neutral-100 px-3 py-0.5 text-xs uppercase tracking-wide text-neutral-500">
                  {selected.tablero.platform}
                </span>
              )}
            </div>
          </header>
        )}

        {/*
          Todos los iframes montados permanecen en el DOM con sus dimensiones
          reales (apilados en una misma caja posicionada). Solo cambia cuál es
          visible/interactivo. Así, al cambiar de tablero no se recarga y, al
          conservar el tamaño, los tableros (p. ej. Metabase) calculan bien su
          layout aunque no estén activos.
        */}
        <div className="relative h-[70vh] min-h-[480px] w-full">
          {flatTableros.map(({ tablero }) => {
            const isActive = tablero.id === selected?.tablero.id;

            if (!tablero.embedUrl) {
              return isActive ? (
                <p key={tablero.id} className="text-sm text-neutral-500">
                  Este tablero no tiene un enlace configurado.
                </p>
              ) : null;
            }

            // Solo se renderiza el iframe si ya fue montado (precarga progresiva).
            if (!effectiveMounted.has(tablero.id)) return null;

            return (
              <TableroIframe
                key={tablero.id}
                src={tablero.embedUrl}
                title={tablero.linkTitle || tablero.title}
                isActive={isActive}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
