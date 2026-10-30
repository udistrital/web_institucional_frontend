# Implementation Plan

Goal: make `ALLOW_EMPTY_EXPORT=true npm run build` finish with **exit code 0** in CI when Drupal is unreachable, while keeping the site a **static export** (`output: "export"` in `next.config.ts`) that degrades gracefully. Never switch to dynamic/SSR to dodge the problem.

Run every command with cwd = `/home/nico_guz/Escritorio/web institucional/web_institucional_frontend`.

## Context discovered during exploration

- Next.js 16.3.4, Turbopack, App Router, `output: "export"` + `trailingSlash: true` (`next.config.ts`). Full static export: every route is prerendered to HTML at build time, so server components run during `next build` and their Drupal `fetch` calls fail with ECONNREFUSED in CI (confirmed in docs `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`).
- CI (`.github/workflows/ci.yml`) runs `npm ci` → `npm run lint` → `ALLOW_EMPTY_EXPORT=true npm run build` with **no** Drupal env vars, so `getServerBaseUrl()` falls back to `http://localhost:8080` and all fetches fail. This is the environment the fix must survive.
- Services already degrade gracefully and are NOT the crash source:
  - `services/hero.ts` → returns `fallbackHeroSlides` (non-empty) on error. This is the fallback pattern to mirror.
  - `services/noticias.ts` → returns `fallbackNews` (non-empty) on error.
  - `services/oferta-academica.ts` → uses `Promise.allSettled`, returns empty arrays + `noDisponible: true` on failure.
- Client carousels already guard empty arrays and are safe:
  - `app/components/home/HeroCarousel.tsx` → `if (!slides.length) return null` and modulo only runs when non-empty.
  - `components/common/news-section/news-carousel.tsx` → `if (!visibleNews.length) return null`, modulo guarded by `news.length` checks.
  - `app/nuestra-universidad/oferta-academica/components/OfertaAcademicaCatalogo.tsx` → only `.map`/`.filter` over arrays (empty = renders nothing / `noDisponible` empty state), no index-by-length hazard.
- **Confirmed single crash:** `app/components/home/FacultiesSection.tsx`. `services/facultades.ts` returns `[]` on fetch failure (no fallback, unlike hero/noticias). With `faculties.length === 0`:
  - line 13: `const visible = Array.from({ length: 3 }, (_, index) => faculties[(start + index) % faculties.length])` → `(start+index) % 0 === NaN` → `faculties[NaN] === undefined`.
  - The mobile `visible.map(...)` then reads `faculty.href` of `undefined` → `TypeError: Cannot read properties of undefined (reading 'href')` → prerender of `/` aborts → whole build exits 1.
  - `move()` (line 12) has the same `% faculties.length` NaN hazard, but it only runs on user interaction, not during prerender.

## Decisions (rationale)

1. **Harden `FacultiesSection.tsx` against empty / undefined-element data** rather than only fixing the service. The component declares `faculties: Faculty[]` and must not throw regardless of what it receives — this is the prerender-safe fix and keeps real data rendering unchanged when present. Chosen over "just return a fallback from the service" because a resilient component is the correct root-cause fix and protects against any future empty-data path.
2. **Also give `services/facultades.ts` a non-empty fallback**, mirroring `fallbackHeroSlides` in `services/hero.ts`. Rationale: consistency with the established fallback pattern (hero, noticias) and a better static page (the Facultades section shows representative content instead of disappearing) when Drupal is down. The component guard (decision 1) is still required and is the authoritative safety net; the fallback is the coherent UX layer on top. Both are kept because the component must be safe even if the fallback is ever empty.
3. **Do not change rendering strategy.** Keep `output: "export"`; no `force-dynamic`, no removing prerender. Explicitly required by the task.

## Plan

