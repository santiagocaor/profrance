export const modules = [
  {
    id: 'traductor',
    title: 'Traductor Inteligente',
    description: 'Traduce texto con una lupa pedagógica para hispanohablantes.',
    inputs: [
      { id: 'input_texto', label: 'Texto en Español o Francés', type: 'textarea', placeholder: 'Pega aquí el texto...' }
    ],
    generatePrompt: (data) => `Traduce el siguiente texto: '${data.input_texto}'. Envuelve la traducción resultante al francés estrictamente dentro de etiquetas <fr-audio> y </fr-audio> (por ejemplo: <fr-audio>Bonjour tout le monde</fr-audio>). No añadas texto introductorio ni explicaciones antes de la traducción. Luego, genera una sección llamada '### Lupa Pedagógica 🔍' donde expliques de forma MUY BREVE y con viñetas cortas: 1) 1 o 2 giros idiomáticos o trampas de traducción literal. 2) Un solo consejo fonético esencial. Sé directo al grano.`
  },
  {
    id: 'leccion',
    title: 'Optimizador de Lección',
    description: 'Crea una lección de 30 minutos enfocada en un tema.',
    inputs: [
      { id: 'input_tema', label: 'Tema de la lección', type: 'text', placeholder: 'Ej: Pedir comida en un restaurante' }
    ],
    generatePrompt: (data) => `Crea una lección de 30 minutos enfocada en '${data.input_tema}'. Estructura la salida así: 
### Lección del Día: ${data.input_tema}
1. Explicación breve destacando las diferencias clave con el español (falsos amigos o cambios estructurales).
2. Tres ejemplos prácticos en francés con su traducción.`
  },
  {
    id: 'flashcards',
    title: 'Tarjetas de Memoria',
    description: 'Genera tarjetas de repaso fonético-contextuales.',
    inputs: [
      { id: 'input_lista', label: 'Lista de palabras (hasta 20)', type: 'textarea', placeholder: 'Palabra 1, Palabra 2...' }
    ],
    generatePrompt: (data) => `Convierte esta lista de palabras en un mazo de tarjetas 3D: '${data.input_lista}'.
Regla estricta: No escribas explicaciones ni texto fuera del HTML. Por cada palabra, devuelve EXACTAMENTE la siguiente estructura HTML, reemplazando los corchetes con el contenido correcto en francés de Quebec:

<div class="flashcard-container">
  <div class="flashcard-inner">
    <div class="flashcard-front">
      <div class="flashcard-word"><span class="fr-click">[Palabra en Francés]</span></div>
      <div class="flashcard-pronunciation">[Pronunciación adaptada al español]</div>
      <div class="flashcard-hint">Haz clic para voltear</div>
    </div>
    <div class="flashcard-back">
      <div class="flashcard-translation">[Traducción al Español]</div>
      <div class="flashcard-example" style="margin-bottom: 0.5rem;"><span class="fr-click">[Ejemplo 1 de uso cotidiano]</span><br><small>[Traducción del ejemplo 1]</small></div>
      <div class="flashcard-example"><span class="fr-click">[Ejemplo 2 de uso cotidiano]</span><br><small>[Traducción del ejemplo 2]</small></div>
    </div>
  </div>
</div>`
  },
  {
    id: 'chat',
    title: 'Simulador de Conversación',
    description: 'Chat interactivo con corrección en tiempo real.',
    inputs: [
      { id: 'input_nivel', label: 'Nivel', type: 'select', options: ['A1', 'A2', 'B1'] },
      { id: 'input_tema', label: 'Tema de la charla', type: 'text', placeholder: 'Ej: Hablar sobre pasatiempos' }
    ],
    generatePrompt: (data) => `Actúa como un hablante nativo de francés y entabla un diálogo conmigo sobre '${data.input_tema}'. Reglas estrictas: 1) Escribe máximo dos frases cortas por turno para mantener la fluidez. 2) Mantén el nivel en '${data.input_nivel}'. 3) Si cometo un error gramatical, estructural o un calco del español, pon la corrección en español entre corchetes '[CORRECCIÓN: ...]' al inicio de tu mensaje, explícame el porqué brevemente, y luego continúa la conversación normalmente dentro de tu personaje. Empieza tú saludándome.`
  },
  {
    id: 'gramatica',
    title: 'Decodificador de Gramática',
    description: 'Explicación de reglas y falsos amigos.',
    inputs: [
      { id: 'input_regla', label: 'Regla o duda', type: 'text', placeholder: 'Ej: Diferencia entre POUR y PAR' }
    ],
    generatePrompt: (data) => `Explica de forma MUY AMPLIA Y DETALLADA la siguiente regla del francés: '${data.input_regla}'.
Regla estricta: Tu explicación debe ser exhaustiva, profunda, llena de ejemplos variados en diferentes contextos, y TODOS los ejemplos deben incluir su traducción al español.
Divide la explicación en: 
### Análisis Gramatical Profundo 🧠
1. **Explicación Detallada:** Explica la regla paso a paso con abundantes ejemplos.
2. **Comparación:** ¿Cómo expresaríamos esta misma lógica o idea en español?
3. **Alerta de Error:** ¿Cuál es el error típico que comete un hispanohablante al intentar usar esta regla?
4. **Práctica:** Dame 3 frases en español para que yo intente traducirlas al francés basándome en tu explicación.`
  },
  {
    id: 'diario',
    title: 'Diario de Errores Activo',
    description: 'Corrector de estilo para textos libres.',
    inputs: [
      { id: 'input_texto', label: 'Texto en Francés', type: 'textarea', placeholder: 'Escribe sobre tu día...' }
    ],
    generatePrompt: (data) => `Actúa como un corrector de estilo de francés especializado en alumnos hispanohablantes. Revisa el siguiente texto: '${data.input_texto}'. Devuelve:
### Texto Corregido ✨
[Muestra el texto completamente corregido, natural y fluido]
### Notas de Mejora 📝
Una lista numerada con los errores detectados, clasificándolos explícitamente en: 'Calco del español' (si se tradujo literal), 'Gramática' u 'Ortografía', explicando la razón de forma amigable.`
  },
  {
    id: 'quiz',
    title: 'Evaluador de Producción',
    description: 'Quiz semanal basado en lo que has estudiado.',
    inputs: [
      { id: 'input_estudio', label: 'Resumen de estudio', type: 'textarea', placeholder: 'Qué estudiaste esta semana?' }
    ],
    generatePrompt: (data) => `Prepárame un quiz personalizado de 5 preguntas basado en: '${data.input_estudio}'. No uses opciones múltiples. En su lugar, dame situaciones o frases en español para que yo las traduzca activamente al francés. Muéstrame las preguntas una por una. Evalúa mi ortografía, contracciones y gramática en cada respuesta antes de pasar a la siguiente.`
  },
  {
    id: 'inmersion',
    title: 'Taller de Inmersión Textual',
    description: 'Análisis de artículos y textos reales.',
    inputs: [
      { id: 'input_texto', label: 'Artículo o Texto en Francés', type: 'textarea', placeholder: 'Pega un artículo aquí...' }
    ],
    generatePrompt: (data) => `Analiza el siguiente texto: '${data.input_texto}'. No lo traduzcas completo. Devuelve:
### Desglose de Inmersión 📖
1. Las 5 expresiones idiomáticas o verbos compuestos más útiles del texto, explicados en español.
2. Alerta de 'Falsos Amigos' presentes en el texto si los hay.
3. Hazme 3 preguntas de comprensión de lectura formuladas en francés para que yo las responda en francés.`
  },
  {
    id: 'lectura',
    title: 'Práctica de Lectura',
    description: 'Genera textos para practicar lectura y vocabulario.',
    inputs: [
      { id: 'input_nivel', label: 'Nivel', type: 'select', options: ['A1', 'A2', 'B1', 'B2', 'C1'] },
      { id: 'input_tema', label: 'Tema (o "Sugiéreme uno")', type: 'text', placeholder: 'Ej: Historia de Quebec' },
      { id: 'input_longitud', label: 'Longitud del texto', type: 'select', options: ['Corto (1-2 min)', 'Medio (3-5 min)', 'Largo (5-10 min)'] }
    ],
    generatePrompt: (data) => `Genera un texto inmersivo de lectura en francés de Quebec basado en el tema '${data.input_tema}'.
El nivel debe ser estrictamente '${data.input_nivel}' y la longitud '${data.input_longitud}'.
REGLA ESTRICTA: NO utilices abreviaciones informales de la lengua oral (como "t'es", "y a" escrito como "y'a", "chu", etc.) ni jerga callejera pesada. El texto debe estar escrito en francés quebequés estándar y gramaticalmente correcto, ideal para un estudiante que necesita aprender la estructura formal del idioma.
Estructura la respuesta de la siguiente forma:

### 📖 Texto en Francés
[Aquí el texto completo en francés de Quebec. Envuelve CADA PÁRRAFO COMPLETO en <span class="fr-click">...</span> para que el usuario pueda escucharlo haciendo clic]

### 🇪🇸 Traducción al Español
[Traducción fiel y natural del texto completo al español latino]

### 🧠 Glosario y Modismos
[Lista de las 5 palabras, expresiones o 'sacres' más interesantes o difíciles del texto, explicadas brevemente. Envuelve las palabras en francés en <span class="fr-click">...</span>]

### 🎯 Comprensión
[3 preguntas cortas en francés sobre el texto para que yo las responda mentalmente. Envuelve cada pregunta en <span class="fr-click">...</span>]`
  },
  {
    id: 'saved_lessons',
    title: 'Mis Lecciones Guardadas',
    description: 'Consulta, repasa o elimina las lecciones que has guardado.',
    inputs: [],
    generatePrompt: () => '' // No usado para este módulo
  }
];
