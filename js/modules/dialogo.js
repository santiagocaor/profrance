export const dialogoModule = {
  id: 'dialogo',
  title: 'Práctica de Diálogo',
  icon: 'record_voice_over',
  description: 'Genera diálogos y conversaciones cotidianas entre dos personas.',
  inputs: [
    { id: 'input_nivel', label: 'Nivel', type: 'select', options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    { id: 'input_tema', label: 'Tema (o "Sugiéreme uno")', type: 'text', placeholder: 'Ej: Pedir en un café en Montreal' },
    { id: 'input_longitud', label: 'Duración del diálogo', type: 'select', options: ['Corto (4-6 turnos)', 'Medio (8-10 turnos)', 'Largo (12+ turnos)'] }
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
  * *Présent*:
    - <span class="fr-click">veux</span> : quiero | verbo: vouloir
  * *Passé composé*:
    - <span class="fr-click">a dit</span> : dijo | verbo: dire
* **Preposiciones**:
  - <span class="fr-click">[preposición en francés]</span> : [traducción directa]

#### 2. Bloques léxicos y semánticos
* **Locuciones**:
  - <span class="fr-click">[locución o frase fija]</span> : [traducción directa]
* **Palabras clave**:
  - <span class="fr-click">[palabra cotidiana]</span> : [traducción directa]

#### 3. Herramientas de cohesión textual
* **Conectores lógicos**:
  - <span class="fr-click">[conector]</span> : [traducción directa]
* **Marcadores discursivos**:
  - <span class="fr-click">[marcador conversacional: alors, bon, voilà]</span> : [traducción directa]`;
    } else if (isAdvanced) {
      explicacionPrompt = `#### 1. Categorías gramaticales
* **Sustantivos**:
  - <span class="fr-click">[sustantivo avanzado/especializado]</span> (m./f.) : [traducción directa]
* **Adjetivos**:
  - <span class="fr-click">[adjetivo expresivo/preciso]</span> : [traducción directa]
* **Verbos**: (agrupados estrictamente por tiempo o modo verbal, sin explicaciones teóricas)
  * *Subjonctif*:
    - <span class="fr-click">fasse</span> : haga | verbo: faire
  * *Conditionnel*:
    - <span class="fr-click">aimerais</span> : me gustaría | verbo: aimer
* **Preposiciones**:
  - <span class="fr-click">[preposición o locución preposicional]</span> : [traducción directa]

#### 2. Bloques léxicos y semánticos
* **Locuciones**:
  - <span class="fr-click">[giro idiomático o modismo quebequés oral]</span> : [traducción directa]
* **Palabras clave**:
  - <span class="fr-click">[término avanzado/argumentativo]</span> : [traducción directa]

#### 3. Herramientas de cohesión textual
* **Conectores lógicos**:
  - <span class="fr-click">[conector argumentativo/oposición]</span> : [traducción directa]
* **Marcadores discursivos**:
  - <span class="fr-click">[marcador pragmático oral: en fait, tu sais, écoute]</span> : [traducción directa]`;
    } else {
      // Intermedio B1 / B2
      explicacionPrompt = `#### 1. Categorías gramaticales
* **Sustantivos**:
  - <span class="fr-click">[sustantivo temático]</span> (m./f.) : [traducción directa]
* **Adjetivos**:
  - <span class="fr-click">[adjetivo intermedio]</span> : [traducción directa]
* **Verbos**: (agrupados estrictamente por tiempo verbal, sin explicaciones teóricas)
  * *Présent / Imparfait / Passé composé*:
    - <span class="fr-click">pensait</span> : pensaba | verbo: penser
* **Preposiciones**:
  - <span class="fr-click">[construcción preposicional]</span> : [traducción directa]

#### 2. Bloques léxicos y semánticos
* **Locuciones**:
  - <span class="fr-click">[expresión conversacional o modismo de Quebec]</span> : [traducción directa]
* **Palabras clave**:
  - <span class="fr-click">[término central del diálogo]</span> : [traducción directa]

#### 3. Herramientas de cohesión textual
* **Conectores lógicos**:
  - <span class="fr-click">[conector de causa/consecuencia/contraste]</span> : [traducción directa]
* **Marcadores discursivos**:
  - <span class="fr-click">[marcador oral: d'ailleurs, quand même, justement]</span> : [traducción directa]`;
    }

    return `Genera un diálogo realista y natural en francés de Quebec entre dos personas (con nombres propios habituales en Quebec) basado en el tema '${data.input_tema}'.
El nivel debe ser estrictamente '${data.input_nivel}' y la duración '${data.input_longitud}'.
${data.level_context ? `\nREGLA DE GROUNDING OBLIGATORIA (MARCO CEFR):\nDebes limitar el vocabulario, las estructuras gramaticales y la complejidad del diálogo ESTRICTAMENTE a las pautas del siguiente marco de referencia para el Nivel ${data.input_nivel}:\n<marco_referencia>\n${data.level_context}\n</marco_referencia>\n` : ''}
REGLA ESTRICTA DE CORRESPONDENCIA: El 'Diálogo en Francés' y la 'Traducción al Español' deben tener EXACTAMENTE EL MISMO NÚMERO DE TURNOS O INTERVENCIONES (por ejemplo, si el diálogo en francés tiene 6 turnos, la traducción debe tener exactamente 6 turnos correspondientes en el mismo orden exacto). Separa cada intervención o turno estrictamente con un SALTO DE LÍNEA DOBLE.
REGLA ESTRICTA DE LENGUAJE: El texto debe sonar a un diálogo oral auténtico del francés quebequés adecuado al nivel ${data.input_nivel}, pero manteniendo una correcta ortografía gramatical.
Estructura la respuesta de la siguiente forma:

### <span class="material-symbols-outlined">record_voice_over</span> Diálogo en Francés
[Aquí el diálogo completo en francés de Quebec. Cada turno debe empezar con **Nombre del personaje**: seguido de su diálogo. Envuelve EL TEXTO DEL TURNO COMPLETO en <span class="fr-click">...</span>. REGLA ESTRICTA: Separa cada turno de palabra con un SALTO DE LÍNEA DOBLE]

### <span class="material-symbols-outlined">translate</span> Traducción al Español
[Traducción fiel y natural al español latino. REGLA ESTRICTA: Debe haber exactamente 1 turno en español por cada turno en francés, separados por un SALTO DE LÍNEA DOBLE]

### <span class="material-symbols-outlined">analytics</span> Explicación del Diálogo
Debe analizar el diálogo e identificar sus componentes estructurados estrictamente en las siguientes 3 categorías.
REGLAS ESTRICTAS DE FORMATO (SIN EXPLICACIONES TEÓRICAS):
1. NO des NINGUNA explicación gramatical, teórica o de uso sobre las palabras o estructuras (por ejemplo, PROHIBIDO escribir explicaciones como "Alors: Marca el inicio de una frase" o "Écoute: Verbo en imperativo para llamar la atención"). SOLO entrega el término en francés y al lado su traducción directa al español.
2. Cada elemento debe estar OBLIGATORIAMENTE en una lista vertical, uno debajo del otro, siguiendo exactamente la plantilla y estructura de viñetas que se muestra abajo.
3. Para la categoría de **Verbos**, agrupa estrictamente por el tiempo verbal usado. Debajo de cada tiempo, lista los verbos en el formato: \`    - <span class="fr-click">[verbo conjugado]</span> : [traducción] | verbo: [infinitivo]\`.
IMPORTANTE: Envuelve cualquier palabra, construcción, verbo o frase en francés dentro de <span class="fr-click">...</span> exactamente como aparecen escritas en el texto, para que la app las resalte visualmente y se puedan escuchar con un clic.

${explicacionPrompt}

---
**Nota en Quebec**: [Aquí debes incluir obligatoriamente, DEBAJO DE TODO EL ANÁLISIS ANTERIOR, una nota explicando las particularidades del habla oral en Quebec presentadas en el diálogo, como pronunciación, contracciones orales informales o modismos quebequeses. REGLA ESTRICTA: Esta nota NUNCA debe ir al principio ni mezclada con las categorías, SIEMPRE estrictamente al final, debajo de todo el análisis].`;
  }
};
