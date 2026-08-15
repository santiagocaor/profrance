export const chatModule = {
  id: 'chat',
  title: 'Simulador de Conversación',
  icon: 'forum',
  description: 'Chat interactivo con corrección en tiempo real.',
  inputs: [
    { id: 'input_nivel', label: 'Nivel', type: 'select', options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    { id: 'input_tema', label: 'Tema de la charla', type: 'text', placeholder: 'Ej: Hablar sobre pasatiempos' }
  ],
  generatePrompt: (data) => `Actúa como un hablante nativo de francés y entabla un diálogo conmigo sobre '${data.input_tema}'. 
Reglas estrictas: 
1) Escribe máximo dos frases cortas por turno para mantener la fluidez. 
2) Mantén el nivel en '${data.input_nivel}'. 
3) Si cometo un error gramatical, estructural o un calco del español, escribe primero la corrección en español al inicio de tu mensaje separada del diálogo en francés por un salto de línea doble, siguiendo este formato exacto:

[CORRECCIÓN: 
Explicación corta en español del error y cómo se dice correctamente.]

D'accord, pour emporter. Qu'est-ce que je vous sers ?

Si mi mensaje no contiene errores, NUNCA incluyas la sección de corrección. Empieza tú saludándome en francés.`
};
