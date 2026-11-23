// Servidor estático mínimo para out/ con soporte de Range (el video de 58 MB lo necesita;
// python -m http.server no lo soporta y bloquea Chrome headless).
// Uso: ROOT=/ruta/out PORT=4322 node serve.mjs
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const ROOT = process.env.ROOT;
const PORT = Number(process.env.PORT ?? 4322);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".mp4": "video/mp4", ".txt": "text/plain; charset=utf-8", ".json": "application/json", ".woff2": "font/woff2", ".vtt": "text/vtt", ".ico": "image/x-icon", ".xml": "application/xml" };

createServer((req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (path.endsWith("/")) path += "index.html";
  const file = join(ROOT, path);
  let stat;
  try { stat = statSync(file); } catch { res.writeHead(404); return res.end("404"); }
  if (stat.isDirectory()) { res.writeHead(301, { Location: `${path}/` }); return res.end(); }
  const headers = { "Content-Type": types[extname(file)] ?? "application/octet-stream", "Accept-Ranges": "bytes" };
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? "");
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
    res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Content-Length": end - start + 1 });
    return createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { ...headers, "Content-Length": stat.size });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`sirviendo ${ROOT} en http://localhost:${PORT}`));
