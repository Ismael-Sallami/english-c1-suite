/*
 * MODELOS C1 de elaboración propia para consignas oficiales de Trinity ISE Digital
 * (examen de ejemplo C1-C2, demo oficial y guías de corrección) y alguna consigna de práctica.
 * Escritos para leer y aprender: lenguaje natural y preciso, dentro del límite de palabras.
 */
window.WRITINGS = window.WRITINGS || [];

const PROMPT_FORUM_ADS = {
  text: 'Read these messages from an online discussion. Write an answer and respond to both your teacher and Luke.',
  thread: [
    { who: 'Ms Davies', role: 'teacher', text: 'Hello class! Here is the topic we are discussing this week: Nowadays, we see advertising everywhere we look. How does this affect our society? Please write your opinion below.' },
    { who: 'Luke', text: 'I don’t think adverts have a strong effect on people at all. We can ignore them if we want to.' },
  ],
  words: '~70 (máx. 90) · 5 min',
  origin: 'Consigna oficial · guía “How to prepare for ISE Digital C1–C2” (es la tarea 1 del examen de ejemplo C1‑C2)',
};

const SUMMER_SOURCES = [
  { label: 'Text A', title: 'Loxford School Website: Careers Advice', content: 'If you have never had a job before, you might want to think about looking for one this summer. Although it is nice to have a break from your studies, you could be acquiring new skills instead, benefitting your future career as well as your bank account. Summer jobs provide you with the opportunity to work with others and learn new things. If you have trouble getting up for class, a summer job will help you to become more responsible as others will depend on you. Even filling in an application form or being interviewed is good practice. Remember, it is not just about the money. Don’t delay! Click on the following link for information. If you need further advice, book a tutorial with one of our team.' },
  { label: 'Text B', title: 'Student Magazine: Tania’s Blog — Final day at work', content: 'Some might be surprised to hear this, but I am actually quite glad the summer is nearly over. I’m looking forward to going back to school and having more free time. Despite putting aside money for university next year, it’s been exhausting. Everyone is off in August, so the restaurants are always crowded. As a result, I’ve had to work long shifts, but now I am worrying about completing my summer assignments in time. However, I have met some great people. When you work as a team, you learn a lot about getting on with others, especially when under pressure. I’m actually going to meet up with some of them next month. My boss was also really proud of the way I dealt with customers too – it’s helped me to be more confident. I found it hard to turn down extra shifts, but now I realise that it’s also important to find the right balance. After all, you can’t do the same thing for all of the summer holidays.' },
];

const CAREER_SOURCES = [
  { label: 'Text A', title: 'Tips to hire the best candidate — Business Today, Stephen Moore', content: 'In today’s competitive market, hiring managers must make sure their recruitment strategy brings in the best employees. Most managers look for candidates with many years of experience. After all, it is said that it takes about 10,000 hours of training for someone to become a specialist in their field. But here are some suggestions for what else managers should consider when hiring new staff. Avoid candidates who have changed career many times during their working life. They might not be reliable. Check their personality, as they must fit with the rest of your staff. Consider candidates who are fast learners or work hard, even if they don’t have the right skills or experience yet.' },
  { label: 'Text B', title: 'Career Talk — Edith Wright', content: 'Ever since I was a girl, I wanted to be a teacher. Both my parents were teachers and I loved helping my brother with his homework. I worked hard at school and then did a teaching course at university. But in my first year of teaching, I realised I didn’t have the right personality. My early decision to be a teacher made me unhappy, so I investigated other jobs. Luckily, I found a new direction for my life – I’m now a scientist. Changing careers wasn’t easy. It took me 10 years and different courses to find the perfect path, but that long journey was important. I now know what my interests and abilities are, I learnt many different skills, and I’m better at solving problems. But the most important thing I’ve learned is that it’s never too late to find what makes you happy. Today, I work in a small team, and I never get bored as I’m always doing something different.' },
  { label: 'Text C', title: 'How to become a great athlete — www.allaboutsports.com', content: 'I read a book about becoming a great athlete recently. Some information was rather obvious, like getting friends and family to encourage and help you. Two things I found most useful were: Start as soon as you can – you’ll be more confident. Repeat the same training frequently – you’ll improve quicker. If you’re young and want to become an athlete, it’s an interesting book to read. — Sandie, Liverpool' },
];

