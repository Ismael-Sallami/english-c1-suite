// Utilidades comunes del simulador ISE Digital.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/** Párrafos a partir de texto con \n\n. */
export function paras(text) {
  return String(text || "").split(/\n\s*\n/).map((p) => `<p>${esc(p.trim()).replace(/\n/g, "<br>")}</p>`).join("");
}

/** Markdown mínimo: **negrita**, `code`, listas "- ", párrafos y ### títulos. */
export function mdLite(src) {
  const lines = String(src || "").split("\n");
  let html = "", inList = false;
  const inline = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`(.+?)`/g, "<code>$1</code>").replace(/(^|\W)\*(?!\s)(.+?)\*(?=\W|$)/g, "$1<i>$2</i>");
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^\s*[-•]\s+/.test(line)) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inline(line.replace(/^\s*[-•]\s+/, ""))}</li>`;
      continue;
    }
    if (inList) { html += "</ul>"; inList = false; }
    if (!line.trim()) continue;
    const m = line.match(/^#{1,4}\s+(.*)/);
    html += m ? `<h4>${inline(m[1])}</h4>` : `<p>${inline(line)}</p>`;
  }
  if (inList) html += "</ul>";
  return html;
}

export function wordCount(text) {
  const m = String(text || "").trim().match(/[A-Za-zÀ-ÿ0-9]+(?:['’-][A-Za-zÀ-ÿ0-9]+)*/g);
  return m ? m.length : 0;
}

export function fmtTime(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const p = (n) => String(n).padStart(2, "0");
  return h ? `${p(h)}:${p(m)}:${p(s)}` : `${p(m)}:${p(s)}`;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem("ise:" + key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem("ise:" + key, JSON.stringify(val)); } catch { /* sin almacenamiento */ }
  },
};

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Modal propio (nunca alert/confirm del navegador). Devuelve true/false. */
export function confirmModal({ title = "Are you sure you want to proceed?", body = "You will not be able to return to this page.", ok = "Yes", cancel = "No" } = {}) {
  return new Promise((resolve) => {
    const root = $("#modal-root");
    root.innerHTML = `<div class="modal-back"><div class="modal" role="dialog" aria-modal="true">
      <h3>${esc(title)}</h3><p class="muted">${esc(body)}</p>
      <div class="row">${cancel ? `<button class="btn ghost small" data-a="0">${esc(cancel)}</button>` : ""}<button class="next-btn" data-a="1">${esc(ok)}</button></div>
    </div></div>`;
    root.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => { root.innerHTML = ""; resolve(b.dataset.a === "1"); }));
    root.querySelector("[data-a='1']").focus();
  });
}

export function toast(msg, ms = 3500) {
  const t = document.createElement("div");
  t.textContent = msg;
  Object.assign(t.style, { position: "fixed", left: "50%", top: "16px", transform: "translateX(-50%)", background: "var(--tr-purple)", color: "#fff", padding: "10px 16px", borderRadius: "10px", zIndex: 200, fontWeight: 700, boxShadow: "0 6px 20px rgba(0,0,0,.25)", maxWidth: "90vw" });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

// ---------------------------------------------------------------- servidor local

let _health = null;
/** Detecta el servidor local (python server/server.py). En GitHub Pages devuelve {local:false}. */
export async function health(force = false) {
  if (_health && !force) return _health;
  try {
    const r = await fetch("/api/health", { cache: "no-store" });
    _health = r.ok ? await r.json() : { local: false };
  } catch { _health = { local: false }; }
  if (!_health || typeof _health !== "object" || !("local" in _health)) _health = { local: false };
  return _health;
}

export async function getJSON(url) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
}

export async function postJSON(url, body) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `${url}: ${r.status}`);
  return data;
}

// ---------------------------------------------------------------- datos

const _cache = {};
export async function loadExam(id) {
  if (!_cache[id]) _cache[id] = await getJSON(`data/exams/${id}.json`);
  return _cache[id];
}
export async function loadExamIndex() {
  if (!_cache.__index) _cache.__index = await getJSON("data/exams/index.json");
  return _cache.__index;
}
export async function loadGrammar() {
  if (!_cache.__grammar) _cache.__grammar = await getJSON("data/grammar.json");
  return _cache.__grammar;
}

// ---------------------------------------------------------------- historial

/** Guarda un intento en localStorage y, si hay servidor local, también en disco. */
export async function saveAttempt(item) {
  item.ts = item.ts || new Date().toISOString();
  item.id = item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const all = store.get("history", []);
  all.push(item);
  store.set("history", all.slice(-400));
  const h = await health();
  if (h.local) { try { await postJSON("/api/history", item); } catch { /* sin disco: queda en el navegador */ } }
  return item;
}

export async function loadHistory() {
  const local = store.get("history", []);
  const h = await health();
  let remote = [];
  if (h.local) { try { remote = await getJSON("/api/history"); } catch { remote = []; } }
  const byId = new Map();
  for (const it of [...remote, ...local]) byId.set(it.id || it.ts, it);
  return [...byId.values()].sort((a, b) => String(b.ts).localeCompare(String(a.ts)));
}

/** Puntuación 0–150 estimada para módulos con respuesta cerrada. Lineal: 70 % ≈ 105 (inicio de C1). */
export function scaled(correct, total) {
  return total ? Math.round((correct / total) * 150) : 0;
}
export function cefrFromScore(s) {
  if (s >= 130) return "C2";
  if (s >= 105) return "C1";
  if (s >= 80) return "B2";
  if (s >= 55) return "B1";
  if (s >= 30) return "A2";
  return "A1";
}
