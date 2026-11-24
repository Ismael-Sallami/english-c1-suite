# ISE Digital simulator — content schema

All content is original, modelled on the official ISE Digital C1–C2 route. Difficulty: **C1 minimum, some C2 items**.
Source of truth for format: `docs/booklet.txt`, `docs/ejemplo_c1c2.txt`,
`~/Descargas/ingles/TRINITY/examen_test_oficial_web/ANALISIS_ESTRUCTURA_ISE_DIGITAL.md`.

## Exam file: `site/ise-digital/data/exams/exam-N.json`

Plain JSON (UTF-8, no comments). Multiple-choice `answer` is the 0-based index of the correct option.
Options always 4, plausible distractors, correct answer position varied (not always the same index).

```json
{
  "id": "exam-1",
  "title": "Mock Exam 1",
  "theme": "short description of the topics used",

  "levelling": [
    { "type": "synonym",  "prompt": "meticulous", "options": ["careless","thorough","rapid","modest"], "answer": 1 },
    { "type": "complete", "prompt": "Hardly ___ the meeting started when the fire alarm went off.", "options": ["has","had","did","was"], "answer": 1 }
  ],

  "speaking": {
    "t1": { "questions": ["Q1?", "Q2?", "Q3?"] },
    "t2": { "followups": ["generic follow-up usable for any candidate topic?", "another?", "another?"] },
    "t3": {
      "partner": "your manager",
      "situation": "Context paragraph the candidate reads (what happened, who they talk to, what they must do).",
      "partnerLine": "What the partner says to open the conversation (spoken by TTS).",
      "newInfo": "New information the partner then gives (spoken by TTS), which the candidate must react to.",
      "newTask": "One-line instruction for the 30-second reaction."
    },
    "t4": {
      "title": "Topic of the conversation",
      "instructions": "Listen to two people talking about X. Summarise the main points: <guiding question 1> <guiding question 2>",
      "speakers": [ { "name": "Anna", "voice": "female" }, { "name": "Tom", "voice": "male" } ],
      "script": [ { "speaker": "Anna", "text": "..." } ],
      "followup": "Opinion follow-up question?"
    }
  },

  "listening": [
    {
      "type": "conversation",
      "title": "Short title",
      "context": "One sentence shown before audio: who is talking and where.",
      "plays": 2,
      "previewSeconds": 25,
      "speakers": [ { "name": "Mark", "voice": "male" }, { "name": "Julia", "voice": "female" } ],
      "script": [ { "speaker": "Mark", "text": "..." } ],
      "questions": [ { "q": "What does Mark think about ...?", "options": ["a","b","c","d"], "answer": 2, "explanation": "Short why, quoting the script." } ]
    }
  ],

  "reading": [
    {
      "type": "single",
      "title": "Text title",
      "genre": "article | blog | autobiography | review | report ...",
      "text": "Full text. Paragraphs separated by \n\n.",
      "questions": [ { "q": "...", "options": ["a","b","c","d"], "answer": 0, "explanation": "..." } ]
    },
    {
      "type": "paired",
      "title": "Shared topic",
      "textA": { "title": "...", "genre": "...", "text": "..." },
      "textB": { "title": "...", "genre": "...", "text": "..." },
      "questions": [ { "q": "...", "options": ["a","b","c","d"], "answer": 3, "explanation": "..." } ]
    }
  ],

  "writing": {
    "t1": {
      "version": "forum | email | chat",
      "platform": "e.g. 'Course discussion board — Module 4' / 'Email' / 'Group chat: Year 2 project team'",
      "instructions": "Official-style instructions incl. the two bullet points the answer must cover.",
      "bullets": ["bullet 1", "bullet 2"],
      "thread": [ { "author": "Name", "role": "optional", "text": "message" } ]
    },
    "t2": {
      "genre": "essay | report | review | article",
      "title": "Essay title / report brief",
      "instructions": "Official-style instructions: audience, purpose, what to cover. Must say: You MUST use ideas from the texts AND your own ideas. You MUST NOT copy from the texts.",
      "sources": [ { "label": "A", "title": "...", "type": "article | blog post | survey summary | interview ...", "text": "120–200 words" } ]
    }
  }
}
```

### Quantities per exam (C1–C2 route)
- `levelling`: 15 items (8 synonym, 7 complete), B2→C2 graded, mostly C1.
- `speaking.t1`: 3 questions (personal opinion, everyday-to-abstract).
- `speaking.t3`: 1 interacting scenario (formal or semi-formal, school/work).
- `speaking.t4`: script 1.5–2.5 min spoken (≈ 280–380 words), 2 speakers.
- `listening`: exactly 4 tasks in this order:
  1. `conversation` (informal, 2 speakers, ≈ 280–380 words, previewSeconds 25, plays 2) — 4 questions
  2. `discussion` (formal, 3 speakers, ≈ 450–550 words, previewSeconds 30, plays 2) — 6 questions
  3. `talk` (formal talk by one speaker ≈ 300 words, then a second person summarises/reacts ≈ 120 words, previewSeconds 30, plays 1) — 6 questions
  4. `talk` (same format, different topic) — 6 questions
- `reading`: exactly 4 tasks: 2 × `single` (300–400 words, 4 questions each), 2 × `paired` (textA+textB total 550–750 words, 5 questions each).
  Question types to mix: purpose of text/paragraph, detail, inference of attitude, function of a word/phrase
  ("Why does the writer use 'literally'?"), meaning in context, "Which idea is mentioned in both texts?",
  "How would the writer of Text A describe…?", "Who would Text B be most useful for?".
- `writing.t2.sources`: 3 sources (A, B, C) with distinct viewpoints/data.

### Voices
`voice` is `"male"` or `"female"`; vary accents implicitly by name. Max 3 speakers in any script.

## Grammar file: `site/ise-digital/data/grammar.json`

```json
{
  "topics": [
    {
      "id": "inversion",
      "title": "Negative & conditional inversion",
      "level": "C1",
      "summary": "One line.",
      "theory": "Concise explanation in Spanish with English examples. Light markdown allowed: **bold**, `code`, lists with '- '.",
      "examples": ["Never have I seen ...", "Had I known, ..."],
      "commonMistakes": ["*Never I have seen → Never have I seen"],
      "exercises": [
        { "type": "mc", "prompt": "Not only ___ late, but he also forgot the report.", "options": ["he was","was he","he is","did he"], "answer": 1, "explanation": "..." },
        { "type": "gap", "prompt": "Little ___ (she / know) what was about to happen.", "answers": ["did she know"], "explanation": "..." },
        { "type": "transform", "prompt": "I had no idea he was the CEO. (IDEA)", "keyword": "IDEA", "start": "Little", "answers": ["Little idea did I have that he was the CEO"], "explanation": "..." }
      ]
    }
  ]
}
```
`answers` for gap/transform: list of accepted strings (compared case-insensitive, trimmed, punctuation-insensitive).