- [ ] 1. Add a non-empty fallback to `services/facultades.ts`, mirroring `fallbackHeroSlides` in `services/hero.ts`.
      Define a module-level `fallbackFaculties: Faculty[]` (2-3 entries) whose shape matches the `Faculty` type exactly (`id`, `title`, `href` pointing to real in-app routes like `/facultades`, `attributes.title`, `imageUrl: null` so no remote image is needed, meaningful `imageAlt`). In `getFaculties()`, after mapping, return the mapped list only when it has entries, otherwise return `fallbackFaculties`; change the `catch {}` to `catch { return fallbackFaculties; }`. Keep the existing mapping logic and the `Faculty` type unchanged. Use `imageUrl: null` in fallbacks so the component's `faculty.imageUrl && <Image/>` guard simply skips the image (static-export image optimization is already `unoptimized`).
      Files: services/facultades.ts
      Verify: part of the full build in step 3; also `npm run lint` passes (step 4).

- [ ] 2. Make `app/components/home/FacultiesSection.tsx` resilient to an empty `faculties` array and to `undefined` elements, with no division/modulo by zero and no unguarded `faculty.href` access.
      Changes inside the `"use client"` component:
      (a) Early return a safe empty state when there are no faculties: at the top of the component body, if `faculties.length === 0`, render just the intro block (`<section>` with the `#faculties-title` heading and the existing "Ver facultades" `<Link href="/facultades">`) and no carousel/curtain — so the section still exists and is accessible but nothing indexes into an empty array. This keeps `aria-labelledby="faculties-title"` valid.
      (b) Guard `move()` and the `visible` computation against `faculties.length === 0` (only reachable if the early return is ever removed): compute `visible` only when there are faculties, and in `move` avoid `% faculties.length` when length is 0.
      (c) When building `visible`, filter out any `undefined` entries before mapping (defensive against holes), so `visible.map` never dereferences `undefined`. Prefer keying list items by a stable unique field; if `faculty.title` can repeat, fall back to `faculty.id` or the index to keep React keys valid.
      Keep real-data behavior identical when `faculties` is non-empty (same curtain, same 3-up carousel, same dots, same swipe). Do not change the `Faculty` prop type.
      Files: app/components/home/FacultiesSection.tsx
      Verify: part of the full build in step 3.

- [ ] 3. **Primary success criterion.** Run the production build simulating CI (no Drupal, no Drupal env vars) and confirm it completes with exit code 0 and emits the static export.
      Command (run from the frontend root, do NOT set any `DRUPAL_BASE_URL` / `NEXT_PUBLIC_DRUPAL_BASE_URL`):
      `ALLOW_EMPTY_EXPORT=true npm run build; echo "EXIT=$?"`
      Expected: `EXIT=0`; the build log shows "Generating static pages (26/26)" with no `Error occurred prerendering page "/"` and no `Cannot read properties of undefined (reading 'href')`; an `out/` directory is produced containing `out/index.html` and `out/nuestra-universidad/oferta-academica/index.html`. The ECONNREFUSED / "fetch failed" console lines from services are expected and acceptable (they are caught); what must be gone is any uncaught prerender exception and the non-zero exit.
      Files: none (verification only)
      Verify: exit code 0 as above.

- [ ] 4. Run the linter to match CI and catch style/type regressions introduced by the edits.
      Command: `npm run lint`
      Expected: completes with no new errors (exit code 0). Fix any lint errors introduced in steps 1-2 before considering the task done.
      Files: none (verification only)

- [ ] 5. Regression guard for the "Drupal available" path (static reasoning + spot check, since no live Drupal in CI).
      Confirm by reading the final diff that: `getFaculties()` still returns real mapped data first and only falls back when the mapped list is empty or the fetch throws; `FacultiesSection` renders the full curtain/carousel unchanged when `faculties` is non-empty. No behavior change is introduced for the non-empty case.
      Files: none (review only)
      Verify: diff review confirms non-empty-data rendering and service mapping are unchanged.

## Notes / assumptions

- The `out/` directory path assumes default `distDir`; `next.config.ts` does not override it, so `out/` is correct.
- `AGENTS.md` auto-injects the `nextjs-agent-rules` block; if `next dev`/`next build` rewrites it, commit it alongside the change to keep the tree clean (do not fight the regeneration).
- If, during step 3, any route OTHER than `/` throws an uncaught prerender exception from empty data, apply the same pattern (guard empty arrays, avoid `% length` on zero, filter `undefined`, never deref possibly-undefined fields) to that component and re-run step 3. Current exploration found no such route besides `FacultiesSection`.
