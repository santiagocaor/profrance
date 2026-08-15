export const analizadorModule = {
  id: 'analizador',
  title: 'Analizador de Texto',
  icon: 'document_scanner',
  description: 'Analiza, clasifica el nivel CEFR y traduce cualquier noticia, historia o texto en francés.',
  inputs: [
    { id: 'input_texto', label: 'Pega aquí tu texto, noticia o historia en francés', type: 'textarea', placeholder: 'Pega aquí un artículo de periódico, correo electrónico, historia o diálogo en francés para analizarlo...' }
  ],
  generatePrompt: (data) => `Analiza exhaustivamente el siguiente texto en francés que ha proporcionado el usuario:

<texto_usuario>
${data.input_texto}
</texto_usuario>

Debes procesar el texto y estructurar tu respuesta estrictamente de la siguiente forma:

### <span class="material-symbols-outlined">grade</span> Nivel Detectado
**Nivel CEFR:** [Indica el nivel: A1 / A2 / B1 / B2 / C1 / C2] — [Añade una breve justificación de 1 o 2 líneas explaining por qué el texto corresponde a este nivel según su sintaxis, gramática y vocabulario]

### <span class="material-symbols-outlined">menu_book</span> Texto en Francés y Fragmentación
[REGLA ESTRICTA DE FRAGMENTACIÓN OBLIGATORIA: Sin importar cómo haya pegado el texto el usuario (incluso si lo pegó como un solo bloque gigante y continuo sin saltos de línea), TIENES LA OBLIGACIÓN ESTRICTA de dividir y segmentar el texto en párrafos cortos (de 2 a 4 frases por párrafo) o en turnos individuales si es un diálogo. NUNCA devuelvas el texto como un solo bloque grande.
1. Envuelve CADA párrafo o fragmento individual dentro de su propia etiqueta <span class="fr-click">...</span> (NUNCA envuelvas todo el texto en una sola etiqueta gigante).
2. Separa cada párrafo estrictamente con DOS SALTOS DE LÍNEA (una línea en blanco de separación \n\n).]

### <span class="material-symbols-outlined">translate</span> Traducción al Español
[Traducción fiel y natural al español latino. REGLA ESTRICTA DE CORRESPONDENCIA 1 A 1: Debe haber EXACTAMENTE EL MISMO NÚMERO DE PÁRRAFOS en español que en el texto en francés fragmentado (un párrafo en español por cada párrafo en francés, exactamente en el mismo orden). Separa cada párrafo en español estrictamente con DOS SALTOS DE LÍNEA (\n\n).]

### <span class="material-symbols-outlined">analytics</span> Explicación del Texto
Debe analizar el texto e identificar sus componentes estructurados estrictamente en las siguientes 3 categorías, adaptando la rigurosidad al nivel CEFR que has detectado.
REGLAS ESTRICTAS DE FORMATO (SIN EXPLICACIONES TEÓRICAS):
1. NO des NINGUNA explicación gramatical, teórica o de uso sobre las palabras o estructuras (por ejemplo, PROHIBIDO escribir explicaciones como "Soudain: Marca una acción inesperada" o "Isolé: Adjetivo para describir un lugar remoto"). SOLO entrega el término en francés y al lado su traducción directa al español.
2. Cada elemento debe estar OBLIGATORIAMENTE en una lista vertical, uno debajo del otro, siguiendo exactamente la plantilla de viñetas que se muestra abajo.
3. Para la categoría de **Verbos**, agrupa estrictamente por el tiempo verbal usado en el texto. Debajo de cada tiempo, lista los verbos en el formato: \`    - <span class="fr-click">[verbo conjugado]</span> : [traducción] | verbo: [infinitivo]\`.
IMPORTANTE: Envuelve cualquier palabra, construcción, verbo o frase en francés dentro de <span class="fr-click">...</span> exactamente como aparecen escritas en el texto, para que la app las resalte visualmente y se puedan escuchar con un clic.

#### 1. Categorías gramaticales
* **Sustantivos**:
  - <span class="fr-click">[sustantivo]</span> (m./f.) : [traducción directa]
* **Adjetivos**:
  - <span class="fr-click">[adjetivo]</span> : [traducción directa]
* **Verbos**: (agrupados estrictamente por tiempo verbal, sin explicaciones teóricas)
  * *Présent / Imparfait / Passé composé / etc.*:
    - <span class="fr-click">[verbo conjugado]</span> : [traducción] | verbo: [infinitivo]
* **Preposiciones**:
  - <span class="fr-click">[preposición o construcción]</span> : [traducción directa]

#### 2. Bloques léxicos y semánticos
* **Locuciones**:
  - <span class="fr-click">[locución o frase fija]</span> : [traducción directa]
* **Palabras clave**:
  - <span class="fr-click">[palabra o término clave del texto]</span> : [traducción directa]

#### 3. Herramientas de cohesión textual
* **Conectores lógicos**:
  - <span class="fr-click">[conector]</span> : [traducción directa]
* **Marcadores discursivos**:
  - <span class="fr-click">[marcador discursivo]</span> : [traducción directa]

---
**Nota en Quebec**: [Aquí debes incluir obligatoriamente, DEBAJO DE TODO EL ANÁLISIS ANTERIOR, una nota explicando si el texto presenta particularidades, vocabulario, pronunciación oral o modismos propios de Quebec, o cómo se interpreta y contextualiza este texto en la cultura y lengua quebequesa. REGLA ESTRICTA: Esta nota NUNCA debe ir al principio ni mezclada con las categorías, SIEMPRE estrictamente al final, debajo de todo el análisis].`
};
