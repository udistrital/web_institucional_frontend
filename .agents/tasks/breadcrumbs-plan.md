# Implementation Plan

- [ ] 1. Import the existing breadcrumb Client Component into the shared faculty template, without changing `FacultyPage` from an async Server Component. Add `import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";` alongside the existing shared-component imports near line 6 of `app/facultades/components/FacultyPage.tsx`. The default import and the existing component API must be used; do not add props or modify the breadcrumb implementation.
      Files: `app/facultades/components/FacultyPage.tsx` (around current lines 1–8)
      Verify: `npm run lint` — ESLint completes without errors, including the new import and Server/Client component composition.

- [ ] 2. Render the breadcrumb once in the successful faculty layout immediately after the closing `</header>` for `styles.hero` (currently line 141) and before `<div className={styles.body}>` (currently line 142). Use `<BreadCrumbs variant="default" />`; this variant matches the component's documented light styling (`bg-white`, gray text, and a bottom border) and the current faculty stylesheet, whose hero ends with a white background and border while the page body uses the light `#f7f7f5` background. This shared insertion automatically covers all seven route files because each route delegates to `FacultyPage`; do not edit the individual `app/facultades/<slug>/page.tsx` files or the general `app/facultades/page.tsx` listing.
      Files: `app/facultades/components/FacultyPage.tsx` (insert between current lines 141–142)
      Verify: `npm run build` — the Next.js production build completes successfully and all seven faculty routes compile with the breadcrumb rendered between hero and academic offer.

- [ ] 3. Keep the early `if (!faculty)` branch unchanged. It is a fallback for an unavailable/invalid faculty lookup, not one of the seven valid faculty routes; adding a breadcrumb there would create behavior outside the requested pages and would place it before the unavailable body rather than at the specified hero/body boundary. Confirm the final diff contains only the shared-template import and successful-branch JSX insertion, with no breadcrumb duplication or unrelated refactor.
      Files: `app/facultades/components/FacultyPage.tsx`
      Verify: `npm run lint && npm run build` — both commands pass; review the build output for successful compilation of the faculty routes.
