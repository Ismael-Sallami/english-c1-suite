/*
 * Respuestas OFICIALES de candidatos, tomadas de las guías de Trinity
 * "Understanding the rating scale — Written online communication" y "— Writing from sources" (ISE Digital, 2026).
 * Textos copiados literalmente, con sus errores. Las notas y la justificación son del examinador oficial.
 * Traducciones, anotaciones y notas en español: elaboración propia para estudio.
 *
 * Formato de marcas: [frase exacta, tipo, nota, corrección?]
 *   tipo: c1 = estructura avanzada · link = conector · src = uso de fuentes · voc = vocabulario · err = error
 */
window.WRITINGS = window.WRITINGS || [];

const PROMPT_FORUM_MAXINE = {
  text: 'Read these messages from an online discussion. Write an answer and respond to both your teacher and Maxine.',
  thread: [
    { who: 'Ms Lang', role: 'teacher', text: 'Hello class! Here is the topic we are discussing this week: Nowadays governments and companies track our internet use. Is this bad for our lives? Please write your opinion below.' },
    { who: 'Maxine', text: 'I am worried that the government can see everything we do online. They can use this information to control people.' },
  ],
  words: '~70 (máx. 90) · 5 min',
};

const PROMPT_EMAIL_CAFETERIA = {
  text: 'Your school is asking for your opinion. Write an answer to say:',
  bullets: ['if the cafeteria is comfortable', 'how to improve the menu'],
  thread: [{ who: 'Mrs Sanders · School Cafeteria', text: 'Dear students, Last month we opened our new school cafeteria. Please tell us your opinion of the cafeteria. Thank you, Mrs Sanders' }],
  words: '~70 (máx. 90) · 5 min',
};

const PROMPT_CHAT_MIA = {
  text: 'You are working on a group project for school. Write a message to your group to:',
  bullets: ['respond to Mia', 'suggest what information to include'],
  thread: [{ who: 'Mia', text: "Students don't read newspapers! Let's tell the teacher we want to make a school website instead." }],
  groupTitle: 'Group project: Create a school newspaper',
  words: '~70 (máx. 90) · 5 min',
};

const BIGDATA_SOURCES = [
  { label: 'Text A', title: 'smartfacts.com', content: "The term 'Big Data' refers to the large amounts of personal information collected from smartphones, computers and other digital devices. This data includes search records, shopping history and other information. There is often too much information to be processed by the human brain. However, companies can use special software to analyse this data and find patterns. For example: authorities use GPS and map data to see which roads are too busy; video game designers see the parts of the game where users press 'pause' or 'stop' to see which parts are exciting or not; companies analyse online shopping to help them direct advertisement." },
  { label: 'Text B', title: 'How has Big Data affected your practice? Interview with Doctor Robert O’Connor', content: 'First, I have a lot more information about individual patients. In the old days, doctors had a patient in front of them and had to ask lots of questions to find the problem. Now, I can look at their medical history and I have access to information about where they live and, if they want, I can record and analyse their diet and daily activity levels. This information can help me to identify problems. Secondly, all doctors have access to lots of anonymised data about how diseases and problems have been treated around the world, and this helps us to see which treatments work best.' },
  { label: 'Text C', title: 'Issue Magazine — Our readers respond to Big Data', content: '"If someone wants to know my personal information, they should ask me first. I don’t want companies to track what I buy, where I go, and what I search for on the internet. They analyse this data so that they can send adverts to me – but this benefits them, not me. Recent news stories have shown that many companies and governments don’t store this data carefully. One bank had millions of customer profiles stolen. Such personal information should be kept private, and offline," wrote Joshua Buchan.' },
];

const PROMPT_BIGDATA = {
  text: "Write a formal essay for your course tutor, developing an argument on the following topic: Governments and companies should not be allowed to collect and analyse 'Big Data'. To what extent do you agree or disagree?",
  bullets: ['You must use ideas from the texts and your own ideas.', 'You must not copy from the texts.'],
  sources: BIGDATA_SOURCES,
  words: '~250 (máx. 300) · 35 min',
};

const TRAFFIC_SOURCES = [
  { label: 'Text A', title: 'The London News — On this day in the past (Marie Mulligan)', content: 'Over 15 years ago, in February 2008, the Mayor of London introduced the traffic congestion charge for central London. Today we interview people walking in central London to find out how it changed life for them. Sita Anand told us: "The new rule meant that everyone driving into central London had to pay £15 per day. My family lived outside the congestion zone, but my grandmother was inside – she worried that no one would visit her again. Of course, we did, but we took the bus instead of driving. We also started using the bus or subway to go shopping or visit friends in the centre. But my father was a professional plumber, so he had to drive in and pay £15 every day. He was extremely angry when the new charge came in. Many others who needed to drive for work felt the same. After the congestion charge, the streets of London had much fewer cars in them. There were still a lot of buses and taxis, so you couldn’t play on the roads, of course. But the air got cleaner, and the roads were a bit quieter. Without so many cars, buses were quicker, and more people started to ride their bikes to work."' },
  { label: 'Text B', title: 'Encyclopaedia of Urban Development — City Planning Terms', content: 'A superblock is: a very large block of buildings in a city in which streets are pedestrianised and traffic cannot pass through. Often there are roads into the block so that people who live in the superblock can bring their own cars in and out, but non-residents or busses cannot drive through. Instead, all the traffic is re-directed onto the main roads that go around the superblock. This means that the main roads can become busier and must be big enough to hold all the traffic. Inside the superblocks the number of cars is reduced, and the extra space is transformed into green areas used for walking or playing. Superblocks are suitable for new cities, or cities with straight roads, like Barcelona in Spain.' },
];

const PROMPT_TRAFFIC = {
  text: 'Write a formal report for your city council about reducing the impact of traffic in the city. In your report, you should:',
  bullets: ['evaluate the methods of reducing traffic', 'make recommendations', 'You must use ideas from the texts and your own ideas.', 'You must not copy from the texts.'],
  sources: TRAFFIC_SOURCES,
  words: '~250 (máx. 300) · 35 min',
};

