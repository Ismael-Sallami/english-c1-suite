// Audio del simulador: reproducción (MP3 pregenerados con Kokoro o, si faltan, voz del navegador)
// y grabación de micrófono para Speaking.

import { getJSON } from "./util.js";

let manifest = null;
async function getManifest() {
  if (manifest) return manifest;
  try { manifest = await getJSON("audio/manifest.json"); } catch { manifest = {}; }
  return manifest;
}

let current = null; // { stop() }

export function stopAudio() {
  if (current) { try { current.stop(); } catch { /* nada */ } current = null; }
  try { window.speechSynthesis && speechSynthesis.cancel(); } catch { /* nada */ }
}

/**
 * Reproduce un clip. key = "exam-1/listening-1" etc. lines = [{speaker,text}], speakers = [{name,voice}].
 * onProgress(0..1). Resuelve al terminar.
 */
export async function play(key, lines, speakers = [], onProgress = () => {}) {
  stopAudio();
  const m = await getManifest();
  if (m[key]) return playFile(`audio/${m[key]}`, onProgress);
  return speakLines(lines, speakers, onProgress);
}

function playFile(src, onProgress) {
  return new Promise((resolve) => {
    const a = new Audio(src);
    let stopped = false;
    current = { stop() { stopped = true; a.pause(); resolve(); } };
    a.addEventListener("timeupdate", () => a.duration && onProgress(a.currentTime / a.duration));
    a.addEventListener("ended", () => { onProgress(1); if (!stopped) resolve(); });
    a.addEventListener("error", () => resolve());
    a.play().catch(() => {
      // Autoplay bloqueado: pedir un clic.
      const b = document.createElement("button");
      b.className = "next-btn"; b.textContent = "▶ Play audio";
      Object.assign(b.style, { position: "fixed", left: "50%", top: "45%", transform: "translateX(-50%)", zIndex: 300 });
      b.onclick = () => { b.remove(); a.play(); };
      document.body.appendChild(b);
    });
  });
}

// ---------------------------------------------------------------- Web Speech (respaldo)

function voices() {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) return resolve([]);
    const v = speechSynthesis.getVoices();
    if (v.length) return resolve(v);
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
    setTimeout(() => resolve(speechSynthesis.getVoices()), 1200);
  });
}

const FEMALE = /female|woman|zira|susan|hazel|libby|sonia|jenny|aria|samantha|karen|moira|tessa|serena|kate|fiona|victoria|google uk english female|google us english/i;
const MALE = /male|man|george|ryan|guy|daniel|david|mark|james|alex|fred|oliver|arthur|google uk english male/i;

async function voiceMap(speakers) {
  const all = (await voices()).filter((v) => /^en[-_]/i.test(v.lang));
  const fem = all.filter((v) => FEMALE.test(v.name) && !/\bmale\b/i.test(v.name.replace(/female/i, "")));
  const mal = all.filter((v) => MALE.test(v.name) && !/female/i.test(v.name));
  const map = {};
  let fi = 0, mi = 0;
  for (const s of speakers) {
    const pool = s.voice === "female" ? (fem.length ? fem : all) : (mal.length ? mal : all);
    const idx = s.voice === "female" ? fi++ : mi++;
    map[s.name] = { voice: pool[idx % Math.max(1, pool.length)], pitch: s.voice === "female" ? 1.1 : 0.85 };
  }
  return map;
}

async function speakLines(lines, speakers, onProgress) {
  if (!("speechSynthesis" in window) || !lines?.length) return;
  const map = await voiceMap(speakers.length ? speakers : [{ name: "_", voice: "female" }]);
  const total = lines.reduce((n, l) => n + l.text.length, 0) || 1;
  let done = 0, stopped = false;
  current = { stop() { stopped = true; speechSynthesis.cancel(); } };
  for (const line of lines) {
    if (stopped) break;
    await new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(line.text);
      const v = map[line.speaker] || Object.values(map)[0];
      if (v?.voice) { u.voice = v.voice; u.lang = v.voice.lang; } else u.lang = "en-GB";
      u.pitch = v?.pitch ?? 1; u.rate = 0.98;
      u.onend = u.onerror = () => resolve();
      speechSynthesis.speak(u);
    });
    done += line.text.length;
    onProgress(done / total);
  }
}

/** Frase suelta de la presentadora (Lexis) o de un interlocutor. */
export function say(key, text, voice = "female", onProgress) {
  return play(key, [{ speaker: "Lexis", text }], [{ name: "Lexis", voice }], onProgress);
}

// ---------------------------------------------------------------- grabación

let stream = null;
export async function micReady() {
  if (stream) return true;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    return true;
  } catch { return false; }
}

/** Graba `seconds` segundos. onTick(restante). Devuelve {blob, url, seconds}. Se puede cortar con .stop(). */
export function record(seconds, onTick = () => {}) {
  let stopFn;
  const promise = new Promise(async (resolve) => {
    const ok = await micReady();
    if (!ok) { resolve({ blob: null, url: null, seconds: 0, error: "mic" }); return; }
    const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"].find((t) => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || "";
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const t0 = performance.now();
    let timer;
    rec.onstop = () => {
      clearInterval(timer);
      const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
      resolve({ blob, url: URL.createObjectURL(blob), seconds: Math.round((performance.now() - t0) / 1000) });
    };
    rec.start();
    timer = setInterval(() => {
      const left = seconds - (performance.now() - t0) / 1000;
      onTick(Math.max(0, left));
      if (left <= 0 && rec.state === "recording") rec.stop();
    }, 200);
    stopFn = () => rec.state === "recording" && rec.stop();
  });
  promise.stop = () => stopFn && stopFn();
  return promise;
}

/** Cuenta atrás visual sin grabar (tiempo de preparación). */
export function countdown(seconds, onTick = () => {}) {
  let skip = false;
  const p = new Promise((resolve) => {
    const t0 = performance.now();
    const timer = setInterval(() => {
      const left = seconds - (performance.now() - t0) / 1000;
      onTick(Math.max(0, left));
      if (left <= 0 || skip) { clearInterval(timer); resolve(); }
    }, 200);
  });
  p.skip = () => { skip = true; };
  return p;
}
