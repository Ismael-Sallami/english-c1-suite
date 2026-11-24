#!/usr/bin/env python3
"""
Servidor local del simulador Trinity ISE Digital.

- Sirve la carpeta `site/` (la misma que se publica en GitHub Pages).
- POST /api/grade       -> lanza una corrección con Antigravity (agy, Gemini Hydrogen) y devuelve un jobId.
- GET  /api/job/<id>    -> estado y resultado de la corrección.
- POST /api/transcribe  -> transcribe audio de Speaking con faster-whisper (GPU si hay, si no CPU).
- GET/POST /api/history -> historial de intentos en server/data/history.jsonl.
- GET  /api/health      -> qué piezas locales están disponibles.

Uso: ./start.sh   (o: server/.venv/bin/python server/server.py --port 8765)

@author Ismael Sallami Moreno
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import uuid
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
SERVER_DIR = ROOT / "server"
RUBRICS = SERVER_DIR / "rubrics"
DATA_DIR = SERVER_DIR / "data"
HISTORY = DATA_DIR / "history.jsonl"
JOBS_DIR = DATA_DIR / "jobs"

MODEL = os.environ.get("ISE_GRADER_MODEL", "gemini-4-hydrogen-high")
AGY = os.environ.get("AGY_BIN") or shutil.which("agy") or str(Path.home() / ".local/bin/agy")
GRADE_TIMEOUT = int(os.environ.get("ISE_GRADE_TIMEOUT", "600"))
WHISPER_MODEL = os.environ.get("ISE_WHISPER_MODEL", "small.en")
WHISPER_DEVICE = os.environ.get("ISE_WHISPER_DEVICE", "cpu")  # "cuda" solo si hay CUDA 12 y VRAM libre

# Rúbrica oficial completa (single-column, Trinity 2025) por tarea.
TASK_RUBRIC = {
    "writing-t1": "Rating_scale_Written_online_communication.txt",
    "writing-t2": "Rating_scale_Writing_from_sources.txt",
    "speaking-t1": "Rating_scale_Speaking_Responding_Talk_Interacting.txt",
    "speaking-t2": "Rating_scale_Speaking_Responding_Talk_Interacting.txt",
    "speaking-t3": "Rating_scale_Speaking_Responding_Talk_Interacting.txt",
    "speaking-t4": "Rating_scale_Speaking_Summarising.txt",
}

TASK_NAMES = {
    "writing-t1": "Writing Task 1 — Written online communication",
    "writing-t2": "Writing Task 2 — Writing from sources",
    "speaking-t1": "Speaking Task 1 — Responding to questions",
    "speaking-t2": "Speaking Task 2 — Delivering a prepared talk",
    "speaking-t3": "Speaking Task 3 — Interacting",
    "speaking-t4": "Speaking Task 4 — Summarising a talk or conversation",
}

GRADE_SCHEMA = {
    "type": "object",
    "required": ["criteria", "overallCefr", "estimatedScore", "summary", "strengths",
                 "improvements", "errors", "improvedVersion"],
    "properties": {
        "criteria": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["name", "band", "maxBand", "justification"],
                "properties": {
                    "name": {"type": "string"},
                    "band": {"type": "number"},
                    "maxBand": {"type": "number"},
                    "justification": {"type": "string"},
                },
            },
        },
        "overallCefr": {"type": "string"},
        "estimatedScore": {"type": "number"},
        "summary": {"type": "string"},
        "strengths": {"type": "array", "items": {"type": "string"}},
        "improvements": {"type": "array", "items": {"type": "string"}},
        "errors": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["original", "correction", "type", "explanation"],
                "properties": {
                    "original": {"type": "string"},
                    "correction": {"type": "string"},
                    "type": {"type": "string"},
                    "explanation": {"type": "string"},
                },
            },
        },
        "usefulExpressions": {"type": "array", "items": {"type": "string"}},
        "improvedVersion": {"type": "string"},
    },
}

JOBS: dict[str, dict] = {}
JOBS_LOCK = threading.Lock()
_WHISPER = None
_WHISPER_LOCK = threading.Lock()


# --------------------------------------------------------------------------- grading


def build_prompt(task: str) -> str:
    """Instrucciones para el examinador. Los datos van en ficheros del directorio de trabajo."""
    name = TASK_NAMES[task]
    speaking = task.startswith("speaking")
    medium = (
        "The candidate's answer is an automatic speech-to-text TRANSCRIPT of a timed recording "
        "(times and durations are in task.json). Ignore punctuation/capitalisation and obvious "
        "transcription artefacts. You cannot hear pronunciation: assess the Delivery criterion only from "
        "fluency evidence in the transcript (fillers, false starts, length relative to the time allowed) "
        "and say so in its justification."
        if speaking else
        "The candidate typed the answer under exam conditions (time limit and word limits in task.json)."
    )
    return f"""You are a senior, strict, trained Trinity College London ISE Digital examiner.
