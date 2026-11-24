# English C1 Suite

Suite web estática para preparar las certificaciones **Aptis ESOL General (banda C / C1)** y **Trinity ISE Digital (ISE III / C1)** directamente en el navegador, sin registro ni servidores externos.

> Disponible en línea en [ismael-sallami.github.io/english-c1-suite](https://ismael-sallami.github.io/english-c1-suite/) y enlazada desde la sección de herramientas de [Recursos GIIADE](https://elblogdeismael.github.io/tools/).

## Contenido

- **Simulador Trinity ISE Digital C1** (`site/ise-digital/`): 5 exámenes completos originales de la ruta C1–C2 (Levelling, Speaking, Listening, Reading y Writing) con la interfaz, los tiempos y la navegación solo hacia delante del examen real; práctica por módulo o tarea suelta; módulo extra de **gramática C1** (18 temas, 180 ejercicios, repaso de fallos) e historial con evolución por destreza. En local, **Writing y Speaking los corrige Antigravity (Gemini Hydrogen)** con las *rating scales* oficiales de Trinity y el Speaking se transcribe con Whisper.
- **Simulador Aptis ESOL General C1** (`site/aptis/`): prueba completa de las 5 destrezas (`Grammar & Vocab`, `Reading`, `Listening` con Web Speech API y límite de 2 reproducciones, `Writing` con analizador C1 y `Speaking` con prompts visuales), modo examen cronometrado, flashcards 3D, speed quiz y modal de chuleta C1.
- **Biblioteca de Writings · Trinity ISE Digital** (`site/writing-library/`): colección interactiva de respuestas oficiales puntuadas por Trinity y modelos C1 anotados (`Foro`, `Email`, `Chat`, `Essay`, `Report`) con traducción frase a frase, banco de expresiones reutilizables y comparador entre bandas.
- **Chuleta de Writing C1 · Trinity ISE Digital** (`site/writing-cheatsheet/`): hoja esquemática maquetada para impresión en A4 (más su PDF listo para descargar) con esqueletos, inversiones, cleft sentences, conectores, errores típicos de hispanohablantes y checklist final.
- **Guías y Banco C1** (`site/guides/`): visor de apuntes en Markdown con estructura táctica de Aptis C1, banco de preguntas reales y guion editable para el *Topic Task* de Trinity.

## Estructura del repositorio

```text
site/
├── index.html                  # Portada unificada de la suite
├── aptis/                      # Simulador Aptis ESOL General C1 + imágenes optimizadas
├── writing-library/            # Biblioteca de Writings Trinity ISE Digital
├── writing-cheatsheet/         # Chuleta imprimible en HTML y PDF
└── guides/                     # Lector Markdown + guías de estudio
tests/
└── check-site.mjs              # Verificación offline de enlaces y activos
```

## Verificación local

```bash
node tests/check-site.mjs
python3 -m http.server 8080 -d site
```

## Simulador ISE Digital en local (corrección con IA)

```bash
./start.sh          # abre http://127.0.0.1:8765/ise-digital/
```

- `server/server.py`: sirve `site/` y expone `/api/grade` (lanza `agy -p --model gemini-4-hydrogen-high --json-schema` con la rúbrica oficial de Trinity en `server/rubrics/`, que no se sube al repo: copia ahí los PDFs de rating scales convertidos con `pdftotext -layout`), `/api/transcribe` (faster-whisper) y `/api/history`.
- `server/gen_audio.py`: regenera los audios de Listening/Speaking con Kokoro (TTS local). Los MP3 ya van en `site/ise-digital/audio/`.
- Todo corre con límites de CPU/RAM (2 núcleos, 3 GB) para no congelar el equipo.
- En GitHub Pages el simulador funciona igual salvo la corrección de Writing/Speaking, que avisa de que requiere el servidor local.
- Formato del contenido: `docs/DATA_SCHEMA.md`.
