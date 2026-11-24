#!/usr/bin/env bash
# Arranca el simulador ISE Digital en local (con corrección de Antigravity y Whisper).
# Uso: ./start.sh            → http://127.0.0.1:8765/ise-digital/
#      ISE_PORT=9000 ./start.sh
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -x server/.venv/bin/python ]]; then
  echo "Creando entorno Python (faster-whisper + kokoro)…"
  python3 -m venv server/.venv
  server/.venv/bin/pip install -q --upgrade pip
  server/.venv/bin/pip install -q faster-whisper kokoro soundfile
fi

# Límites para no congelar el portátil: máx. 2 núcleos, 3 GB de RAM, prioridad baja.
LIMIT=(nice -n 10 env OMP_NUM_THREADS=2 MKL_NUM_THREADS=2)
if command -v systemd-run >/dev/null; then
  LIMIT=(systemd-run --user --scope --quiet -p CPUQuota=200% -p MemoryMax=3G "${LIMIT[@]}")
fi

PORT="${ISE_PORT:-8765}"
URL="http://127.0.0.1:${PORT}/ise-digital/"
( sleep 1.5; xdg-open "$URL" >/dev/null 2>&1 || true ) &
exec "${LIMIT[@]}" server/.venv/bin/python server/server.py --port "$PORT"
