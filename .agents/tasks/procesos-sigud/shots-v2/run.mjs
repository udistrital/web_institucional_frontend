// Verificación real de Procesos SIGUD con Chrome headless (CDP).
// Uso: BASE=http://localhost:4330 LABEL=embed node run.mjs   (LABEL = subcarpeta de salida)
import { spawn } from "node:child_process";
import { mkdirSync, statSync, writeFileSync, readFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.env.BASE ?? "http://localhost:4330";
const LABEL = process.env.LABEL ?? "final";
const OUT = new URL(`./${LABEL}/`, import.meta.url).pathname;
const PORT = 9355;
mkdirSync(OUT, { recursive: true });

const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=/tmp/sigud-v2-${LABEL}`, "--hide-scrollbars", "about:blank"],
  { stdio: "ignore" },
);
let targets;
for (let i = 0; i < 40 && !targets; i++) {
  await sleep(250);
  targets = await fetch(`http://127.0.0.1:${PORT}/json`).then((r) => r.json()).catch(() => undefined);
}
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
const listeners = [];
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  else if (msg.method) listeners.forEach((l) => l(msg));
});
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const n = ++id;
  pending.set(n, (m) => (m.error ? reject(new Error(method + ": " + JSON.stringify(m.error))) : resolve(m.result)));
  ws.send(JSON.stringify({ id: n, method, params, ...(sessionId ? { sessionId } : {}) }));
});
const evaluate = async (expr) => {
  const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
  return res.result.value;
};

// ---- Registro de red (página + iframes fuera de proceso) ----
let step = "init";
let holdDaruma = false;
const net = [];
const reqs = new Map();
listeners.push((m) => {
  const key = (m.sessionId ?? "root") + ":" + (m.params?.requestId ?? "");
  if (m.method === "Network.requestWillBeSent") {
    const e = { step, url: m.params.request.url, type: m.params.type, status: null, failed: null, t: Date.now() };
    reqs.set(key, e);
    net.push(e);
  } else if (m.method === "Network.responseReceived") {
    const e = reqs.get(key);
    if (e) { e.status = m.params.response.status; e.xfo = m.params.response.headers?.["x-frame-options"]; e.csp = m.params.response.headers?.["content-security-policy"]; }
  } else if (m.method === "Network.loadingFailed") {
    const e = reqs.get(key);
    if (e) e.failed = m.params.errorText + (m.params.blockedReason ? ` (${m.params.blockedReason})` : "");
  } else if (m.method === "Target.attachedToTarget") {
    const sid = m.params.sessionId;
    send("Network.enable", {}, sid).catch(() => {});
    if (holdDaruma) send("Fetch.enable", { patterns: [{ urlPattern: "*darumasoftware*" }] }, sid).catch(() => {});
    send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: false, flatten: true }, sid).catch(() => {});
    send("Runtime.runIfWaitingForDebugger", {}, sid).catch(() => {});
  }
});
await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: false, flatten: true });

const darumaReqs = (s) => net.filter((n) => n.step === s && /darumasoftware/.test(n.url)).map((n) => ({ url: n.url.replace(/^.*index=/, "index="), type: n.type, status: n.status, failed: n.failed, xfo: n.xfo, csp: n.csp }));

async function setViewport(width, height = 900) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 769 });
}
async function navigate(url) {
  await send("Page.navigate", { url: "about:blank" });
  await sleep(200);
  const loaded = new Promise((res) => { const l = (m) => { if (m.method === "Page.loadEventFired") { listeners.splice(listeners.indexOf(l), 1); res(); } }; listeners.push(l); });
  await send("Page.navigate", { url });
  await loaded;
  await evaluate("document.fonts.ready.then(() => true)");
  await sleep(800);
}
async function shot(name, { full = true } = {}) {
  const file = `${OUT}${name}.png`;
  const params = { format: "png" };
  if (full) {
    await evaluate("window.scrollTo({top: 0, behavior: 'instant'})");
    await sleep(500);
    const m = await send("Page.getLayoutMetrics");
    const w = Math.ceil(m.cssContentSize.width), h = Math.ceil(m.cssContentSize.height);
    Object.assign(params, { captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: h, scale: 1 } });
  }
  const r = await send("Page.captureScreenshot", params);
  writeFileSync(file, Buffer.from(r.data, "base64"));
  const buf = readFileSync(file);
  return { file: `${name}.png`, bytes: statSync(file).size, px: `${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}` };
}
const pageState = () => evaluate(`(() => {
  const tabs = [...document.querySelectorAll('[role=tab]')];
  const list = document.querySelector('[role=tablist]');
  const active = tabs.find(t => t.getAttribute('aria-selected') === 'true');
  const panels = [...document.querySelectorAll('[role=tabpanel]')].map(p => ({ id: p.id, hidden: p.hidden, iframe: !!p.querySelector('iframe'), loading: !!p.querySelector('[role=status]'), h2: p.querySelector('h2')?.textContent, iframeTitle: p.querySelector('iframe')?.title }));
  const de = document.documentElement;
  return {
    tabLabels: tabs.map(t => t.textContent.trim()),
    activeTab: active?.id, hash: location.hash,
    docScrollWidth: de.scrollWidth, innerWidth: innerWidth, hScroll: de.scrollWidth > innerWidth,
    tablistScrollWidth: list.scrollWidth, tablistClientWidth: list.clientWidth, tablistOverflows: list.scrollWidth > list.clientWidth,
    panels,
  };
})()`);
async function waitLoaded(panelId, ms = 25000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const s = await evaluate(`(() => { const p = document.getElementById(${JSON.stringify(panelId)}); return { hasIframe: !!p.querySelector('iframe'), loading: !!p.querySelector('[role=status]') }; })()`);
    if (s.hasIframe && !s.loading) return Date.now() - t0;
    if (!s.hasIframe && !(await evaluate(`!!document.getElementById(${JSON.stringify(panelId)}).querySelector('a[target=_blank]')`))) { await sleep(300); continue; }
    if (!s.hasIframe) return "fallback";
    await sleep(300);
  }
  return "timeout";
}
const key = async (k) => {
  const vk = { ArrowRight: 39, ArrowLeft: 37 }[k];
  await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: k, code: k, windowsVirtualKeyCode: vk });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code: k, windowsVirtualKeyCode: vk });
};