window.WRITINGS.push(
  /* ======================= T1 · FORO ======================= */
  {
    id: 'of-forum-1', task: 1, type: 'forum', origin: 'official',
    title: 'Big Brother is watching', prompt: PROMPT_FORUM_MAXINE,
    scores: { Content: [4, 5], Language: [5, 5], Style: [4, 5] },
    rationale: 'Both parts of the task are addressed sufficiently, although in places the response is rather repetitive and supporting details are somewhat lacking. The reader is likely to have some questions (eg In what ways might internet histories be used against people?). The response is almost error-free, and includes a range of complex structures and less common lexis/expressions. Meaning is communicated clearly and precisely throughout, with only very minor lapses. Maxine’s contribution is fully acknowledged, and an appropriate informal-neutral register is used throughout.',
    paras: [
      { role: 'Reacción a Maxine', sents: [
        ["I agree with Maxine’s opinion.", 'Estoy de acuerdo con la opinión de Maxine.'],
        ['The fact that governments can see everything that we do online is really bad.', 'El hecho de que los gobiernos puedan ver todo lo que hacemos en internet es muy malo.'],
      ] },
      { role: 'Argumento', sents: [
        ['We have completely lost our sense of privacy and we always feel like someone out there is watching every single thing we do; that’s because it is true.', 'Hemos perdido por completo la sensación de privacidad y siempre sentimos que alguien ahí fuera vigila cada cosa que hacemos; y es porque es verdad.'],
      ] },
      { role: 'Ampliación', sents: [
        ['“Big Brother” seems to have resurfaced and it getting stronger and stronger.', 'El “Gran Hermano” parece haber resurgido y cada vez es más fuerte.'],
        ['What is more, governments and companies might one day use our internet history against us and there would be no way for us to defend ourselves.', 'Es más, los gobiernos y las empresas podrían algún día usar nuestro historial de internet contra nosotros y no tendríamos forma de defendernos.'],
      ] },
    ],
    marks: [
      ["I agree with Maxine’s opinion", 'c1', 'Nombra a Maxine en la primera frase: así cumple la parte de “responder a Maxine”.'],
      ['The fact that', 'c1', '“The fact that + oración” convierte una idea en sujeto de la frase. Muy típico de C1.'],
      ['someone out there', 'voc', 'alguien ahí fuera'],
      ['every single thing', 'voc', 'absolutamente todo (énfasis)'],
      ['seems to have resurfaced', 'c1', 'seem + infinitivo perfecto (to have + participio): hablar con cautela de algo pasado.'],
      ['it getting stronger', 'err', 'Falta el verbo auxiliar.', "it is getting stronger"],
      ['stronger and stronger', 'voc', 'cada vez más fuerte (comparativo repetido)'],
      ['What is more', 'link', 'Conector de adición formal-neutro: “es más / además”.'],
      ['might one day', 'c1', 'Modal de posibilidad + adverbio intercalado.'],
      ['there would be no way for us to', 'c1', '“there would be no way for + persona + to” = no habría manera de que…'],
    ],
    notes: [
      'Nota alta en Language por la variedad: <i>the fact that</i>, <i>seems to have</i>, <i>might one day</i>.',
      'Le falta responder de verdad a la profesora (Ms Lang): no explica <b>cómo</b> afecta a nuestras vidas. Por eso Content se queda en 4.',
      'Repite la misma idea (“nos vigilan”) en lugar de dar ejemplos concretos.',
    ],
  },
  {
    id: 'of-forum-2', task: 1, type: 'forum', origin: 'official',
    title: '“Why would the government care?”', prompt: PROMPT_FORUM_MAXINE,
    scores: { Content: [3, 5], Language: [4, 5], Style: [3, 5] },
    rationale: 'Both parts of the task are addressed, although supporting details are rather limited and repetitive. The writer poses questions but does not answer them, leaving the reader to fill in significant gaps. Uses both simple and complex structures to express their message, including both common and lower-frequency lexis (eg inoffensive) alongside lexical chunks (eg in the case that). Minor errors are frequent (eg word order) but have minimal impact. An acceptable informal-neutral register is used throughout, but does not show evidence of acknowledging interlocutors, or politely disagreeing.',
    paras: [
      { role: 'Opinión', sents: [
        ['i think that internet is inoffensive and the goverment doesnt spy us like most of the people think', 'creo que internet es inofensivo y que el gobierno no nos espía como piensa la mayoría de la gente'],
      ] },
      { role: 'Preguntas retóricas', sents: [
        ['i mean why the goverment would be so interested about what their citizens are searching on internet?', 'o sea, ¿por qué iba a estar el gobierno tan interesado en lo que buscan sus ciudadanos en internet?'],
        ['and what bad thing they could do with that information?', '¿y qué cosa mala podrían hacer con esa información?'],
        ['that it’s a thing that just didn’t make sense to me', 'eso es algo que simplemente no tenía sentido para mí'],
      ] },
      { role: 'Conclusión', sents: [
        ['So in the case that the goverment take our information, i dont think they would do something that make a great difference in how we live our lifes', 'Así que, en el caso de que el gobierno coja nuestra información, no creo que hicieran algo que cambiara mucho nuestra forma de vivir'],
      ] },
    ],
    marks: [
      ['i think', 'err', 'Mayúscula: el pronombre “I” siempre va en mayúscula, y también la primera letra de la frase.', 'I think'],
      ['goverment', 'err', 'Ortografía.', 'government'],
      ['doesnt spy us', 'err', 'Falta el apóstrofo y la preposición: spy ON someone.', "doesn't spy on us"],
      ['most of the people think', 'err', 'En general se dice “most people”, sin “of the”.', 'most people think'],
      ['inoffensive', 'voc', 'inofensivo — palabra poco frecuente: suma en Language.'],
      ['why the goverment would be', 'err', 'En una pregunta directa se invierte: auxiliar + sujeto.', 'why would the government be'],
      ['interested about', 'err', 'interested IN.', 'interested in'],
      ['on internet', 'err', 'Con artículo: on the internet.', 'on the internet'],
      ['what bad thing they could do', 'err', 'Pregunta directa: invierte.', 'what harm could they do'],
      ['in the case that', 'c1', 'Bloque léxico “in the case that” = en caso de que. El examinador lo valora.'],
      ['make a great difference', 'voc', 'make a (great) difference = cambiar mucho las cosas'],
      ['lifes', 'err', 'Plural irregular.', 'lives'],
    ],
    notes: [
      '<b>Style 3</b>: no saluda ni nombra a Maxine ni a la profesora, y no muestra desacuerdo de forma educada (“I see your point, Maxine, but…”).',
      'Hace preguntas retóricas pero <b>no las responde</b>: el lector se queda con dudas.',
      'Aun con muchos errores pequeños saca 4 en Language porque se entiende todo y usa estructuras variadas.',
    ],
  },

  /* ======================= T1 · EMAIL ======================= */
  {
    id: 'of-email-3', task: 1, type: 'email', origin: 'official',
    title: 'The new cafeteria (banda baja)', prompt: PROMPT_EMAIL_CAFETERIA,
    scores: { Content: [2, 5], Language: [2, 5], Style: [2, 5] },
    rationale: 'Attempts the first part of the task, but ignores the second part. Some relevant ideas and supporting details are included, but effort is required from the reader due to confusing sequencing and superfluous content. Manages to use simple sentences and basic lexis to communicate a simple message. Lexical repetition is noticeable and grammatical range is limited. There is very little evidence of awareness of style, although the register is largely neutral and the tone somewhat positive.',
    paras: [
      { role: 'Opinión', sents: [
        ['The School Cafeteria is more beatiful because there are new toilets,tables and new taste of coffee.', 'La cafetería del colegio es más bonita porque hay baños nuevos, mesas y un nuevo sabor de café.'],
        ['last week I went in this cafeteria and I tried the new taste of coffee.', 'la semana pasada fui a esta cafetería y probé el nuevo sabor de café.'],
      ] },
      { role: 'Descripción', sents: [
        ['This cafeteria is more big;the walls are white and yellow,the tale are for 7 people; thebarman is more gentle and is very good to prepare the coffee.', 'Esta cafetería es más grande; las paredes son blancas y amarillas, las mesas son para 7 personas; el camarero es más amable y prepara muy bien el café.'],
      ] },
      { role: 'Comparación', sents: [
        ['The old cafeteria was poor:the toilets was broken, the bath was small and the tables were more dirty', 'La cafetería antigua era pobre: los baños estaban rotos, el baño era pequeño y las mesas estaban más sucias'],
      ] },
    ],
    marks: [
      ['beatiful', 'err', 'Ortografía.', 'beautiful'],
      ['new taste of coffee', 'err', 'Calco del español (“sabor”): en inglés, a new coffee flavour / blend.', 'a new coffee blend'],
      ['went in this cafeteria', 'err', 'went TO.', 'went to'],
      ['more big', 'err', 'Comparativo de una sílaba: -er.', 'bigger'],
      ['the tale are', 'err', 'Errata.', 'the tables are'],
      ['more gentle', 'err', '“gentle” = suave/delicado; para personas amables: friendlier.', 'friendlier'],
      ['good to prepare', 'err', 'good AT + -ing.', 'good at making'],
      ['the toilets was', 'err', 'Concordancia: plural.', 'the toilets were'],
      ['more dirty', 'err', 'Comparativo.', 'dirtier'],
    ],
    notes: [
      '<b>Ignora el segundo punto</b> (cómo mejorar el menú) → Content no puede pasar de 2.',
      'No hay saludo ni despedida: es un email a Mrs Sanders y debería empezar con “Dear Mrs Sanders,”.',
      'Mira el siguiente texto (respuesta 4): con la misma consigna saca 5 en Content.',
    ],
  },
  {
    id: 'of-email-4', task: 1, type: 'email', origin: 'official',
    title: 'Dear Mrs Sanders (Content 5)', prompt: PROMPT_EMAIL_CAFETERIA,
    scores: { Content: [5, 5], Language: [4, 5], Style: [4, 5] },
    rationale: 'Relevant ideas and appropriate supporting details are provided in relation to both parts of the task, and the logical sequencing helps the reader follow the message. Uses both simple and complex structures to express their message, including a good range of common lexis. There is noticeable repetition (eg maybe you can add) and occasional errors, but understanding is not impeded. The tone is consistently positive and constructive, with a polite beginning/ending and an appropriate informal-neutral register.',
    paras: [
      { role: 'Saludo', sents: [['Dear Mrs. Sanders:', 'Estimada Sra. Sanders:']] },
      { role: 'Bullet 1 · comodidad', sents: [
        ['I reckon that the cafeteria is a really good place and very confortable, but maybe you can add more sofas and chairs, to have more space for the students.', 'Creo que la cafetería es un sitio muy bueno y muy cómodo, pero quizá podrían añadir más sofás y sillas, para tener más espacio para los alumnos.'],
      ] },
      { role: 'Bullet 2 · menú', sents: [
        ['I think that maybe you can add more choices of lunch in the menu, as there are lot’s of students that prefer to eat healthier, and sometimes the choices are of junk food.', 'Creo que quizá podrían añadir más opciones de comida en el menú, ya que hay muchos alumnos que prefieren comer más sano, y a veces las opciones son comida basura.'],
        ['Also there are students that can ‘t consume flour.', 'Además, hay alumnos que no pueden consumir harina.'],
      ] },
      { role: 'Despedida', sents: [['Best whishes,', 'Un saludo,'], ['Gabriela.', 'Gabriela.']] },
    ],
    marks: [
      ['Dear Mrs. Sanders:', 'c1', 'Saludo correcto para un email a una profesora. En inglés británico se usa coma: “Dear Mrs Sanders,”.'],
      ['I reckon that', 'voc', 'creo que (coloquial británico) — encaja con el registro informal-neutro.'],
      ['confortable', 'err', 'Ortografía (en inglés con m).', 'comfortable'],
      ['maybe you can add', 'err', 'Repetido dos veces. Más educado y variado: you could add / it would be great if you added.', 'you could perhaps add'],
      ['as there are', 'link', '“as” = ya que (causa).'],
      ['lot’s of', 'err', 'Sin apóstrofo.', 'lots of'],
      ['eat healthier', 'voc', 'comer más sano'],
      ['junk food', 'voc', 'comida basura'],
      ['can ‘t consume flour', 'voc', '“consume” es correcto pero formal; más natural: “can’t eat gluten”.'],
      ['Best whishes', 'err', 'Ortografía.', 'Best wishes'],
    ],
    notes: [
      'Esto es lo que da <b>Content 5</b>: un bloque para cada bullet, con una razón (“as there are lots of students that prefer to eat healthier”).',
      'Tono constructivo y educado: primero elogia y después sugiere (“…a really good place…, but maybe…”).',
      'Language 4 y no 5 por repetir “maybe you can add” y por los errores de ortografía.',
    ],
  },

  /* ======================= T1 · CHAT ======================= */
  {
    id: 'of-chat-5', task: 1, type: 'chat', origin: 'official',
    title: 'Lo que NO hay que hacer en un chat', prompt: PROMPT_CHAT_MIA,
    scores: { Content: [1, 5], Language: [2, 5], Style: [1, 5] },
    rationale: 'Seems to have misunderstood the question and is acting out the entire group conversation. The readers are not informed as the lack of coherence renders the content largely incomprehensible. Noticeable repetition results in a limited range of language shown. Uses some structures such as subordinated clauses and more complex lexis (eg innovative) but with limited compressibility, requiring significant effort form the reader. The confrontational tone has the potential to seriously offend the readers.',
    paras: [
      { role: '(confuso)', sents: [
        ['no Mia, I am disappoident to you because to writing a school newspapers and im don’t disappoint the teacher.', 'no Mia, estoy decepcionado contigo porque escribir periódicos escolares y yo no decepciono a la profesora.'],
        ['Kai you are disappoint to me? :’’ no giuseppe i don’t disappoint you’’.', 'Kai, ¿estás decepcionado conmigo? :“no giuseppe no te decepciono”.'],
        ['And you Amy? :’’ giuseppe i am disappoint to you because i like the idea of a website because is most proffessional and is most innovative.', '¿Y tú, Amy? :“giuseppe estoy decepcionada contigo porque me gusta la idea de una web porque es más profesional y más innovadora”.'],
        ['the grop decide the idea of the newspapers', 'el grupo decide la idea de los periódicos'],
      ] },
    ],
    marks: [
      ['I am disappoident to you', 'err', 'disappointed WITH someone; además, decirle eso a una compañera es agresivo.', "I'm not sure I agree, Mia"],
      ['Kai you are disappoint to me?', 'err', 'Se inventa la conversación de los demás: la tarea pide UN mensaje tuyo.', '—'],
      ['most proffessional', 'err', 'Comparativo de adjetivos largos: more + adj; ortografía.', 'more professional'],
      ['innovative', 'voc', 'innovador — palabra C1, pero rodeada de errores.'],
    ],
    notes: [
      '<b>Error fatal</b>: escribe el diálogo de todo el grupo en vez de un único mensaje suyo.',
      'Tono confrontativo (“I am disappointed with you”) → Style 1. En un chat de grupo hay que ser <b>positivo y colaborativo</b>.',
      'Compáralo con la respuesta 6 (siguiente), que es la misma tarea con nota máxima.',
    ],
  },
  {
    id: 'of-chat-6', task: 1, type: 'chat', origin: 'official',
    title: 'Hi Mia! (Content 5 · Language 5)', prompt: PROMPT_CHAT_MIA,
    scores: { Content: [5, 5], Language: [5, 5], Style: [4, 5] },
    rationale: 'Both parts of the task are addressed in detail forming a logical and coherent message which leaves the reader feeling fully informed. The response is error-free and exploits a range of complex structures and lexical items, including several rich collocations (eg fashion section, creative voices, pretty much). The tone is consistently positive and constructive, with a friendly beginning/ending and an appropriate neutral register.',
    paras: [
      { role: 'Saludo', sents: [['Hi Mia,', 'Hola, Mia:']] },
      { role: 'Bullet 1 · responder a Mia', sents: [
        ['I completely agree with you.', 'Estoy totalmente de acuerdo contigo.'],
        ['Nowadays, students no longer read the newspaper and that is why we should suggest a school website.', 'Hoy en día los estudiantes ya no leen el periódico, y por eso deberíamos proponer una web del colegio.'],
      ] },
      { role: 'Bullet 2 · qué incluir', sents: [
        ['I think it should contain pretty much the same information a newspaper would contain - from a sports section to a fashion section and school announcements.', 'Creo que debería tener más o menos la misma información que tendría un periódico: desde una sección de deportes hasta una de moda y avisos del colegio.'],
        ['We should also propose a column where each week we can publish two or three of the students’ best articles - that way, we could try and find new creative voices and let them speak up.', 'También deberíamos proponer una columna donde cada semana publiquemos dos o tres de los mejores artículos de los alumnos; así podríamos intentar encontrar nuevas voces creativas y darles la palabra.'],
      ] },
      { role: 'Cierre interactivo', sents: [['What do you think?', '¿Qué os parece?']] },
    ],
    marks: [
      ['I completely agree with you', 'c1', 'Responde a Mia en la primera línea: cumple el bullet 1 sin rodeos.'],
      ['no longer', 'c1', '“no longer” = ya no. Más elegante que “don’t … anymore”.'],
      ['that is why', 'link', 'por eso (consecuencia)'],
      ['pretty much', 'voc', 'prácticamente / más o menos (informal)'],
      ['a newspaper would contain', 'c1', 'Relativa sin “that” + condicional hipotético: “lo que contendría un periódico”.'],
      ['from a sports section to a fashion section', 'c1', 'Estructura “from X to Y” para enumerar con elegancia.'],
      ['propose a column', 'voc', 'proponer una columna/sección fija'],
      ['that way', 'link', 'de esa forma / así (resultado, informal)'],
      ['try and find', 'voc', 'try and + verbo = intentar (informal, británico)'],
      ['creative voices', 'voc', 'voces creativas (colocación que el examinador destaca)'],
      ['speak up', 'voc', 'alzar la voz, hacerse oír (phrasal verb)'],
      ['What do you think?', 'c1', 'Cierre que abre la conversación: perfecto para un chat de grupo.'],
    ],
    notes: [
      '<b>Plantilla perfecta de chat</b>: saludo → responde a Mia → propuesta concreta con ejemplos → pregunta al grupo.',
      'Sin errores y con colocaciones naturales (<i>fashion section</i>, <i>creative voices</i>, <i>pretty much</i>).',
      'Style 4 y no 5: podría ajustar un poco más el tono al grupo (por ejemplo, “Hi everyone” o mencionar a Kai).',
    ],
  },

  /* ======================= T2 · ESSAY (BIG DATA) ======================= */
  {
    id: 'of-essay-1', task: 2, type: 'essay', origin: 'official',
    title: 'Big Data — banda 4 (conclusión sin terminar)', prompt: PROMPT_BIGDATA,
    scores: { 'Content & org.': [4, 6], 'Use of sources': [4, 6], Language: [4, 6], Style: [4, 6] },
    rationale: 'Both sides of the argument are addressed together with supporting details, and basic textual organisation devices are used to help the reader navigate the text (eg for example, plus, another way). Overall, the reader is left feeling sufficiently informed of the writer’s stance on the topic. However, some of the supporting detail seems to conflate the issue of big data with cybersecurity, leaving the reader with some questions on the logical connection between the two. The unfinished conclusion is a missed opportunity to consolidate the response. The candidate exploits information from all three sources in the response. Lexical borrowing is noticeable at times, but paraphrasing is generally effective, managing to avoid copying. Synthesis is clearly attempted, with key ideas from all sources recombined and used in support of own stance. Uses both simple and complex structures alongside varied lexis to communicate their message, although certain are drawn directly from the source texts so cannot be credited (eg which […] works best, personal information, digital devices). There are noticeable errors and signs of awkwardness in a few places, but these tend not to impact comprehensibility (eg takes to many losses of money). Examples of all three features of style are evident within the text, although this is not maintained consistently (eg personal pronouns appear frequently).',
    paras: [
      { role: 'Intro · definición', sents: [
        ['The term ‘Big Data’ means all the personal information that is stored in digital devises, such as computers, smartphones ore smartwatches.', 'El término “Big Data” se refiere a toda la información personal almacenada en dispositivos digitales, como ordenadores, móviles o relojes inteligentes.'],
        ['It includes search history, adresses or even passwords.', 'Incluye el historial de búsqueda, direcciones o incluso contraseñas.'],
      ] },
      { role: 'Postura + argumento', sents: [
        ['In my opinion, the personal informations of any person shound not be analysed by anyone on the internet.', 'En mi opinión, la información personal de nadie debería ser analizada por nadie en internet.'],
        ['It should be protected by security softwares.', 'Debería estar protegida por programas de seguridad.'],
        ['In this way, only authorised people will access the personal information of a particular person.', 'Así, solo personas autorizadas accederán a la información personal de una persona concreta.'],
        ['There are many hackers around the world who could use this informations for crimes.', 'Hay muchos hackers en el mundo que podrían usar esta información para cometer delitos.'],
        ['For example, they could steal money from a bank account just by knowing the password.', 'Por ejemplo, podrían robar dinero de una cuenta bancaria solo con saber la contraseña.'],
        ['Some companies don’t store the “Big Data” about their customers carefully.', 'Algunas empresas no guardan con cuidado el “Big Data” de sus clientes.'],
        ['This makes the work of a hacker easier and takes to many losses of money.', 'Esto facilita el trabajo de un hacker y provoca muchas pérdidas de dinero.'],
        ['The persnal informations must be kept private, as Joshua Buchan says.', 'La información personal debe mantenerse privada, como dice Joshua Buchan.'],
      ] },
      { role: 'Contraargumento', sents: [
        ['On the other hand, personal informations can be useful in some purposes.', 'Por otro lado, la información personal puede ser útil para algunos fines.'],
        ['For example, doctors can record the analyses of their patients.', 'Por ejemplo, los médicos pueden registrar los análisis de sus pacientes.'],
        ['Plus, they can use ‘Big Data’ to help them developing cures for different diseases or seeing which medicines work best.', 'Además, pueden usar el “Big Data” para desarrollar curas para distintas enfermedades o ver qué medicinas funcionan mejor.'],
        ['Another way in that “Big Data” is useful is making the video games and programmes better and more interesting.', 'Otra forma en la que el “Big Data” es útil es mejorando los videojuegos y los programas y haciéndolos más interesantes.'],
        ['The video game designers can see the numbers of players.', 'Los diseñadores de videojuegos pueden ver el número de jugadores.'],
      ] },
      { role: 'Conclusión (sin acabar)', sents: [['In concude', 'En concl… (sin terminar)']] },
    ],
    marks: [
      ['digital devises', 'err', 'Ortografía: device (sustantivo) / devise (verbo). Además “digital devices” está copiado de la fuente y no puntúa.', 'digital devices'],
      ['ore smartwatches', 'err', 'Errata.', 'or smartwatches'],
      ['adresses', 'err', 'Ortografía.', 'addresses'],
      ['personal informations', 'err', '“information” es incontable: nunca lleva -s.', 'personal information'],
      ['shound', 'err', 'Errata.', 'should'],
      ['security softwares', 'err', '“software” es incontable.', 'security software'],
      ['In this way', 'link', 'de este modo (resultado)'],
      ['takes to many losses', 'err', '“lleva a” = leads to. El examinador lo cita como “awkward”.', 'leads to considerable financial losses'],
      ['as Joshua Buchan says', 'src', 'Cita la fuente nombrando al autor (Text C). Bien, pero mejor con un verbo más preciso: “as Joshua Buchan argues”.'],
      ['On the other hand', 'link', 'Contraste: introduce el otro lado del argumento.'],
      ['useful in some purposes', 'err', 'useful FOR.', 'useful for some purposes'],
      ['doctors can record the analyses', 'src', 'Idea del Text B (el médico), parafraseada.'],
      ['Plus,', 'link', 'Además (informal; en un essay mejor “Furthermore,”).'],
      ['help them developing', 'err', 'help + (to) infinitivo.', 'help them develop'],
      ['which medicines work best', 'src', 'Préstamo casi literal del Text B (“which treatments work best”): no puntúa como lenguaje propio.'],
      ['Another way in that', 'err', 'way IN WHICH.', 'Another way in which'],
      ['The video game designers', 'src', 'Idea del Text A (diseñadores de videojuegos).'],
      ['In concude', 'err', 'Conclusión sin terminar: pierde la oportunidad de cerrar el argumento.', 'In conclusion, …'],
    ],
    notes: [
      'Usa <b>las tres fuentes</b> (A: videojuegos, B: médicos, C: Joshua Buchan) → Use of sources 4.',
      'Mezcla “Big Data” con “ciberseguridad/hackers”, que no es lo mismo: el examinador lo penaliza en Content.',
      '<b>No terminó la conclusión</b>: controla el tiempo y escribe la conclusión antes de pulir.',
      'Usa “I”/“my” con frecuencia: en un essay formal resta en Style.',
    ],
  },
  {
    id: 'of-essay-2', task: 2, type: 'essay', origin: 'official',
    title: 'Big Data — banda 5', prompt: PROMPT_BIGDATA,
    scores: { 'Content & org.': [5, 6], 'Use of sources': [5, 6], Language: [6, 6], Style: [4, 6] },
    rationale: 'Both sides of the argument are explored, although at times there seems to be some confusion between governments and companies. Sequencing is logical and supported by cohesive devices, but the reader is left with some questions (eg How could this situation lead to millions of lives being in great danger?). Content from all sources is judiciously selected and synthesised with own ideas to suit the new writing purpose, with a clear effort made to distinguish voices (eg as stated in Text B). The writer exploits a range of structures and lexis to ensure meaning is communicated clearly and precisely throughout (eg different lines of work, influencing our needs and desires). Errors are rare and have negligible impact on the reader. Examples of all three features of style are evident within the text, although this is not maintained consistently (eg conversational tone the next thing you know, personal pronouns).',
    paras: [
      { role: 'Intro · contexto + tesis', sents: [
        ['The issue of big data is more and more present nowadays.', 'El tema del big data está cada vez más presente hoy en día.'],
        ['Companies and the government seem to have taken the liberty of collecting information about us without our consent.', 'Las empresas y el gobierno parecen haberse tomado la libertad de recopilar información sobre nosotros sin nuestro consentimiento.'],
        ['I strongly believe that there is information that should be collected and some that shouldn’t.', 'Creo firmemente que hay información que debería recopilarse y otra que no.'],
      ] },
      { role: 'A favor (+ Text B, Text A)', sents: [
        ['On the one hand, collecting big data can really help people in different lines of work.', 'Por un lado, recopilar big data puede ayudar mucho a la gente en distintos ámbitos profesionales.'],
        ['For example, as stated in Text B, it is definitely easier for doctors to treat their patients if they are one click away from their medical records.', 'Por ejemplo, como se afirma en el Texto B, es sin duda más fácil para los médicos tratar a sus pacientes si tienen su historial a un clic.'],
        ['What is more, the fact that big data is collected by GPS helps so many drives take the best and the fastest route to work.', 'Es más, el hecho de que el GPS recopile big data ayuda a muchísimos conductores a tomar la mejor y más rápida ruta al trabajo.'],
      ] },
      { role: 'En contra (+ Text C, ideas propias)', sents: [
        ['On the other hand, these ‘state powers’ seem to have taken too much liberty.', 'Por otro lado, estos “poderes” parecen haberse tomado demasiadas libertades.'],
        ['Nowadays, it is enough to say once near your phone or your computer that you are thinking about visiting a certain place or buying a certain object and the next thing you know, your online pages are filled with all these ads.', 'Hoy basta con decir una vez cerca del móvil o del ordenador que estás pensando en visitar un sitio o comprar algo y, cuando te quieres dar cuenta, tus páginas están llenas de anuncios.'],
        ['This gives companies too much power over what we as humans invest in.', 'Esto da a las empresas demasiado poder sobre aquello en lo que invertimos como personas.'],
        ['It also has a way of influencing our needs and desires.', 'También tiene una forma de influir en nuestras necesidades y deseos.'],
        ['Another issue of data saving is the fact that thives can steal precious information with just one click.', 'Otro problema de almacenar datos es que los ladrones pueden robar información valiosa con un solo clic.'],
      ] },
      { role: 'Conclusión', sents: [
        ['To put it in a nutshell, there should be a clear division between what data should be saved and what shouldn’t.', 'En pocas palabras, debería haber una división clara entre qué datos deberían guardarse y cuáles no.'],
        ['If any personal information wound up in the wrong hands, millions of lives could be in great danger.', 'Si alguna información personal acabara en malas manos, millones de vidas podrían correr un grave peligro.'],
      ] },
    ],
    marks: [
      ['more and more present', 'voc', 'cada vez más presente'],
      ['seem to have taken the liberty of', 'c1', 'seem + infinitivo perfecto + expresión idiomática “take the liberty of + -ing” (tomarse la libertad de).'],
      ['without our consent', 'voc', 'sin nuestro consentimiento'],
      ['I strongly believe that', 'c1', 'Tesis clara al final de la introducción.'],
      ['On the one hand', 'link', 'Por un lado…'],
      ['different lines of work', 'voc', 'distintos ámbitos profesionales (el examinador lo destaca)'],
      ['as stated in Text B', 'src', 'Distingue su voz de la de la fuente: exactamente lo que pide “Use of sources”.'],
      ['it is definitely easier for doctors to', 'c1', 'Estructura impersonal: it is + adj + for sb + to-infinitive.'],
      ['one click away from', 'voc', 'a un clic de (expresión idiomática)'],
      ['What is more', 'link', 'Es más (adición enfática)'],
      ['the fact that', 'c1', '“the fact that + oración” como sujeto.'],
      ['so many drives', 'err', 'Errata: drivers.', 'so many drivers'],
      ['On the other hand', 'link', 'Por otro lado (contraste)'],
      ['it is enough to', 'c1', 'it is enough to + infinitivo = basta con…'],
      ['the next thing you know', 'err', 'Expresión demasiado coloquial para un essay formal (el examinador lo señala en Style).', 'before long'],
      ['has a way of influencing', 'c1', '“have a way of + -ing” = tender a (algo que suele pasar).'],
      ['influencing our needs and desires', 'voc', 'influir en nuestras necesidades y deseos (lo destaca el examinador)'],
      ['thives', 'err', 'Ortografía.', 'thieves'],
      ['To put it in a nutshell', 'link', 'En pocas palabras (resumen idiomático).'],
      ['wound up in the wrong hands', 'c1', '“wind up” (acabar) en pasado + condicional de segundo tipo; “in the wrong hands” = en malas manos.'],
    ],
    notes: [
      '<b>Language 6 (máximo)</b> con un texto bastante sencillo: lo que cuenta es la precisión y la naturalidad, no las palabras rebuscadas.',
      'Cita las fuentes con fórmulas como <i>as stated in Text B</i>, separando su voz de la de las fuentes.',
      'Style 4: se le cuelan expresiones coloquiales (<i>the next thing you know</i>) y pronombres personales.',
      'Estructura clásica en 4 párrafos: intro + tesis → a favor → en contra → conclusión.',
    ],
  },
  {
    id: 'of-essay-3', task: 2, type: 'essay', origin: 'official',
    title: 'Big Data — banda máxima ⭐', prompt: PROMPT_BIGDATA,
    scores: { 'Content & org.': [6, 6], 'Use of sources': [5, 6], Language: [6, 6], Style: [5, 6] },
    rationale: 'All aspects of the question are addressed comprehensively, with a nuanced position being fully supported by rich details. Staging and organisation are managed seamlessly, while the integration of counter-arguments and rebuttals contribute to a very well-rounded response. Key ideas and details from all sources are extracted and synthesised in support of the new writing purpose, with an attempt made to distance the candidate’s voice from other voices. A range of complex structures and lexis are employed flexibly to enhance the message, with no sign of needing to compromise. Meaning is communicated clearly and precisely throughout, with any errors difficult to spot. All three features of style are demonstrated consistently throughout the text, with only very minor and occasional lapses (eg some personal pronouns and flashes of a journalistic tone — There is no secret that).',
    paras: [
      { role: 'Intro · contexto + postura matizada', sents: [
        ['In this digital age, the collection and analysis of vast volumes of data, known as ‘big data’, have become essential.', 'En esta era digital, la recopilación y el análisis de enormes volúmenes de datos, lo que se conoce como “big data”, se han vuelto esenciales.'],
        ['With this in mind, I partially disagree with the statement below since it offers a narrow perspective on a complex issue.', 'Teniendo esto en cuenta, estoy parcialmente en desacuerdo con la afirmación, ya que ofrece una perspectiva estrecha de un tema complejo.'],
      ] },
      { role: 'Argumento 1 · beneficios (Text A + B)', sents: [
        ['‘Big data’ has revolutionised numerous industries, such as healthcare, transportation, and fashion.', 'El “big data” ha revolucionado numerosos sectores, como la sanidad, el transporte y la moda.'],
        ['It collects targeted information, analyses it and finds patterns that shape how we interact online.', 'Recopila información específica, la analiza y encuentra patrones que dan forma a cómo interactuamos en internet.'],
        ['For instance, in healthcare, analysing patient and medical data can lead to quicker diagnosis and personalised treatments.', 'Por ejemplo, en sanidad, analizar datos médicos y de pacientes puede llevar a diagnósticos más rápidos y tratamientos personalizados.'],
        ['Similarly, collecting transportation data can help optimise traffic flow and make navigation easier worldwide.', 'Del mismo modo, recopilar datos de transporte puede ayudar a optimizar el tráfico y facilitar la navegación en todo el mundo.'],
      ] },
      { role: 'Argumento 2 · prohibir no es práctico', sents: [
        ['Moreover, prohibiting governments and companies from collecting data is, from my perspective, impractical and may seriously hinder technological advancement.', 'Además, prohibir a gobiernos y empresas recopilar datos es, desde mi punto de vista, poco práctico y podría frenar seriamente el avance tecnológico.'],
        ['In today’s interconnected world, where there is a high dependency on all-tech, vast amounts of data are generated daily which ultimately allow us, the users, to have better experiences and access to technological advancements.', 'En el mundo interconectado de hoy, donde dependemos mucho de la tecnología, se generan a diario enormes cantidades de datos que, en última instancia, nos permiten a los usuarios tener mejores experiencias y acceder a avances tecnológicos.'],
      ] },
      { role: 'Concesión · riesgos (Text C)', sents: [
        ['However, while acknowledging the benefits of ‘big data’, it is crucial to address the associated risks, particularly concerning data privacy and security.', 'Sin embargo, aun reconociendo los beneficios del “big data”, es crucial abordar los riesgos asociados, sobre todo en cuanto a privacidad y seguridad de los datos.'],
        ['There is no secret that these companies are frequently in the centre of various scandals of data breaches and hence why they should be subject to rigorous auditing.', 'No es ningún secreto que estas empresas están a menudo en el centro de escándalos de filtraciones de datos y, por eso, deberían estar sometidas a auditorías rigurosas.'],
      ] },
      { role: 'Propuesta propia', sents: [
        ['Furthermore, legislation should be comprehensive and up-to-date, reflecting the evolving nature of technology and data privacy concerns.', 'Además, la legislación debería ser completa y estar actualizada, reflejando la naturaleza cambiante de la tecnología y de la preocupación por la privacidad.'],
        ['Clear guidelines should be established, and users should always be asked to consent, or not, their data to be collected, and informed on data retention periods.', 'Deberían establecerse pautas claras, y siempre debería pedirse a los usuarios que consientan (o no) que se recojan sus datos, e informarles de los plazos de conservación.'],
      ] },
      { role: 'Conclusión', sents: [
        ['In conclusion, protecting data privacy and security is crucial, but completely opposing ‘big data’ collection and analysis is not the solution.', 'En conclusión, proteger la privacidad y la seguridad de los datos es crucial, pero oponerse por completo a recopilar y analizar “big data” no es la solución.'],
        ['Instead, there should be a regulated approach with auditing processes and clear legislation to hold companies accountable and safeguard individuals’ privacy rights.', 'En su lugar, debería haber un enfoque regulado, con auditorías y una legislación clara, para que las empresas rindan cuentas y se protejan los derechos de privacidad de las personas.'],
      ] },
    ],
    marks: [
      ['In this digital age', 'voc', 'en esta era digital (apertura de contexto)'],
      ['vast volumes of data', 'voc', 'enormes volúmenes de datos'],
      ['known as', 'c1', 'Participio reducido: “(which is) known as”.'],
      ['With this in mind', 'link', 'Teniendo esto en cuenta (enlaza intro con tesis).'],
      ['I partially disagree with the statement', 'c1', 'Postura MATIZADA: justo lo que pide “To what extent…?”.'],
      ['a narrow perspective on a complex issue', 'voc', 'una visión estrecha de un tema complejo'],
      ['has revolutionised numerous industries', 'voc', 'ha revolucionado numerosos sectores'],
      ['shape how we interact', 'voc', 'dar forma a / determinar cómo interactuamos'],
      ['For instance', 'link', 'Por ejemplo'],
      ['can lead to', 'voc', 'puede llevar a / conducir a'],
      ['Similarly', 'link', 'Del mismo modo (paralelismo)'],
      ['help optimise traffic flow', 'src', 'Idea del Text A (GPS y carreteras), transformada con vocabulario propio.'],
      ['Moreover', 'link', 'Además (formal)'],
      ['prohibiting governments and companies from collecting', 'c1', 'prohibit sb FROM + -ing (rección verbal correcta).'],
      ['from my perspective', 'link', 'desde mi punto de vista (inciso)'],
      ['may seriously hinder', 'voc', 'podría frenar seriamente — “hinder” = obstaculizar'],
      ['where there is a high dependency on', 'c1', 'Relativa de lugar “where” aplicada a un concepto abstracto.'],
      ['which ultimately allow us, the users,', 'c1', 'Relativa + aposición “the users” entre comas.'],
      ['However, while acknowledging', 'c1', 'Concesión con participio: “while acknowledging…” = aun reconociendo…'],
      ['it is crucial to address the associated risks', 'voc', 'es crucial abordar los riesgos asociados'],
      ['There is no secret that', 'err', 'Expresión periodística (el examinador lo señala). Además, la forma correcta es “It is no secret that”.', 'It is no secret that'],
      ['data breaches', 'src', 'Idea del Text C (banco al que robaron perfiles) generalizada con vocabulario técnico.'],
      ['hence why', 'link', '“hence” = por lo tanto (formal). “hence why” es coloquial: mejor solo “hence”.'],
      ['should be subject to rigorous auditing', 'c1', 'Pasiva con modal + “be subject to” (estar sujeto a).'],
      ['reflecting the evolving nature of', 'c1', 'Oración de participio que añade información: “reflejando…”.'],
      ['should be established', 'c1', 'Pasiva modal impersonal: típica de propuestas formales.'],
      ['In conclusion', 'link', 'En conclusión'],
      ['Instead,', 'link', 'En su lugar (alternativa)'],
      ['hold companies accountable', 'voc', 'hacer que las empresas rindan cuentas'],
      ['safeguard', 'voc', 'proteger / salvaguardar'],
    ],
    notes: [
      '⭐ <b>El modelo a imitar.</b> Fíjate en la estructura: postura matizada → 2 argumentos a favor → <b>concesión</b> (riesgos) → <b>solución propia</b> → conclusión que recoge todo.',
      'Las fuentes no se citan con “Text A says…”: sus ideas se <b>integran y transforman</b> (GPS → “optimise traffic flow”).',
      'Casi todo es impersonal (pasivas, “it is crucial to”): por eso tiene Style 5.',
      'Solo la penalizan por “There is no secret that” (tono periodístico) y algún “we/us”.',
    ],
  },

  /* ======================= T2 · REPORT (TRAFFIC) ======================= */
  {
    id: 'of-report-5', task: 2, type: 'report', origin: 'official',
    title: 'Traffic report — escrito como una carta', prompt: PROMPT_TRAFFIC,
    scores: { 'Content & org.': [4, 6], 'Use of sources': [4, 6], Language: [4, 6], Style: [3, 6] },
    rationale: 'Both parts of the question are addressed together with supporting details, and textual organisation devices are used to help link ideas sequentially (eg first of all, in addition). The reader feels moderately informed, but a few questions remain (eg Why is it very wrong for someone to have to pay to drive to work?). The writer selects and paraphrases content from both sources to support the new writing purpose. Synthesis is partially successful, although the reference to Text B feels somewhat tagged on. There is some attempt to create distance from other voices (eg they, other people) but this is not entirely successful. Uses both simple and complex structures alongside a range of lexis to communicate their message. There are signs of awkwardness in places (eg run-on sentences, big pollution) but these do not impact comprehensibility. There is clear evidence of control over formal register (eg avoiding contractions) and academic tone (eg softening) across much of the text, but there are also a number of lapses (eg personal pronouns). The intended genre has obviously been misunderstood.',
    paras: [
      { role: 'Saludo (¡no es un report!)', sents: [['Dear city council,', 'Estimado ayuntamiento:']] },
      { role: 'Evaluación de métodos', sents: [
        ['I am very worried about the traffic that is happening in the city and I presonally believe that if try we can find some good methods to reduce it.', 'Me preocupa mucho el tráfico que hay en la ciudad y personalmente creo que, si lo intentamos, podemos encontrar buenos métodos para reducirlo.'],
        ['First of all, I think that is very wrong for someone to pay a specific amount of money to just take his car and drive to his job.', 'En primer lugar, creo que está muy mal que alguien tenga que pagar una cantidad concreta solo por coger el coche e ir al trabajo.'],
        ['And also paying another charge that is not affordable for all the citizens.', 'Y además pagar otra tasa que no todos los ciudadanos pueden permitirse.'],
        ['Although with this charges less and less people were driving in the streets so the environment got cleaner and this big pollution that was happening to it became less.', 'Aunque con estas tasas cada vez menos gente conducía por las calles, así que el ambiente se volvió más limpio y la gran contaminación que había disminuyó.'],
        ['In addition, others transportations were faster and they were doing their job better and many people started to use bicycles for going to their work, which is another benefit to the enviroment.', 'Además, otros transportes eran más rápidos y funcionaban mejor, y mucha gente empezó a ir en bici al trabajo, lo cual es otro beneficio para el medio ambiente.'],
        ['About superblock, is very difficult to adapt this new building design, because is made for big cities that does not have a problem with traffic and becasue it makes busier the main roads.', 'Sobre las supermanzanas, es muy difícil adaptar este nuevo diseño, porque está hecho para grandes ciudades sin problemas de tráfico y porque hace que las vías principales estén más congestionadas.'],
      ] },
      { role: 'Recomendaciones', sents: [
        ['My recommendations in order to reduce this problem that is a headache for a lot of people, is to make a programme about how beneficial is to envirnoment and in our daily life, to use bikes or go by foot in our work, if it is near our house, in order both to avoid traffic and reduce it.', 'Mi recomendación para reducir este problema, que es un quebradero de cabeza para mucha gente, es hacer un programa sobre lo beneficioso que es para el medio ambiente y para nuestra vida diaria ir en bici o a pie al trabajo, si está cerca de casa, tanto para evitar el tráfico como para reducirlo.'],
        ['In addition, I suggest that we could use more transports such us busses, metros and others because they can fit more people and it reduces the amount of cars on the roads.', 'Además, sugiero que usemos más transporte como autobuses, metro y otros, porque caben más personas y se reduce el número de coches en la carretera.'],
        ['I hope my suggestions have been helpful and can solve this problem that bothers many people in the morning that want to get in their work.', 'Espero que mis sugerencias hayan sido útiles y puedan resolver este problema que molesta a mucha gente por la mañana cuando quiere llegar al trabajo.'],
      ] },
      { role: 'Despedida', sents: [['Sincerely,', 'Atentamente,'], ['Adela Valero', 'Adela Valero']] },
    ],
    marks: [
      ['Dear city council,', 'err', 'Un report NO es una carta: lleva título y secciones con encabezado. El examinador dice “the intended genre has obviously been misunderstood”.', 'Report on reducing traffic in the city'],
      ['presonally', 'err', 'Errata.', 'personally'],
      ['if try we can find', 'err', 'Falta el sujeto.', 'if we try, we can find'],
      ['First of all', 'link', 'En primer lugar (secuencia)'],
      ['to pay a specific amount of money', 'src', 'Idea del Text A (tasa de £15), parafraseada.'],
      ['less and less people', 'err', '“people” es contable: fewer and fewer.', 'fewer and fewer people'],
      ['this big pollution', 'err', '“big pollution” no es una colocación natural (el examinador lo cita).', 'the high levels of pollution'],
      ['In addition', 'link', 'Además'],
      ['others transportations', 'err', 'Los adjetivos no llevan -s; “transport” es incontable.', 'other forms of transport'],
      ['About superblock', 'src', 'Referencia al Text B “pegada” sin integrar (“tagged on”, dice el examinador).'],
      ['makes busier the main roads', 'err', 'Orden: make + objeto + adjetivo.', 'makes the main roads busier'],
      ['a headache for a lot of people', 'voc', 'un quebradero de cabeza para mucha gente'],
      ['in order both to avoid traffic and reduce it', 'c1', '“both … and” con finalidad.'],
      ['such us', 'err', 'Errata.', 'such as'],
      ['I hope my suggestions have been helpful', 'err', 'Cierre de carta: en un report, una conclusión impersonal.', 'In conclusion, a combination of these measures would…'],
    ],
    notes: [
      '<b>Lección principal:</b> un report no es una carta. Necesita <b>título + secciones con encabezado</b> (Introduction / Findings / Recommendations).',
      'Usa ideas de las dos fuentes (A: tasa, bicis y autobuses; B: supermanzanas), pero la del Text B queda “pegada” sin integrar.',
      'Párrafos larguísimos con frases encadenadas (“run-on sentences”).',
      'Compáralo con la respuesta 7, que tiene la nota máxima con la misma tarea.',
    ],
  },
  {
    id: 'of-report-6', task: 2, type: 'report', origin: 'official',
    title: 'Traffic report — fuera de tema', prompt: PROMPT_TRAFFIC,
    scores: { 'Content & org.': [2, 6], 'Use of sources': [1, 6], Language: [3, 6], Style: [2, 6] },
    rationale: 'The writer seems to have partly misunderstood the prompt, focusing largely on dangerous driving instead of reducing traffic. Most of the content is irrelevant, but some minimally relevant recommendations (e-scooters and bikes) are put forward. The sources are not used at all. Common lexis and simple structures are used comprehensibly. Despite frequent errors, the reader rarely struggles to understand (eg two cars tracked). In Style, some very limited evidence of formality can be discerned (eg as a result).',
    paras: [
      { role: '(sin estructura)', sents: [
        ['My city hasn’t very good traffics.', 'Mi ciudad no tiene muy buen tráfico.'],
        ['The police and the government don’t do anything so I decited to write this report message.', 'La policía y el gobierno no hacen nada, así que decidí escribir este mensaje de informe.'],
        ['The traffic lights don’t light so much as a resault to be many tracks and also deaths.', 'Los semáforos no funcionan mucho y, como resultado, hay muchos choques y también muertes.'],
        ['Last week out of my house the traffic light didn’t light so two cars tracked and the drivers died.', 'La semana pasada, delante de mi casa, el semáforo no funcionó, dos coches chocaron y los conductores murieron.'],
        ['But the problem is not only about traffic lights but is about drivers.', 'Pero el problema no son solo los semáforos, sino los conductores.'],
        ['87% of the drivers of my town drive dangerously.', 'El 87 % de los conductores de mi pueblo conduce de forma peligrosa.'],
        ['My opinion is that if drivers drive under 80 km they must pay 100$.', 'Mi opinión es que si los conductores conducen por debajo de 80 km deben pagar 100 $.'],
        ['The police must do something.', 'La policía tiene que hacer algo.'],
        ['Also there is a big polution on earth so I say that we must use elctric cars or e- scooters or even better bikes.', 'Además, hay mucha contaminación en la Tierra, así que digo que debemos usar coches eléctricos o patinetes eléctricos, o mejor aún, bicis.'],
        ['Finally teenagers must not drive too young because a lot of teenagers died because they were driving dangerously and fast.', 'Por último, los adolescentes no deben conducir tan jóvenes porque muchos murieron por conducir de forma peligrosa y rápida.'],
        ['I hope you will thing about it and make our town better! Good bye!', '¡Espero que lo penséis y hagáis mejor nuestro pueblo! ¡Adiós!'],
      ] },
    ],
    marks: [
      ['traffics', 'err', '“traffic” es incontable.', 'traffic'],
      ['decited', 'err', 'Ortografía.', 'decided'],
      ['as a resault', 'link', '“as a result” (bien elegido, mal escrito): el único rasgo formal que encuentra el examinador.'],
      ['tracks', 'err', 'Choque = crash.', 'crashes'],
      ['87% of the drivers of my town drive dangerously', 'err', 'Fuera de tema: la tarea es reducir el TRÁFICO, no la conducción peligrosa.', '—'],
      ['elctric cars or e- scooters or even better bikes', 'voc', 'Única recomendación relevante (bicis, patinetes).'],
      ['Good bye!', 'err', 'Totalmente informal para un report.', '—'],
    ],
    notes: [
      '<b>Use of sources 1</b>: no usa ninguna de las dos fuentes.',
      'Habla de accidentes en vez de reducir el tráfico: lee bien la consigna y <b>subraya lo que pide</b>.',
      'Sin párrafos ni encabezados, y con exclamaciones: Style 2.',
    ],
  },
  {
    id: 'of-report-7', task: 2, type: 'report', origin: 'official',
    title: 'Traffic report — banda máxima ⭐', prompt: PROMPT_TRAFFIC,
    scores: { 'Content & org.': [6, 6], 'Use of sources': [5, 6], Language: [6, 6], Style: [5, 6] },
    rationale: 'All aspects of the question are addressed comprehensively, with relevant ideas being supported by plentiful details. Staging and organisation are managed skilfully, while the integration of counter-arguments and rebuttals contribute to a very well-rounded responses. Key ideas and details from both sources are extracted and synthesised in support of the new writing purpose, while citations and reporting verbs are employed to clearly distinguish voices. The candidate exploits a range of complex structures and vocabulary, including some highly sophisticated lexical chunks (eg tailored to local socio-economic and demographic conditions). Meaning is communicated clearly and precisely throughout, with any lapses/errors difficult to spot. All three features of style are applied consistently throughout the text.',
    paras: [
      { role: 'Introducción · objetivo', sents: [
        ['This report addresses the issue of traffic congestion.', 'Este informe aborda el problema de la congestión del tráfico.'],
        ['It aims to evaluate two possible solutions, outlining their respective advantages and disadvantages, and make recommedations for local authorities.', 'Pretende evaluar dos posibles soluciones, exponiendo sus respectivas ventajas e inconvenientes, y hacer recomendaciones a las autoridades locales.'],
      ] },
      { role: 'Solución 1 · Congestion Charge', heading: 'Solution 1 — Congestion Charge', sents: [
        ['In place since 2008, the measure involves charging 15 pounds/day for any car entering central London.', 'Vigente desde 2008, la medida consiste en cobrar 15 libras al día a cualquier coche que entre en el centro de Londres.'],
      ] },
      { role: 'Ventajas (Text A)', heading: 'Advantages', sents: [
        ['According to Marie Mulligan of London News, the charge has resulted in a reduced number of cars circulating in the city centre as people opted for bikes or public transportation for leisure activities.', 'Según Marie Mulligan, de London News, la tasa ha reducido el número de coches que circulan por el centro, ya que la gente optó por la bici o el transporte público para el ocio.'],
        ['In turn, noise and air pollution has decreased and public transportation has become more efficient due to fewer cars competing for space.', 'A su vez, el ruido y la contaminación del aire han disminuido y el transporte público se ha vuelto más eficiente al haber menos coches compitiendo por el espacio.'],
      ] },
      { role: 'Inconvenientes (Text A + cálculo propio)', heading: 'Disadvantages', sents: [
        ['People travelling to London for work or business are negatively impacted by the daily 15 pound charge.', 'Las personas que van a Londres por trabajo o negocios se ven perjudicadas por la tasa diaria de 15 libras.'],
        ['Over 20 wroking days, this amounts to 300 pounds, a significant reduction in one’s monthly income.', 'En 20 días laborables, esto supone 300 libras, una reducción importante de los ingresos mensuales.'],
      ] },
      { role: 'Solución 2 · Superblocks (Text B)', heading: 'Solution 2 — ‘Superblocks’', sents: [
        ['A city planning solution which entails blocking all but residential traffic in a certain area of the city, often called a ‘superblock’.', 'Una solución urbanística que consiste en bloquear todo el tráfico salvo el de los residentes en una zona de la ciudad, a menudo llamada “supermanzana”.'],
      ] },
      { role: 'Ventajas', heading: 'Advantages', sents: [
        ['The space previously taken up by cars is reclaimed and used for leisure activities for pedestrians.', 'El espacio que antes ocupaban los coches se recupera y se destina al ocio de los peatones.'],
      ] },
      { role: 'Inconvenientes (análisis propio)', heading: 'Disadvantages', sents: [
        ['It does not reduce or eliminate traffic, it merely diverts it to nearby roads which are likely to become even more congested.', 'No reduce ni elimina el tráfico: simplemente lo desvía a calles cercanas, que probablemente se congestionarán aún más.'],
        ['Non-residents are unlikely to feel any positive effects, and in fact those living just outside the superblock limits may even feel an increase in traffic in their street.', 'Es poco probable que los no residentes noten efectos positivos y, de hecho, quienes viven justo fuera de los límites de la supermanzana podrían incluso notar más tráfico en su calle.'],
      ] },
      { role: 'Recomendaciones', heading: 'Recommendations', sents: [
        ['A mixed approach, tailored to local socio-economic and demographic conditions is recommneded.', 'Se recomienda un enfoque mixto, adaptado a las condiciones socioeconómicas y demográficas locales.'],
        ['Cities with a regular, grid-like street pattern may find superblocks easy to implement.', 'A las ciudades con calles regulares, en cuadrícula, les puede resultar fácil implantar supermanzanas.'],
        ['However, careful research into the effects of diverting traffic around the super-block is essential.', 'Sin embargo, es esencial estudiar con cuidado los efectos de desviar el tráfico alrededor de la supermanzana.'],
        ['In addition, a congestion charge scheme could also be introduced in areas used for leisure.', 'Además, también podría introducirse un sistema de tasa de congestión en zonas de ocio.'],
        ['Professionals travelling for work could be deemed exempt.', 'Los profesionales que se desplazan por trabajo podrían quedar exentos.'],
      ] },
    ],
    marks: [
      ['This report addresses the issue of', 'c1', 'Apertura de report de manual: “Este informe aborda…”.'],
      ['It aims to evaluate', 'c1', 'Objetivo del report: “aims to + infinitivo”.'],
      ['outlining their respective advantages and disadvantages', 'c1', 'Oración de participio que resume el contenido.'],
      ['In place since 2008', 'c1', 'Frase de participio/adjetivo al inicio en lugar de “It has been in place since…”.'],
      ['involves charging', 'c1', 'involve + -ing = consistir en.'],
      ['According to Marie Mulligan of London News', 'src', 'Cita la fuente con el nombre del autor y el medio: distingue voces.'],
      ['has resulted in', 'voc', 'ha dado lugar a'],
      ['opted for', 'voc', 'optaron por'],
      ['In turn', 'link', 'A su vez (consecuencia encadenada)'],
      ['due to fewer cars competing for space', 'c1', '“due to + sustantivo + -ing”: causa expresada de forma compacta.'],
      ['are negatively impacted by', 'c1', 'Pasiva: “se ven afectados negativamente por”.'],
      ['this amounts to 300 pounds', 'c1', 'amount to = ascender a. Añade un CÁLCULO PROPIO a partir de la fuente: eso es “transformar” la información.'],
      ['wroking', 'err', 'Errata.', 'working'],
      ['entails blocking all but residential traffic', 'c1', 'entail + -ing = implicar; “all but X” = todo excepto X.'],
      ['is reclaimed', 'voc', 'se recupera (espacio)'],
      ['it merely diverts it', 'c1', '“merely” = simplemente: matiza y critica la solución.'],
      ['are likely to become', 'c1', 'be likely to = es probable que (hedging).'],
      ['are unlikely to feel', 'c1', 'be unlikely to = es poco probable que.'],
      ['and in fact', 'link', 'y de hecho (refuerzo)'],
      ['may even feel', 'c1', 'Modal + “even” para subrayar un efecto inesperado.'],
      ['A mixed approach, tailored to local socio-economic and demographic conditions', 'voc', 'un enfoque mixto, adaptado a las condiciones socioeconómicas y demográficas locales (el examinador lo destaca)'],
      ['is recommneded', 'err', 'Errata.', 'is recommended'],
      ['may find superblocks easy to implement', 'c1', 'find + objeto + adjetivo + to-infinitive.'],
      ['However,', 'link', 'Sin embargo'],
      ['careful research into', 'voc', 'una investigación minuciosa sobre'],
      ['could be deemed exempt', 'c1', 'Pasiva modal + “deem” (considerar, formal) + adjetivo.'],
    ],
    notes: [
      '⭐ <b>Este es el formato de report que hay que copiar:</b> título/objetivo → Solución 1 (ventajas / inconvenientes) → Solución 2 (ventajas / inconvenientes) → Recomendaciones.',
      '<b>Cero “I”</b>: todo es impersonal (“It aims to…”, “is recommended”, “could be deemed”).',
      'Transforma la fuente con un <b>cálculo propio</b> (15 £ × 20 días = 300 £) y un análisis propio (las supermanzanas solo desvían el tráfico).',
      'Encabezados cortos y frases densas: unas 250 palabras muy bien aprovechadas.',
    ],
  },
  {
    id: 'of-report-8', task: 2, type: 'report', origin: 'official',
    title: 'Traffic report — bien organizado, pocas fuentes', prompt: PROMPT_TRAFFIC,
    scores: { 'Content & org.': [4, 6], 'Use of sources': [3, 6], Language: [5, 6], Style: [4, 6] },
    rationale: 'Puntuación oficial: Content & organisation 4 · Use of sources 3 · Language 5 · Style 4. (La guía no incluye justificación escrita para esta respuesta; las notas en español son propias.)',
    paras: [
      { role: 'Título', heading: 'The impact of traffic in the city', sents: [] },
      { role: 'Introducción', heading: 'INTRODUCTION', sents: [
        ['Pollution is one of the biggest problems in nowadays society and one of the main constituents is, of course, traffic.', 'La contaminación es uno de los mayores problemas de la sociedad actual y uno de sus principales componentes es, por supuesto, el tráfico.'],
        ['In this report you shall receive a few ideas that might help in the process of reducing the impact of the traffic.', 'En este informe recibirá algunas ideas que podrían ayudar a reducir el impacto del tráfico.'],
      ] },
      { role: 'Medida 1 (Text A)', heading: 'ADDING CHARGES FOR PERSONAL CARS', sents: [
        ['For each of us is easier to drive to work, to school, to concerts.', 'Para cada uno de nosotros es más fácil ir en coche al trabajo, al colegio, a conciertos.'],
        ['Therefore adding fees and charges, will make a considerable percent of the population to switch to public transport or to bikes.', 'Por lo tanto, añadir tasas y cargos hará que un porcentaje considerable de la población se pase al transporte público o a la bici.'],
      ] },
      { role: 'Medida 2 (Text B)', heading: 'CREATING SUPERBLOCKS', sents: [
        ['Indeed, having micro neighbourhoods where there are no cars is essential for a balanced healthier life.', 'De hecho, tener microbarrios sin coches es esencial para una vida más equilibrada y sana.'],
        ['Developing green spaces and parks, promoting walks and spending time outdoors would improve everyday life considerably.', 'Crear zonas verdes y parques, fomentar los paseos y pasar tiempo al aire libre mejoraría considerablemente el día a día.'],
        ['Moreover, combining superblocks with the fees mentioned above would have a double effect.', 'Además, combinar las supermanzanas con las tasas mencionadas tendría un doble efecto.'],
      ] },
      { role: 'Medida 3 (propia)', heading: 'FREE ALTERNATIVES TO PUBLIC TRANSPORTATION', sents: [
        ['Another idea would be to adopt healthier free alternatives for citizens who want to use the public transportation.', 'Otra idea sería adoptar alternativas gratuitas y más saludables para los ciudadanos que quieran usar el transporte público.'],
        ['For example 1 bus ticked could equivalate 3 squads.', 'Por ejemplo, un billete de autobús podría equivaler a 3 sentadillas.'],
      ] },
      { role: 'Conclusión', heading: 'CONCLUSION', sents: [
        ['Taking into consideration all the ideas mentioned before, I reckon that the city council might implement the measure brought to attention.', 'Teniendo en cuenta todas las ideas mencionadas, creo que el ayuntamiento podría aplicar la medida expuesta.'],
      ] },
    ],
    marks: [
      ['in nowadays society', 'err', '“nowadays” es adverbio, no adjetivo.', "in today's society"],
      ['one of the main constituents', 'voc', 'uno de los principales componentes'],
      ['you shall receive', 'err', 'Registro raro y personal: en un report, impersonal.', 'this report sets out'],
      ['For each of us is easier', 'err', 'Falta el sujeto “it”.', 'It is easier for most people'],
      ['Therefore', 'link', 'Por lo tanto'],
      ['will make a considerable percent of the population to switch', 'err', 'make + objeto + infinitivo SIN “to”; “percent” → percentage.', 'will make a considerable percentage of the population switch'],
      ['Indeed', 'link', 'De hecho (refuerzo)'],
      ['would improve everyday life considerably', 'c1', 'Condicional + adverbio de grado al final.'],
      ['Moreover', 'link', 'Además'],
      ['the fees mentioned above', 'c1', 'Participio reducido: “(which were) mentioned above”.'],
      ['would have a double effect', 'voc', 'tendría un doble efecto'],
      ['1 bus ticked could equivalate 3 squads', 'err', 'Idea poco seria y errores (ticket; equivalate no existe → be equivalent to).', 'a bus ticket could be exchanged for…'],
      ['Taking into consideration', 'c1', 'Oración de participio para abrir la conclusión.'],
      ['I reckon that', 'err', '“reckon” es coloquial: no encaja en un report formal.', 'it is recommended that'],
    ],
    notes: [
      'Buena <b>organización con encabezados</b> (eso sí es un report), pero las fuentes apenas se usan: no cita ni distingue voces → Use of sources 3.',
      'Mezcla de registros: “you shall receive”, “I reckon” no encajan en un report formal.',
      'Compáralo con la respuesta 7: misma estructura con encabezados, pero aquella usa la fuente con datos (£15) y verbos de referencia.',
    ],
  },
);