Mark one candidate response for: {name}. The candidate is aiming for CEFR C1.

Files in the current directory (read ALL of them before marking):
- rubric.txt  : the OFFICIAL Trinity rating scale for this task (criteria, bands, FAQs). Apply it exactly,
                best-fit, analytic (one band per category), same band numbering as the rubric.
- task.json   : the task exactly as shown to the candidate (instructions, prompts, source texts, timings).
- response.txt: the candidate's response.

{medium}

Rules:
- Use exactly the categories of the official scale (e.g. Content / Language / Style, or Content and organisation /
  Use of sources / Language / Style, or Task fulfilment / Language / Delivery, or Task fulfilment / Mediation of source
  text / Delivery). maxBand = top band of that scale.
- Respect word limits: in Writing, text beyond the maximum word count is ignored by real examiners; copied
  chunks from sources get no credit.
- Be honest and demanding: do not inflate. A C1 pass on the 0–150 module scale starts at 105
  (C2 130, B2 80, B1 55). estimatedScore = your best estimate of the candidate's 0–150 scaled score
  for this task's performance; overallCefr one of A2, B1, B2, C1, C2 (you may add +/-).
- errors: list EVERY language error you find (grammar, vocabulary, collocation, spelling, register, cohesion),
  quoting the exact original fragment, the correction, a short type label, and a brief explanation IN SPANISH.
- summary, strengths, improvements and justifications: write them IN SPANISH, concrete, referring to the rubric
  descriptors. improvements must be actionable for next time (what exactly to add/change).
- usefulExpressions: 5–8 C1-level English phrases the candidate could have used for this exact task.
- improvedVersion: rewrite the candidate's response at solid C1/C2 level, in English, keeping their ideas and
  respecting the task's word limit (for speaking: what an excellent spoken answer of the same length would be).

