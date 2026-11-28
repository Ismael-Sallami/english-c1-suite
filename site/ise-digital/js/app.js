// ISE Digital Simulator · router, portada, modo práctica, examen completo, revisión e historial.

import { $, $$, esc, paras, fmtTime, health, loadExam, loadExamIndex, saveAttempt, loadHistory, scaled, cefrFromScore, store, toast, sleep } from "./util.js";
import { chrome, Clock, TimeUp, runLevelling, runReading, runListening, runWriting, runSpeaking, writingContext, speakingContext } from "./exam.js";
import { startGrade, markingScreen, feedbackHTML, noServerHTML, gradeAndShow, copyCheck, taskLabel } from "./grading.js";
import { grammarHome, grammarTopic, grammarQuiz } from "./grammar.js";
import { stopAudio } from "./audio.js";

const EXAM_DATE = new Date("2026-12-10T09:00:00");
const MODULES = [
  { id: "levelling", name: "Levelling", tasks: [] },
  { id: "speaking", name: "Speaking", tasks: [["t1", "T1 Questions"], ["t2", "T2 Talk"], ["t3", "T3 Interacting"], ["t4", "T4 Summarising"]] },
  { id: "listening", name: "Listening", tasks: [["1", "Conversation"], ["2", "Discussion"], ["3", "Talk 1"], ["4", "Talk 2"]] },
  { id: "reading", name: "Reading", tasks: [["1", "Single 1"], ["2", "Single 2"], ["3", "Paired 1"], ["4", "Paired 2"]] },
  { id: "writing", name: "Writing", tasks: [["t1", "T1 Online"], ["t2", "T2 Sources"]] },
];

// ---------------------------------------------------------------- router

async function route() {
  stopAudio();
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  try {
    if (!parts.length) return hub();
    if (parts[0] === "practice") return practice(parts[1], parts[2], parts[3]);
    if (parts[0] === "mock") return mock(parts[1]);
    if (parts[0] === "grammar") {
      if (!parts[1]) return grammarHome();
      if (parts[1] === "mix" || parts[1] === "review") return grammarQuiz(parts[1]);
      return grammarTopic(parts[1]);
    }
    if (parts[0] === "history") return history(parts[1]);
    return hub();
  } catch (e) {
    console.error(e);
    $("#app").innerHTML = `<div class="wrap"><div class="notice">Error: ${esc(e.message)}</div><p style="margin-top:12px"><a class="btn" href="#/">Inicio</a></p></div>`;
  }
}
window.addEventListener("hashchange", route);
route();

// ---------------------------------------------------------------- portada

