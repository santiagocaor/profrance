export const quizModule = {
  id: 'quiz',
  title: 'Evaluador de Producción',
  icon: 'quiz',
  description: 'Quiz semanal basado en lo que has estudiado.',
  inputs: [
    { id: 'input_estudio', label: 'Resumen de estudio', type: 'textarea', placeholder: 'Qué estudiaste esta semana?' }
  ],
  generatePrompt: (data) => `Prepárame un quiz personalizado de 5 preguntas basado en: '${data.input_estudio}'.
No uses opciones múltiples. En su lugar, dame situaciones o frases en español para que yo las traduzca al francés.
Estructura estrictamente la salida en las siguientes secciones:
### <span class="material-symbols-outlined">quiz</span> Preguntas
Presenta las 5 preguntas numeradas. Cada una debe ser una situación o frase en español que el estudiante debe traducir al francés. Asegúrate de cubrir gramática, vocabulario y ortografía relacionados con el tema de estudio.

### <span class="material-symbols-outlined">check_circle</span> Respuestas y Evaluación
Para cada pregunta, muestra:
1. La traducción correcta al francés envuelta en <span class="fr-click">...</span>.
2. Una explicación breve de los puntos gramaticales clave y errores comunes que un hispanohablante podría cometer.
3. Variantes aceptables si las hay.`
};
