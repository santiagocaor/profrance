export const lecturaModule = {
  id: 'lectura',
  title: 'Práctica de Lectura',
  icon: 'chrome_reader_mode',
  description: 'Genera textos para practicar lectura y vocabulario.',
  inputs: [
    { id: 'input_nivel', label: 'Nivel', type: 'select', options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    { id: 'input_tema', label: 'Tema (o "Sugiéreme uno")', type: 'text', placeholder: 'Ej: Historia de Quebec' },
    { id: 'input_longitud', label: 'Longitud del texto', type: 'select', options: ['Corto (1-2 min)', 'Medio (3-5 min)', 'Largo (5-10 min)'] }
  ],
  generatePrompt: (data) => {
    const isBeginner = ['A1', 'A2'].includes(data.input_nivel);
    const isAdvanced = ['C1', 'C2'].includes(data.input_nivel);
    
    let explicacionPrompt = '';
    if (isBeginner) {
      explicacionPrompt = `#### 1. Categorías gramaticales
* **Sustantivos**:
  - <span class="fr-click">[sustantivo en francés]</span> (m./f.) : [traducción directa]
* **Adjetivos**:
  - <span class="fr-click">[adjetivo en francés]</span> : [traducción directa]
* **Verbos**: (agrupados estrictamente por el tiempo verbal usado, sin explicaciones teóricas)
  * *Imparfait*:
    - <span class="fr-click">appelait</span> : llamaba | verbo: appeler
  * *Présent*:
    - <span class="fr-click">marche</span> : camina | verbo: marcher
* **Preposiciones**:
  - <span class="fr-click">[preposición en francés]</span> : [traducción directa]

#### 2. Bloques léxicos y semánticos
* **Locuciones**:
  - <span class="fr-click">[locución o frase fija]</span> : [traducción directa]
* **Palabras clave**:
  - <span class="fr-click">[palabra clave]</span> : [traducción directa]

#### 3. Herramientas de cohesión textual
* **Conectores lógicos**:
  - <span class="fr-click">[conector]</span> : [traducción directa]
* **Marcadores discursivos**:
  - <span class="fr-click">[marcador discursivo]</span> : [traducción directa]`;
    } else if (isAdvanced) {
      explicacionPrompt = `#### 1. Categorías gramaticales
* **Sustantivos**:
  - <span class="fr-click">[sustantivo avanzado/culto]</span> (m./f.) : [traducción directa]
* **Adjetivos**:
  - <span class="fr-click">[adjetivo literario/abstracto]</span> : [traducción directa]
* **Verbos**: (agrupados estrictamente por tiempo o modo verbal, sin explicaciones teóricas)
  * *Subjonctif*:
    - <span class="fr-click">fasse</span> : haga | verbo: faire
  * *Plus-que-parfait*:
    - <span class="fr-click">avait dit</span> : había dicho | verbo: dire
* **Preposiciones**:
  - <span class="fr-click">[preposición o locución preposicional]</span> : [traducción directa]

#### 2. Bloques léxicos y semánticos
* **Locuciones**:
  - <span class="fr-click">[giro figurado o modismo quebequés]</span> : [traducción directa]
* **Palabras clave**:
  - <span class="fr-click">[palabra especializada/académica]</span> : [traducción directa]

#### 3. Herramientas de cohesión textual
* **Conectores lógicos**:
  - <span class="fr-click">[conector argumentativo/oposición]</span> : [traducción directa]
* **Marcadores discursivos**:
  - <span class="fr-click">[marcador pragmático de alto nivel]</span> : [traducción directa]`;
    } else {
      // Intermedio B1 / B2
      explicacionPrompt = `#### 1. Categorías gramaticales
* **Sustantivos**:
  - <span class="fr-click">[sustantivo temático]</span> (m./f.) : [traducción directa]
* **Adjetivos**:
  - <span class="fr-click">[adjetivo intermedio]</span> : [traducción directa]
* **Verbos**: (agrupados estrictamente por tiempo verbal, sin explicaciones teóricas)
  * *Imparfait*:
    - <span class="fr-click">appelait</span> : llamaba | verbo: appeler
  * *Passé composé*:
    - <span class="fr-click">a compris</span> : comprendió | verbo: comprendre
* **Preposiciones**:
  - <span class="fr-click">[construcción preposicional]</span> : [traducción directa]

#### 2. Bloques léxicos y semánticos
* **Locuciones**:
  - <span class="fr-click">[bloque de sentido fijo o modismo quebequés]</span> : [traducción directa]
* **Palabras clave**:
  - <span class="fr-click">[término temático central]</span> : [traducción directa]

#### 3. Herramientas de cohesión textual
* **Conectores lógicos**:
  - <span class="fr-click">[conector de causa/consecuencia/oposición]</span> : [traducción directa]
* **Marcadores discursivos**:
  - <span class="fr-click">[marcador discursivo del relato]</span> : [traducción directa]`;
    }

    return `Genera un texto inmersivo de lectura en francés de Quebec basado en el tema '${data.input_tema}'.
El nivel debe ser estrictamente '${data.input_nivel}' y la longitud '${data.input_longitud}'.
${data.level_context ? `\nREGLA DE GROUNDING OBLIGATORIA (MARCO CEFR):\nDebes limitar el vocabulario, las estructuras gramaticales y la complejidad del texto ESTRICTAMENTE a las pautas del siguiente marco de referencia para el Nivel ${data.input_nivel}:\n<marco_referencia>\n${data.level_context}\n</marco_referencia>\n` : ''}
REGLA ESTRICTA DE CORRESPONDENCIA: El 'Texto en Francés' y la 'Traducción al Español' deben tener EXACTAMENTE EL MISMO NÚMERO DE PÁRRAFOS (por ejemplo, si el texto en francés tiene 4 párrafos, la traducción debe tener exactamente 4 párrafos correspondientes en el mismo orden exacto). Separa cada párrafo estrictamente con un SALTO DE LÍNEA DOBLE.
REGLA ESTRICTA DE LENGUAJE: NO utilices abreviaciones informales de la lengua oral (como "t'es", "y a" escrito como "y'a", "chu", etc.) ni jerga callejera pesada. El texto debe estar escrito en francés quebequés estándar y gramaticalmente correcto.
Estructura la respuesta de la siguiente forma:

### <span class="material-symbols-outlined">menu_book</span> Texto en Francés
[Aquí el texto completo en francés de Quebec. Envuelve CADA PÁRRAFO COMPLETO o LÍNEA DE DIÁLOGO en <span class="fr-click">...</span>. REGLA ESTRICTA: Separa cada párrafo con un SALTO DE LÍNEA DOBLE]

### <span class="material-symbols-outlined">translate</span> Traducción al Español
[Traducción fiel y natural al español latino. REGLA ESTRICTA: Debe haber exactamente 1 párrafo en español por cada párrafo en francés, separados por un SALTO DE LÍNEA DOBLE]

### <span class="material-symbols-outlined">analytics</span> Explicación de la Lectura
Debe analizar el texto e identificar sus componentes estructurados estrictamente en las siguientes 3 categorías.
REGLAS ESTRICTAS DE FORMATO (SIN EXPLICACIONES TEÓRICAS):
1. NO des NINGUNA explicación gramatical, teórica o de uso sobre las palabras o estructuras (por ejemplo, PROHIBIDO escribir explicaciones como "Soudain: Marca una acción inesperada", "Isolé: Adjetivo para describir un lugar remoto" o "Habitait dans: El verbo habiter se usa con..."). SOLO entrega el término en francés y al lado su traducción directa al español.
2. Cada elemento debe estar OBLIGATORIAMENTE en una lista vertical, uno debajo del otro, siguiendo exactamente la plantilla y estructura de viñetas que se muestra abajo.
3. Para la categoría de **Verbos**, agrupa estrictamente por el tiempo verbal usado. Debajo de cada tiempo, lista los verbos en el formato: \`    - <span class="fr-click">[verbo conjugado]</span> : [traducción] | verbo: [infinitivo]\`.
IMPORTANTE: Envuelve cualquier palabra, construcción, verbo o frase en francés dentro de <span class="fr-click">...</span> exactamente como aparecen escritas en el texto, para que la app las resalte visualmente y se puedan escuchar con un clic.

${explicacionPrompt}

---
**Nota en Quebec**: [Aquí debes incluir obligatoriamente, DEBAJO DE TODO EL ANÁLISIS ANTERIOR, una nota explicando las particularidades, pronunciación, modismos o contexto cultural quebequés del texto. REGLA ESTRICTA: Esta nota NUNCA debe ir al principio ni mezclada con las categorías, SIEMPRE estrictamente al final, debajo de todo el análisis].`;
  }
};