const results = { base: BASE, label: LABEL, shots: [], runs: {} };
const TAB_IDS = ["admisiones-registro-control", "gestion-docencia", "gestion-laboratorios"];
const faculties = ["ingenieria", "artes-asab"];
const widths = [1440, 1024, 390];

for (const fac of faculties) {
  for (const w of widths) {
    const tag = `${fac}-${w}`;
    const run = (results.runs[tag] = {});
    await setViewport(w);
    // 1) Carga inicial
    step = `${tag}:inicial`;
    await navigate(`${BASE}/facultades/${fac}/procesos-sigud/`);
    run.inicialLoadWait = await waitLoaded(`panel-${TAB_IDS[0]}`);
    await sleep(1500);
    run.inicial = await pageState();
    run.inicialDaruma = darumaReqs(step);
    run.linkVisible = await evaluate(`(() => { const a = [...document.querySelectorAll('[role=tabpanel]:not([hidden]) a[target=_blank]')].map(a => { const r = a.getBoundingClientRect(); return { text: a.textContent.trim(), top: Math.round(r.top), bottom: Math.round(r.bottom), inViewportAtScroll0: r.top >= 0 && r.bottom <= innerHeight }; }); return { innerHeight, links: a }; })()`);
    results.shots.push(await shot(`${tag}-tab1-full`));
    if (w === 1440 || w === 390) results.shots.push(await shot(`${tag}-tab1-viewport`, { full: false }));
    // 2) Clic en cada pestaña
    for (const [i, tid] of TAB_IDS.entries()) {
      step = `${tag}:clic-${tid}`;
      await evaluate(`document.getElementById('tab-${tid}').click()`);
      await sleep(600);
      run[`clic${i + 1}Load`] = await waitLoaded(`panel-${tid}`);
      await sleep(1200);
      run[`clic${i + 1}`] = await pageState();
      run[`clic${i + 1}Daruma`] = darumaReqs(step);
      results.shots.push(await shot(`${tag}-tab${i + 1}-full`));
    }
    // 3) Teclado (solo en 1440 y 390)
    if (w !== 1024) {
      await navigate(`${BASE}/facultades/${fac}/procesos-sigud/`);
      await evaluate(`document.getElementById('tab-${TAB_IDS[0]}').focus()`);
      step = `${tag}:teclado`;
      await key("ArrowRight");
      await sleep(1500);
      const k1 = (await pageState()).activeTab;
      await key("ArrowRight");
      await sleep(1500);
      const k2 = (await pageState()).activeTab;
      await key("ArrowLeft");
      await sleep(800);
      const k3 = (await pageState()).activeTab;
      run.teclado = { tras1: k1, tras2: k2, tras3_izq: k3, panels: (await pageState()).panels, daruma: darumaReqs(step) };
    }
    // 4) Hash directo
    for (const tid of ["gestion-docencia", "gestion-laboratorios"]) {
      if (w === 1024) continue;
      step = `${tag}:hash-${tid}`;
      await navigate(`${BASE}/facultades/${fac}/procesos-sigud/#${tid}`);
      await sleep(1500);
      run[`hash_${tid}`] = { state: await pageState(), daruma: darumaReqs(step) };
      if (w === 1440 && fac === "ingenieria") results.shots.push(await shot(`${tag}-hash-${tid}-full`));
    }
  }
}