window.WRITINGS.push(
  /* ======================= T1 · FORO ======================= */
  {
    id: 'mo-forum-ads', task: 1, type: 'forum', origin: 'model',
    title: 'Advertising everywhere (Ms Davies & Luke)', prompt: PROMPT_FORUM_ADS,
    paras: [
      { role: 'Responde a la profesora', sents: [
        ['Thanks for the topic, Ms Davies.', 'Gracias por el tema, Ms Davies.'],
        ['I think constant advertising shapes our society far more than we realise, especially what we consider “normal” to own.', 'Creo que la publicidad constante moldea nuestra sociedad mucho más de lo que creemos, sobre todo lo que consideramos “normal” tener.'],
      ] },
      { role: 'Responde a Luke (matiza)', sents: [
        ['I see your point, Luke, but ignoring adverts isn’t that simple.', 'Entiendo lo que dices, Luke, pero ignorar los anuncios no es tan sencillo.'],
        ['Not only are they tailored to our online searches, but they also appear in videos made by people we trust.', 'No solo están adaptados a nuestras búsquedas en internet, sino que también aparecen en vídeos de gente en la que confiamos.'],
      ] },
      { role: 'Cierre abierto', sents: [
        ['Perhaps the real question is whether we notice how they influence us.', 'Quizá la verdadera pregunta es si nos damos cuenta de cómo nos influyen.'],
      ] },
    ],
    marks: [
      ['Thanks for the topic, Ms Davies.', 'c1', 'Nombra a la profesora: cumple la primera parte (“respond to your teacher”).'],
      ['shapes our society', 'voc', 'moldea / da forma a nuestra sociedad'],
      ['far more than we realise', 'c1', '“far + comparativo” para intensificar.'],
      ['I see your point, Luke, but', 'c1', 'Desacuerdo EDUCADO: reconoce primero la idea de Luke y luego matiza. Es lo que pide Style.'],
      ["isn’t that simple", 'voc', 'no es tan sencillo (“that” = tan, coloquial-neutro)'],
      ['Not only are they tailored', 'c1', 'Inversión: Not only + auxiliar + sujeto… but … also.'],
      ['tailored to', 'voc', 'adaptados a / hechos a medida de'],
      ['people we trust', 'c1', 'Relativa sin “that/who”.'],
      ['Perhaps the real question is whether', 'c1', 'Frase de cierre que abre debate: “whether” = si (opción).'],
    ],
    notes: [
      'Estructura de foro: <b>profesora → Luke → cierre</b>. Cada participante tiene su frase.',
      'Dentro del rango (70–90): suficiente para dos ideas con razones.',
      'Registro neutro: contracciones (isn’t), pero sin jerga.',
    ],
  },
  {
    id: 'mo-forum-tracking', task: 1, type: 'forum', origin: 'model',
    title: 'Internet tracking — versión C1 (compárala con las oficiales)', prompt: PROMPT_FORUM_MAXINE,
    paras: [
      { role: 'Responde a la profesora', sents: [
        ['Interesting topic, Ms Lang!', '¡Tema interesante, Ms Lang!'],
        ['In my view, tracking isn’t harmful in itself; what matters is how the data is used.', 'En mi opinión, el rastreo no es perjudicial en sí mismo; lo que importa es cómo se usan los datos.'],
      ] },
      { role: 'Responde a Maxine', sents: [
        ['I understand your concern, Maxine, and you’re right that information could be used to control people.', 'Entiendo tu preocupación, Maxine, y tienes razón en que la información podría usarse para controlar a la gente.'],
        ['However, the same data also helps us, for instance by showing which roads are busy.', 'Sin embargo, esos mismos datos también nos ayudan, por ejemplo mostrando qué carreteras están colapsadas.'],
      ] },
      { role: 'Propuesta', sents: [
        ['Rather than banning it, we should demand clear rules and the right to say no.', 'En lugar de prohibirlo, deberíamos exigir normas claras y el derecho a decir que no.'],
      ] },
    ],
    marks: [
      ['Interesting topic, Ms Lang!', 'c1', 'Saluda a la profesora: así responde a las dos personas (lo que no hizo la respuesta oficial 2).'],
      ['In my view', 'link', 'En mi opinión (mejor que “according to me”).'],
      ['in itself', 'voc', 'en sí mismo'],
      ['what matters is', 'c1', 'Cleft sentence: “lo que importa es…”.'],
      ['I understand your concern, Maxine', 'c1', 'Reconoce la preocupación de Maxine antes de matizar.'],
      ['you’re right that', 'voc', 'tienes razón en que'],
      ['However,', 'link', 'Sin embargo'],
      ['for instance', 'link', 'por ejemplo'],
      ['Rather than banning it', 'c1', '“Rather than + -ing” = en lugar de…'],
      ['demand clear rules', 'voc', 'exigir normas claras'],
    ],
    notes: [
      'Compárala con la oficial 1 (Content 4): aquí hay un <b>ejemplo concreto</b> (las carreteras) y una <b>propuesta</b>, así que el lector no se queda con dudas.',
      'Desacuerdo educado: “I understand your concern… However…”.',
    ],
  },

  /* ======================= T1 · EMAIL ======================= */
  {
    id: 'mo-email-cafeteria', task: 1, type: 'email', origin: 'model',
    title: 'Cafeteria feedback — versión C1', prompt: PROMPT_EMAIL_CAFETERIA,
    paras: [
      { role: 'Saludo', sents: [['Dear Mrs Sanders,', 'Estimada Sra. Sanders:']] },
      { role: 'Bullet 1 · comodidad', sents: [
        ['Thank you for asking for our views.', 'Gracias por pedir nuestra opinión.'],
        ['The new cafeteria is bright and comfortable, although it gets rather crowded at lunchtime, so a few more tables would make a real difference.', 'La nueva cafetería es luminosa y cómoda, aunque se llena bastante a la hora de comer, así que unas cuantas mesas más se notarían mucho.'],
      ] },
      { role: 'Bullet 2 · menú', sents: [
        ['As for the menu, it would be great if you could offer more healthy and vegetarian options, as well as gluten-free dishes for students with allergies.', 'En cuanto al menú, sería estupendo que pudieran ofrecer más opciones sanas y vegetarianas, además de platos sin gluten para los alumnos con alergias.'],
      ] },
      { role: 'Despedida', sents: [['Kind regards,', 'Un saludo cordial,'], ['Ismael', 'Ismael']] },
    ],
    marks: [
      ['Dear Mrs Sanders,', 'c1', 'Saludo formal-neutro a una profesora.'],
      ['Thank you for asking for our views.', 'c1', 'Primera frase cortés que conecta con el email recibido.'],
      ['bright and comfortable', 'voc', 'luminosa y cómoda'],
      ['although it gets rather crowded', 'c1', 'Concesión: elogia y matiza en la misma frase.'],
      ['would make a real difference', 'voc', 'se notaría mucho / supondría una gran diferencia'],
      ['As for the menu', 'link', 'En cuanto a… (cambia de tema: bullet 2)'],
      ['it would be great if you could', 'c1', 'Sugerencia muy educada: condicional + could (mejor que “maybe you can”).'],
      ['as well as', 'link', 'además de'],
      ['gluten-free dishes', 'voc', 'platos sin gluten'],
      ['Kind regards,', 'c1', 'Despedida neutra-formal.'],
    ],
    notes: [
      'Mismo contenido que la oficial 4 (Content 5), pero <b>sin repetir “maybe you can add”</b> y sin errores → Language 5.',
      'Un párrafo para cada bullet. Conector “As for…” para pasar al segundo.',
    ],
  },
  {
    id: 'mo-email-extension', task: 1, type: 'email', origin: 'model',
    title: 'Pedir una prórroga al tutor (email formal)',
    prompt: {
      text: 'Your tutor, Dr Green, has emailed the class to remind you that the essay deadline is this Friday. Write a reply to:',
      bullets: ['apologise and explain why you need more time', 'ask for an extension and offer something in return'],
      thread: [{ who: 'Dr Green', text: 'Dear all, Just a reminder that your 2,000-word essays are due this Friday at 5 pm. Please email me if you have any questions. Best, Dr Green' }],
      words: '~70 (máx. 90) · 5 min',
      origin: 'Consigna de práctica (versión B: email), de elaboración propia',
    },
    paras: [
      { role: 'Saludo + contexto', sents: [['Dear Dr Green,', 'Estimado Dr. Green:'], ['Thank you for the reminder.', 'Gracias por el recordatorio.']] },
      { role: 'Bullet 1 · disculpa + motivo', sents: [
        ['I am sorry to ask, but I have been ill for most of this week and have fallen behind with my essay.', 'Siento tener que pedirlo, pero he estado enfermo casi toda la semana y me he retrasado con el ensayo.'],
      ] },
      { role: 'Bullet 2 · petición + oferta', sents: [
        ['Would it be possible to submit it next Wednesday instead?', '¿Sería posible entregarlo el próximo miércoles?'],
        ['I would be happy to send you a detailed outline by Friday so that you can see how it is progressing.', 'Con gusto le enviaría un esquema detallado antes del viernes para que pueda ver cómo avanza.'],
      ] },
      { role: 'Cierre', sents: [['I look forward to hearing from you.', 'Quedo a la espera de su respuesta.'], ['Kind regards,', 'Un saludo cordial,'], ['Ismael', 'Ismael']] },
    ],
    marks: [
      ['Thank you for the reminder.', 'c1', 'Conecta con el email recibido.'],
      ['I am sorry to ask, but', 'c1', 'Disculpa formal: sin contracciones (I am, no I’m).'],
      ['have fallen behind with', 'voc', 'me he retrasado con (fall behind with sth)'],
      ['Would it be possible to', 'c1', 'Petición formal indirecta.'],
      ['instead', 'link', 'en su lugar'],
      ['I would be happy to', 'c1', 'Ofrecimiento formal.'],
      ['so that you can see', 'link', 'para que (finalidad con sujeto distinto)'],
      ['I look forward to hearing from you.', 'c1', 'Cierre formal fijo: look forward to + -ing.'],
    ],
    notes: [
      'Email formal: <b>sin contracciones</b>, saludo “Dear Dr …,” y despedida “Kind regards,”.',
      'Hace las tres funciones de la versión B: <b>disculparse, pedir y ofrecer</b>.',
    ],
  },

  /* ======================= T1 · CHAT ======================= */
  {
    id: 'mo-chat-mia', task: 1, type: 'chat', origin: 'model',
    title: 'Newspaper or website? — versión C1 matizada', prompt: PROMPT_CHAT_MIA,
    paras: [
      { role: 'Responde a Mia (acuerdo parcial)', sents: [
        ['Good point, Mia — hardly anyone reads paper newspapers these days.', 'Buena observación, Mia: hoy en día casi nadie lee periódicos en papel.'],
        ['That said, we could keep the newspaper idea but publish it online, so the teacher still gets what she asked for.', 'Dicho esto, podríamos mantener la idea del periódico pero publicarlo en internet, para que la profesora tenga lo que pidió.'],
      ] },
      { role: 'Bullet 2 · qué incluir', sents: [
        ['How about a short news section, interviews with teachers and a page where students review films and games?', '¿Qué tal una sección corta de noticias, entrevistas a profesores y una página donde los alumnos reseñen películas y juegos?'],
        ['A weekly “student of the month” profile would also make it feel more personal.', 'Un perfil semanal del “alumno del mes” también lo haría más cercano.'],
      ] },
      { role: 'Cierre al grupo', sents: [['Kai, would you mind doing the interviews?', 'Kai, ¿te importaría encargarte de las entrevistas?']] },
    ],
    marks: [
      ['Good point, Mia', 'c1', 'Responde a Mia por su nombre en la primera línea.'],
      ['hardly anyone', 'c1', '“hardly anyone” = casi nadie (más natural que “almost nobody”).'],
      ['That said,', 'link', 'Dicho esto (matiza lo anterior; muy natural en registro neutro).'],
      ['so the teacher still gets what she asked for', 'c1', 'Finalidad + relativa con preposición al final (“what she asked for”).'],
      ['How about', 'c1', 'How about + sustantivo / -ing: sugerencia informal.'],
      ['review films and games', 'voc', 'reseñar películas y juegos'],
      ['would you mind doing', 'c1', 'Petición educada: would you mind + -ing.'],
      ['would also make it feel more personal', 'c1', 'make + objeto + verbo sin “to” (make it feel).'],
    ],
    notes: [
      'Diferencia con la oficial 6: aquí el acuerdo es <b>parcial</b> (propone un compromiso), que también es válido y muestra más matiz.',
      'Termina implicando a otro miembro del grupo (Kai): interacción real.',
    ],
  },
  {
    id: 'mo-chat-bookclub', task: 1, type: 'chat', origin: 'model',
    title: 'Organise a book club (demo oficial)',
    prompt: {
      text: 'You are working on a group project for school. Write a message to your group to:',
      bullets: ['respond to Lilly', 'ask the group to help you with something'],
      groupTitle: 'Group project: Organise a book club',
      thread: [{ who: 'Lilly', text: 'I’m worried about time. We only have two weeks and there’s so much to do!' }],
      words: '~70 (máx. 90) · 5 min',
      origin: 'Consigna de la demo oficial de Trinity (Writing example tasks)',
    },
    paras: [
      { role: 'Responde a Lilly (tranquiliza)', sents: [
        ['Don’t worry, Lilly — two weeks is plenty if we split the work sensibly.', 'No te preocupes, Lilly: dos semanas son más que suficientes si nos repartimos bien el trabajo.'],
        ['I’ve already drafted a timeline, which I’ll share tonight.', 'Ya he hecho un borrador del calendario, que compartiré esta noche.'],
      ] },
      { role: 'Bullet 2 · pedir ayuda', sents: [
        ['Could someone help me choose the first three books?', '¿Podría alguien ayudarme a elegir los tres primeros libros?'],
        ['Ideally, they should be short enough to read in a week but interesting enough to discuss.', 'Lo ideal es que sean lo bastante cortos para leerlos en una semana, pero lo bastante interesantes para comentarlos.'],
        ['After that, each of us could lead one session, which would share the workload fairly.', 'Después, cada uno podría dirigir una sesión, lo que repartiría el trabajo de forma justa.'],
      ] },
      { role: 'Cierre', sents: [['Shall we vote on Friday?', '¿Votamos el viernes?']] },
    ],
    marks: [
      ['Don’t worry, Lilly', 'c1', 'Responde directamente a la preocupación de Lilly.'],
      ['is plenty', 'voc', 'es más que suficiente'],
      ['split the work', 'voc', 'repartirse el trabajo'],
      ['which I’ll share tonight', 'c1', 'Relativa explicativa con “which”.'],
      ['Could someone help me', 'c1', 'Petición: cumple el bullet 2.'],
      ['Ideally,', 'link', 'Lo ideal es que…'],
      ['short enough to read in a week but interesting enough to discuss', 'c1', 'Paralelismo con “adj + enough + to-infinitive”.'],
      ['Shall we', 'c1', 'Shall we…? = propuesta para el grupo.'],
      ['which would share the workload fairly', 'c1', 'Relativa “which” que comenta toda la idea anterior.'],
    ],
    notes: [
      'La respuesta de ejemplo de la demo tenía 58 palabras y frases flojas (“to make it easier”). Esta versión llega a ~70 con una estructura de C1 en cada frase.',
      'Estructura: <b>tranquilizar → plan → petición concreta → pregunta al grupo</b>.',
    ],
  },

  /* ======================= T2 · REPORT ======================= */
  {
    id: 'mo-report-summer', task: 2, type: 'report', origin: 'model',
    title: 'Summer employment for students (examen de ejemplo C1‑C2)',
    prompt: {
      text: 'Write a formal report for a youth employment office about summer employment for students. In your report, you should:',
      bullets: ['evaluate the benefits and drawbacks of summer employment', 'make recommendations', 'You MUST use ideas from the texts AND your own ideas.', 'You MUST NOT copy from the texts.'],
      sources: SUMMER_SOURCES,
      words: '~250 (máx. 300) · 35 min',
      origin: 'Consigna oficial · examen de ejemplo C1‑C2 (“MAT_DW_T2R_24_0046 Summer Employment”) y guía “How to prepare”',
    },
    paras: [
      { role: 'Título', heading: 'Summer Employment for Students', sents: [] },
      { role: 'Introducción · objetivo + fuentes', heading: 'Introduction', sents: [
        ['This report evaluates the advantages and disadvantages of summer jobs for students and makes recommendations on how the office could support young workers.', 'Este informe evalúa las ventajas e inconvenientes de los trabajos de verano para estudiantes y hace recomendaciones sobre cómo la oficina podría apoyar a los jóvenes trabajadores.'],
        ['It draws on advice from a school careers website and the experience of a student who has just finished a summer job.', 'Se basa en los consejos de la web de orientación de un instituto y en la experiencia de una alumna que acaba de terminar un trabajo de verano.'],
      ] },
      { role: 'Beneficios (Text A + Text B)', heading: 'Benefits', sents: [
        ['Summer work clearly offers more than a salary.', 'El trabajo de verano ofrece claramente algo más que un sueldo.'],
        ['According to the school’s careers advice, even applying and being interviewed provides useful preparation for future employment, while knowing that colleagues rely on them makes students more responsible.', 'Según la orientación del instituto, incluso solicitar el puesto y hacer la entrevista prepara para futuros empleos, y saber que los compañeros dependen de ellos hace a los estudiantes más responsables.'],
        ['This is supported by Tania’s account: dealing with customers under pressure noticeably increased her confidence, and she formed friendships through teamwork.', 'Lo confirma el relato de Tania: atender a clientes bajo presión aumentó notablemente su confianza, e hizo amistades gracias al trabajo en equipo.'],
        ['Financially, too, a summer job allows students to set money aside for their future studies, as Tania managed to do for university.', 'También en lo económico, un trabajo de verano permite a los estudiantes ahorrar para sus estudios, como consiguió hacer Tania para la universidad.'],
      ] },
      { role: 'Inconvenientes (Text B + idea propia)', heading: 'Drawbacks', sents: [
        ['However, the same account reveals the main risk.', 'Sin embargo, el mismo relato revela el principal riesgo.'],
        ['Because restaurants are busiest in August, Tania worked long shifts and found it difficult to refuse extra hours, which left her exhausted and behind with her school assignments.', 'Como los restaurantes tienen más trabajo en agosto, Tania hizo turnos largos y le costó rechazar horas extra, lo que la dejó agotada y retrasada con las tareas del instituto.'],
        ['Young employees may also be reluctant to say no to an employer for fear of losing the job.', 'Además, los empleados jóvenes pueden ser reacios a decir que no a un jefe por miedo a perder el trabajo.'],
        ['Furthermore, peak-season work in hospitality tends to be repetitive, which limits how much students actually learn.', 'Además, el trabajo en hostelería en temporada alta suele ser repetitivo, lo que limita lo que los estudiantes aprenden realmente.'],
      ] },
      { role: 'Recomendaciones (ideas propias)', heading: 'Recommendations', sents: [
        ['The office should therefore:', 'Por lo tanto, la oficina debería:'],
        ['• publish clear guidance on maximum weekly hours for students;', '• publicar una guía clara sobre el máximo de horas semanales para estudiantes;'],
        ['• run short workshops on applications, interviews and saying no politely;', '• organizar talleres breves sobre solicitudes, entrevistas y cómo decir que no con educación;'],
        ['• encourage employers to offer flexible shifts during exam and assignment periods.', '• animar a las empresas a ofrecer turnos flexibles en épocas de exámenes y entregas.'],
      ] },
      { role: 'Conclusión', heading: 'Conclusion', sents: [
        ['On balance, summer jobs are highly beneficial, provided that students are helped to strike a healthy balance between work, study and rest.', 'En conjunto, los trabajos de verano son muy beneficiosos, siempre que se ayude a los estudiantes a encontrar un equilibrio sano entre trabajo, estudio y descanso.'],
      ] },
    ],
    marks: [
      ['This report evaluates', 'c1', 'Apertura de report: objetivo en presente, impersonal.'],
      ['makes recommendations on', 'voc', 'hace recomendaciones sobre'],
      ['It draws on', 'src', 'Presenta las fuentes sin copiarlas: “se basa en…”.'],
      ['offers more than a salary', 'c1', 'Frase temática (topic sentence) que resume el párrafo.'],
      ['According to the school’s careers advice', 'src', 'Cita el Text A describiéndolo, sin copiar su frase.'],
      ['provides useful preparation for future employment', 'src', 'Paráfrasis de “Even filling in an application form or being interviewed is good practice”.'],
      ['while', 'link', 'mientras que / y además (une dos ideas)'],
      ['knowing that colleagues rely on them makes students more responsible', 'c1', 'Gerundio como sujeto (“knowing that… makes…”).'],
      ['This is supported by Tania’s account', 'src', 'Conecta dos fuentes (síntesis): el Text B confirma el Text A.'],
      ['noticeably increased her confidence', 'voc', 'aumentó notablemente su confianza'],
      ['Financially, too,', 'link', 'Adverbio de punto de vista: “en lo económico, también…”.'],
      ['set money aside', 'voc', 'ahorrar / apartar dinero (paráfrasis de “putting aside money” del Text B)'],
      ['However,', 'link', 'Sin embargo (cambio a inconvenientes)'],
      ['reveals the main risk', 'voc', 'revela el principal riesgo'],
      ['found it difficult to refuse', 'c1', 'find it + adj + to-infinitive.'],
      ['which left her exhausted and behind with', 'c1', 'Relativa que se refiere a toda la frase anterior (“lo que…”).'],
      ['may also be reluctant to', 'c1', 'Idea PROPIA con matiz (may) que generaliza lo que le pasó a Tania.'],
      ['for fear of losing', 'c1', 'for fear of + -ing = por miedo a.'],
      ['Furthermore,', 'link', 'Además (formal)'],
      ['tends to be repetitive', 'c1', 'Hedging con “tend to”: generaliza sin exagerar.'],
      ['which limits how much students actually learn', 'c1', 'Relativa de frase + pregunta indirecta (“how much students learn”, sin invertir).'],
      ['should therefore:', 'link', 'por lo tanto (dentro de la frase, más formal)'],
      ['publish clear guidance', 'voc', 'publicar una guía clara'],
      ['run short workshops', 'voc', 'organizar talleres breves (run = organizar)'],
      ['On balance,', 'link', 'En conjunto / sopesándolo todo'],
      ['provided that', 'c1', 'Condición: siempre que…'],
      ['strike a healthy balance between', 'voc', 'encontrar un equilibrio sano entre'],
    ],
    notes: [
      'Mismo esquema que el report oficial de banda máxima: <b>Introducción → Beneficios → Inconvenientes → Recomendaciones → Conclusión</b>.',
      '<b>Síntesis</b>: el Text B no se cita aparte, sino que confirma (“This is supported by…”) o contradice (“However, the same account reveals…”) al Text A.',
      'Las recomendaciones son ideas propias que nacen de los problemas detectados: así se ve el pensamiento crítico.',
    ],
  },

  /* ======================= T2 · ESSAY ======================= */
  {
    id: 'mo-essay-career', task: 2, type: 'essay', origin: 'model',
    title: 'Preparing for a career early (demo oficial)',
    prompt: {
      text: 'Write a formal essay for your course tutor, developing an argument on the following topic: Young people must start preparing for their future career as early as possible. To what extent do you agree or disagree?',
      bullets: ['You MUST use ideas from the texts AND your own ideas.', 'You MUST NOT copy from the texts.'],
      sources: CAREER_SOURCES,
      words: '~250 (máx. 300) · 35 min',
      origin: 'Consigna oficial de la demo de Trinity (Writing example tasks)',
    },
    paras: [
      { role: 'Intro · contexto + tesis matizada', sents: [
        ['Choosing a career is one of the most important decisions young people face, and many believe that the earlier they start preparing, the better.', 'Elegir una carrera profesional es una de las decisiones más importantes que afrontan los jóvenes, y muchos creen que cuanto antes empiecen a prepararse, mejor.'],
        ['While early preparation undoubtedly has advantages, I would argue that committing to a single path too soon can be counterproductive.', 'Aunque prepararse pronto tiene sin duda ventajas, yo diría que comprometerse con un único camino demasiado pronto puede ser contraproducente.'],
      ] },
      { role: 'A favor (Text A + Text C)', sents: [
        ['There is a strong case for starting young.', 'Hay buenos argumentos para empezar joven.'],
        ['Employers tend to value years of experience, and it is often claimed that becoming a true expert requires thousands of hours of practice.', 'Las empresas suelen valorar los años de experiencia, y a menudo se afirma que llegar a ser un verdadero experto requiere miles de horas de práctica.'],
        ['Similarly, the sports website suggests that athletes who begin early gain confidence and progress faster through regular training.', 'Del mismo modo, la web de deportes sugiere que los deportistas que empiezan pronto ganan confianza y progresan más rápido con un entrenamiento regular.'],
        ['Early experience can also help young people build a network of contacts that may later open doors.', 'La experiencia temprana también puede ayudar a los jóvenes a crear una red de contactos que más adelante les abra puertas.'],
      ] },
      { role: 'En contra (Text B + Text A)', sents: [
        ['However, Edith Wright’s experience shows the risks of deciding too early.', 'Sin embargo, la experiencia de Edith Wright muestra los riesgos de decidir demasiado pronto.'],
        ['Having trained as a teacher because of her family, she soon realised the job did not suit her personality, and it took her a decade to find a career in science that made her happy.', 'Tras formarse como profesora por influencia familiar, pronto se dio cuenta de que el trabajo no encajaba con su personalidad, y tardó una década en encontrar una carrera científica que la hiciera feliz.'],
        ['Interestingly, even the hiring advice in Text A recommends considering hard-working fast learners who lack experience.', 'Curiosamente, incluso los consejos de contratación del Texto A recomiendan tener en cuenta a candidatos trabajadores y que aprenden rápido aunque no tengan experiencia.'],
      ] },
      { role: 'Idea propia · solución', sents: [
        ['In my view, what young people need is not an early decision but early exploration: work placements, volunteering and a range of subjects allow them to discover their strengths before specialising.', 'En mi opinión, lo que los jóvenes necesitan no es una decisión temprana, sino explorar pronto: las prácticas, el voluntariado y una variedad de asignaturas les permiten descubrir sus puntos fuertes antes de especializarse.'],
        ['Schools could encourage this through careers fairs and job-shadowing days with local companies.', 'Los institutos podrían fomentarlo con ferias de empleo y jornadas de acompañamiento en empresas locales.'],
      ] },
      { role: 'Conclusión', sents: [
        ['In conclusion, preparing early is valuable only if it keeps doors open rather than closing them.', 'En conclusión, prepararse pronto solo es valioso si mantiene puertas abiertas en lugar de cerrarlas.'],
        ['Only by combining early experience with the freedom to change direction can young people find careers that truly suit them.', 'Solo combinando la experiencia temprana con la libertad de cambiar de rumbo pueden los jóvenes encontrar carreras que de verdad encajen con ellos.'],
      ] },
    ],
    marks: [
      ['one of the most important decisions young people face', 'c1', 'Relativa sin pronombre (“decisions [that] young people face”).'],
      ['the earlier they start preparing, the better', 'c1', 'Comparativa doble: “the + comparativo…, the + comparativo”.'],
      ['While early preparation undoubtedly has advantages', 'c1', 'Concesión con “While…” para introducir la tesis matizada.'],
      ['I would argue that', 'c1', 'Tesis con cautela (would): tono académico.'],
      ['counterproductive', 'voc', 'contraproducente'],
      ['There is a strong case for', 'c1', '“There is a strong case for + -ing” = hay buenos argumentos para…'],
      ['tend to value', 'c1', 'Hedging: “tend to” = suelen.'],
      ['it is often claimed that', 'src', 'Paráfrasis impersonal de la idea de las 10.000 horas (Text A), sin copiarla.'],
      ['Similarly,', 'link', 'Del mismo modo'],
      ['the sports website suggests that', 'src', 'Cita el Text C describiéndolo + verbo de referencia (suggests).'],
      ['build a network of contacts', 'voc', 'crear una red de contactos'],
      ['open doors', 'voc', 'abrir puertas (oportunidades)'],
      ['However,', 'link', 'Sin embargo'],
      ['Edith Wright’s experience shows', 'src', 'Usa el Text B como ejemplo (nombre de la autora).'],
      ['Having trained as a teacher', 'c1', 'Oración de participio perfecto: “Tras haberse formado…”.'],
      ['did not suit her personality', 'voc', 'no encajaba con su personalidad'],
      ['it took her a decade to', 'c1', '“it took + persona + tiempo + to” = tardó…'],
      ['Interestingly,', 'link', 'Curiosamente (introduce un dato que refuerza el argumento)'],
      ['even the hiring advice in Text A recommends', 'src', 'SÍNTESIS: usa el mismo Text A para apoyar la postura contraria.'],
      ['In my view,', 'link', 'En mi opinión'],
      ['what young people need is', 'c1', 'Cleft sentence: “lo que los jóvenes necesitan es…”.'],
      ['not an early decision but early exploration', 'c1', 'Paralelismo “not X but Y”.'],
      ['before specialising', 'c1', 'before + -ing.'],
      ['job-shadowing days', 'voc', 'jornadas de acompañamiento (observar a un profesional en su trabajo)'],
      ['In conclusion,', 'link', 'En conclusión'],
      ['keeps doors open rather than closing them', 'voc', 'mantener puertas abiertas en lugar de cerrarlas (metáfora)'],
      ['Only by combining', 'c1', 'Inversión: Only by + -ing + auxiliar + sujeto (can young people…).'],
    ],
    notes: [
      'Estructura “To what extent”: <b>tesis matizada → a favor → en contra → solución propia → conclusión</b>.',
      'Las tres fuentes aparecen <b>transformadas</b>: ninguna frase copiada y cada una con su verbo (claimed, suggests, shows, recommends).',
      'Truco C1: usar <b>la misma fuente para los dos lados</b> (Text A apoya la experiencia, pero también contrata a gente sin experiencia).',
    ],
  },
);
