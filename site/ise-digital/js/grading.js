// Corrección de Writing y Speaking con Antigravity (agy · Gemini Hydrogen) a través del servidor local.
// Pantalla "Your response is being marked…" + página de corrección.

import { $, esc, paras, fmtTime, sleep, health, postJSON, getJSON, saveAttempt, cefrFromScore } from "./util.js";

const TASK_LABEL = {
  "writing-t1": "Writing · Task 1 · Written online communication",
  "writing-t2": "Writing · Task 2 · Writing from sources",
  "speaking-t1": "Speaking · Task 1 · Responding to questions",
  "speaking-t2": "Speaking · Task 2 · Prepared talk",
  "speaking-t3": "Speaking · Task 3 · Interacting",
  "speaking-t4": "Speaking · Task 4 · Summarising",
};
export const taskLabel = (t) => TASK_LABEL[t] || t;

const STEPS = [
  "Response submitted securely",
  "Examiner reading the task and the official rating scale",
  "Assessing content and task fulfilment",
  "Assessing language: grammar, vocabulary and accuracy",
  "Assessing style / delivery",
  "Writing your diagnostic report",
];

/** Lanza un trabajo de corrección. Devuelve jobId o lanza error (p. ej. sin servidor local). */
export async function startGrade(task, context, response) {
  const h = await health();
  if (!h.local) throw new Error("NO_LOCAL");
  const { jobId } = await postJSON("/api/grade", { task, context, response });
  return jobId;
}

export async function waitJob(jobId, onTick = () => {}) {
  const t0 = Date.now();
  for (;;) {
    await sleep(2500);
    onTick((Date.now() - t0) / 1000);
    let job;
    try { job = await getJSON(`/api/job/${jobId}`); } catch { continue; }
    if (job.status === "done") return job;
    if (job.status === "error") throw new Error(job.error || "Error en la corrección");
  }
}

/** Pantalla de carga mientras se corrigen uno o varios trabajos. jobs = [{task, jobId}]. */
export async function markingScreen(jobs, title = "Your response is being marked") {
  const app = $("#app");
  app.innerHTML = `<div class="marking"><div class="box">
    <div class="spinner"></div>
    <h2>${esc(title)}…</h2>
    <p style="opacity:.85">A Trinity-trained examiner model (Antigravity · Gemini Hydrogen) is applying the official ISE Digital rating scale.</p>
    <div class="steps">${STEPS.map((s, i) => `<div data-i="${i}">${esc(s)}</div>`).join("")}</div>
    <div class="elapsed">00:00</div>
    <p class="small" style="opacity:.7;margin-top:10px">${jobs.length > 1 ? `${jobs.length} tasks · ` : ""}Suele tardar entre 30 s y 3 min.</p>
  </div></div>`;
  const stepEls = [...app.querySelectorAll(".steps div")];
  const elapsedEl = app.querySelector(".elapsed");
  const t0 = Date.now();
  const anim = setInterval(() => {
    const s = (Date.now() - t0) / 1000;
    elapsedEl.textContent = fmtTime(s);
    const k = Math.min(STEPS.length - 1, Math.floor(Math.log2(1 + s / 4)) + 1);
    stepEls.forEach((el, i) => { el.className = i < k ? "done" : i === k ? "on" : ""; });
  }, 500);
  const results = await Promise.all(jobs.map(async (j) => {
    try { const job = await waitJob(j.jobId); return { ...j, result: job.result, elapsed: job.elapsed, model: job.model }; }
    catch (e) { return { ...j, error: e.message }; }
  }));
  clearInterval(anim);
  stepEls.forEach((el) => (el.className = "done"));
  await sleep(500);
  return results;
}

// ---------------------------------------------------------------- informe

function pips(band, max) {
  let out = "";
  for (let i = 1; i <= max; i++) out += `<i class="${i <= band ? "on" : ""}"></i>`;
  return `<div class="pips" aria-label="${band} de ${max}">${out}</div>`;
}

function gauge(score) {
  const s = Math.max(0, Math.min(150, Math.round(score || 0)));
  const col = s >= 105 ? "var(--ok)" : s >= 80 ? "var(--warn)" : "var(--bad)";
  return `<div class="gauge" style="--p:${(s / 150) * 100};--g-col:${col}"><div><b>${s}</b><span class="small muted">/ 150</span></div></div>`;
}

