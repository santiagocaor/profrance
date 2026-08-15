export const flashcardsModule = {
  id: 'flashcards',
  title: 'Tarjetas de Memoria',
  icon: 'style',
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
};
