#!/usr/bin/env python3
"""
Genera los audios del simulador ISE Digital con Kokoro (TTS local, gratis) y escribe
site/ise-digital/audio/manifest.json. Idempotente: no regenera clips que ya existen.

Uso: server/.venv/bin/python server/gen_audio.py [--force] [exam-1 exam-2 ...]

@author Ismael Sallami Moreno
"""

from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import os

# Límite de recursos: el portátil se congela si torch usa todos los núcleos.
os.environ.setdefault("OMP_NUM_THREADS", "2")
os.environ.setdefault("MKL_NUM_THREADS", "2")
os.environ.setdefault("CUDA_VISIBLE_DEVICES", "")  # GPU de 4 GB compartida con el escritorio: CPU por defecto

import numpy as np
import soundfile as sf
import torch
from kokoro import KPipeline

torch.set_num_threads(int(os.environ.get("ISE_THREADS", "2")))

ROOT = Path(__file__).resolve().parent.parent
EXAMS = ROOT / "site/ise-digital/data/exams"
OUT = ROOT / "site/ise-digital/audio"
SR = 24000

# Voces Kokoro: prefijo b = británico, a = americano. Mezcla de acentos como en el examen.
FEMALE = ["bf_emma", "af_heart", "bf_isabella", "af_bella", "bf_alice", "af_nicole", "bf_lily", "af_sarah"]
MALE = ["bm_george", "am_michael", "bm_lewis", "am_adam", "bm_daniel", "am_fenrir", "bm_fable", "am_puck"]
LEXIS = "bf_emma"
PARTNER = "bm_lewis"

_pipes: dict[str, KPipeline] = {}


def pipe(voice: str) -> KPipeline:
    code = voice[0]
    if code not in _pipes:
        _pipes[code] = KPipeline(lang_code=code, repo_id="hexgrad/Kokoro-82M")
    return _pipes[code]


def synth(text: str, voice: str, speed: float = 1.0) -> np.ndarray:
    chunks = [r.audio.numpy() if hasattr(r.audio, "numpy") else np.asarray(r.audio)
              for r in pipe(voice)(text, voice=voice, speed=speed) if r.audio is not None]
    return np.concatenate(chunks) if chunks else np.zeros(1, dtype=np.float32)


def pick_voices(speakers: list[dict], seed: str) -> dict[str, str]:
    """Voz estable por hablante (mismo examen → mismas voces), sin repetir dentro del clip."""
    off = int(hashlib.md5(seed.encode()).hexdigest(), 16)
    used: set[str] = set()
    out = {}
    for i, s in enumerate(speakers):
        pool = FEMALE if s.get("voice") == "female" else MALE
        k = (off + i * 3) % len(pool)
        while pool[k] in used:
            k = (k + 1) % len(pool)
        used.add(pool[k])
        out[s["name"]] = pool[k]
    return out


def dialogue(script: list[dict], speakers: list[dict], seed: str) -> np.ndarray:
    voices = pick_voices(speakers, seed)
    gap = np.zeros(int(SR * 0.45), dtype=np.float32)
    parts = [np.zeros(int(SR * 0.6), dtype=np.float32)]
    for line in script:
        v = voices.get(line["speaker"]) or (FEMALE[0])
        parts += [synth(line["text"], v), gap]
    return np.concatenate(parts)


def single(text: str, voice: str) -> np.ndarray:
    return np.concatenate([np.zeros(int(SR * 0.3), dtype=np.float32), synth(text, voice), np.zeros(int(SR * 0.3), dtype=np.float32)])


def to_mp3(audio: np.ndarray, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        sf.write(tmp.name, audio.astype(np.float32), SR)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp.name, "-ac", "1", "-b:a", "56k", str(dest)], check=True)


def clips_for(exam: dict):
    eid = exam["id"]
    for i, t in enumerate(exam["listening"], 1):
        yield f"listening-{i}", lambda t=t, i=i: dialogue(t["script"], t["speakers"], f"{eid}-L{i}")
    sp = exam["speaking"]
    for i, q in enumerate(sp["t1"]["questions"], 1):
        yield f"s1-q{i}", lambda q=q: single(q, LEXIS)
    for i, q in enumerate(sp["t2"]["followups"], 1):
        yield f"s2-f{i}", lambda q=q: single(q, LEXIS)
    yield "s3-partner", lambda: single(sp["t3"]["partnerLine"], PARTNER)
    yield "s3-new", lambda: single(sp["t3"]["newInfo"], PARTNER)
    yield "s4", lambda: dialogue(sp["t4"]["script"], sp["t4"]["speakers"], f"{eid}-S4")
    yield "s4-f", lambda: single(sp["t4"]["followup"], LEXIS)


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    force = "--force" in sys.argv
    files = sorted(EXAMS.glob("exam-*.json"))
    if args:
        files = [f for f in files if f.stem in args]
    manifest_path = OUT / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    for f in files:
        exam = json.loads(f.read_text())
        eid = exam["id"]
        for key, make in clips_for(exam):
            rel = f"{eid}/{key}.mp3"
            dest = OUT / rel
            if dest.exists() and not force:
                manifest[f"{eid}/{key}"] = rel
                continue
            print(f"[tts] {rel}", flush=True)
            to_mp3(make(), dest)
            manifest[f"{eid}/{key}"] = rel
            manifest_path.write_text(json.dumps(manifest, indent=1, sort_keys=True))
    manifest_path.write_text(json.dumps(manifest, indent=1, sort_keys=True))
    print(f"OK · {len(manifest)} clips en {OUT}")


if __name__ == "__main__":
    main()
