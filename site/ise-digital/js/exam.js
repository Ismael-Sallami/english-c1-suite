// Motor de examen: interfaz tipo Trinity (barra morada, reloj, "Items Attempted", Next solo hacia delante)
// y los cinco módulos: Levelling, Speaking, Listening, Reading, Writing.

import { $, $$, esc, paras, fmtTime, sleep, wordCount, confirmModal, toast, store } from "./util.js";
import { play, say, stopAudio, record, countdown, micReady } from "./audio.js";

export const CANDIDATE = () => store.get("candidate", "Ismael Sallami Moreno");

// ---------------------------------------------------------------- reloj

/** Reloj de cuenta atrás. Con global=true se comparte entre módulos (modo examen completo, 105 min). */
export class Clock {
  constructor(seconds, { warnings = [], onWarn = () => {}, onExpire = () => {} } = {}) {
    this.deadline = Date.now() + seconds * 1000;
    this.warnings = new Set(warnings);
    this.onWarn = onWarn;
    this.onExpire = onExpire;
    this.listeners = new Set();
    this.expired = false;
    this.timer = setInterval(() => this.tick(), 500);
  }
  left() { return Math.max(0, (this.deadline - Date.now()) / 1000); }
  tick() {
    const l = this.left();
    for (const w of this.warnings) if (l <= w * 60) { this.warnings.delete(w); this.onWarn(w); }
    this.listeners.forEach((fn) => fn(l));
    if (l <= 0 && !this.expired) { this.expired = true; this.stop(); this.onExpire(); this.expireFns.forEach((f) => f()); }
  }
  expireFns = new Set();
  stop() { clearInterval(this.timer); }
  /** Pausa (p. ej. mientras revisas soluciones en modo estudio). */
  pause() { if (this.paused || this.expired) return; this.paused = this.left(); clearInterval(this.timer); }
  resume() {
    if (this.paused == null || this.expired) return;
    this.deadline = Date.now() + this.paused * 1000; this.paused = null;
    clearInterval(this.timer); this.timer = setInterval(() => this.tick(), 500);
  }
}

// ---------------------------------------------------------------- chrome

export class TimeUp extends Error { constructor() { super("TIMEUP"); } }

/** Crea la interfaz de examen para un módulo. */
export function chrome(moduleName, { clock, onQuit, practice = true } = {}) {
  const app = $("#app");
  app.innerHTML = `<div class="exam">
    <div class="exam-bar"><span>Test: <b>${esc(moduleName)}</b></span>
      <span style="display:flex;gap:12px;align-items:center">Candidate: <b>${esc(CANDIDATE())}</b><button class="quit" id="quit">${practice ? "Salir" : "Abandonar"}</button></span></div>
    <div class="exam-sub">
      <span class="clock" id="clock" title="${practice ? "Tiempo del módulo" : "Total Test Time Remaining"}">⏱ <span>--:--</span></span>
      <span class="attempted" id="attempted"></span>
      <div class="progress"><i id="prog" style="width:0"></i></div>
    </div>
    <main class="exam-body" id="body"></main>
    <div class="exam-foot"><span class="small muted" id="foot-note"></span><button class="next-btn" id="next">Next ›</button></div>
  </div>`;
  const body = $("#body"), next = $("#next"), clockEl = $("#clock"), prog = $("#prog"), att = $("#attempted");
  let expiredReject = null;
  if (clock) {
    const fn = (l) => { clockEl.querySelector("span").textContent = fmtTime(l); clockEl.classList.toggle("low", l < 300); };
    clock.listeners.add(fn);
    fn(clock.left());
    clock.expireFns.add(() => expiredReject && expiredReject(new TimeUp()));
  }
  $("#quit").onclick = async () => {
    if (await confirmModal({ title: "¿Salir del examen?", body: practice ? "Se perderá lo que no hayas entregado." : "Se guarda todo hasta el último módulo terminado; podrás continuar desde la portada.", ok: "Salir", cancel: "Seguir" })) {
      stopAudio(); clock?.stop(); onQuit ? onQuit() : (location.hash = "#/");
    }
  };
  const ui = {
    body,
    page(html) { body.innerHTML = html; window.scrollTo(0, 0); return body; },
    progress(done, total) { prog.style.width = `${total ? (done / total) * 100 : 0}%`; att.textContent = `${done} of ${total} · Items Attempted`; },
    note(t) { $("#foot-note").textContent = t || ""; },
    showNext(show = true, label = "Next ›") { next.style.visibility = show ? "visible" : "hidden"; next.textContent = label; },
    /** Espera a Next (con diálogo opcional). Rechaza con TimeUp si se acaba el tiempo. */
    waitNext({ label = "Next ›", confirm = true, enabled = true, enableWhen } = {}) {
      ui.showNext(true, label);
      next.disabled = !enabled;
      if (enableWhen) enableWhen.then(() => (next.disabled = false));
      return new Promise((resolve, reject) => {
        expiredReject = reject;
        if (clock?.expired) return reject(new TimeUp());
        next.onclick = async () => {
          if (confirm && !(await confirmModal())) return;
          next.onclick = null; expiredReject = null; resolve();
        };
      });
    },
    /** Envuelve una promesa para que se corte si se acaba el tiempo. */
    guard(p) {
      return new Promise((resolve, reject) => {
        expiredReject = reject;
        if (clock?.expired) return reject(new TimeUp());
        p.then((v) => { expiredReject = null; resolve(v); }, reject);
      });
    },
  };
  return ui;
}

