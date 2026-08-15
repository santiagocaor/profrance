export const correctorModule = {
  id: 'corrector',
  title: 'Corrector de Textos',
  icon: 'spellcheck',
  description: 'Revisa y corrige tus textos en francés con explicaciones detalladas y audición.',
  inputs: [
    { id: 'input_texto', label: 'Texto en Francés a corregir', type: 'textarea', placeholder: 'Escribe o pega aquí tu texto o párrafo en francés para que sea revisado y corregido...' }
  ],
  generatePrompt: (data) => `Revisa exhaustivamente y corrige el siguiente texto escrito en francés por un alumno hispanohablante:

<texto_usuario>
${data.input_texto}
</texto_usuario>

Estructura estrictamente la salida en las siguientes secciones:

### <span class="material-symbols-outlined">spellcheck</span> Texto Corregido
[Escribe el texto en francés completamente corregido, natural y fluido. REGLA ESTRICTA DE AUDIO: Envuelve CADA oración o frase independiente del texto corregido dentro de la etiqueta <span class="fr-click">...</span> (ejemplo: <span class="fr-click">Je suis allé au marché hier matin.</span>) para que el usuario pueda hacer clic en cualquier palabra o en el altavoz para reproducir el audio de cada frase con el control de velocidad].

### <span class="material-symbols-outlined">fact_check</span> Explicación de las Correcciones
[Si el texto tenía errores gramaticales, ortográficos, de concordancia, de puntuación o calcos estructurales del español, detállalos en una lista clara de viñetas, explaining la razón gramatical o de uso en español de forma comprensible y pedagógica. Si el texto original no tenía ningún error, felicita al estudiante y proporciona 2 o 3 sugerencias avanzadas de reformulación o vocabulario alternativo para enriquecer su expresión escrita].

---
**Nota en Quebec**: [Aquí debes incluir obligatoriamente, DEBAJO DE TODO EL ANÁLISIS ANTERIOR, una nota explicando si el texto presenta particularidades, vocabulario, pronunciación oral o modismos propios de Quebec, o cómo se interpreta y contextualiza este texto en la cultura y lengua quebequesa. REGLA ESTRICTA: Esta nota NUNCA debe ir al principio ni mezclada con las categorías, SIEMPRE estrictamente al final, debajo de todo el análisis].`
};
