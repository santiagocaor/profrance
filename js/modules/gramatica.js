export const gramaticaModule = {
  id: 'gramatica',
  title: 'Decodificador de Gramática',
  icon: 'auto_fix_high',
  description: 'Explicación profunda de reglas gramaticales, falsos amigos y errores comunes.',
  inputs: [
    { id: 'input_regla', label: 'Regla o duda', type: 'text', placeholder: 'Ej: Diferencia entre POUR y PAR' }
  ],
  generatePrompt: (data) => `Explica de forma MUY AMPLIA Y DETALLADA la siguiente regla del francés: '${data.input_regla}'.
Regla estricta: Tu explicación debe ser exhaustiva, profunda, llena de ejemplos variados en diferentes contextos, y TODOS los ejemplos deben incluir su traducción al español.
Divide la explicación en: 
### <span class="material-symbols-outlined">psychology</span> Análisis Gramatical Profundo
1. **Explicación Detallada:** Explica la regla paso a paso con abundantes ejemplos.
2. **Comparación:** ¿Cómo expresaríamos esta misma lógica o idea en español?
3. **Alerta de Error:** ¿Cuál es el error típico que comete un hispanohablante al intentar usar esta regla?
4. **Práctica:** Dame 3 frases en español para que yo intente traducirlas al francés basándome en tu explicación.`
};
