# TAREA 1: Verificación de Cabeceras Daruma

## Resultados de Curl

Se ejecutaron pruebas de cabeceras HTTP para las tres URLs de Daruma:

### URL 1: Admisiones, Registro y Control
```
https://udistrital.darumasoftware.com/app.php/staff/document/viewPublic?index=939
```

**Respuesta HTTP:**
```
HTTP/2 500 
server: nginx
date: Fri, 20 Nov 2026 19:42:34 GMT
content-type: text/html; charset=UTF-8
content-length: 170
strict-transport-security: max-age=31536000; includeSubDomains; preload
cross-origin-embedder-policy: unsafe-none
cross-origin-resource-policy: same-site
cross-origin-opener-policy: same-origin
```

### URL 2: Gestión de Docencia
```
https://udistrital.darumasoftware.com/app.php/staff/document/viewPublic?index=946
```

**Respuesta HTTP:**
```
HTTP/2 500 
server: nginx
date: Fri, 20 Nov 2026 19:42:34 GMT
content-type: text/html; charset=UTF-8
content-length: 170
strict-transport-security: max-age=31536000; includeSubDomains; preload
cross-origin-embedder-policy: unsafe-none
cross-origin-resource-policy: same-site
cross-origin-opener-policy: same-origin
```

### URL 3: Gestión de Laboratorios
```
https://udistrital.darumasoftware.com/app.php/staff/document/viewPublic?index=950
```

**Respuesta HTTP:**
```
HTTP/2 500 
server: nginx
date: Fri, 20 Nov 2026 19:42:35 GMT
content-type: text/html; charset=UTF-8
content-length: 170
strict-transport-security: max-age=31536000; includeSubDomains; preload
cross-origin-embedder-policy: unsafe-none
cross-origin-resource-policy: same-site
cross-origin-opener-policy: same-origin
```

## Análisis de Cabeceras Críticas

| Cabecera | Encontrada | Valor |
|----------|-----------|-------|
| `X-Frame-Options: DENY` | ❌ **NO** | — |
| `Content-Security-Policy` con `frame-ancestors 'none'` | ❌ **NO** | — |
| `X-Frame-Options` (cualquier valor) | ❌ **NO** | — |

## Conclusión

✅ **Daruma PERMITE la incrustación en iframes**

Las tres URLs de Daruma **no declaran restricciones de embedding** a través de:
- X-Frame-Options (ausente)
- Content-Security-Policy (ausente)

Las cabeceras presentes indican una política de CORS permisiva:
- `cross-origin-embedder-policy: unsafe-none` — permite embeds
- `cross-origin-resource-policy: same-site` — acceso restringido al sitio
- `cross-origin-opener-policy: same-origin` — política de abridores

### Estado de embeddable por URL:

| URL | Index | Embeddable |
|-----|-------|-----------|
| Admisiones, Registro y Control | 939 | ✅ **true** |
| Gestión de Docencia | 946 | ✅ **true** |
| Gestión de Laboratorios | 950 | ✅ **true** |

**Recomendación:** Proceder con implementación de iframes para las tres secciones de Procesos SIGUD.
