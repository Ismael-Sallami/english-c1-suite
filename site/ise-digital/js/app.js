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
      return `<div class="card exam-card"><div class="num">${i + 1}</div><h3>${esc(e.title)}</h3>
        <div class="meta">${esc(e.theme.split(":")[0])}<br>Writing: ${esc(e.t1)} + ${esc(e.t2)}${lm ? `<br><b>Último: ${esc(lm.cefr)} (${lm.minScore}/150)</b>` : ""}</div>
        <div class="row"><a class="btn primary small" href="#/mock/${e.id}">Empezar examen</a></div></div>`;
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

async function practice(examId, module, part) {
  const exam = await loadExam(examId);
  const back = "#/";
  const clock = new Clock(PRACTICE_TIME[module](part), { onExpire: () => toast("⏱ Se acabó el tiempo") });
  const mod = MODULES.find((m) => m.id === module);
  const partLabel = part ? ` · ${mod.tasks.find(([t]) => t === part)?.[1] || part}` : "";
  const ui = chrome(`${mod.name}${partLabel}`, { clock, practice: true });
  try {
    if (module === "levelling") {
      const r = await runLevelling(exam, ui);
      clock.stop();
      await saveAuto(exam, r);
      return reviewAuto(exam, r, back);
    }
    if (module === "reading" || module === "listening") {
      const only = part ? Number(part) - 1 : null;
      const r = await (module === "reading" ? runReading(exam, ui, only) : runListening(exam, ui, only));
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
  $("#app").innerHTML = `<div class="marking"><div class="box"><div class="spinner"></div><h2>Processing your recordings…</h2><p id="tp" style="opacity:.85">Transcribing with Whisper (local GPU)</p></div></div>`;
  let k = 0;
  for (const rec of recsAll) {
    k++;
    $("#tp").textContent = `Transcribing ${k} of ${recsAll.length}…`;
    if (!rec.blob || rec.blob.size < 1000) { rec.text = ""; continue; }
    try {
      const resp = await fetch("/api/transcribe", { method: "POST", headers: { "Content-Type": rec.blob.type || "audio/webm" }, body: rec.blob });
      const d = await resp.json();
      rec.text = d.text || "";
      if (d.error) rec.text = "";
    } catch { rec.text = ""; }
  }
  return tasks.map((t) => {
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

function reviewAuto(exam, r, back) {
  const score = scaled(r.correct, r.total);
  let detail = "";
  if (r.module === "levelling") {
    detail = `<section class="card flat">${reviewQuestions(exam.levelling.map((it) => ({ q: it.prompt, options: it.options, answer: it.answer })), (k) => r.answers[k])}</section>`;
  } else {
    const list = r.module === "reading" ? exam.reading : exam.listening;
    detail = r.taskIdx.map((i) => {
      const t = list[i];
      const src = r.module === "listening"
        ? `<details class="transcript"><summary>Transcripción</summary><div style="margin-top:8px">${t.script.map((l) => `<p><b>${esc(l.speaker)}:</b> ${esc(l.text)}</p>`).join("")}</div></details>`
        : `<details class="transcript"><summary>Texto</summary><div class="reading-text" style="margin-top:8px">${t.type === "paired" ? `<h3>Text A · ${esc(t.textA.title)}</h3>${paras(t.textA.text)}<h3>Text B · ${esc(t.textB.title)}</h3>${paras(t.textB.text)}` : paras(t.text)}</div></details>`;
      return `<section class="card flat stack"><h3>${esc(t.title)}</h3>${src}${reviewQuestions(t.questions, (k) => r.answers[`${i}-${k}`])}</section>`;
    }).join("");
  }
  $("#app").innerHTML = `<div class="wrap stack">
    <div class="topbar"><a class="brand" href="#/"><span class="brand-mark">ISE</span>Resultados</a><div class="top-actions"><a class="btn small" href="${back}">Volver</a></div></div>
    <section class="card flat"><div class="score-hero"><div class="gauge" style="--p:${(score / 150) * 100};--g-col:${score >= 105 ? "var(--ok)" : score >= 80 ? "var(--warn)" : "var(--bad)"}"><div><b>${score}</b><span class="small muted">/ 150</span></div></div>
      <div><div class="small muted">${esc(exam.title)} · ${esc(r.module)}</div><h2 style="margin:4px 0">${r.correct} / ${r.total} correctas <span class="cefr ${score >= 105 ? "pass" : "fail"}">${cefrFromScore(score)}</span></h2>
      <p class="small muted">Estimación lineal (70 % ≈ 105 = inicio de C1). El examen real es adaptativo.</p></div></div></section>
    ${detail}<a class="btn" href="${back}">Volver</a></div>`;
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- corrección de varias tareas

async function gradeBundle(exam, items, { back, autos = null, mockMeta = null }) {
  const h = await health();
  let results = [];
  if (h.local && items.length) {
    const jobs = [];
    for (const it of items) {
      try { jobs.push({ ...it, jobId: await startGrade(it.task, it.context, it.response) }); }
      catch (e) { results.push({ ...it, error: e.message }); }
    }
    results = results.concat(await markingScreen(jobs, mockMeta ? "Your exam is being marked" : "Your responses are being marked"));
  } else {
    results = items.map((it) => ({ ...it, error: "NO_LOCAL" }));
  }
  const order = ["speaking-t1", "speaking-t2", "speaking-t3", "speaking-t4", "writing-t1", "writing-t2"];
  results.sort((a, b) => order.indexOf(a.task) - order.indexOf(b.task));
  for (const r of results) if (r.result) {
    await saveAttempt({ kind: "graded", task: r.task, examId: exam.id, score: Math.round(r.result.estimatedScore || 0), cefr: r.result.overallCefr, response: r.response, result: r.result, jobId: r.jobId, elapsed: r.elapsed });
  }

  const sc = (t) => results.find((r) => r.task === t && r.result)?.result.estimatedScore;
  const weighted = (pairs) => {
    const got = pairs.filter(([t]) => sc(t) != null);
    if (!got.length) return null;
    return Math.round(got.reduce((n, [t, w]) => n + sc(t) * w, 0) / got.reduce((n, [, w]) => n + w, 0));
  };
  const modules = {};
  const speak = weighted([["speaking-t1", 1], ["speaking-t2", 1], ["speaking-t3", 1.5], ["speaking-t4", 1.5]]);
  const writ = weighted([["writing-t1", 1], ["writing-t2", 1.5]]);
  if (speak != null) modules.Speaking = speak;
  if (autos?.listening) modules.Listening = scaled(autos.listening.correct, autos.listening.total);
  if (autos?.reading) modules.Reading = scaled(autos.reading.correct, autos.reading.total);
  if (writ != null) modules.Writing = writ;
  const vals = Object.values(modules);
  const min = vals.length ? Math.min(...vals) : null;

  if (mockMeta && vals.length) {
    await saveAttempt({ kind: "mock", examId: exam.id, modules, minScore: min, cefr: cefrFromScore(min), levelling: autos?.levelling ? `${autos.levelling.correct}/${autos.levelling.total}` : null, timeUsed: mockMeta.timeUsed });
  }

  const sections = results.map((r, i) => `<details class="card flat" ${i === 0 ? "open" : ""}><summary style="cursor:pointer;font-weight:700">${esc(taskLabel(r.task))}${r.result ? ` · <span class="cefr ${(r.result.estimatedScore || 0) >= 105 ? "pass" : "fail"}">${esc(r.result.overallCefr)}</span> ${Math.round(r.result.estimatedScore)}/150` : " · sin corregir"}</summary>
    <div class="stack" style="margin-top:14px">${r.result ? feedbackHTML(r.task, r.result, r) : `${r.error === "NO_LOCAL" ? noServerHTML() : `<div class="notice">${esc(r.error)}</div>`}<div class="prose">${esc(r.response)}</div>`}</div></details>`).join("");

  $("#app").innerHTML = `<div class="wrap stack">
    <div class="topbar"><a class="brand" href="#/"><span class="brand-mark">ISE</span>${mockMeta ? "Resultados del examen" : "Corrección"}</a><div class="top-actions"><a class="btn small ghost" href="#/history">Historial</a><a class="btn small" href="${back}">Inicio</a></div></div>
    <h1>${esc(exam.title)}</h1>
    ${vals.length ? `<section class="card flat stack"><div class="module-scores">${Object.entries(modules).map(([m, s]) => `<div class="mscore"><span class="small muted">${m}</span><b>${s}</b><span class="cefr ${s >= 105 ? "pass" : "fail"}">${cefrFromScore(s)}</span></div>`).join("")}
      ${autos?.levelling ? `<div class="mscore"><span class="small muted">Levelling (no puntúa)</span><b>${autos.levelling.correct}/${autos.levelling.total}</b></div>` : ""}</div>
      ${mockMeta ? `<p><b>Nivel certificable (mínimo de los 4 módulos, criterio UGR/ACLES): <span class="cefr ${min >= 105 ? "pass" : "fail"}">${cefrFromScore(min)}</span> (${min}/150)</b>${vals.length < 4 ? " · faltan módulos por corregir" : ""}</p>` : ""}
      <p class="small muted">Speaking = (T1 + T2 + 1,5·T3 + 1,5·T4) / 5 · Writing = (T1 + 1,5·T2) / 2,5 · Reading/Listening: estimación lineal. Orientativo.</p></section>` : ""}
    ${autos ? `<div class="row" style="display:flex;gap:8px;flex-wrap:wrap">${autos.reading ? `<button class="btn small" data-rev="reading">Revisar Reading</button>` : ""}${autos.listening ? `<button class="btn small" data-rev="listening">Revisar Listening</button>` : ""}${autos.levelling ? `<button class="btn small" data-rev="levelling">Revisar Levelling</button>` : ""}</div>` : ""}
    ${sections}
    <a class="btn" href="${back}">Volver al inicio</a></div>`;
  $$("[data-rev]").forEach((b) => (b.onclick = () => {
    const key = b.dataset.rev;
    const cached = $("#app").innerHTML;
    reviewAuto(exam, autos[key], "#/");
    const back2 = document.createElement("button");
    back2.className = "btn primary"; back2.textContent = "‹ Volver a los resultados";
    back2.onclick = () => { $("#app").innerHTML = cached; gradeBundleRebind(exam, autos); };
    $(".wrap").prepend(back2);
  }));
  window.scrollTo(0, 0);
}

function gradeBundleRebind(exam, autos) {
  $$("[data-rev]").forEach((b) => (b.onclick = () => { reviewAuto(exam, autos[b.dataset.rev], "#/"); }));
}

// ---------------------------------------------------------------- examen completo

async function mock(examId) {
  const exam = await loadExam(examId);
  const h = await health();
  $("#app").innerHTML = `<div class="wrap stack" style="max-width:760px">
    <div class="topbar"><a class="brand" href="#/"><span class="brand-mark">ISE</span>${esc(exam.title)}</a></div>
    <div class="lexis"><div class="avatar">L</div><div><h2>Welcome to ISE Digital</h2>
      <p>This test has five parts: <b>Levelling test, Speaking, Listening, Reading and Writing</b>. You have <b>105 minutes</b> in total, with one clock for the whole test. You will be told when 50, 40 and 10 minutes remain. Start the Writing module with at least 40 minutes left.</p>
      <p>You can only move forward. When you select <b>Next</b>, you cannot return to the previous page.</p></div></div>
    ${h.local ? "" : noServerHTML()}
    <div class="card flat stack"><b>Antes de empezar</b>
      <ul style="margin-left:18px"><li>Auriculares puestos y micrófono permitido.</li><li>Ten a mano tus <i>topic notes</i> para el Speaking Task 2.</li><li>Sin pausas, como el día del examen. Al acabar, Antigravity corrige Writing y Speaking (unos minutos).</li></ul>
      <label class="small muted">Nombre en pantalla</label><input class="ex-input" id="cand" value="${esc(store.get("candidate", "Ismael Sallami Moreno"))}"></div>
    <div style="display:flex;gap:10px"><button class="next-btn" id="go">Start the Test ›</button><a class="btn ghost" href="#/">Cancelar</a></div></div>`;
  await new Promise((res) => ($("#go").onclick = res));
  store.set("candidate", $("#cand").value.trim() || "Candidate");

  const TOTAL = 105 * 60;
  const clock = new Clock(TOTAL, { warnings: [50, 40, 10], onWarn: (m) => toast(`⏱ ${m} minutes remaining`, 5000), onExpire: () => toast("⏱ Time is up", 5000) });
  const autos = {};
  const out = {};
  const quit = () => { clock.stop(); stopAudio(); location.hash = "#/"; };
  try {
    autos.levelling = await runLevelling(exam, chrome("Levelling test", { clock, practice: false, onQuit: quit }));
    if (location.hash !== `#/mock/${examId}`) return;
    out.speaking = await runSpeaking(exam, chrome("Speaking", { clock, practice: false, onQuit: quit }), null, { practice: false });
    if (location.hash !== `#/mock/${examId}`) return;
    autos.listening = await runListening(exam, chrome("Listening", { clock, practice: false, onQuit: quit }));
    if (location.hash !== `#/mock/${examId}`) return;
    autos.reading = await runReading(exam, chrome("Reading", { clock, practice: false, onQuit: quit }));
    if (location.hash !== `#/mock/${examId}`) return;
    if (clock.left() < 40 * 60) toast("⚠ Empiezas Writing con menos de 40 minutos", 5000);
    out.writing = await runWriting(exam, chrome("Writing", { clock, practice: false, onQuit: quit }));
  } catch (e) {
    if (!(e instanceof TimeUp)) throw e;
  }
  const timeUsed = Math.round(TOTAL - clock.left());
  clock.stop();
  if (location.hash !== `#/mock/${examId}`) return;
  $("#app").innerHTML = `<div class="marking"><div class="box"><div class="spinner"></div><h2>Test finished</h2><p>Time used: ${fmtTime(timeUsed)}. Submitting your responses…</p></div></div>`;
  await sleep(1200);
  for (const k of ["listening", "reading", "levelling"]) if (autos[k]) await saveAuto(exam, autos[k]);
  const items = [];
  if (out.speaking) {
    const sp = await speakingItems(exam, out.speaking, { silentNoServer: true });
    if (sp) items.push(...sp.filter((i) => i.recordings.some((x) => x.blob && x.blob.size > 1000)));
  }
  if (out.writing) items.push(...writingItems(exam, out.writing));
  return gradeBundle(exam, items, { back: "#/", autos, mockMeta: { timeUsed } });
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
