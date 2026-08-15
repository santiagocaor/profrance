export const inmersionModule = {
  id: 'inmersion',
  title: 'Taller de Inmersión Textual',
  icon: 'article',
  description: 'Análisis de artículos y textos reales.',
  inputs: [
    { id: 'input_texto', label: 'Artículo o Texto en Francés', type: 'textarea', placeholder: 'Pega un artículo aquí...' }
  ],
  generatePrompt: (data) => `Analiza el siguiente texto: '${data.input_texto}'. No lo traduzcas completo. Devuelve:
### <span class="material-symbols-outlined">auto_stories</span> Desglose de Inmersión
1. Las 5 expresiones idiomáticas o verbos compuestos más útiles del texto, explicados en español.
2. Alerta de 'Falsos Amigos' presentes en el texto si los hay.
3. Hazme 3 preguntas de comprensión de lectura formuladas en francés para que yo las responda en francés.`
};