// ---------------------------------------------------------------- opción múltiple

function mcHTML(q, n, name) {
  return `<div class="q" data-q="${name}"><div class="q-title"><span class="n">${n}.</span>${esc(q.q ?? q.prompt)}</div>
    ${q.options.map((o, i) => `<button type="button" class="opt" data-i="${i}"><span class="radio"></span><span>${esc(o)}</span></button>`).join("")}</div>`;
}

/** Activa clic = elegir, clic derecho = tachar. Devuelve estado {answers}. */
function bindMC(root, answers, onChange = () => {}) {
  $$(".q", root).forEach((qEl) => {
    const key = qEl.dataset.q;
    $$(".opt", qEl).forEach((o) => {
      o.addEventListener("click", () => {
        if (o.classList.contains("struck")) o.classList.remove("struck");
        $$(".opt", qEl).forEach((x) => x.classList.remove("sel"));
        o.classList.add("sel");
        answers[key] = Number(o.dataset.i);
        onChange();
      });
      o.addEventListener("contextmenu", (e) => { e.preventDefault(); if (!o.classList.contains("sel")) o.classList.toggle("struck"); });
    });
    if (answers[key] != null) $$(".opt", qEl)[answers[key]]?.classList.add("sel");
  });
}

function intro(ui, title, html, label = "Start ›") {
  ui.page(`<div class="lexis"><div class="avatar">L</div><div><h2>${esc(title)}</h2>${html}</div></div>`);
  return ui.waitNext({ label, confirm: false });
}

// ---------------------------------------------------------------- LEVELLING

export async function runLevelling(exam, ui) {
  const items = exam.levelling;
  await intro(ui, "Levelling test", `<p>${items.length} questions. Choose the word with a similar meaning, or the option that best completes the sentence.</p><p class="small">Suggested time: 10 minutes.</p>`);
  const answers = {};
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    ui.progress(i, items.length);
    const label = it.type === "synonym" ? "Select the word with a similar meaning" : "Complete the sentence with the correct option";
    ui.page(`<div class="instructions"><b>${label}</b></div><div class="panel" style="max-width:720px">${mcHTML({ q: it.prompt, options: it.options }, i + 1, String(i))}</div>`);
    bindMC(ui.body, answers, () => ui.progress(Object.keys(answers).length, items.length));
    await ui.waitNext({ confirm: i === items.length - 1, label: i === items.length - 1 ? "Finish ›" : "Next ›" });
  }
  const detail = items.map((it, i) => ({ chosen: answers[i], answer: it.answer }));
  return { module: "levelling", correct: detail.filter((d) => d.chosen === d.answer).length, total: items.length, answers };
}