async function hub() {
  const [idx, h, hist] = await Promise.all([loadExamIndex(), health(), loadHistory()]);
  const days = Math.ceil((EXAM_DATE - new Date()) / 86400000);
  const doneKey = new Set(hist.map((a) => `${a.examId}|${a.module || (a.task || "").split("-")[0]}|${a.part ?? (a.task || "").split("-")[1] ?? ""}`));
  const lastMock = (id) => hist.find((a) => a.kind === "mock" && a.examId === id);
  const chip = (on, label) => `<span class="chip ${on ? "on" : "off"}"><span class="dot"></span>${label}</span>`;
  $("#app").innerHTML = `<div class="wrap">
    <div class="topbar"><a class="brand" href="../"><span class="brand-mark">ISE</span>English C1 Suite</a>
      <div class="top-actions">${chip(h.local, h.local ? "Servidor local" : "Modo web (sin corrección IA)")}${h.local ? chip(h.agy, "Antigravity · Hydrogen") + chip(h.whisper, "Whisper") : ""}
      <button class="btn small ghost" id="theme">◐</button></div></div>
    <section class="hero">
      <h1>Trinity ISE Digital · Simulador C1</h1>
      <p>Cinco exámenes completos de la ruta C1–C2 con el formato, los tiempos y la interfaz del examen real. Writing y Speaking los corrige Antigravity con las <i>rating scales</i> oficiales de Trinity. Para tener el C1 necesitas al menos <b>105/150 en cada módulo</b>.</p>
      ${days > 0 ? `<span class="countdown">Faltan ${days} días · 10 de diciembre</span>` : ""}
    </section>
    ${h.local ? "" : `<div class="notice info" style="margin-bottom:10px"><b>Estás en modo web.</b> Levelling, Reading, Listening y Gramática se corrigen aquí mismo. Para que Antigravity corrija Writing y Speaking, abre el simulador en local con <code>./start.sh</code> (repo english-c1-suite).</div>`}

    <h2 class="section-title">Examen completo <span class="muted">105 min · Levelling → Speaking → Listening → Reading → Writing · solo hacia delante</span></h2>
    <div class="grid">${idx.map((e, i) => {
      const lm = lastMock(e.id);
      const sv = loadMock(e.id);
      const svLabel = sv && (sv.idx >= ORDER.length ? "Correcciones pendientes" : `A medias: vas por ${MOD_NAME[ORDER[sv.idx]]} · ${fmtTime(sv.left)}`);
      return `<div class="card exam-card"><div class="num">${i + 1}</div><h3>${esc(e.title)}</h3>
        <div class="meta">${esc(e.theme.split(":")[0])}<br>Writing: ${esc(e.t1)} + ${esc(e.t2)}${lm ? `<br><b>Último: ${esc(lm.cefr)} (${lm.minScore}/150)</b>` : ""}${sv ? `<br><b style="color:var(--tr-purple-2)">${esc(svLabel)}</b>` : ""}</div>
        <div class="row"><a class="btn primary small" href="#/mock/${e.id}">${sv ? "Continuar" : "Empezar examen"}</a></div></div>`;
    }).join("")}</div>

    <h2 class="section-title">Práctica por partes <span class="muted">elige módulo o tarea suelta, con su tiempo oficial</span></h2>
    <div class="table-scroll"><table class="practice-table"><thead><tr><th>Examen</th>${MODULES.map((m) => `<th>${m.name}</th>`).join("")}</tr></thead><tbody>
    ${idx.map((e, i) => `<tr><td><b>${i + 1}</b> <span class="small muted">${esc(e.title)}</span></td>${MODULES.map((m) => `<td><div class="task-links">
      <a href="#/practice/${e.id}/${m.id}" class="${doneKey.has(`${e.id}|${m.id}|`) ? "done" : ""}">${m.tasks.length ? "Módulo" : "Hacer"}</a>
      ${m.tasks.map(([t, l]) => `<a href="#/practice/${e.id}/${m.id}/${t}" title="${esc(l)}" class="${doneKey.has(`${e.id}|${m.id}|${t}`) ? "done" : ""}">${esc(l)}</a>`).join("")}</div></td>`).join("")}</tr>`).join("")}
    </tbody></table></div>

    <h2 class="section-title">Más</h2>
    <div class="grid">
      <a class="card" href="#/grammar" style="text-decoration:none"><h3>Gramática C1</h3><div class="meta">18 temas · 180 ejercicios · repaso de fallos</div><span class="btn small primary">Repasar</span></a>
      <a class="card" href="#/history" style="text-decoration:none"><h3>Historial</h3><div class="meta">${hist.length} intentos guardados · evolución por destreza</div><span class="btn small">Ver</span></a>
      <a class="card" href="../writing-library/" style="text-decoration:none"><h3>Biblioteca de writings</h3><div class="meta">Respuestas oficiales puntuadas y modelos C1</div><span class="btn small">Abrir</span></a>
      <a class="card" href="../writing-cheatsheet/" style="text-decoration:none"><h3>Chuleta de Writing</h3><div class="meta">Esqueletos, conectores y checklist</div><span class="btn small">Abrir</span></a>
    </div>
    <footer class="foot">Contenido original generado para practicar; formato basado en la guía oficial ISE Digital y su demo. La puntuación es una estimación, no un resultado oficial de Trinity.</footer>
  </div>`;
  $("#theme").onclick = () => {
    const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", cur);
    try { localStorage.setItem("course-theme", cur); } catch { /* nada */ }
  };
}

// ---------------------------------------------------------------- práctica

const PRACTICE_TIME = {
  levelling: () => 600,
  reading: (t) => (t ? (Number(t) <= 2 ? 300 : 360) : 1200),
  listening: (t) => (t ? 420 : 1200),
  writing: (t) => (t === "t1" ? 300 : t === "t2" ? 2100 : 2400),
  speaking: () => 1200,
};

const ORDER = ["levelling", "speaking", "listening", "reading", "writing"];
const MOD_NAME = { levelling: "Levelling test", speaking: "Speaking", listening: "Listening", reading: "Reading", writing: "Writing" };
const SKILL_OF_TASK = (t) => (t.startsWith("writing") ? "Writing" : "Speaking");

// ---------------------------------------------------------------- notas y nivel

/** Notas por módulo (0–150) a partir de lo corregido. Pesos oficiales en Speaking y Writing. */
function moduleScores(autos = {}, graded = []) {
  const sc = (t) => graded.find((g) => g.task === t && g.result)?.result.estimatedScore;
  const weighted = (pairs) => {
    const got = pairs.filter(([t]) => sc(t) != null);
    if (!got.length) return null;
    return Math.round(got.reduce((n, [t, w]) => n + sc(t) * w, 0) / got.reduce((n, [, w]) => n + w, 0));
  };
  const out = {};
  const s = weighted([["speaking-t1", 1], ["speaking-t2", 1], ["speaking-t3", 1.5], ["speaking-t4", 1.5]]);
  if (s != null) out.Speaking = s;
  if (autos.listening) out.Listening = scaled(autos.listening.correct, autos.listening.total);
  if (autos.reading) out.Reading = scaled(autos.reading.correct, autos.reading.total);
  const w = weighted([["writing-t1", 1], ["writing-t2", 1.5]]);
  if (w != null) out.Writing = w;
  return out;
}

