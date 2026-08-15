export const traductorModule = {
  id: 'traductor',
  title: 'Traductor',
  icon: 'translate',
  description: 'Traducción natural entre español y francés con explicaciones contextuales y notas de Quebec.',
  inputs: [
    { id: 'input_texto', label: 'Texto en Español o Francés', type: 'textarea', placeholder: 'Pega aquí el texto...' }
  ],
  generatePrompt: (data) => `Analiza el texto ingresado: '${data.input_texto}'.
Escribe obligatoriamente al inicio como título: ### <span class="material-symbols-outlined">translate</span> Traducción
1. Si el texto está en español, tradúcelo al francés justo debajo del título. Si el texto es muy corto o ambiguo, proporciona las 2 traducciones más comunes según el contexto. La traducción resultante en francés debe estar estrictamente envuelta en <span class="fr-click">...</span>.
2. Si el texto está en francés, muestra justo debajo del título primero el texto original en francés envuelto en <span class="fr-click">...</span>, y luego añade un salto de línea doble y escribe la traducción al español justo debajo.
No añadas saludos ni introducciones antes de la traducción. Asegúrate de separar el francés y el español con un salto de línea doble para que no se peguen en la misma línea.
Luego, genera la sección '### <span class="material-symbols-outlined">lightbulb</span> Consejos del Profesor' explaining en viñetas cortas:
- 1 o 2 giros idiomáticos, falsos amigos o diferencias gramaticales importantes con el español.
REGLA ESTRICTA DE FORMATO: En la sección Consejos del Profesor, NUNCA uses comillas invertidas (\` \`) para resaltar palabras o frases en francés. En su lugar, usa negritas y envuélvelas estrictamente en <span class="fr-click">...</span> para que el usuario pueda hacer clic y escucharlas.`
};