// ---------------------------------------------------------------- READING

export async function runReading(exam, ui, only = null, { onTaskDone } = {}) {
  const tasks = exam.reading.map((t, i) => ({ ...t, i })).filter((t) => only == null || t.i === only);
  const total = tasks.reduce((n, t) => n + t.questions.length, 0);
  await intro(ui, "Reading", `<p>There are ${tasks.length} reading task${tasks.length > 1 ? "s" : ""} and ${total} questions. The texts are on the left and the questions on the right.</p><p class="small">Click an option to choose it. <b>Right-click</b> an option to cross it out. You cannot go back to a previous task.</p>`);
  const answers = {};
  let done = 0;
  for (const t of tasks) {
    const textHTML = t.type === "paired"
      ? `<div class="tabs"><button class="tab active" data-t="A">Text A</button><button class="tab" data-t="B">Text B</button><button class="tab" data-t="AB">Both</button></div>
         <div data-text="A" class="reading-text"><div class="genre">${esc(t.textA.genre || "")}</div><h3>${esc(t.textA.title)}</h3>${paras(t.textA.text)}</div>
         <div data-text="B" class="reading-text hidden"><div class="genre">${esc(t.textB.genre || "")}</div><h3>${esc(t.textB.title)}</h3>${paras(t.textB.text)}</div>`
      : `<div class="reading-text"><div class="genre">${esc(t.genre || "")}</div><h3>${esc(t.title)}</h3>${paras(t.text)}</div>`;
    ui.page(`<h2 class="task-head">${t.type === "paired" ? "Reading paired texts" : "Reading a single text"}${t.type === "paired" ? `: ${esc(t.title)}` : ""}</h2>
      <span class="scroll-hint">This page requires scrolling</span>
      <div class="split"><div class="panel sticky">${textHTML}</div>
      <div class="panel">${t.questions.map((q, k) => mcHTML(q, k + 1, `${t.i}-${k}`)).join("")}</div></div>`);
    $$(".tab", ui.body).forEach((b) => b.addEventListener("click", () => {
      $$(".tab", ui.body).forEach((x) => x.classList.toggle("active", x === b));
      $$("[data-text]", ui.body).forEach((el) => el.classList.toggle("hidden", !(b.dataset.t.includes(el.dataset.text))));
    }));
    const upd = () => ui.progress(Object.keys(answers).length, total);
    bindMC(ui.body, answers, upd); upd();
    try { await ui.waitNext(); } catch (e) { if (e instanceof TimeUp) break; throw e; }
    done++;
    if (onTaskDone && done < tasks.length) await onTaskDone(t, answers, "reading");
  }
  return gradeMC("reading", tasks, answers, exam);
}

function gradeMC(module, tasks, answers) {
  const detail = [];
  let correct = 0, total = 0;
  for (const t of tasks) t.questions.forEach((q, k) => {
    const chosen = answers[`${t.i}-${k}`];
    total++; if (chosen === q.answer) correct++;
    detail.push({ task: t.i, k, chosen });
  });
  return { module, correct, total, answers, taskIdx: tasks.map((t) => t.i) };
}

// ---------------------------------------------------------------- LISTENING

const L_NAMES = { conversation: "Listening to a conversation", discussion: "Listening to a discussion", talk: "Listening to a talk", description: "Listening to a description" };