// Referencia: organigrama y sigud a 1440 y 390
for (const w of [1440, 390]) {
  await setViewport(w);
  await navigate(`${BASE}/sigud/organigrama/`);
  results.shots.push(await shot(`ref-organigrama-${w}-full`));
  results.shots.push(await shot(`ref-organigrama-${w}-viewport`, { full: false }));
}

// Estado "tarda más de lo esperado": se retiene la petición a Daruma > 12 s
holdDaruma = true;
await setViewport(1440);
await send("Fetch.enable", { patterns: [{ urlPattern: "*darumasoftware*" }] });
listeners.push((m) => { if (m.method === "Fetch.requestPaused") { results.heldRequests = (results.heldRequests ?? 0) + 1; } });
step = "lento";
await navigate(`${BASE}/facultades/ingenieria/procesos-sigud/`);
results.slow = {};
await sleep(3000);
results.slow.t3s = await evaluate(`(() => { const p = document.querySelector('[role=tabpanel]:not([hidden])'); return { status: p.querySelector('[role=status]')?.innerText, iframe: !!p.querySelector('iframe') }; })()`);
await evaluate("(() => { const v = document.querySelector('[role=tabpanel]:not([hidden]) [role=status]'); v.scrollIntoView({block:'center', behavior:'instant'}); })()"); await sleep(400);
results.shots.push(await shot("lento-1440-t3s-viewport", { full: false }));
await sleep(11000);
results.slow.t14s = await evaluate(`(() => { const p = document.querySelector('[role=tabpanel]:not([hidden])'); return { status: p.querySelector('[role=status]')?.innerText, iframe: !!p.querySelector('iframe'), links: [...p.querySelectorAll('a[target=_blank]')].map(a => a.className + ':' + a.textContent.trim()) }; })()`);
await evaluate("(() => { const v = document.querySelector('[role=tabpanel]:not([hidden]) [role=status]'); v.scrollIntoView({block:'center', behavior:'instant'}); })()"); await sleep(400);
results.shots.push(await shot("lento-1440-t14s-viewport", { full: false }));
await setViewport(390);
await evaluate("(() => { const v = document.querySelector('[role=tabpanel]:not([hidden]) [role=status]'); v.scrollIntoView({block:'center', behavior:'instant'}); })()"); await sleep(400);
results.shots.push(await shot("lento-390-t14s-viewport", { full: false }));
await send("Fetch.disable").catch(() => {});
holdDaruma = false;
// Colores calculados: referencia vs página
await setViewport(1440);
await navigate(`${BASE}/sigud/organigrama/`);
results.colorsOrganigrama = await evaluate(`(() => { const cs = (s, ps) => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); return Object.fromEntries(ps.map(p => [p, c.getPropertyValue(p)])); };
  return { page: cs('section', ['background-color']), card: cs('[role=tabpanel]:not([hidden]) article > div:nth-child(2)', ['background-color','border-top','box-shadow','padding']), kicker: cs('[role=tabpanel]:not([hidden]) p', ['color','font-size','font-weight','letter-spacing','text-transform']), h2: cs('[role=tabpanel]:not([hidden]) h2', ['font-size','font-family','color']), tabActive: cs('[role=tab][aria-selected=true]', ['color','border-bottom-color','font-size']) }; })()`);
await navigate(`${BASE}/facultades/ingenieria/procesos-sigud/`);
results.colorsProcesos = await evaluate(`(() => { const cs = (s, ps) => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); return Object.fromEntries(ps.map(p => [p, c.getPropertyValue(p)])); };
  return { page: cs('section', ['background-color']), card: cs('[role=tabpanel]:not([hidden]) article > div:nth-child(2)', ['background-color','border-top','box-shadow','padding']), kicker: cs('[role=tabpanel]:not([hidden]) p', ['color','font-size','font-weight','letter-spacing','text-transform']), h2: cs('[role=tabpanel]:not([hidden]) h2', ['font-size','font-family','color']), tabActive: cs('[role=tab][aria-selected=true]', ['color','border-bottom-color','font-size']),
  heroActive: (() => { const a = document.querySelector('a[aria-current=page]'); if (!a) return null; const c = getComputedStyle(a); return { text: a.textContent, bg: c.backgroundColor, color: c.color, transform: c.transform, href: a.getAttribute('href') }; })(),
  heroLinks: [...document.querySelectorAll('a')].filter(a => /Procesos SIGUD/.test(a.textContent)).map(a => a.getAttribute('href')) }; })()`);

// Todas las peticiones a Daruma agrupadas
results.darumaPorPaso = {};
for (const n of net.filter((n) => /darumasoftware/.test(n.url))) (results.darumaPorPaso[n.step] ??= []).push(`${n.url.replace(/^.*index=/, "index=")} -> ${n.status ?? "sin respuesta"}${n.failed ? " FALLO " + n.failed : ""}`);

writeFileSync(`${OUT}measurements.json`, JSON.stringify(results, null, 2));
console.log("listo", OUT);
ws.close();
chrome.kill();
process.exit(0);