/** Marcador: nota y nivel de cada destreza + nivel certificable (el mínimo). */
function levelBar({ autos = {}, graded = [], pending = [] }, title = "Tu nivel hasta ahora") {
  const mods = moduleScores(autos, graded);
  const skills = ["Speaking", "Listening", "Reading", "Writing"];
  const pend = new Set(pending.map((p) => SKILL_OF_TASK(p.task)));
  const vals = Object.values(mods);
  const min = vals.length ? Math.min(...vals) : null;
  return `<section class="card flat stack"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:baseline"><h3>${esc(title)}</h3>
    ${min != null ? `<span>Nivel certificable${vals.length < 4 ? " provisional" : ""}: <span class="cefr ${min >= 105 ? "pass" : "fail"}">${cefrFromScore(min)}</span> <b>${min}</b>/150</span>` : ""}</div>
    <div class="module-scores">${skills.map((s) => mods[s] != null
      ? `<div class="mscore"><span class="small muted">${s}</span><b>${mods[s]}</b><span class="cefr ${mods[s] >= 105 ? "pass" : "fail"}">${cefrFromScore(mods[s])}</span></div>`
      : `<div class="mscore"><span class="small muted">${s}</span><b class="muted">—</b><span class="small muted">${pend.has(s) ? "se corrige al final" : "pendiente"}</span></div>`).join("")}
      ${autos.levelling ? `<div class="mscore"><span class="small muted">Levelling (no puntúa)</span><b>${autos.levelling.correct}/${autos.levelling.total}</b></div>` : ""}</div>
    <p class="small muted">Para el C1 necesitas ≥ 105 en cada destreza (cuenta la más baja). Speaking = (T1 + T2 + 1,5·T3 + 1,5·T4) / 5 · Writing = (T1 + 1,5·T2) / 2,5 · Reading/Listening: estimación lineal (70 % ≈ 105).</p></section>`;
}

// ---------------------------------------------------------------- práctica

async function practice(examId, module, part) {
  const exam = await loadExam(examId);
  const back = "#/";
  const clock = new Clock(PRACTICE_TIME[module](part), { onExpire: () => toast("⏱ Se acabó el tiempo") });
  const mod = MODULES.find((m) => m.id === module);
  const partLabel = part ? ` · ${mod.tasks.find(([t]) => t === part)?.[1] || part}` : "";
  const ui = chrome(`${mod.name}${partLabel}`, { clock, practice: true });
  // Solución al terminar cada tarea (antes de pasar a la siguiente), con el reloj en pausa.
  const onTaskDone = async (t, answers, kind) => {
    clock.pause();
    ui.page(taskReviewHTML(exam, t, answers, kind));
    await ui.waitNext({ confirm: false, label: "Siguiente tarea ›" });
    clock.resume();
  };
  try {
    if (module === "levelling") {
      const r = await runLevelling(exam, ui);
      clock.stop();
      await saveAuto(exam, r);
      return reviewAuto(exam, r, back);
    }
    if (module === "reading" || module === "listening") {
      const only = part ? Number(part) - 1 : null;
      const r = await (module === "reading" ? runReading(exam, ui, only, { onTaskDone }) : runListening(exam, ui, only, { onTaskDone }));
      clock.stop();
      r.part = part || "";
      await saveAuto(exam, r);
      return reviewAuto(exam, r, back);
    }
    if (module === "writing") {
      const r = await runWriting(exam, ui, part || null);
      clock.stop();
      const items = writingItems(exam, r);
      if (items.length === 1) return gradeAndShow({ ...items[0], examId: exam.id, backHref: back });
      return gradeBundle(exam, items, { back });
    }
    if (module === "speaking") {
      clock.stop(); // en Speaking mandan los tiempos de cada tarea
      const r = await runSpeaking(exam, ui, part || null, { practice: true });
      const items = await speakingItems(exam, r);
      if (!items) return;
      if (items.length === 1) return gradeAndShow({ ...items[0], examId: exam.id, backHref: back });
      return gradeBundle(exam, items, { back });
    }
  } finally { clock.stop(); }
}

function writingItems(exam, r) {
  const items = [];
  if (r.t1) items.push({ task: "writing-t1", context: writingContext(exam, "t1"), response: r.t1.text || "", words: r.t1.words });
  if (r.t2) {
    const warns = copyCheck(r.t2.text || "", exam.writing.t2.sources.map((s) => s.text));
    items.push({ task: "writing-t2", context: writingContext(exam, "t2"), response: r.t2.text || "", words: r.t2.words, copyWarnings: warns });
  }
  return items.filter((i) => i.response.trim());
}