/** HTML de una corrección individual. extra = {response, recordings[], copyWarnings[]} */
export function feedbackHTML(task, r, extra = {}) {
  const pass = (r.estimatedScore || 0) >= 105;
  const crit = (r.criteria || []).map((c) => `
    <div class="crit"><div><b>${esc(c.name)}</b>${pips(Math.round(c.band), Math.round(c.maxBand || 5))}<span class="small muted">Band ${esc(c.band)} / ${esc(c.maxBand)}</span></div>
    <div>${esc(c.justification)}</div></div>`).join("");
  const errs = (r.errors || []).length
    ? `<div class="table-scroll"><table class="err-table"><thead><tr><th>Tu texto</th><th>Corrección</th><th>Tipo</th><th>Por qué</th></tr></thead><tbody>${
      r.errors.map((e) => `<tr><td class="orig">${esc(e.original)}</td><td class="fix">${esc(e.correction)}</td><td><span class="tag">${esc(e.type)}</span></td><td>${esc(e.explanation)}</td></tr>`).join("")
    }</tbody></table></div>`
    : `<p class="muted">No se han detectado errores de lengua.</p>`;
  const recs = (extra.recordings || []).filter((x) => x.url).map((x) => `<div class="small"><b>${esc(x.label)}</b><br><audio controls src="${x.url}" style="width:100%"></audio></div>`).join("");
  return `
  <section class="card flat stack">
    <div class="score-hero">${gauge(r.estimatedScore)}
      <div>
        <div class="small muted">${esc(taskLabel(task))}</div>
        <h2 style="margin:4px 0 8px">Nivel estimado <span class="cefr ${pass ? "pass" : "fail"}">${esc(r.overallCefr || cefrFromScore(r.estimatedScore))}</span></h2>
        <p>${esc(r.summary)}</p>
        <p class="small muted" style="margin-top:6px">C1 empieza en 105/150 · C2 en 130. Estimación de un modelo de IA con la rating scale oficial: orientativa, no oficial.</p>
      </div>
    </div>
  </section>
  ${(extra.copyWarnings || []).length ? `<div class="copy-warn">⚠ Fragmentos casi literales de las fuentes (no puntúan): ${extra.copyWarnings.map((w) => `“${esc(w)}”`).join(" · ")}</div>` : ""}
  <section class="card flat"><h3>Criterios (rating scale oficial)</h3>${crit}</section>
  <div class="two-col">
    <section class="card flat"><h3>Puntos fuertes</h3><ul class="list-clean good">${(r.strengths || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ul></section>
    <section class="card flat"><h3>Qué mejorar</h3><ul class="list-clean todo">${(r.improvements || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ul></section>
  </div>
  <section class="card flat"><h3>Errores (${(r.errors || []).length})</h3>${errs}</section>
  ${(r.usefulExpressions || []).length ? `<section class="card flat"><h3>Expresiones C1 que podrías haber usado</h3><ul class="list-clean todo">${r.usefulExpressions.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></section>` : ""}
  <div class="two-col">
    <section class="card flat"><h3>Tu respuesta</h3>${recs ? `<div class="stack" style="margin-bottom:12px">${recs}</div>` : ""}<div class="prose">${esc(extra.response || "")}</div></section>
    <section class="card flat"><h3>Versión mejorada (C1/C2)</h3><div class="prose">${esc(r.improvedVersion || "")}</div></section>
  </div>`;
}

export function noServerHTML() {
  return `<div class="notice"><b>La corrección automática solo funciona en local.</b> Arranca el simulador con <code>./start.sh</code>
    dentro del repo <code>english-c1-suite</code> y abre <code>http://127.0.0.1:8765/ise-digital/</code>. Tu respuesta queda guardada abajo para que la copies.</div>`;
}

/** Corrige una tarea suelta (modo práctica): pantalla de carga + informe + guardado en historial. */
export async function gradeAndShow({ task, context, response, examId, recordings = [], copyWarnings = [], backHref = "#/" }) {
  let jobId;
  try { jobId = await startGrade(task, context, response); }
  catch (e) {
    $("#app").innerHTML = `<div class="wrap stack"><h1>${esc(taskLabel(task))}</h1>${e.message === "NO_LOCAL" ? noServerHTML() : `<div class="notice">${esc(e.message)}</div>`}
      <section class="card flat"><h3>Tu respuesta</h3><div class="prose">${esc(response)}</div></section>
      <a class="btn" href="${backHref}">Volver</a></div>`;
    return;
  }
  const [res] = await markingScreen([{ task, jobId }]);
  renderResultPage(task, res, { response, recordings, copyWarnings, backHref, examId, context, jobId });
}

export async function renderResultPage(task, res, { response, recordings, copyWarnings, backHref, examId, context, jobId }) {
  const app = $("#app");
  if (res.error) {
    app.innerHTML = `<div class="wrap stack"><h1>No se pudo corregir</h1><div class="notice">${esc(res.error)}</div>
      <p class="muted">Suele deberse a la cuota de Antigravity (ventana de 5 h). Tu respuesta:</p>
      <section class="card flat"><div class="prose">${esc(response)}</div></section>
      <div class="row" style="display:flex;gap:8px"><button class="btn primary" id="retry">Reintentar corrección</button><a class="btn" href="${backHref}">Volver</a></div></div>`;
    $("#retry").onclick = () => gradeAndShow({ task, context, response, examId, recordings, copyWarnings, backHref });
    return;
  }
  const r = res.result;
  await saveAttempt({ kind: "graded", task, examId, score: Math.round(r.estimatedScore || 0), cefr: r.overallCefr, response, result: r, jobId, elapsed: res.elapsed });
  app.innerHTML = `<div class="wrap stack">
    <div class="topbar"><a class="brand" href="#/"><span class="brand-mark">ISE</span>Corrección</a>
      <div class="top-actions"><a class="btn small ghost" href="#/history">Historial</a><a class="btn small" href="${backHref}">Volver</a></div></div>
    ${feedbackHTML(task, r, { response, recordings, copyWarnings })}
    <p class="small muted">Corregido por ${esc(res.model || "Antigravity")} en ${esc(res.elapsed)} s.</p>
  </div>`;
  window.scrollTo(0, 0);
}

/** Detecta fragmentos de ≥ 7 palabras copiados de las fuentes. */
export function copyCheck(text, sources) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(Boolean);
  const src = sources.map((s) => " " + norm(s).join(" ") + " ").join("|");
  const w = norm(text);
  const hits = [];
  for (let i = 0; i + 7 <= w.length; i++) {
    const gram = w.slice(i, i + 7).join(" ");
    if (src.includes(" " + gram + " ")) {
      let j = i + 7;
      while (j < w.length && src.includes(" " + w.slice(i, j + 1).join(" ") + " ")) j++;
      hits.push(w.slice(i, j).join(" "));
      i = j;
    }
  }
  return hits;
}

export { paras };