Output ONLY the JSON object required by the schema. No markdown, no commentary."""


def extract_json(text: str):
    """Saca el primer objeto JSON de una cadena (agy puede envolverlo en texto o ```json)."""
    if not text:
        return None
    text = text.strip()
    try:
        return json.loads(text)
    except Exception:
        pass
    m = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.S)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end > start:
        try:
            return json.loads(text[start:end + 1])
        except Exception:
            return None
    return None


def run_grade(job_id: str, payload: dict) -> None:
    task = payload["task"]
    job_dir = JOBS_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy(RUBRICS / TASK_RUBRIC[task], job_dir / "rubric.txt")
    (job_dir / "task.json").write_text(json.dumps(payload.get("context", {}), ensure_ascii=False, indent=2))
    (job_dir / "response.txt").write_text(payload.get("response", ""))
    schema_path = job_dir / "schema.json"
    schema_path.write_text(json.dumps(GRADE_SCHEMA))

    cmd = [AGY, "--model", MODEL, "--output-format", "json", "--json-schema", str(schema_path),
           "--print-timeout", f"{GRADE_TIMEOUT}s", "--sandbox", "--mode", "plan",
           "-p", build_prompt(task)]
    t0 = time.time()
    try:
        proc = subprocess.run(cmd, cwd=job_dir, capture_output=True, text=True, timeout=GRADE_TIMEOUT + 60)
        (job_dir / "out.json").write_text(proc.stdout)
        (job_dir / "stderr.log").write_text(proc.stderr)
        result = None
        outer = extract_json(proc.stdout)
        if isinstance(outer, dict):
            for key in ("structured_output", "result", "response", "output"):
                val = outer.get(key)
                if isinstance(val, dict) and "criteria" in val:
                    result = val
                    break
                if isinstance(val, str):
                    result = extract_json(val)
                    if isinstance(result, dict) and "criteria" in result:
                        break
                    result = None
            if result is None and "criteria" in outer:
                result = outer
        if not isinstance(result, dict) or "criteria" not in result:
            err = (proc.stderr or "").strip()[-600:] or (proc.stdout or "").strip()[-600:]
            if "quota" in err.lower() or "RESOURCE_EXHAUSTED" in err:
                m = re.search(r"Resets in ([0-9hms ]+)", err)
                raise RuntimeError("Cuota de Antigravity agotada" + (f": se renueva en {m.group(1).strip()}." if m else ".")
                                   + " Tu respuesta está guardada: pulsa «Reintentar corrección» cuando se renueve.")
            raise RuntimeError(f"agy no devolvió una corrección válida (rc={proc.returncode}). {err}")
        elapsed = round(time.time() - t0, 1)
        update_job(job_id, status="done", result=result, elapsed=elapsed, model=MODEL)
    except subprocess.TimeoutExpired:
        update_job(job_id, status="error", error=f"agy tardó más de {GRADE_TIMEOUT}s")
    except Exception as exc:  # noqa: BLE001
        update_job(job_id, status="error", error=str(exc))


def update_job(job_id: str, **fields) -> None:
    with JOBS_LOCK:
        JOBS[job_id].update(fields)
        JOBS[job_id]["updated"] = time.time()
    (JOBS_DIR / job_id / "job.json").write_text(json.dumps(JOBS[job_id], ensure_ascii=False, indent=2))


# --------------------------------------------------------------------------- whisper


def get_whisper():
    global _WHISPER
    with _WHISPER_LOCK:
        if _WHISPER is None:
            from faster_whisper import WhisperModel  # type: ignore
            threads = int(os.environ.get("ISE_THREADS", "2"))  # nunca todos los núcleos
            if WHISPER_DEVICE == "cuda":
                try:
                    _WHISPER = WhisperModel(WHISPER_MODEL, device="cuda", compute_type="int8_float16")
                except Exception:
                    _WHISPER = None
            if _WHISPER is None:
                _WHISPER = WhisperModel(WHISPER_MODEL if WHISPER_DEVICE == "cpu" else "small.en",
                                        device="cpu", compute_type="int8", cpu_threads=threads)
        return _WHISPER


def transcribe(data: bytes, suffix: str) -> dict:
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as f:
        f.write(data)
        path = f.name
    try:
        # Decodificar con ffmpeg (evita incompatibilidades de PyAV): 16 kHz mono float32.
        import numpy as np
        raw = subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-threads", "1", "-i", path,
                              "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                             capture_output=True, check=True).stdout
        audio = np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0
        model = get_whisper()
        segments, info = model.transcribe(audio, language="en", vad_filter=True, beam_size=5)
        text = " ".join(s.text.strip() for s in segments).strip()
        return {"text": text, "duration": round(info.duration, 1)}
    finally:
        os.unlink(path)


def whisper_available() -> bool:
    try:
        import faster_whisper  # noqa: F401
        return True
    except Exception:
        return False


# --------------------------------------------------------------------------- http


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE), **kwargs)

    def log_message(self, fmt, *args):  # menos ruido: solo API
        if "/api/" in (self.path or ""):
            sys.stderr.write("[api] " + (fmt % args) + "\n")

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _body(self) -> bytes:
        n = int(self.headers.get("Content-Length") or 0)
        return self.rfile.read(n) if n else b""

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.send_response(HTTPStatus.FOUND)
            self.send_header("Location", "/ise-digital/")
            self.end_headers()
            return
        if self.path == "/api/health":
            return self._json({
                "local": True,
                "agy": bool(AGY and Path(AGY).exists()),
                "model": MODEL,
                "whisper": whisper_available(),
            })
        if self.path.startswith("/api/job/"):
            job_id = self.path.rsplit("/", 1)[-1]
            with JOBS_LOCK:
                job = JOBS.get(job_id)
            return self._json(job or {"status": "unknown"}, 200 if job else 404)
        if self.path == "/api/history":
            items = []
            if HISTORY.exists():
                for line in HISTORY.read_text().splitlines():
                    try:
                        items.append(json.loads(line))
                    except Exception:
                        pass
            return self._json(items)
        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/grade":
            try:
                payload = json.loads(self._body())
            except Exception:
                return self._json({"error": "JSON inválido"}, 400)
            if payload.get("task") not in TASK_RUBRIC:
                return self._json({"error": "task desconocida"}, 400)
            if not (payload.get("response") or "").strip():
                return self._json({"error": "respuesta vacía"}, 400)
            job_id = time.strftime("%Y%m%d-%H%M%S-") + uuid.uuid4().hex[:6]
            with JOBS_LOCK:
                JOBS[job_id] = {"id": job_id, "status": "running", "task": payload["task"],
                                "started": time.time()}
            threading.Thread(target=run_grade, args=(job_id, payload), daemon=True).start()
            return self._json({"jobId": job_id})
        if self.path == "/api/transcribe":
            ctype = self.headers.get("Content-Type", "audio/webm")
            suffix = ".ogg" if "ogg" in ctype else ".wav" if "wav" in ctype else ".webm"
            try:
                return self._json(transcribe(self._body(), suffix))
            except Exception as exc:  # noqa: BLE001
                return self._json({"error": f"Whisper falló: {exc}"}, 500)
        if self.path == "/api/history":
            try:
                item = json.loads(self._body())
            except Exception:
                return self._json({"error": "JSON inválido"}, 400)
            item.setdefault("ts", time.strftime("%Y-%m-%dT%H:%M:%S"))
            DATA_DIR.mkdir(parents=True, exist_ok=True)
            with HISTORY.open("a") as f:
                f.write(json.dumps(item, ensure_ascii=False) + "\n")
            return self._json({"ok": True})
        return self._json({"error": "not found"}, 404)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=int(os.environ.get("ISE_PORT", "8765")))
    ap.add_argument("--host", default="127.0.0.1")
    args = ap.parse_args()
    JOBS_DIR.mkdir(parents=True, exist_ok=True)
    srv = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"ISE Digital simulator → http://{args.host}:{args.port}/ise-digital/  (grader: {MODEL})", flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