/** Transcribe con Whisper (servidor local) y arma las respuestas de Speaking. null si no se puede. */
async function speakingItems(exam, r, { silentNoServer = false } = {}) {
  const tasks = ["t1", "t2", "t3", "t4"].filter((t) => r[t]);
  const recsAll = tasks.flatMap((t) => r[t].recs);
  const h = await health();
  if (!h.local || !h.whisper) {
    if (silentNoServer) return [];
    $("#app").innerHTML = `<div class="wrap stack"><h1>Speaking grabado</h1>${noServerHTML()}
      ${recsAll.filter((x) => x.url).map((x) => `<div class="card flat"><b>${esc(x.label)}</b><audio controls src="${x.url}" style="width:100%;margin-top:6px"></audio></div>`).join("")}
      <a class="btn" href="#/">Volver</a></div>`;
    return null;
  }
  $("#app").innerHTML = `<div class="marking"><div class="box"><div class="spinner"></div><h2>Processing your recordings…</h2><p id="tp" style="opacity:.85">Transcribing with Whisper</p></div></div>`;
  let k = 0;
  for (const rec of recsAll) {
    k++;
    $("#tp").textContent = `Transcribing ${k} of ${recsAll.length}…`;
    if (!rec.blob || rec.blob.size < 1000) { rec.text = ""; continue; }
    try {
      const resp = await fetch("/api/transcribe", { method: "POST", headers: { "Content-Type": rec.blob.type || "audio/webm" }, body: rec.blob });
      const d = await resp.json();
      rec.text = d.error ? "" : d.text || "";
    } catch { rec.text = ""; }
  }
  return tasks
    .filter((t) => r[t].recs.some((x) => x.blob && x.blob.size > 1000))
    .map((t) => {
      const recs = r[t].recs;
      const response = recs.map((x) => `[${x.label}] (spoke ${x.seconds || 0}s)\n${x.text || "(no speech detected)"}`).join("\n\n");
      return { task: `speaking-${t}`, context: speakingContext(exam, t, r[t]), response, recordings: recs };
    });
}

async function saveAuto(exam, r) {
  const score = scaled(r.correct, r.total);
  return saveAttempt({ kind: "auto", examId: exam.id, module: r.module, part: r.part ?? "", correct: r.correct, total: r.total, score, cefr: cefrFromScore(score) });
}

// ---------------------------------------------------------------- revisión de módulos automáticos

function reviewQuestions(questions, chosenOf) {
  return questions.map((q, k) => {
    const chosen = chosenOf(k);
    return `<div class="q"><div class="q-title"><span class="n">${k + 1}.</span>${esc(q.q ?? q.prompt)}</div>
      ${q.options.map((o, i) => `<button type="button" disabled class="opt ${i === q.answer ? "correct" : i === chosen ? "wrong" : ""}"><span class="radio"></span><span>${esc(o)}</span></button>`).join("")}
      ${chosen == null ? `<div class="small" style="color:var(--bad)">Sin responder</div>` : ""}
      ${q.explanation ? `<div class="explain">${esc(q.explanation)}</div>` : ""}</div>`;
  }).join("");
}

function scoreLine(correct, total, label) {
  const s = scaled(correct, total);
  return `<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><b>${esc(label)}: ${correct}/${total}</b> <span>${s}/150</span> <span class="cefr ${s >= 105 ? "pass" : "fail"}">${cefrFromScore(s)}</span></div>`;
}

function sourceHTML(t, kind) {
  return kind === "listening"
    ? `<details class="transcript"><summary>Transcripción</summary><div style="margin-top:8px">${t.script.map((l) => `<p><b>${esc(l.speaker)}:</b> ${esc(l.text)}</p>`).join("")}</div></details>`
    : `<details class="transcript"><summary>Texto</summary><div class="reading-text" style="margin-top:8px">${t.type === "paired" ? `<h3>Text A · ${esc(t.textA.title)}</h3>${paras(t.textA.text)}<h3>Text B · ${esc(t.textB.title)}</h3>${paras(t.textB.text)}` : paras(t.text)}</div></details>`;
}

/** Solución de una sola tarea (Reading/Listening), para verla al pasar de bloque. */
function taskReviewHTML(exam, t, answers, kind) {
  const correct = t.questions.filter((q, k) => answers[`${t.i}-${k}`] === q.answer).length;
  return `<h2 class="task-head">Solución · ${esc(t.title)}</h2>
    <section class="card flat stack">${scoreLine(correct, t.questions.length, "Esta tarea")}${sourceHTML(t, kind)}${reviewQuestions(t.questions, (k) => answers[`${t.i}-${k}`])}</section>`;
}

function reviewAutoHTML(exam, r) {
  if (r.module === "levelling") {
    return `<section class="card flat">${reviewQuestions(exam.levelling.map((it) => ({ q: it.prompt, options: it.options, answer: it.answer })), (k) => r.answers[k])}</section>`;
  }
  const list = r.module === "reading" ? exam.reading : exam.listening;
  return r.taskIdx.map((i) => {
    const t = { ...list[i], i };
    const correct = t.questions.filter((q, k) => r.answers[`${i}-${k}`] === q.answer).length;
    return `<section class="card flat stack"><h3>${esc(t.title)}</h3>${scoreLine(correct, t.questions.length, "Aciertos")}${sourceHTML(t, r.module)}${reviewQuestions(t.questions, (k) => r.answers[`${i}-${k}`])}</section>`;
  }).join("");
}

function autoHeaderHTML(exam, r) {
  const score = scaled(r.correct, r.total);
  return `<section class="card flat"><div class="score-hero"><div class="gauge" style="--p:${(score / 150) * 100};--g-col:${score >= 105 ? "var(--ok)" : score >= 80 ? "var(--warn)" : "var(--bad)"}"><div><b>${score}</b><span class="small muted">/ 150</span></div></div>
    <div><div class="small muted">${esc(exam.title)} · ${esc(r.module)}</div><h2 style="margin:4px 0">${r.correct} / ${r.total} correctas <span class="cefr ${score >= 105 ? "pass" : "fail"}">${cefrFromScore(score)}</span></h2>
    <p class="small muted">${r.module === "levelling" ? "El levelling no puntúa: solo decide la ruta." : "Estimación lineal (70 % ≈ 105 = inicio de C1). El examen real es adaptativo."}</p></div></div></section>`;
}

