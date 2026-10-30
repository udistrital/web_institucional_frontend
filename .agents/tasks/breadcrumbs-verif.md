# Breadcrumb verification

- `npm run lint`: passed with 0 errors and 9 pre-existing warnings in shared layout/header components (`<img>` usage and unused variables).
- `npm run build`: passed. The build compiled successfully and included all seven faculty routes:
  - `/facultades/artes-asab`
  - `/facultades/ciencias-educacion`
  - `/facultades/ciencias-matematicas-naturales`
  - `/facultades/ciencias-salud`
  - `/facultades/ingenieria`
  - `/facultades/medio-ambiente-recursos-naturales`
  - `/facultades/tecnologica`

The breadcrumb is rendered once through the shared `FacultyPage` template, between the faculty hero and academic offer body. No individual faculty route files were changed.