export async function runListening(exam, ui, only = null, { onTaskDone } = {}) {
  const tasks = exam.listening.map((t, i) => ({ ...t, i })).filter((t) => only == null || t.i === only);
  const total = tasks.reduce((n, t) => n + t.questions.length, 0);
  await intro(ui, "Listening", `<p>There are ${tasks.length} listening task${tasks.length > 1 ? "s" : ""} and ${total} questions.</p>
    <p class="small">You will have time to read the questions before each recording. Answer <b>while you listen</b>. The recording cannot be paused. Use the <b>Notepad</b> if you want. Put your headphones on.</p>`);
  const answers = {};
  for (const t of tasks) {
    const plays = t.plays || (t.type === "talk" ? 1 : 2);
    ui.page(`<h2 class="task-head">${esc(L_NAMES[t.type] || "Listening")}: ${esc(t.title)}</h2>
      <div class="instructions">${esc(t.context || "")}<div class="small muted" style="margin-top:6px">${plays === 1 ? "You will hear the recording once." : `You will hear the recording ${plays} times.`}</div></div>
      <div class="audio-box"><span class="status" id="st">Read the questions</span><span class="big-count" id="cd"></span><div class="bar"><i id="ab"></i></div></div>
      <div class="split"><div class="panel">${t.questions.map((q, k) => mcHTML(q, k + 1, `${t.i}-${k}`)).join("")}</div>
      <div class="panel"><div class="platform">📝 Notepad</div><textarea class="notepad" placeholder="Click here to take notes"></textarea></div></div>`);
    const upd = () => ui.progress(Object.keys(answers).length, total);
    bindMC(ui.body, answers, upd); upd();
    ui.showNext(false);
    const st = $("#st", ui.body), cd = $("#cd", ui.body), ab = $("#ab", ui.body);
    try {
      await ui.guard(countdown(t.previewSeconds || 25, (l) => (cd.textContent = Math.ceil(l))));
      cd.textContent = "";
      for (let p = 1; p <= plays; p++) {
        st.textContent = `▶ Playing (${p} of ${plays})`;
        await ui.guard(play(`${exam.id}/listening-${t.i + 1}`, t.script, t.speakers, (x) => (ab.style.width = `${x * 100}%`)));
        if (p < plays) { st.textContent = "Second listening in…"; await ui.guard(countdown(5, (l) => (cd.textContent = Math.ceil(l)))); cd.textContent = ""; ab.style.width = "0"; }
      }
      st.textContent = "Recording finished. Check your answers.";
      await ui.waitNext();
    } catch (e) { stopAudio(); if (e instanceof TimeUp) break; throw e; }
    if (onTaskDone && t !== tasks[tasks.length - 1]) await onTaskDone(t, answers, "listening");
  }
  return gradeMC("listening", tasks, answers);
}

// ---------------------------------------------------------------- WRITING

function threadHTML(t1) {
  const av = (n) => esc((n || "?").trim()[0] || "?").toUpperCase();
  if (t1.version === "email") {
    const first = t1.thread?.[0];
    return `<div class="platform">✉ ${esc(t1.platform || "Email")}</div>
      ${(t1.thread || []).map((m) => `<div class="email-head"><b>From:</b> ${esc(m.author)}${m.role ? ` (${esc(m.role)})` : ""}</div><div class="prose" style="margin-bottom:12px">${esc(m.text)}</div>`).join("")}
      ${first ? "" : ""}`;
  }
  return `<div class="platform">${t1.version === "chat" ? "💬" : "🗂"} ${esc(t1.platform || (t1.version === "chat" ? "Group chat" : "Discussion board"))}</div>
    <div class="thread">${(t1.thread || []).map((m) => `<div class="msg"><div class="avatar">${av(m.author)}</div><div class="bubble"><div class="who">${esc(m.author)}${m.role ? ` <span class="muted small">· ${esc(m.role)}</span>` : ""}</div>${esc(m.text)}</div></div>`).join("")}</div>`;
}

