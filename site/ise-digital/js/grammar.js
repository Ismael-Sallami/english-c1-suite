// Módulo extra de gramática C1: teoría, ejercicios con corrección inmediata y repaso de fallos.

import { $, $$, esc, mdLite, store, shuffle, loadGrammar, saveAttempt } from "./util.js";

const norm = (s) => String(s || "").toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
const expand = (s) => norm(s)
  .replace(/\bwon't\b/g, "will not").replace(/\bcan't\b/g, "cannot").replace(/\bshan't\b/g, "shall not")
  .replace(/n't\b/g, " not").replace(/'re\b/g, " are").replace(/'ve\b/g, " have").replace(/'ll\b/g, " will").replace(/'d\b/g, " would").replace(/'m\b/g, " am");

export function checkAnswer(ex, value) {
  if (ex.type === "mc") return Number(value) === ex.answer;
  const v = expand(value);
  return (ex.answers || []).some((a) => expand(a) === v);
}

// progreso: { [topicId]: { [exIndex]: true|false } }
const getProg = () => store.get("grammar", {});
function setResult(topicId, i, ok) {
  const p = getProg();
  p[topicId] = p[topicId] || {};
  p[topicId][i] = ok;
  store.set("grammar", p);
  const mistakes = new Set(store.get("grammarMistakes", []));
  const key = `${topicId}#${i}`;
  ok ? mistakes.delete(key) : mistakes.add(key);
  store.set("grammarMistakes", [...mistakes]);
}

function topicStats(t) {
  const p = getProg()[t.id] || {};
  const done = Object.keys(p).length, ok = Object.values(p).filter(Boolean).length;
  return { done, ok, total: t.exercises.length };
}

export async function grammarHome() {
  const g = await loadGrammar();
  const mistakes = store.get("grammarMistakes", []);
  $("#app").innerHTML = `<div class="wrap">
    <div class="topbar"><a class="brand" href="#/"><span class="brand-mark">ISE</span>Gramática C1</a>
      <div class="top-actions"><a class="btn small ghost" href="#/">Inicio</a></div></div>
    <div class="hero"><h1>Repaso de gramática C1</h1><p>${g.topics.length} temas con la teoría justa y ${g.topics.reduce((n, t) => n + t.exercises.length, 0)} ejercicios: opción múltiple, huecos y <i>key word transformations</i>. Lo que falles va a tu lista de repaso.</p>
      <div class="row" style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
        <a class="btn primary" href="#/grammar/mix">Test mixto (20 al azar)</a>
        <a class="btn ${mistakes.length ? "" : "ghost"}" href="#/grammar/review">Repasar fallos (${mistakes.length})</a>
      </div></div>
    <div class="topic-grid">${g.topics.map((t, i) => {
      const s = topicStats(t);
      return `<a class="topic" href="#/grammar/${esc(t.id)}"><div class="card flat"><div class="small muted">${String(i + 1).padStart(2, "0")} · ${esc(t.level || "C1")}</div>
        <h3>${esc(t.title)}</h3><div class="small muted">${esc(t.summary || "")}</div>
        <div class="meter"><i style="width:${(s.ok / s.total) * 100}%"></i></div><div class="small muted" style="margin-top:4px">${s.ok}/${s.total} correctos${s.done > s.ok ? ` · ${s.done - s.ok} fallos` : ""}</div></div></a>`;
    }).join("")}</div></div>`;
}

function exerciseHTML(ex, n, label = "") {
  let body;
  if (ex.type === "mc") {
    body = ex.options.map((o, i) => `<button type="button" class="opt" data-i="${i}"><span class="radio"></span><span>${esc(o)}</span></button>`).join("");
  } else if (ex.type === "transform") {
    body = `<div class="small muted" style="margin-bottom:6px">Usa la palabra <span class="kw">${esc(ex.keyword || "")}</span> sin cambiarla${ex.start ? ` · empieza por “${esc(ex.start)}…”` : ""}.</div>
      <input class="ex-input" autocomplete="off" spellcheck="false" value="${esc(ex.start ? ex.start + " " : "")}"><button class="btn small" style="margin-top:8px" data-check>Comprobar</button>`;
  } else {
    body = `<input class="ex-input" autocomplete="off" spellcheck="false" placeholder="Escribe la respuesta del hueco"><button class="btn small" style="margin-top:8px" data-check>Comprobar</button>`;
  }
  return `<div class="card flat q" data-ex="${n}">${label ? `<div class="small muted">${esc(label)}</div>` : ""}<div class="q-title"><span class="n">${n + 1}.</span>${esc(ex.prompt)}</div>${body}<div class="fb"></div></div>`;
}

function bindExercise(el, ex, onResult) {
  const fb = $(".fb", el);
  const show = (ok, given) => {
    const right = ex.type === "mc" ? ex.options[ex.answer] : (ex.answers || [])[0];
    fb.innerHTML = `<div class="explain" style="margin-top:10px;border-left-color:${ok ? "var(--ok)" : "var(--bad)"}"><b>${ok ? "✓ Correcto" : "✗ Incorrecto"}</b>${ok ? "" : ` · Respuesta: <b>${esc(right)}</b>`}${ex.type !== "mc" && (ex.answers || []).length > 1 ? `<div class="small muted">También vale: ${ex.answers.slice(1).map(esc).join(" · ")}</div>` : ""}<div>${esc(ex.explanation || "")}</div></div>`;
    onResult(ok, given);
  };
  if (ex.type === "mc") {
    $$(".opt", el).forEach((o) => o.addEventListener("click", () => {
      if (el.dataset.done) return;
      el.dataset.done = 1;
      const ok = checkAnswer(ex, o.dataset.i);
      o.classList.add(ok ? "correct" : "wrong");
      if (!ok) $$(".opt", el)[ex.answer].classList.add("correct");
      $$(".opt", el).forEach((x) => (x.disabled = true));
      show(ok, o.dataset.i);
    }));
  } else {
    const inp = $("input", el), btn = $("[data-check]", el);
    const go = () => {
      if (el.dataset.done || !inp.value.trim()) return;
      el.dataset.done = 1;
      const ok = checkAnswer(ex, inp.value);
      inp.classList.add(ok ? "ok" : "ko"); inp.disabled = true; btn.disabled = true;
      show(ok, inp.value);
    };
    btn.onclick = go;
    inp.addEventListener("keydown", (e) => e.key === "Enter" && go());
  }
}

export async function grammarTopic(id) {
  const g = await loadGrammar();
  const t = g.topics.find((x) => x.id === id);
  if (!t) { location.hash = "#/grammar"; return; }
  const idx = g.topics.indexOf(t);
  const nextT = g.topics[idx + 1];
  $("#app").innerHTML = `<div class="wrap stack">
    <div class="topbar"><a class="brand" href="#/grammar"><span class="brand-mark">ISE</span>Gramática C1</a>
      <div class="top-actions"><a class="btn small ghost" href="#/grammar">Temas</a>${nextT ? `<a class="btn small" href="#/grammar/${esc(nextT.id)}">Siguiente tema ›</a>` : ""}</div></div>
    <h1>${esc(t.title)}</h1>
    <section class="card flat theory">${mdLite(t.theory)}
      ${t.examples?.length ? `<h4>Ejemplos</h4><ul>${t.examples.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : ""}
      ${t.commonMistakes?.length ? `<h4>Errores típicos</h4><ul>${t.commonMistakes.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>` : ""}</section>
    <h2>Ejercicios <span class="small muted" id="score"></span></h2>
    <div class="stack" id="exs">${t.exercises.map((ex, i) => exerciseHTML(ex, i)).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="redo">Repetir tema</button>${nextT ? `<a class="btn primary" href="#/grammar/${esc(nextT.id)}">Siguiente: ${esc(nextT.title)} ›</a>` : ""}</div>
  </div>`;
  let ok = 0, done = 0;
  const score = $("#score");
  $$("[data-ex]").forEach((el) => bindExercise(el, t.exercises[Number(el.dataset.ex)], (good) => {
    done++; if (good) ok++;
    setResult(t.id, Number(el.dataset.ex), good);
    score.textContent = `${ok}/${done}`;
    if (done === t.exercises.length) saveAttempt({ kind: "grammar", topic: t.id, title: t.title, correct: ok, total: done });
  }));
  $("#redo").onclick = () => grammarTopic(id);
  window.scrollTo(0, 0);
}

/** Test mixto o repaso de fallos. */
export async function grammarQuiz(mode) {
  const g = await loadGrammar();
  let items = [];
  if (mode === "review") {
    for (const key of store.get("grammarMistakes", [])) {
      const [tid, i] = key.split("#");
      const t = g.topics.find((x) => x.id === tid);
      if (t?.exercises[i]) items.push({ t, i: Number(i), ex: t.exercises[i] });
    }
  } else {
    for (const t of g.topics) t.exercises.forEach((ex, i) => items.push({ t, i, ex }));
    items = shuffle(items).slice(0, 20);
  }
  const title = mode === "review" ? "Repaso de fallos" : "Test mixto";
  $("#app").innerHTML = `<div class="wrap stack">
    <div class="topbar"><a class="brand" href="#/grammar"><span class="brand-mark">ISE</span>Gramática C1</a><div class="top-actions"><a class="btn small ghost" href="#/grammar">Temas</a></div></div>
    <h1>${title} <span class="small muted" id="score"></span></h1>
    ${items.length ? `<div class="stack">${items.map((it, n) => exerciseHTML(it.ex, n, it.t.title)).join("")}</div>
      <div style="display:flex;gap:8px"><button class="btn primary" id="again">${mode === "review" ? "Volver a repasar" : "Otro test"}</button></div>`
      : `<div class="notice info">No tienes fallos pendientes. Haz algún tema o un test mixto.</div>`}
  </div>`;
  let ok = 0, done = 0;
  $$("[data-ex]").forEach((el) => {
    const it = items[Number(el.dataset.ex)];
    bindExercise(el, it.ex, (good) => {
      done++; if (good) ok++;
      setResult(it.t.id, it.i, good);
      $("#score").textContent = `${ok}/${done}`;
      if (done === items.length) saveAttempt({ kind: "grammar", topic: mode, title, correct: ok, total: done });
    });
  });
  $("#again")?.addEventListener("click", () => grammarQuiz(mode));
  window.scrollTo(0, 0);
}