function reviewAuto(exam, r, back) {
  $("#app").innerHTML = `<div class="wrap stack">
    <div class="topbar"><a class="brand" href="#/"><span class="brand-mark">ISE</span>Resultados</a><div class="top-actions"><a class="btn small" href="${back}">Volver</a></div></div>
    ${autoHeaderHTML(exam, r)}${reviewAutoHTML(exam, r)}<a class="btn" href="${back}">Volver</a></div>`;
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- corrección con Antigravity

/** Corrige varias tareas a la vez. Devuelve {ok:[…con result], failed:[…con error]}. */
async function gradeNow(exam, items, title) {
  const h = await health();
  if (!h.local) return { ok: [], failed: items.map((it) => ({ ...it, error: "NO_LOCAL" })) };
  const jobs = [], failed = [];
  for (const it of items) {
    try { jobs.push({ ...it, jobId: await startGrade(it.task, it.context, it.response) }); }
    catch (e) { failed.push({ ...it, error: e.message }); }
  }
  const results = jobs.length ? await markingScreen(jobs, title) : [];
  const ok = [];
  for (const r of results) {
    if (r.result) {
      ok.push(r);
      await saveAttempt({ kind: "graded", task: r.task, examId: exam.id, score: Math.round(r.result.estimatedScore || 0), cefr: r.result.overallCefr, response: r.response, result: r.result, jobId: r.jobId, elapsed: r.elapsed });
    } else failed.push(r);
  }
  return { ok, failed };
}

const TASK_ORDER = ["speaking-t1", "speaking-t2", "speaking-t3", "speaking-t4", "writing-t1", "writing-t2"];
const byTask = (a, b) => TASK_ORDER.indexOf(a.task) - TASK_ORDER.indexOf(b.task);

function gradedSections(list, { openFirst = true } = {}) {
  return [...list].sort(byTask).map((r, i) => `<details class="card flat" ${openFirst && i === 0 ? "open" : ""}><summary style="cursor:pointer;font-weight:700">${esc(taskLabel(r.task))}${r.result ? ` · <span class="cefr ${(r.result.estimatedScore || 0) >= 105 ? "pass" : "fail"}">${esc(r.result.overallCefr)}</span> ${Math.round(r.result.estimatedScore)}/150` : " · sin corregir"}</summary>
    <div class="stack" style="margin-top:14px">${r.result ? feedbackHTML(r.task, r.result, r) : `${r.error === "NO_LOCAL" ? noServerHTML() : `<div class="notice">${esc(r.error || "Pendiente de corregir")}</div>`}<div class="prose">${esc(r.response)}</div>`}</div></details>`).join("");
}

/** Práctica de un módulo entero de Writing/Speaking: corrige todo y muestra notas. */
async function gradeBundle(exam, items, { back }) {
  const { ok, failed } = await gradeNow(exam, items, "Your responses are being marked");
  $("#app").innerHTML = `<div class="wrap stack">
    <div class="topbar"><a class="brand" href="#/"><span class="brand-mark">ISE</span>Corrección</a><div class="top-actions"><a class="btn small ghost" href="#/history">Historial</a><a class="btn small" href="${back}">Inicio</a></div></div>
    <h1>${esc(exam.title)}</h1>
    ${ok.length ? levelBar({ graded: ok }, "Nota de este módulo") : ""}
    ${failed.length && failed[0].error !== "NO_LOCAL" ? `<button class="btn primary" id="retry">Reintentar las ${failed.length} correcciones fallidas</button>` : ""}
    ${gradedSections([...ok, ...failed])}
    <a class="btn" href="${back}">Volver al inicio</a></div>`;
  $("#retry")?.addEventListener("click", () => gradeBundle(exam, failed.map(({ error, ...it }) => it), { back }));
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- examen completo (modo real / estudio, con guardado)

const mockKey = (id) => `mock:${id}`;
export const loadMock = (id) => store.get(mockKey(id), null);
const saveMock = (st) => { st.ts = new Date().toISOString(); store.set(mockKey(st.examId), st); };
const clearMock = (id) => store.set(mockKey(id), null);
/** Para guardar en el navegador: sin blobs de audio. */
const stripItem = ({ recordings, ...it }) => ({ ...it, recordings: (recordings || []).map(({ label, seconds, text }) => ({ label, seconds, text })) });
const liveRecs = new Map(); // grabaciones de esta sesión (para escucharlas en la corrección)
const withRecs = (it) => ({ ...it, recordings: liveRecs.get(it.task) || [] });

async function mock(examId) {
  const exam = await loadExam(examId);
  const h = await health();
  const saved = loadMock(examId);
  const resumeLabel = saved && (saved.idx >= ORDER.length ? "ver resultados y correcciones pendientes" : `vas por ${MOD_NAME[ORDER[saved.idx]]} · quedan ${fmtTime(saved.left)}`);
  $("#app").innerHTML = `<div class="wrap stack" style="max-width:780px">
    <div class="topbar"><a class="brand" href="#/"><span class="brand-mark">ISE</span>${esc(exam.title)}</a></div>
    ${saved ? `<div class="card stack"><b>Tienes este examen a medias (${saved.mode === "study" ? "modo estudio" : "modo real"})</b><span class="muted">${esc(resumeLabel)}</span>
      ${levelBar(saved)}<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="next-btn" id="resume">Continuar ›</button><button class="btn ghost" id="restart">Empezar de nuevo</button></div></div>` : ""}
    <div id="newbox" class="stack ${saved ? "hidden" : ""}">
      <div class="lexis"><div class="avatar">L</div><div><h2>Welcome to ISE Digital</h2>
        <p>Five parts: <b>Levelling test, Speaking, Listening, Reading and Writing</b>. <b>105 minutes</b> in total with one clock for the whole test. You will be told when 50, 40 and 10 minutes remain. Start Writing with at least 40 minutes left.</p>
        <p>You can only move forward. When you select <b>Next</b>, you cannot return to the previous page.</p></div></div>
      ${h.local ? "" : noServerHTML()}
      <div class="card flat stack"><b>Modo</b>
        <label style="display:flex;gap:10px;align-items:flex-start"><input type="radio" name="mode" value="study" checked style="margin-top:5px"><span><b>Modo estudio</b> · al terminar cada módulo el reloj se pausa y ves su nota, tu nivel y las soluciones (Writing y Speaking corregidos por Antigravity en ese momento). Puedes <b>guardar y seguir otro día</b>.</span></label>
        <label style="display:flex;gap:10px;align-items:flex-start"><input type="radio" name="mode" value="real" style="margin-top:5px"><span><b>Modo real</b> · como el día del examen: sin pausas ni soluciones hasta el final. Si sales, se guarda lo hecho hasta el último módulo terminado.</span></label></div>
      <div class="card flat stack"><b>Antes de empezar</b>
        <ul style="margin-left:18px"><li>Auriculares puestos y micrófono permitido.</li><li>Ten a mano tus <i>topic notes</i> para el Speaking Task 2.</li></ul>
        <label class="small muted">Nombre en pantalla</label><input class="ex-input" id="cand" value="${esc(store.get("candidate", "Ismael Sallami Moreno"))}"></div>
      <div style="display:flex;gap:10px"><button class="next-btn" id="go">Start the Test ›</button><a class="btn ghost" href="#/">Cancelar</a></div>
    </div></div>`;
  $("#restart")?.addEventListener("click", () => { $("#newbox").classList.remove("hidden"); $("#resume").closest(".card").classList.add("hidden"); });
  const choice = await new Promise((res) => { $("#go").onclick = () => res("new"); $("#resume")?.addEventListener("click", () => res("resume")); });
  let st;
  if (choice === "resume") st = saved;
  else {
    store.set("candidate", $("#cand").value.trim() || "Candidate");
    st = { examId, mode: $("input[name=mode]:checked").value, left: 105 * 60, idx: 0, autos: {}, graded: [], pending: [], startedAt: new Date().toISOString() };
    liveRecs.clear();
    saveMock(st);
  }
  if (st.idx >= ORDER.length) return mockFinal(exam, st);

  const clock = new Clock(st.left, {
    warnings: [50, 40, 10].filter((w) => w * 60 < st.left),
    onWarn: (m) => toast(`⏱ ${m} minutes remaining`, 5000),
    onExpire: () => toast("⏱ Time is up", 5000),
  });
  const here = () => location.hash === `#/mock/${examId}`;
  const quit = () => { clock.stop(); stopAudio(); location.hash = "#/"; };
  try {
    while (st.idx < ORDER.length) {
      const m = ORDER[st.idx];
      if (m === "writing" && clock.left() < 40 * 60) toast("⚠ Empiezas Writing con menos de 40 minutos", 5000);
      const ui = chrome(MOD_NAME[m], { clock, practice: false, onQuit: quit });
      let r;
      try {
        if (m === "levelling") r = await runLevelling(exam, ui);
        else if (m === "speaking") r = await runSpeaking(exam, ui, null, { practice: false });
        else if (m === "listening") r = await runListening(exam, ui);
        else if (m === "reading") r = await runReading(exam, ui);
        else r = await runWriting(exam, ui);
      } catch (e) { if (!(e instanceof TimeUp)) throw e; r = null; }
      if (!here()) return;
      clock.pause();
      st.left = clock.expired ? 0 : clock.left();
      if (r) await finishModule(exam, st, m, r);
      st.idx++;
      if (clock.expired) st.idx = ORDER.length;
      saveMock(st);
      if (!here()) return;
      if (st.mode === "study" && r) {
        const go = await moduleResultScreen(exam, st, m, clock);
        if (go === "exit") { clock.stop(); toast("Progreso guardado. Continúa desde la portada.", 4000); location.hash = "#/"; return; }
      }
      clock.resume();
    }
  } finally { clock.stop(); }
  if (here()) return mockFinal(exam, st);
}

/** Guarda el resultado del módulo. En modo estudio corrige Writing/Speaking al momento. */
async function finishModule(exam, st, m, r) {
  if (m === "levelling" || m === "listening" || m === "reading") {
    st.autos[m] = r;
    await saveAuto(exam, r);
    return;
  }
  const items = m === "speaking" ? (await speakingItems(exam, r, { silentNoServer: true })) || [] : writingItems(exam, r);
  for (const it of items) if (it.recordings) liveRecs.set(it.task, it.recordings);
  if (!items.length) return;
  if (st.mode === "study") {
    const { ok, failed } = await gradeNow(exam, items, `Your ${m} is being marked`);
    st.graded.push(...ok.map(stripItem));
    st.pending.push(...failed.map(stripItem));
  } else {
    st.pending.push(...items.map(stripItem));
  }
}

/** Pantalla de resultado de un módulo (modo estudio). Resuelve "go" o "exit". */
function moduleResultScreen(exam, st, m, clock) {
  const last = st.idx >= ORDER.length;
  const nextName = last ? "" : MOD_NAME[ORDER[st.idx]];
  let body = "";
  if (st.autos[m] && (m === "levelling" || m === "listening" || m === "reading")) {
    body = autoHeaderHTML(exam, st.autos[m]) + reviewAutoHTML(exam, st.autos[m]);
  } else {
    const prefix = m === "speaking" ? "speaking" : "writing";
    const mine = [...st.graded, ...st.pending].filter((x) => x.task.startsWith(prefix)).map(withRecs);
    const failedHere = st.pending.filter((x) => x.task.startsWith(prefix) && x.error && x.error !== "NO_LOCAL");
    body = (mine.length ? gradedSections(mine) : `<div class="notice">No hay respuestas que corregir en este módulo.</div>`)
      + (failedHere.length ? `<p class="small muted">Las que no se pudieron corregir se reintentan al final del examen.</p>` : "");
  }
  $("#app").innerHTML = `<div class="wrap stack">
    <div class="topbar"><span class="brand"><span class="brand-mark">ISE</span>${esc(exam.title)} · modo estudio</span>
      <span class="chip">⏸ Reloj en pausa · quedan ${fmtTime(st.left)}</span></div>
    <h1>Resultado de ${esc(MOD_NAME[m])}</h1>
    ${levelBar(st)}
    ${body}
    <div class="sticky-actions">
      <button class="next-btn" id="cont">${last ? "Ver resultados finales ›" : `Continuar con ${esc(nextName)} ›`}</button>
      ${last ? "" : `<button class="btn" id="exit">Guardar y salir</button>`}</div></div>`;
  window.scrollTo(0, 0);
  return new Promise((res) => {
    $("#cont").onclick = () => res("go");
    $("#exit")?.addEventListener("click", () => res("exit"));
  });
}

/** Final del examen: corrige lo pendiente, muestra notas y guarda el intento. */
async function mockFinal(exam, st, { regrade = true } = {}) {
  const h = await health();
  if (regrade && st.pending.length && h.local) {
    $("#app").innerHTML = `<div class="marking"><div class="box"><div class="spinner"></div><h2>Test finished</h2><p>Submitting your responses…</p></div></div>`;
    await sleep(800);
    const { ok, failed } = await gradeNow(exam, st.pending.map(({ error, ...it }) => it), "Your exam is being marked");
    st.graded.push(...ok.map(stripItem));
    st.pending = failed.map(stripItem);
    saveMock(st);
  }
  const mods = moduleScores(st.autos, st.graded);
  const vals = Object.values(mods);
  const min = vals.length ? Math.min(...vals) : null;
  if (!st.pending.length) {
    if (vals.length && !st.recorded) {
      await saveAttempt({ kind: "mock", examId: exam.id, mode: st.mode, modules: mods, minScore: min, cefr: cefrFromScore(min), levelling: st.autos.levelling ? `${st.autos.levelling.correct}/${st.autos.levelling.total}` : null, timeUsed: Math.round(105 * 60 - st.left) });
      st.recorded = true;
    }
    clearMock(exam.id);
  }
  const autos = st.autos;
  $("#app").innerHTML = `<div class="wrap stack">
    <div class="topbar"><a class="brand" href="#/"><span class="brand-mark">ISE</span>Resultados del examen</a><div class="top-actions"><a class="btn small ghost" href="#/history">Historial</a><a class="btn small" href="#/">Inicio</a></div></div>
    <h1>${esc(exam.title)}</h1>
    ${levelBar(st, "Resultado final")}
    ${st.pending.length ? `<div class="notice">${st.pending.length} tarea(s) sin corregir${st.pending[0].error && st.pending[0].error !== "NO_LOCAL" ? `: ${esc(st.pending[0].error)}` : ""}. Quedan guardadas; puedes reintentarlo ahora o desde la portada.</div>
      ${h.local ? `<button class="btn primary" id="retry">Reintentar corrección pendiente</button>` : noServerHTML()}` : ""}
    <div style="display:flex;gap:8px;flex-wrap:wrap">${["reading", "listening", "levelling"].filter((k) => autos[k]).map((k) => `<button class="btn small" data-rev="${k}">Revisar ${MOD_NAME[k]}</button>`).join("")}</div>
    ${gradedSections([...st.graded, ...st.pending].map(withRecs))}
    <a class="btn" href="#/">Volver al inicio</a></div>`;
  $("#retry")?.addEventListener("click", () => mockFinal(exam, st));
  $$("[data-rev]").forEach((b) => (b.onclick = () => {
    const r = autos[b.dataset.rev];
    $("#app").innerHTML = `<div class="wrap stack"><button class="btn primary" id="backres">‹ Volver a los resultados</button>${autoHeaderHTML(exam, r)}${reviewAutoHTML(exam, r)}</div>`;
    $("#backres").onclick = () => mockFinal(exam, st, { regrade: false });
    window.scrollTo(0, 0);
  }));
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- historial

function skillOf(a) {
  if (a.kind === "graded") return a.task.startsWith("writing") ? "Writing" : "Speaking";
  if (a.kind === "auto") return { listening: "Listening", reading: "Reading", levelling: "Levelling" }[a.module];
  if (a.kind === "grammar") return "Gramática";
  if (a.kind === "mock") return "Examen completo";
  return "Otro";
}

function sparkline(points) {
  if (points.length < 2) return "";
  const W = 600, H = 120, pad = 14;
  const xs = (i) => pad + (i / (points.length - 1)) * (W - 2 * pad);
  const ys = (v) => H - pad - (v / 150) * (H - 2 * pad);
  const d = points.map((p, i) => `${i ? "L" : "M"}${xs(i).toFixed(1)},${ys(p).toFixed(1)}`).join(" ");
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Evolución">
    <line x1="${pad}" x2="${W - pad}" y1="${ys(105)}" y2="${ys(105)}" stroke="var(--ok)" stroke-dasharray="4 4"/>
    <text x="${W - pad}" y="${ys(105) - 4}" text-anchor="end" font-size="11" fill="var(--ok)">C1 · 105</text>
    <path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
    ${points.map((p, i) => `<circle cx="${xs(i)}" cy="${ys(p)}" r="3.5" fill="var(--accent)"/>`).join("")}</svg>`;
}

async function history(id) {
  const all = await loadHistory();
  if (id) {
    const a = all.find((x) => x.id === id);
    if (a?.kind === "graded") {
      $("#app").innerHTML = `<div class="wrap stack"><div class="topbar"><a class="brand" href="#/history"><span class="brand-mark">ISE</span>Historial</a><div class="top-actions"><a class="btn small" href="#/history">Volver</a></div></div>
        <p class="muted">${esc(new Date(a.ts).toLocaleString("es-ES"))} · ${esc(a.examId || "")}</p>${feedbackHTML(a.task, a.result, { response: a.response })}</div>`;
      window.scrollTo(0, 0);
      return;
    }
  }
  const skills = ["Speaking", "Listening", "Reading", "Writing"];
  const bySkill = Object.fromEntries(skills.map((s) => [s, all.filter((a) => skillOf(a) === s && a.score != null).reverse().map((a) => a.score)]));
  $("#app").innerHTML = `<div class="wrap stack">
    <div class="topbar"><a class="brand" href="#/"><span class="brand-mark">ISE</span>Historial</a><div class="top-actions"><a class="btn small" href="#/">Inicio</a></div></div>
    <h1>Tu evolución</h1>
    <div class="two-col">${skills.map((s) => {
      const pts = bySkill[s];
      const avg = pts.length ? Math.round(pts.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, pts.length)) : null;
      return `<section class="card flat"><h3>${s}</h3><div class="small muted">${pts.length} intentos${avg != null ? ` · media últimos 5: <b>${avg}</b> <span class="cefr ${avg >= 105 ? "pass" : "fail"}">${cefrFromScore(avg)}</span>` : ""}</div>${sparkline(pts) || `<p class="small muted" style="margin-top:8px">${pts.length === 1 ? `Último: ${pts[0]}/150` : "Sin datos todavía."}</p>`}</section>`;
    }).join("")}</div>
    <section class="card flat"><h3>Todos los intentos</h3>${all.length ? all.map((a) => `<div class="hist-row">
      <span class="when small muted">${esc(new Date(a.ts).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }))}</span>
      <span><b>${esc(skillOf(a))}</b> <span class="small muted">${esc(a.examId || "")} ${a.kind === "graded" ? esc(taskLabel(a.task)) : esc(a.title || a.module || "")}${a.part ? ` · parte ${esc(a.part)}` : ""}</span></span>
      <span>${a.kind === "mock" ? `<span class="cefr ${a.minScore >= 105 ? "pass" : "fail"}">${esc(a.cefr)}</span> ${Object.entries(a.modules || {}).map(([m, s]) => `${m[0]}${s}`).join(" ")}` : a.score != null ? `${a.score}/150 <span class="cefr ${a.score >= 105 ? "pass" : "fail"}">${esc(a.cefr || cefrFromScore(a.score))}</span>` : `${a.correct}/${a.total}`}</span>
      <span>${a.kind === "graded" && a.result ? `<a class="btn small ghost" href="#/history/${esc(a.id)}">Ver corrección</a>` : ""}</span></div>`).join("") : `<p class="muted">Aún no hay intentos.</p>`}</section>
  </div>`;
}