function editor(ui, { max, target }) {
  const ta = $(".editor", ui.body), wc = $(".wc", ui.body);
  const upd = () => {
    let n = wordCount(ta.value);
    if (n > max) { // límite de entrada como en el examen real
      const words = ta.value.match(/\S+\s*/g) || [];
      ta.value = words.slice(0, max).join("").trimEnd();
      n = max;
    }
    wc.querySelector("span").textContent = `Word Count: ${n}`;
    wc.classList.toggle("over", n >= max);
  };
  ta.addEventListener("input", upd);
  ta.addEventListener("paste", (e) => { e.preventDefault(); toast("Pegar está desactivado, como en el examen."); });
  ta.addEventListener("drop", (e) => e.preventDefault());
  upd();
  ta.focus();
  return ta;
}

export async function runWriting(exam, ui, only = null, { clockFor } = {}) {
  const w = exam.writing;
  const out = { module: "writing" };
  const doT1 = only == null || only === "t1", doT2 = only == null || only === "t2";
  await intro(ui, "Writing", `<p>There ${doT1 && doT2 ? "are two tasks" : "is one task"}.${doT1 && doT2 ? " Spend about <b>5 minutes</b> on Task 1 and about <b>35 minutes</b> on Task 2." : ""}</p><p class="small">Copying and pasting is disabled. The word counter stops you at the maximum.</p>`);
  const total = (doT1 ? 1 : 0) + (doT2 ? 1 : 0);
  let n = 0;
  if (doT1) {
    clockFor?.("t1");
    ui.progress(n, total);
    const t1 = w.t1;
    ui.page(`<h2 class="task-head">Task 1 · Written online communication</h2>
      <div class="split"><div class="panel sticky"><div class="instructions" style="border:0;padding:0">${esc(t1.instructions)}
        ${t1.bullets?.length ? `<ul>${t1.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
        <p class="small muted" style="margin-top:8px">Write about <b>70 words</b> (maximum 90). About 5 minutes.</p></div><hr style="border:0;border-top:1px solid var(--line);margin:14px 0">${threadHTML(t1)}</div>
      <div class="panel"><textarea class="editor" spellcheck="false" placeholder="Type your reply here…" style="min-height:240px"></textarea><div class="wc"><span></span><span class="muted">max 90</span></div></div></div>`);
    const ta = editor(ui, { max: 90 });
    try { await ui.waitNext({ label: doT2 ? "Next ›" : "Submit ›" }); } catch (e) { if (!(e instanceof TimeUp)) throw e; }
    out.t1 = { text: ta.value.trim(), words: wordCount(ta.value) };
    n++;
  }
  if (doT2 && !(ui._expired)) {
    clockFor?.("t2");
    ui.progress(n, total);
    const t2 = w.t2;
    ui.page(`<h2 class="task-head">Task 2 · Writing from sources · ${esc(t2.genre)}</h2>
      <div class="instructions"><b>${esc(t2.title)}</b><div style="margin-top:6px">${paras(t2.instructions)}</div>
        <p class="small" style="margin-top:6px"><b>You MUST use ideas from the texts AND your own ideas. You MUST NOT copy from the texts.</b> Write about <b>250 words</b> (maximum 300). About 35 minutes.</p>
        <button class="btn small" id="open-src" style="margin-top:8px">📄 Click here to read texts</button></div>
      <div class="panel"><textarea class="editor" spellcheck="false" placeholder="Type your ${esc(t2.genre)} here…" style="min-height:420px"></textarea><div class="wc"><span></span><span class="muted">max 300</span></div></div>
      <aside class="sources-drawer" id="drawer"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b>Source material</b><button class="btn small" id="close-src">Close Source Material</button></div>
        <div class="tabs">${t2.sources.map((s, i) => `<button class="tab ${i ? "" : "active"}" data-s="${i}">Text ${esc(s.label)}</button>`).join("")}</div>
        ${t2.sources.map((s, i) => `<div class="reading-text ${i ? "hidden" : ""}" data-src="${i}"><div class="genre">${esc(s.type || "")}</div><h3>${esc(s.title)}</h3>${paras(s.text)}</div>`).join("")}
      </aside>`);
    const drawer = $("#drawer", ui.body);
    $("#open-src", ui.body).onclick = () => { drawer.classList.add("open"); ui.body.classList.add("with-drawer"); };
    $("#close-src", ui.body).onclick = () => { drawer.classList.remove("open"); ui.body.classList.remove("with-drawer"); };
    $$(".tab", drawer).forEach((b) => b.addEventListener("click", () => {
      $$(".tab", drawer).forEach((x) => x.classList.toggle("active", x === b));
      $$("[data-src]", drawer).forEach((el) => el.classList.toggle("hidden", el.dataset.src !== b.dataset.s));
    }));
    const ta = editor(ui, { max: 300 });
    try { await ui.waitNext({ label: "Submit ›" }); } catch (e) { if (!(e instanceof TimeUp)) throw e; }
    out.t2 = { text: ta.value.trim(), words: wordCount(ta.value) };
  }
  ui.progress(total, total);
  return out;
}

export function writingContext(exam, which) {
  const w = exam.writing;
  if (which === "t1") return { task: "Written online communication", version: w.t1.version, platform: w.t1.platform, instructions: w.t1.instructions, bullets: w.t1.bullets, thread: w.t1.thread, wordTarget: "about 70 words, maximum 90", time: "about 5 minutes" };
  return { task: "Writing from sources", genre: w.t2.genre, title: w.t2.title, instructions: w.t2.instructions, sources: w.t2.sources, wordTarget: "about 250 words, maximum 300", time: "about 35 minutes" };
}

// ---------------------------------------------------------------- SPEAKING

async function recordStep(ui, { label, seconds, practice }) {
  const box = $("#rec", ui.body);
  box.innerHTML = `<span class="rec-dot"></span><span class="status">Record your response now</span><span class="big-count" id="rc">${fmtTime(seconds)}</span><div class="bar rec"><i id="rb"></i></div>${practice ? `<button class="btn small ghost" id="stop-rec">Terminar respuesta</button>` : ""}`;
  const rc = $("#rc", box), rb = $("#rb", box);
  const p = record(seconds, (l) => { rc.textContent = fmtTime(l); rb.style.width = `${(1 - l / seconds) * 100}%`; });
  const stop = $("#stop-rec", box);
  if (stop) stop.onclick = () => p.stop();
  const res = await ui.guard(p);
  box.innerHTML = `<span class="status">✓ Response recorded</span>`;
  return { label, ...res };
}

async function prep(ui, seconds, text = "Prepare your answer") {
  const box = $("#rec", ui.body);
  box.innerHTML = `<span class="status">${esc(text)}</span><span class="big-count" id="pc">${seconds}</span><div class="bar"><i id="pb"></i></div>`;
  await ui.guard(countdown(seconds, (l) => { $("#pc", box).textContent = Math.ceil(l); $("#pb", box).style.width = `${(1 - l / seconds) * 100}%`; }));
}

async function speak(ui, key, text, voice = "female", who = "L") {
  const av = $(".avatar", ui.body);
  av?.classList.add("speaking");
  const box = $("#rec", ui.body);
  if (box) box.innerHTML = `<span class="status">🔊 Listen…</span><div class="bar"><i id="sb"></i></div>`;
  await ui.guard(say(key, text, voice, (x) => { const b = $("#sb", ui.body); if (b) b.style.width = `${x * 100}%`; }));
  av?.classList.remove("speaking");
}

export async function runSpeaking(exam, ui, only = null, { practice = true } = {}) {
  const s = exam.speaking;
  const id = exam.id;
  const out = { module: "speaking" };
  const tasks = ["t1", "t2", "t3", "t4"].filter((t) => only == null || only === t);
  if (!(await micReady())) {
    ui.page(`<div class="notice">No hay acceso al micrófono. Permite el micrófono en el navegador y vuelve a entrar.</div>`);
    await ui.waitNext({ confirm: false, label: "Continuar sin grabar ›" });
  }
  await intro(ui, "Speaking", `<p>There ${tasks.length > 1 ? `are ${tasks.length} tasks` : "is one task"}. Recording starts <b>automatically</b> — there is no button to start or repeat.</p>
    <p class="small">Your answers are transcribed locally (Whisper) and marked with the official rating scale.</p>`);
  const total = tasks.length;
  let n = 0;
  try {
    if (tasks.includes("t1")) {
      ui.progress(n, total); ui.showNext(false);
      out.t1 = { questions: s.t1.questions, recs: [] };
      ui.page(`<div class="lexis"><div class="avatar">L</div><div><h2>Task 1 · Responding to questions</h2><p>You will hear 3 questions. You have <b>30 seconds</b> to answer each one.</p></div></div><div class="audio-box" id="rec"></div><div id="qtext" class="instructions"></div>`);
      for (let i = 0; i < s.t1.questions.length; i++) {
        const q = s.t1.questions[i];
        $("#qtext", ui.body).innerHTML = `<b>Question ${i + 1}:</b> <span class="muted">(listen)</span>`;
        await speak(ui, `${id}/s1-q${i + 1}`, q);
        $("#qtext", ui.body).innerHTML = `<b>Question ${i + 1}:</b> ${esc(q)}`;
        out.t1.recs.push(await recordStep(ui, { label: `Q${i + 1}: ${q}`, seconds: 30, practice }));
        await sleep(600);
      }
      n++;
    }
    if (tasks.includes("t2")) {
      ui.progress(n, total);
      const topic = store.get("topic", "");
      const notes = store.get("topicNotes", "");
      ui.page(`<div class="lexis"><div class="avatar">L</div><div><h2>Task 2 · Delivering a prepared talk</h2>
        <p>Talk about the topic you prepared for <b>2 minutes</b>. Then answer one follow-up question (<b>30 seconds</b>).</p></div></div>
        <div class="split"><div class="panel"><label class="small muted">Your topic title</label><input class="ex-input" id="topic" value="${esc(topic)}" placeholder="e.g. The impact of AI on university education">
        <label class="small muted" style="display:block;margin-top:10px">Your topic notes (allowed in the exam)</label><textarea class="notepad" id="notes">${esc(notes)}</textarea></div>
        <div class="panel"><div class="audio-box" id="rec"><span class="status">Press Start when you are ready.</span></div></div></div>`);
      await ui.waitNext({ confirm: false, label: "Start talk ›" });
      const tp = $("#topic", ui.body).value.trim(), nt = $("#notes", ui.body).value;
      store.set("topic", tp); store.set("topicNotes", nt);
      ui.showNext(false);
      $("#topic", ui.body).disabled = true;
      out.t2 = { topic: tp, recs: [] };
      out.t2.recs.push(await recordStep(ui, { label: `Talk: ${tp}`, seconds: 120, practice }));
      const fi = Math.floor(Math.random() * s.t2.followups.length);
      const fq = s.t2.followups[fi];
      out.t2.followup = fq;
      await speak(ui, `${id}/s2-f${fi + 1}`, fq);
      $(".lexis p", ui.body).innerHTML = `<b>Follow-up:</b> ${esc(fq)}`;
      out.t2.recs.push(await recordStep(ui, { label: `Follow-up: ${fq}`, seconds: 30, practice }));
      n++;
    }
    if (tasks.includes("t3")) {
      ui.progress(n, total); ui.showNext(false);
      const t3 = s.t3;
      ui.page(`<div class="lexis"><div class="avatar teacher">${esc((t3.partner || "P").replace(/^(your|a|the)\s+/i, "")[0].toUpperCase())}</div><div><h2>Task 3 · Interacting</h2>
        <p>${esc(t3.situation)}</p><p class="small">Listen, then you have <b>15 seconds</b> to think and <b>1 minute</b> to respond. Then you will hear new information and respond for <b>30 seconds</b>.</p></div></div>
        <div class="audio-box" id="rec"></div><div class="instructions" id="t3info"></div>`);
      await speak(ui, `${id}/s3-partner`, t3.partnerLine, "male", "P");
      $("#t3info", ui.body).innerHTML = `<b>${esc(t3.partner)}:</b> “${esc(t3.partnerLine)}”`;
      await prep(ui, 15, "Think about your answer");
      out.t3 = { recs: [] };
      out.t3.recs.push(await recordStep(ui, { label: "Response (1 min)", seconds: 60, practice }));
      await speak(ui, `${id}/s3-new`, t3.newInfo, "male", "P");
      $("#t3info", ui.body).innerHTML = `<b>New information — ${esc(t3.partner)}:</b> “${esc(t3.newInfo)}”<div style="margin-top:6px"><b>${esc(t3.newTask || "Respond to the new information.")}</b></div>`;
      out.t3.recs.push(await recordStep(ui, { label: "Reaction to new information (30 s)", seconds: 30, practice }));
      n++;
    }
    if (tasks.includes("t4")) {
      ui.progress(n, total); ui.showNext(false);
      const t4 = s.t4;
      ui.page(`<div class="lexis"><div class="avatar">L</div><div><h2>Task 4 · Summarising a talk or conversation</h2>
        <p>${esc(t4.instructions)}</p><p class="small">Take notes while you listen. Then <b>30 seconds</b> to plan, <b>1 minute</b> to summarise and give your opinion, and <b>1 minute</b> for a follow-up question.</p></div></div>
        <div class="split"><div class="panel"><div class="audio-box" id="rec"></div></div>
        <div class="panel"><div class="platform">📝 Notepad</div><textarea class="notepad" placeholder="Click here to take notes"></textarea></div></div>`);
      const box = $("#rec", ui.body);
      box.innerHTML = `<span class="status">▶ Playing conversation: ${esc(t4.title)}</span><div class="bar"><i id="t4b"></i></div>`;
      await ui.guard(play(`${id}/s4`, t4.script, t4.speakers, (x) => { const b = $("#t4b", ui.body); if (b) b.style.width = `${x * 100}%`; }));
      await prep(ui, 30, "Plan your summary");
      out.t4 = { recs: [] };
      out.t4.recs.push(await recordStep(ui, { label: "Summary + opinion (1 min)", seconds: 60, practice }));
      await speak(ui, `${id}/s4-f`, t4.followup);
      $(".lexis p", ui.body).innerHTML = `<b>Follow-up:</b> ${esc(t4.followup)}`;
      out.t4.recs.push(await recordStep(ui, { label: `Follow-up: ${t4.followup}`, seconds: 60, practice }));
      n++;
    }
  } catch (e) { stopAudio(); if (!(e instanceof TimeUp)) throw e; }
  ui.progress(total, total);
  return out;
}

export function speakingContext(exam, which, out) {
  const s = exam.speaking;
  const base = { note: "Response is a speech-to-text transcript of timed recordings." };
  if (which === "t1") return { ...base, task: "Responding to questions", timing: "3 questions, 30 seconds each", questions: s.t1.questions };
  if (which === "t2") return { ...base, task: "Delivering a prepared talk", timing: "2-minute talk on a topic chosen and prepared by the candidate + 1 follow-up question, 30 seconds", topic: out?.topic, followup: out?.followup };
  if (which === "t3") return { ...base, task: "Interacting", timing: "listen, 15 s to think, 1 minute response; then new information and 30 seconds response", partner: s.t3.partner, situation: s.t3.situation, partnerLine: s.t3.partnerLine, newInfo: s.t3.newInfo, newTask: s.t3.newTask };
  return { ...base, task: "Summarising a talk or conversation", timing: "listen with notes, 30 s to plan, 1 minute summary + opinion, 1 minute follow-up", instructions: s.t4.instructions, conversationScript: s.t4.script, followup: s.t4.followup };
}
