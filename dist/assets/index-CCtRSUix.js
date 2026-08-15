(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`traductor`,title:`Traductor`,icon:`translate`,description:`Traducción natural entre español y francés con explicaciones contextuales y notas de Quebec.`,inputs:[{id:`input_texto`,label:`Texto en Español o Francés`,type:`textarea`,placeholder:`Pega aquí el texto...`}],generatePrompt:e=>`Analiza el texto ingresado: '${e.input_texto}'.
Escribe obligatoriamente al inicio como título: ### <span class="material-symbols-outlined">translate</span> Traducción
1. Si el texto está en español, tradúcelo al francés justo debajo del título. Si el texto es muy corto o ambiguo, proporciona las 2 traducciones más comunes según el contexto. La traducción resultante en francés debe estar estrictamente envuelta en <span class="fr-click">...</span>.
2. Si el texto está en francés, muestra justo debajo del título primero el texto original en francés envuelto en <span class="fr-click">...</span>, y luego añade un salto de línea doble y escribe la traducción al español justo debajo.
No añadas saludos ni introducciones antes de la traducción. Asegúrate de separar el francés y el español con un salto de línea doble para que no se peguen en la misma línea.
Luego, genera la sección '### <span class="material-symbols-outlined">lightbulb</span> Consejos del Profesor' explaining en viñetas cortas:
- 1 o 2 giros idiomáticos, falsos amigos o diferencias gramaticales importantes con el español.
REGLA ESTRICTA DE FORMATO: En la sección Consejos del Profesor, NUNCA uses comillas invertidas (\` \`) para resaltar palabras o frases en francés. En su lugar, usa negritas y envuélvelas estrictamente en <span class="fr-click">...</span> para que el usuario pueda hacer clic y escucharlas.`},{id:`diccionario`,title:`Diccionario`,icon:`menu_book`,description:`Búsqueda lingüística completa con significados, fonética, expresiones, sinónimos y micro-historias.`,inputs:[{id:`input_palabra`,label:`Palabra en Francés`,type:`text`,placeholder:`Ej: boulot, allait, perdues...`}],generatePrompt:e=>`Eres un experto lingüista y desarrollador de diccionarios bilingües (Francés-Español). 
Tu tarea es analizar la palabra en francés ingresada por el usuario y devolver información estructurada, útil, contextualizada y adaptada para hispanohablantes.

Palabra a buscar: '${e.input_palabra}'

REGLAS ESTRICTAS:
1. Analiza la entrada del usuario. Si es una forma conjugada o plural, identifica el infinitivo o la raíz y construye tu respuesta basándote en la raíz principal.
2. Proporciona todos los significados y traducciones principales más relevantes y usados de la palabra (solo la palabra o frase corta por significado, sin explicaciones largas).
3. IMPORTANTE: En la sección "traducciones", debes proporcionar EXACTAMENTE un ejemplo (campos "ejemplo_frances" y "ejemplo_espanol") por cada significado. Asegúrate estrictamente de que los ejemplos entregados correspondan y apliquen tanto al significado principal como a los sinónimos proporcionados.
4. Para preposiciones y colocaciones, debes incluir siempre una frase de ejemplo completa que ilustre su uso (campos "ejemplo_frances" y "ejemplo_espanol").
5. Proporciona una transcripción fonética simplificada leída en español (ej. para "oiseau", usa "ua-zó").
6. Genera una "micro-historia" creativa de 3 líneas en francés que utilice la palabra buscada, junto con su traducción al español.
7. NO incluyas NINGÚN texto conversacional antes o después del JSON. Tu respuesta debe ser ÚNICA y EXCLUSIVAMENTE un objeto JSON válido, sin delimitadores \`\`\`json, con esta estructura exacta:
{
  "entrada_original": "COPIA EXACTAMENTE la palabra que el usuario escribió, sin corregir ni alterar nada",
  "palabra_raiz": "La forma base de la palabra (infinitivo, o masculino singular)",
  "verbo_relacionado": "Si la palabra NO es un verbo, indica el verbo raíz relacionado (ej. travail -> travailler). Si ya es verbo o no aplica, déjalo vacío.",
  "genero_y_numero": "MÁXIMO 2 PALABRAS (Ej: Masc Singular, Fem Plural o N/A)",
  "sinonimos": [
    { "frances": "Sinónimo 1 en francés", "espanol": "Traducción al español 1" }
  ],
  "antonimo": { "frances": "Antónimo directo en francés (o N/A)", "espanol": "Traducción del antónimo al español (o N/A)" },
  "fonetica_simplificada": "Pronunciación en español",
  "traducciones": [
    { "significado": "Traducción 1", "ejemplo_frances": "Frase natural", "ejemplo_espanol": "Traducción de la frase" }
  ],
  "notas_gramaticales": {
    "preposiciones": [
      { "frances": "Preposición o frase con verbo", "espanol": "Traducción al español", "ejemplo_frances": "Frase completa de ejemplo", "ejemplo_espanol": "Traducción de la frase" }
    ],
    "conjugacion_o_forma_original": "Explicación breve de la forma que introdujo el usuario (si aplica)"
  },
  "diferencias_regionales": "Explicación breve de diferencias Francia vs Quebec (o vacío)",
  "colocaciones": [
    { "frances": "Frase hecha 1", "espanol": "Traducción al español 1", "ejemplo_frances": "Frase completa de ejemplo", "ejemplo_espanol": "Traducción de la frase" }
  ],
  "micro_historia": {
    "frances": "Anécdota de 3 líneas",
    "espanol": "Traducción de la anécdota"
  }
}`},{id:`conjugador`,title:`Conjugador`,icon:`table_chart`,description:`Conjugación de verbos con autocompletado inteligente, significado y ejemplos prácticos con pronunciación individual.`,inputs:[{id:`input_verbo`,label:`Verbo a conjugar (empieza a escribir y selecciona una coincidencia o escribe cualquier otro)`,type:`text`,placeholder:`Ej: être, avoir, aller, faire, vouloir, devoir, manger, partir, prendre...`,datalist:`acheter.adorer.aider.aimer.aller.amener.appeler.apporter.apprendre.arriver.attendre.avoir.boire.bouger.changer.chanter.chercher.choisir.commencer.comprendre.conduire.connaître.continuer.courir.coûter.craindre.créer.croire.décider.demander.descendre.devenir.devoir.dire.donner.dormir.douter.écouter.écrire.emmener.entendre.entrer.envoyer.espérer.essayer.être.étudier.exister.expliquer.faire.falloir.fermer.finir.gagner.garder.goûter.habiter.hésiter.inviter.jouer.laisser.laver.lever.lire.manger.marcher.mettre.monter.montrer.mourir.naître.naviguer.nettoyer.offrir.oublier.ouvrir.parler.partager.partir.passer.payer.penser.perdre.permettre.plaire.pleurer.porter.pouvoir.préférer.prendre.préparer.promettre.proposer.raconter.rappeler.recevoir.reconnaître.réfléchir.regarder.rendre.rentrer.répondre.ressembler.rester.réussir.revendiquer.revenir.rêver.rire.savoir.sembler.sentir.servir.sortir.souffrir.sourire.se souvenir.suivre.taire.tenir.tomber.toucher.travailler.traverser.trouver.utiliser.valoir.vendre.venir.vivre.voir.voler.vouloir.voyager`.split(`.`)},{id:`input_tiempo`,label:`Tiempo / Modo verbal`,type:`select`,options:[`Todos los tiempos esenciales (Resumen Completo)`,`Présent de l'indicatif`,`Passé Composé`,`L'Imparfait`,`Futur Proche`,`Conditionnel Présent`,`Subjonctif Présent`,`Futur Simple`,`Plus-que-parfait`]}],generatePrompt:e=>`Actúa como un profesor nativo y experto lingüista de francés.
El usuario desea conjugar el verbo: '${e.input_verbo}' en el tiempo/modo: '${e.input_tiempo}'.

REGLAS Y ESTRUCTURA DE RESPUESTA EN MARKDOWN:
### <span class="material-symbols-outlined">info</span> Ficha del Verbo
- **Significado:** Significado principal y preciso del verbo en español (ejemplo: si el verbo es aller, el significado sería: Ir). NO incluyas sinónimos, antónimos ni ninguna otra información técnica aquí.

- Si el usuario eligió "Todos los tiempos esenciales (Resumen Completo)", genera las secciones de Conjugación y Ejemplos para cada uno de los 8 tiempos clave del francés en orden: Présent, Passé Composé, L'Imparfait, Futur Proche, Conditionnel Présent, Subjonctif Présent, Futur Simple y Plus-que-parfait.
- Si eligió un tiempo específico, genera las secciones únicamente para ese tiempo.

### <span class="material-symbols-outlined">table_chart</span> Conjugación (${e.input_tiempo})
Muestra una tabla con UNA SOLA columna llamada "Conjugación en Francés". 
REGLA ESTRICTA DE PRONOMBRES INDIVIDUALES: Para que al reproducir el sonido del sintetizador de voz se escuche claramente cada persona gramatical sin leer barras ni paréntesis, debes generar EXACTAMENTE 9 filas separadas e independientes en la tabla, una por cada pronombre individual en este orden: je (o j'), tu, il, elle, on, nous, vous, ils, elles.
NUNCA agrupes il/elle/on ni ils/elles en la misma fila. NUNCA uses barras inclinadas (/) ni paréntesis en las terminaciones de los verbos ni participios (ejemplo: en lugar de poner "est allé(e)", pon exactamente "il est allé" en la fila de il, "elle est allée" en la fila de elle, "on est allé" en la fila de on, "ils sont allés" en la fila de ils, y "elles sont allées" en la fila de elles).
Todo el texto de cada celda debe ir envuelto en una sola etiqueta <span class="fr-click">...</span> para su pronunciación al hacer clic o reproducir audio:
| Conjugación en Francés |
| :--- |
| <span class="fr-click">je suis</span> |
| <span class="fr-click">tu es</span> |
| <span class="fr-click">il est</span> |
| <span class="fr-click">elle est</span> |
| <span class="fr-click">on est</span> |
| <span class="fr-click">nous sommes</span> |
| <span class="fr-click">vous êtes</span> |
| <span class="fr-click">ils sont</span> |
| <span class="fr-click">elles sont</span> |

### <span class="material-symbols-outlined">lightbulb</span> Ejemplos (${e.input_tiempo})
Muestra 9 ejemplos prácticos de la vida cotidiana en francés (uno individual por cada pronombre/persona gramatical: Je / J', Tu, Il, Elle, On, Nous, Vous, Ils, Elles) usando la conjugación del tiempo correspondiente. En la frase en francés del ejemplo, NO uses barras ni paréntesis ni agrupes pronombres, usa una frase fluida y natural adaptada al género y número del pronombre (por ejemplo, concordancia femenina para elle/elles).
Todo el texto en francés (incluyendo el pronombre) debe ir envuelto en <span class="fr-click">...</span> para su pronunciación.
Sigue EXACTAMENTE este formato de 3 líneas por cada ejemplo (poniendo dos espacios al final de las primeras dos líneas para crear saltos de línea limpios en Markdown, y dejando una línea en blanco entre cada pronombre):

**Je / J':**  
<span class="fr-click">[Frase completa en francés con pronombre]</span>  
[Traducción al español sin la palabra Traducción]

**Tu:**  
<span class="fr-click">[Frase completa en francés con pronombre]</span>  
[Traducción al español sin la palabra Traducción]

**Il:**  
<span class="fr-click">[Frase completa en francés con pronombre]</span>  
[Traducción al español sin la palabra Traducción]

**Elle:**  
<span class="fr-click">[Frase completa en francés con pronombre]</span>  
[Traducción al español sin la palabra Traducción]

**On:**  
<span class="fr-click">[Frase completa en francés con pronombre]</span>  
[Traducción al español sin la palabra Traducción]

**Nous:**  
<span class="fr-click">[Frase completa en francés con pronombre]</span>  
[Traducción al español sin la palabra Traducción]

**Vous:**  
<span class="fr-click">[Frase completa en francés con pronombre]</span>  
[Traducción al español sin la palabra Traducción]

**Ils:**  
<span class="fr-click">[Frase completa en francés con pronombre]</span>  
[Traducción al español sin la palabra Traducción]

**Elles:**  
<span class="fr-click">[Frase completa en francés con pronombre]</span>  
[Traducción al español sin la palabra Traducción]

### <span class="material-symbols-outlined">notes</span> Notas
- REGLA ESTRICTA DE NOTAS: Cualquier nota explicativa, de uso cotidiano, aclaración gramatical o nota sobre Quebec (incluyendo la nota de Quebec que el sistema te indique en las instrucciones generales) debe ir SIEMPRE Y ESTRICTAMENTE al final de todo el documento en esta sección final. NUNCA insertes notas intermedias entre las tablas ni entre los ejemplos.`},{id:`lectura`,title:`Práctica de Lectura`,icon:`chrome_reader_mode`,description:`Genera textos para practicar lectura y vocabulario.`,inputs:[{id:`input_nivel`,label:`Nivel`,type:`select`,options:[`A1`,`A2`,`B1`,`B2`,`C1`,`C2`]},{id:`input_tema`,label:`Tema (o "Sugiéreme uno")`,type:`text`,placeholder:`Ej: Historia de Quebec`},{id:`input_longitud`,label:`Longitud del texto`,type:`select`,options:[`Corto (1-2 min)`,`Medio (3-5 min)`,`Largo (5-10 min)`]}],generatePrompt:e=>{let t=[`A1`,`A2`].includes(e.input_nivel),n=[`C1`,`C2`].includes(e.input_nivel),r=``;return r=t?`#### 1. Categorías gramaticales
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
  - <span class="fr-click">[marcador discursivo]</span> : [traducción directa]`:n?`#### 1. Categorías gramaticales
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
  - <span class="fr-click">[marcador pragmático de alto nivel]</span> : [traducción directa]`:`#### 1. Categorías gramaticales
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
  - <span class="fr-click">[marcador discursivo del relato]</span> : [traducción directa]`,`Genera un texto inmersivo de lectura en francés de Quebec basado en el tema '${e.input_tema}'.
El nivel debe ser estrictamente '${e.input_nivel}' y la longitud '${e.input_longitud}'.
${e.level_context?`\nREGLA DE GROUNDING OBLIGATORIA (MARCO CEFR):\nDebes limitar el vocabulario, las estructuras gramaticales y la complejidad del texto ESTRICTAMENTE a las pautas del siguiente marco de referencia para el Nivel ${e.input_nivel}:\n<marco_referencia>\n${e.level_context}\n</marco_referencia>\n`:``}
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

${r}

---
**Nota en Quebec**: [Aquí debes incluir obligatoriamente, DEBAJO DE TODO EL ANÁLISIS ANTERIOR, una nota explicando las particularidades, pronunciación, modismos o contexto cultural quebequés del texto. REGLA ESTRICTA: Esta nota NUNCA debe ir al principio ni mezclada con las categorías, SIEMPRE estrictamente al final, debajo de todo el análisis].`}},{id:`dialogo`,title:`Práctica de Diálogo`,icon:`record_voice_over`,description:`Genera diálogos y conversaciones cotidianas entre dos personas.`,inputs:[{id:`input_nivel`,label:`Nivel`,type:`select`,options:[`A1`,`A2`,`B1`,`B2`,`C1`,`C2`]},{id:`input_tema`,label:`Tema (o "Sugiéreme uno")`,type:`text`,placeholder:`Ej: Pedir en un café en Montreal`},{id:`input_longitud`,label:`Duración del diálogo`,type:`select`,options:[`Corto (4-6 turnos)`,`Medio (8-10 turnos)`,`Largo (12+ turnos)`]}],generatePrompt:e=>{let t=[`A1`,`A2`].includes(e.input_nivel),n=[`C1`,`C2`].includes(e.input_nivel),r=``;return r=t?`#### 1. Categorías gramaticales
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
  - <span class="fr-click">[marcador conversacional: alors, bon, voilà]</span> : [traducción directa]`:n?`#### 1. Categorías gramaticales
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
  - <span class="fr-click">[marcador pragmático oral: en fait, tu sais, écoute]</span> : [traducción directa]`:`#### 1. Categorías gramaticales
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
  - <span class="fr-click">[marcador oral: d'ailleurs, quand même, justement]</span> : [traducción directa]`,`Genera un diálogo realista y natural en francés de Quebec entre dos personas (con nombres propios habituales en Quebec) basado en el tema '${e.input_tema}'.
El nivel debe ser estrictamente '${e.input_nivel}' y la duración '${e.input_longitud}'.
${e.level_context?`\nREGLA DE GROUNDING OBLIGATORIA (MARCO CEFR):\nDebes limitar el vocabulario, las estructuras gramaticales y la complejidad del diálogo ESTRICTAMENTE a las pautas del siguiente marco de referencia para el Nivel ${e.input_nivel}:\n<marco_referencia>\n${e.level_context}\n</marco_referencia>\n`:``}
REGLA ESTRICTA DE CORRESPONDENCIA: El 'Diálogo en Francés' y la 'Traducción al Español' deben tener EXACTAMENTE EL MISMO NÚMERO DE TURNOS O INTERVENCIONES (por ejemplo, si el diálogo en francés tiene 6 turnos, la traducción debe tener exactamente 6 turnos correspondientes en el mismo orden exacto). Separa cada intervención o turno estrictamente con un SALTO DE LÍNEA DOBLE.
REGLA ESTRICTA DE LENGUAJE: El texto debe sonar a un diálogo oral auténtico del francés quebequés adecuado al nivel ${e.input_nivel}, pero manteniendo una correcta ortografía gramatical.
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

${r}

---
**Nota en Quebec**: [Aquí debes incluir obligatoriamente, DEBAJO DE TODO EL ANÁLISIS ANTERIOR, una nota explicando las particularidades del habla oral en Quebec presentadas en el diálogo, como pronunciación, contracciones orales informales o modismos quebequeses. REGLA ESTRICTA: Esta nota NUNCA debe ir al principio ni mezclada con las categorías, SIEMPRE estrictamente al final, debajo de todo el análisis].`}},{id:`analizador`,title:`Analizador de Texto`,icon:`document_scanner`,description:`Analiza, clasifica el nivel CEFR y traduce cualquier noticia, historia o texto en francés.`,inputs:[{id:`input_texto`,label:`Pega aquí tu texto, noticia o historia en francés`,type:`textarea`,placeholder:`Pega aquí un artículo de periódico, correo electrónico, historia o diálogo en francés para analizarlo...`}],generatePrompt:e=>`Analiza exhaustivamente el siguiente texto en francés que ha proporcionado el usuario:

<texto_usuario>
${e.input_texto}
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
**Nota en Quebec**: [Aquí debes incluir obligatoriamente, DEBAJO DE TODO EL ANÁLISIS ANTERIOR, una nota explicando si el texto presenta particularidades, vocabulario, pronunciación oral o modismos propios de Quebec, o cómo se interpreta y contextualiza este texto en la cultura y lengua quebequesa. REGLA ESTRICTA: Esta nota NUNCA debe ir al principio ni mezclada con las categorías, SIEMPRE estrictamente al final, debajo de todo el análisis].`},{id:`pronunciador`,title:`Pronunciador`,icon:`volume_up`,description:`Reproduce el sonido en francés de cualquier texto a diferentes velocidades.`,inputs:[],generatePrompt:()=>``},{id:`corrector`,title:`Corrector de Textos`,icon:`spellcheck`,description:`Revisa y corrige tus textos en francés con explicaciones detalladas y audición.`,inputs:[{id:`input_texto`,label:`Texto en Francés a corregir`,type:`textarea`,placeholder:`Escribe o pega aquí tu texto o párrafo en francés para que sea revisado y corregido...`}],generatePrompt:e=>`Revisa exhaustivamente y corrige el siguiente texto escrito en francés por un alumno hispanohablante:

<texto_usuario>
${e.input_texto}
</texto_usuario>

Estructura estrictamente la salida en las siguientes secciones:

### <span class="material-symbols-outlined">spellcheck</span> Texto Corregido
[Escribe el texto en francés completamente corregido, natural y fluido. REGLA ESTRICTA DE AUDIO: Envuelve CADA oración o frase independiente del texto corregido dentro de la etiqueta <span class="fr-click">...</span> (ejemplo: <span class="fr-click">Je suis allé au marché hier matin.</span>) para que el usuario pueda hacer clic en cualquier palabra o en el altavoz para reproducir el audio de cada frase con el control de velocidad].

### <span class="material-symbols-outlined">fact_check</span> Explicación de las Correcciones
[Si el texto tenía errores gramaticales, ortográficos, de concordancia, de puntuación o calcos estructurales del español, detállalos en una lista clara de viñetas, explaining la razón gramatical o de uso en español de forma comprensible y pedagógica. Si el texto original no tenía ningún error, felicita al estudiante y proporciona 2 o 3 sugerencias avanzadas de reformulación o vocabulario alternativo para enriquecer su expresión escrita].

---
**Nota en Quebec**: [Aquí debes incluir obligatoriamente, DEBAJO DE TODO EL ANÁLISIS ANTERIOR, una nota explicando si el texto presenta particularidades, vocabulario, pronunciación oral o modismos propios de Quebec, o cómo se interpreta y contextualiza este texto en la cultura y lengua quebequesa. REGLA ESTRICTA: Esta nota NUNCA debe ir al principio ni mezclada con las categorías, SIEMPRE estrictamente al final, debajo de todo el análisis].`},{id:`flashcards`,title:`Tarjetas de Memoria`,icon:`style`,description:`Genera tarjetas de repaso fonético-contextuales.`,inputs:[{id:`input_lista`,label:`Lista de palabras (hasta 20)`,type:`textarea`,placeholder:`Palabra 1, Palabra 2...`}],generatePrompt:e=>`Convierte esta lista de palabras en un mazo de tarjetas 3D: '${e.input_lista}'.
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
</div>`},{id:`chat`,title:`Simulador de Conversación`,icon:`forum`,description:`Chat interactivo con corrección en tiempo real.`,inputs:[{id:`input_nivel`,label:`Nivel`,type:`select`,options:[`A1`,`A2`,`B1`,`B2`,`C1`,`C2`]},{id:`input_tema`,label:`Tema de la charla`,type:`text`,placeholder:`Ej: Hablar sobre pasatiempos`}],generatePrompt:e=>`Actúa como un hablante nativo de francés y entabla un diálogo conmigo sobre '${e.input_tema}'. 
Reglas estrictas: 
1) Escribe máximo dos frases cortas por turno para mantener la fluidez. 
2) Mantén el nivel en '${e.input_nivel}'. 
3) Si cometo un error gramatical, estructural o un calco del español, escribe primero la corrección en español al inicio de tu mensaje separada del diálogo en francés por un salto de línea doble, siguiendo este formato exacto:

[CORRECCIÓN: 
Explicación corta en español del error y cómo se dice correctamente.]

D'accord, pour emporter. Qu'est-ce que je vous sers ?

Si mi mensaje no contiene errores, NUNCA incluyas la sección de corrección. Empieza tú saludándome en francés.`},{id:`gramatica`,title:`Decodificador de Gramática`,icon:`auto_fix_high`,description:`Explicación profunda de reglas gramaticales, falsos amigos y errores comunes.`,inputs:[{id:`input_regla`,label:`Regla o duda`,type:`text`,placeholder:`Ej: Diferencia entre POUR y PAR`}],generatePrompt:e=>`Explica de forma MUY AMPLIA Y DETALLADA la siguiente regla del francés: '${e.input_regla}'.
Regla estricta: Tu explicación debe ser exhaustiva, profunda, llena de ejemplos variados en diferentes contextos, y TODOS los ejemplos deben incluir su traducción al español.
Divide la explicación en: 
### <span class="material-symbols-outlined">psychology</span> Análisis Gramatical Profundo
1. **Explicación Detallada:** Explica la regla paso a paso con abundantes ejemplos.
2. **Comparación:** ¿Cómo expresaríamos esta misma lógica o idea en español?
3. **Alerta de Error:** ¿Cuál es el error típico que comete un hispanohablante al intentar usar esta regla?
4. **Práctica:** Dame 3 frases en español para que yo intente traducirlas al francés basándome en tu explicación.`},{id:`quiz`,title:`Evaluador de Producción`,icon:`quiz`,description:`Quiz semanal basado en lo que has estudiado.`,inputs:[{id:`input_estudio`,label:`Resumen de estudio`,type:`textarea`,placeholder:`Qué estudiaste esta semana?`}],generatePrompt:e=>`Prepárame un quiz personalizado de 5 preguntas basado en: '${e.input_estudio}'.
No uses opciones múltiples. En su lugar, dame situaciones o frases en español para que yo las traduzca al francés.
Estructura estrictamente la salida en las siguientes secciones:
### <span class="material-symbols-outlined">quiz</span> Preguntas
Presenta las 5 preguntas numeradas. Cada una debe ser una situación o frase en español que el estudiante debe traducir al francés. Asegúrate de cubrir gramática, vocabulario y ortografía relacionados con el tema de estudio.

### <span class="material-symbols-outlined">check_circle</span> Respuestas y Evaluación
Para cada pregunta, muestra:
1. La traducción correcta al francés envuelta en <span class="fr-click">...</span>.
2. Una explicación breve de los puntos gramaticales clave y errores comunes que un hispanohablante podría cometer.
3. Variantes aceptables si las hay.`},{id:`inmersion`,title:`Taller de Inmersión Textual`,icon:`article`,description:`Análisis de artículos y textos reales.`,inputs:[{id:`input_texto`,label:`Artículo o Texto en Francés`,type:`textarea`,placeholder:`Pega un artículo aquí...`}],generatePrompt:e=>`Analiza el siguiente texto: '${e.input_texto}'. No lo traduzcas completo. Devuelve:
### <span class="material-symbols-outlined">auto_stories</span> Desglose de Inmersión
1. Las 5 expresiones idiomáticas o verbos compuestos más útiles del texto, explicados en español.
2. Alerta de 'Falsos Amigos' presentes en el texto si los hay.
3. Hazme 3 preguntas de comprensión de lectura formuladas en francés para que yo las responda en francés.`},{id:`saved_lessons`,title:`Mis Lecciones Guardadas`,icon:`bookmark`,description:`Consulta, repasa o elimina las lecciones que has guardado.`,inputs:[],generatePrompt:()=>``}],t=`Eres un profesor nativo de francés experto en la enseñanza y pedagogía para estudiantes hispanohablantes (latinos).
- REGLA ESTRICTA: Cero relleno conversacional. NUNCA saludes, no te despidas, ni hagas introducciones como "¡Hola! Como tu profesor...". Ve directa y exclusivamente a la explicación técnica.
- Idioma de la interfaz y explicaciones: Español. Idioma de estudio: Francés estándar (Français standard). Toda la gramática, vocabulario básico y explicaciones deben basarse en el francés estándar internacional.
- ENFOQUE LOCAL (QUEBEC): Como el usuario vive en Quebec (Canadá), siempre que haya una diferencia importante en el vocabulario, modismos cotidianos, pronunciación típica o cultura quebequesa respecto a lo explicado, debes añadir obligatoriamente al final de la explicación, separada por una línea horizontal (---) en su propia línea, una nota corta sobre la variante de Quebec en cursiva (por ejemplo: "*En Quebec se suele decir...*"). No añadas prefijos repetitivos como "Nota para Quebec:".
- AUDIO INTERACTIVO: Envuelve TODAS las palabras, frases o ejemplos en francés estrictamente dentro de la etiqueta HTML <span class="fr-click">texto en francés</span>. Esto es vital para que el usuario pueda hacer clic y escuchar la pronunciación.
- Enfoque pedagógico: Basado en contrastes. El sistema debe anticipar los errores típicos de los hispanohablantes (traducciones literales, falsos amigos, preposiciones incorrectas y brecha fonética).
- Registro y contexto: Cuando sea relevante, especifica el registro de la traducción (si es muy formal, estándar o si es jerga/familier).
- Formato de salida: Sé ultra conciso. Toda respuesta debe venir formateada en Markdown limpio (usando títulos '###', reglas horizontales '---', negritas '**' y viñetas '*') para garantizar una lectura rápida y directa en móvil.`;async function n(e,n){if(!e)throw Error(`Por favor, ingresa tu API Key de Gemini en la barra lateral.`);let r=`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${e}`,i={systemInstruction:{parts:[{text:t}]},contents:[{role:`user`,parts:[{text:n}]}],generationConfig:{temperature:.7}};try{let e=await fetch(r,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(i)});if(!e.ok){let t=await e.json();throw Error(t.error?.message||`Error al comunicarse con la API de Gemini`)}let t=await e.json();if(!t.candidates||t.candidates.length===0){let e=t.promptFeedback?.blockReason;throw Error(e?`La solicitud fue bloqueada por el filtro de seguridad: ${e}`:`La API no devolvió ninguna respuesta. Intenta reformular tu solicitud.`)}let n=t.candidates[0];if(!n.content?.parts?.[0]?.text){let e=n.finishReason;throw Error(e&&e!==`STOP`?`La respuesta fue interrumpida: ${e}`:`La API devolvió una respuesta vacía. Intenta de nuevo.`)}return n.content.parts[0].text}catch(e){throw console.error(`Error in API call:`,e),e}}var r=e[0],i=``,a={nav:document.getElementById(`module-nav`),title:document.getElementById(`current-module-title`),desc:document.getElementById(`current-module-desc`),dynamicInputs:document.getElementById(`dynamic-inputs`),form:document.getElementById(`input-form`),outputContent:document.getElementById(`output-content`),loading:document.getElementById(`loading`),submitBtn:document.getElementById(`submit-btn`),apiKeyInput:document.getElementById(`api-key`),saveBtn:document.getElementById(`save-btn`),mobileMenuBtn:document.getElementById(`mobile-menu-btn`),closeSidebarBtn:document.getElementById(`close-sidebar-btn`),sidebar:document.querySelector(`.sidebar`),inputPanel:document.querySelector(`.input-panel`),outputPanel:document.querySelector(`.output-panel`),exportBtn:document.getElementById(`export-btn`),importBtn:document.getElementById(`import-btn`),importFile:document.getElementById(`import-file`),copyBtn:document.getElementById(`copy-btn`)},o=``,s=[],c=``,l=``,u=.9;function d(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function f(){let t=localStorage.getItem(`geminiApiKey`);t&&(a.apiKeyInput.value=t),p(),m(e[0].id),g()}function p(){a.nav.innerHTML=``,e.forEach(e=>{let t=document.createElement(`button`);t.className=`nav-item`,e.icon?t.innerHTML=`<span class="material-symbols-outlined nav-icon">${e.icon}</span><span>${e.title}</span>`:t.textContent=e.title,t.dataset.id=e.id,t.addEventListener(`click`,()=>m(e.id)),a.nav.appendChild(t)})}function m(t){r=e.find(e=>e.id===t),document.querySelectorAll(`.nav-item`).forEach(e=>{e.classList.toggle(`active`,e.dataset.id===t)}),r.icon?a.title.innerHTML=`<span class="material-symbols-outlined header-icon">${r.icon}</span><span>${r.title}</span>`:a.title.textContent=r.title,a.desc.textContent=r.description,h(r.inputs),a.outputContent.innerHTML=`<p class="placeholder-text">La respuesta aparecerá aquí...</p>`,a.saveBtn.classList.add(`hidden`),a.copyBtn.classList.add(`hidden`),i=``,s=[],window.innerWidth<=768&&a.sidebar.classList.remove(`open`)}function h(e){if(a.dynamicInputs.innerHTML=``,r.id===`saved_lessons`){a.submitBtn.classList.add(`hidden`),a.outputPanel&&(a.outputPanel.style.display=``),a.inputPanel&&(a.inputPanel.style.flex=``,a.inputPanel.style.maxWidth=``,a.inputPanel.style.margin=``),x();return}if(r.id===`pronunciador`){a.submitBtn.classList.add(`hidden`),a.outputPanel&&(a.outputPanel.style.display=`none`),a.inputPanel&&(a.inputPanel.style.flex=`1`,a.inputPanel.style.maxWidth=`640px`,a.inputPanel.style.margin=`0 auto`),P();return}a.outputPanel&&(a.outputPanel.style.display=``),a.inputPanel&&(a.inputPanel.style.flex=``,a.inputPanel.style.maxWidth=``,a.inputPanel.style.margin=``),a.submitBtn.classList.remove(`hidden`),e.forEach(e=>{let t=document.createElement(`div`);t.className=`input-group`;let n=document.createElement(`label`);n.htmlFor=e.id,n.textContent=e.label,t.appendChild(n);let r,i=null,o=null;if(e.type===`textarea`||e.type===`text`){if(i=document.createElement(`div`),i.className=`input-wrapper`,e.type===`textarea`)r=document.createElement(`textarea`),r.placeholder=e.placeholder||``,r.addEventListener(`input`,function(){this.style.height=`auto`,this.style.height=this.scrollHeight+`px`});else if(r=document.createElement(`input`),r.type=`text`,r.placeholder=e.placeholder||``,e.datalist&&Array.isArray(e.datalist)){let t=e.id+`-datalist`;r.setAttribute(`list`,t);let n=document.createElement(`datalist`);n.id=t,e.datalist.forEach(e=>{let t=document.createElement(`option`);t.value=e,n.appendChild(t)}),i.appendChild(n)}r.id=e.id,r.name=e.id,r.required=!0,o=document.createElement(`button`),o.type=`button`,o.className=`clear-input-btn hidden`,o.title=`Borrar texto`,o.innerHTML=`<span class="material-symbols-outlined">close</span>`,r.addEventListener(`input`,function(){this.value.trim()===``?o.classList.add(`hidden`):o.classList.remove(`hidden`)}),o.addEventListener(`click`,function(){r.value=``,e.type===`textarea`&&(r.style.height=`auto`),o.classList.add(`hidden`),r.focus()}),i.appendChild(r),i.appendChild(o)}else e.type===`select`?(r=document.createElement(`select`),e.options.forEach(e=>{let t=document.createElement(`option`);t.value=e,t.textContent=e,r.appendChild(t)}),r.id=e.id,r.name=e.id,r.required=!0):(r=document.createElement(`input`),r.type=e.type,r.placeholder=e.placeholder||``,r.id=e.id,r.name=e.id,r.required=!0);i?t.appendChild(i):t.appendChild(r),a.dynamicInputs.appendChild(t)})}function g(){a.form.addEventListener(`submit`,async e=>{e.preventDefault();let t=new FormData(a.form),i=Object.fromEntries(t.entries()),u=a.apiKeyInput.value.trim();if(!u){alert(`Por favor, ingresa tu Gemini API Key en la barra lateral.`);return}if(localStorage.setItem(`geminiApiKey`,u),i.input_nivel&&[`chat`,`lectura`,`dialogo`].includes(r.id))try{let e=`./data/levels/Niveau_${i.input_nivel}.md`,t=await fetch(e);t.ok?i.level_context=await t.text():console.warn(`No se pudo cargar el archivo de nivel: ${e}`)}catch(e){console.error(`Error al cargar el archivo de nivel:`,e)}if(r.id===`chat`){s=[],c=i.input_nivel,l=i.input_tema;try{v(!0);let e=await n(u,r.generatePrompt(i));s.push({role:`AI`,text:e}),D(u)}catch(e){a.outputContent.innerHTML=`<div class="error-message">Error: ${d(e.message)}</div>`}finally{v(!1)}return}let f=r.generatePrompt(i),p=i.input_tema||i.input_lista||i.input_regla||i.input_estudio||i.input_texto||r.title;o=p.length>35&&p!==r.title?p.substring(0,35)+`...`:p,await _(u,f)}),a.mobileMenuBtn.addEventListener(`click`,()=>{a.sidebar.classList.add(`open`)}),a.closeSidebarBtn.addEventListener(`click`,()=>{a.sidebar.classList.remove(`open`)}),a.saveBtn.addEventListener(`click`,b),a.copyBtn.addEventListener(`click`,w),a.exportBtn.addEventListener(`click`,T),a.importBtn.addEventListener(`click`,()=>a.importFile.click()),a.importFile.addEventListener(`change`,E);let e=document.querySelectorAll(`.btn-speed`);e.forEach(t=>{t.addEventListener(`click`,()=>{e.forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),u=parseFloat(t.dataset.rate)||.9})})}async function _(e,t){try{v(!0);let o=await n(e,t);if(i=o,r.id===`diccionario`)try{let e=o.indexOf(`{`),t=o.lastIndexOf(`}`);if(e===-1||t===-1)throw Error(`No se encontró JSON en la respuesta.`);let n=o.substring(e,t+1),r=j(M(JSON.parse(n)));a.outputContent.innerHTML=typeof DOMPurify<`u`?DOMPurify.sanitize(r,{ADD_ATTR:[`class`,`style`,`title`]}):r}catch(e){a.outputContent.innerHTML=`<div class="error-message">Error parseando respuesta: ${d(e.message)}</div>`}else if(typeof marked<`u`){if(r.id===`lectura`||r.id===`dialogo`||r.id===`analizador`)a.outputContent.innerHTML=N(o,r.id);else{let e=j(marked.parse(A(o)));a.outputContent.innerHTML=typeof DOMPurify<`u`?DOMPurify.sanitize(e,{ADD_ATTR:[`class`,`style`,`title`]}):e}}else a.outputContent.innerHTML=`<pre style="white-space: pre-wrap;">${o}</pre>`;a.saveBtn.classList.remove(`hidden`),a.copyBtn.classList.remove(`hidden`)}catch(t){let n=t.message;if(n.includes(`is not found`)||n.includes(`not supported`))try{let t=`https://generativelanguage.googleapis.com/v1beta/models?key=${e}`,r=await(await fetch(t)).json();if(r.models){let e=r.models.filter(e=>e.supportedGenerationMethods&&e.supportedGenerationMethods.includes(`generateContent`)).map(e=>e.name.replace(`models/`,``)).join(`, `);n+=`<br><br><strong>Modelos disponibles para tu API Key:</strong><br>${e}`}}catch(e){console.error(`Error fetching models:`,e)}a.outputContent.innerHTML=`<div style="color: var(--error-text);"><strong>Error:</strong> ${d(n)}</div>`}finally{v(!1)}}function v(e){e?(a.loading.classList.remove(`hidden`),a.outputContent.classList.add(`hidden`),a.submitBtn.disabled=!0):(a.loading.classList.add(`hidden`),a.outputContent.classList.remove(`hidden`),a.submitBtn.disabled=!1)}function y(){let e=localStorage.getItem(`savedLessons`);return e?JSON.parse(e):[]}function b(){if(!i)return;let e=y();if(e.some(e=>e.content===i)){alert(`Esta lección ya está guardada.`);return}e.push({id:Date.now().toString(),title:o,content:i,module:r.title}),localStorage.setItem(`savedLessons`,JSON.stringify(e)),r.id===`saved_lessons`&&x();let t=a.saveBtn.innerHTML;a.saveBtn.innerHTML=`<span class="material-symbols-outlined">check_circle</span>`,setTimeout(()=>{a.saveBtn.innerHTML=t},2e3)}function x(e=null){let t=y();if(a.dynamicInputs.innerHTML=``,t.length===0){a.dynamicInputs.innerHTML=`<p class="placeholder-text">Aún no hay lecciones guardadas.</p>`;return}if(!e)[...new Set(t.map(e=>e.module))].forEach(e=>{let n=t.filter(t=>t.module===e).length,r=document.createElement(`div`);r.className=`saved-folder`,r.innerHTML=`
                <div class="saved-folder-info">
                    <span class="material-symbols-outlined saved-folder-icon">folder</span>
                    <strong>${e}</strong>
                </div>
                <span class="saved-folder-count">${n} guardadas</span>
            `,r.addEventListener(`click`,()=>x(e)),a.dynamicInputs.appendChild(r)});else{let n=document.createElement(`button`);n.className=`saved-back-btn`,n.innerHTML=`<span class="material-symbols-outlined">arrow_back</span> Volver a Carpetas`,n.addEventListener(`click`,()=>x(null)),a.dynamicInputs.appendChild(n),t.filter(t=>t.module===e).forEach(t=>{let n=document.createElement(`div`);n.className=`saved-card`;let r=document.createElement(`div`);r.innerHTML=`<strong>${t.title}</strong><br><small style="color: var(--text-secondary)">${new Date(parseInt(t.id)).toLocaleDateString()}</small>`;let i=document.createElement(`button`);i.className=`saved-delete-btn`,i.innerHTML=`<span class="material-symbols-outlined">delete</span>`,i.title=`Eliminar lección`,i.addEventListener(`click`,n=>{n.stopPropagation(),C(t.id,e)}),n.addEventListener(`click`,()=>S(t)),n.appendChild(r),n.appendChild(i),a.dynamicInputs.appendChild(n)})}}function S(e){if(i=e.content,typeof marked<`u`){if(e.module===`Práctica de Lectura`||e.module===`Práctica de Diálogo`||e.module===`Analizador de Texto`){let t=e.module===`Práctica de Diálogo`?`dialogo`:e.module===`Analizador de Texto`?`analizador`:`lectura`;a.outputContent.innerHTML=N(e.content,t)}else if(e.module===`Pronunciador`||e.module===`Pronunciador y Fonética`){m(`pronunciador`),P(e.content.replace(/<[^>]*>/g,``).trim());return}else{let t=marked.parse(e.content);a.outputContent.innerHTML=typeof DOMPurify<`u`?DOMPurify.sanitize(j(t),{ADD_ATTR:[`class`,`style`,`title`]}):j(t)}}else a.outputContent.innerHTML=`<pre style="white-space: pre-wrap;">${e.content}</pre>`;a.saveBtn.classList.add(`hidden`),a.copyBtn.classList.remove(`hidden`),window.innerWidth<=768&&a.sidebar.classList.remove(`open`)}function C(e,t){if(!confirm(`¿Seguro que quieres borrar esta lección?`))return;let n=y();n=n.filter(t=>t.id!==e),localStorage.setItem(`savedLessons`,JSON.stringify(n)),x(t)}async function w(){if(!i)return;let e=i;if(r&&r.id===`traductor`){let t=i.split(`###`).find(e=>e.toLowerCase().includes(`traducción`)||e.toLowerCase().includes(`traduccion`));if(t){let n=t.replace(/<span[^>]*>.*?<\/span> Traducción/i,``).trim();n=n.replace(/<span class="fr-click">/gi,``).replace(/<\/span>/gi,``).trim(),e=n}}else e=e.replace(/<span class="fr-click">/gi,``).replace(/<\/span>/gi,``);try{await navigator.clipboard.writeText(e);let t=a.copyBtn.innerHTML;a.copyBtn.innerHTML=`<span class="material-symbols-outlined">check_circle</span>`,setTimeout(()=>{a.copyBtn.innerHTML=t},2e3)}catch(e){alert(`No se pudo copiar: `+e)}}function T(){let e=y();if(e.length===0){alert(`No tienes lecciones guardadas para exportar.`);return}let t=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`lecciones_frances_quebec_${new Date().toISOString().slice(0,10)}.json`,r.click(),URL.revokeObjectURL(n)}function E(e){let t=e.target.files[0];if(!t)return;let n=new FileReader;n.onload=function(e){try{let t=JSON.parse(e.target.result);if(!Array.isArray(t))throw Error(`El archivo no contiene un listado válido.`);if(t.length>0&&(!t[0].id||!t[0].title||!t[0].content))throw Error(`El formato de las lecciones no es compatible.`);let n=y(),i=[...n];t.forEach(e=>{n.some(t=>t.content===e.content)||i.push(e)}),localStorage.setItem(`savedLessons`,JSON.stringify(i)),alert(`¡Importación exitosa! Se añadieron ${i.length-n.length} lecciones nuevas.`),r.id===`saved_lessons`&&x()}catch(e){alert(`Error al importar el archivo: `+e.message)}a.importFile.value=``},n.readAsText(t)}a.outputContent.addEventListener(`click`,e=>{if(e.target.classList.contains(`fr-word`)){k(e.target.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g,``).trim()),e.stopPropagation();return}if(e.target.classList.contains(`fr-sentence-play`)){let t=e.target.closest(`.fr-click`);if(t){let e=t.cloneNode(!0),n=e.querySelector(`.fr-sentence-play`);n&&n.remove(),k(e.innerText.trim())}e.stopPropagation();return}if(e.target.classList.contains(`fr-click`)){let t=e.target.innerText;k(t),e.stopPropagation();return}let t=e.target.closest(`.btn-toggle-trad`);if(t){let n=t.nextElementSibling;n&&n.classList.contains(`lectura-es-p`)&&(n.classList.toggle(`hidden`),t.innerHTML=n.classList.contains(`hidden`)?`<span class="material-symbols-outlined">visibility</span> Ver traducción`:`<span class="material-symbols-outlined">visibility_off</span> Ocultar traducción`),e.stopPropagation();return}let n=e.target.closest(`.flashcard-inner`);n&&n.parentElement.classList.toggle(`flipped`)});function D(e){a.saveBtn.classList.add(`hidden`),a.copyBtn.classList.add(`hidden`),a.outputContent.innerHTML=`
      <div class="chat-container">
        <div class="chat-messages" id="chat-messages-box"></div>
        <div class="chat-input-bar">
          <input type="text" id="chat-user-input" placeholder="Responde en francés de Quebec...">
          <button id="chat-send-btn"><span class="material-symbols-outlined">send</span> Enviar</button>
        </div>
      </div>
    `;let t=document.getElementById(`chat-messages-box`),n=document.getElementById(`chat-user-input`),r=document.getElementById(`chat-send-btn`);s.forEach(e=>{let n=document.createElement(`div`);n.className=`chat-bubble ${e.role.toLowerCase()}`,e.role===`AI`?n.innerHTML=j(marked.parse(A(e.text))):n.innerText=e.text,t.appendChild(n)}),t.scrollTop=t.scrollHeight,r.addEventListener(`click`,()=>O(e)),n.addEventListener(`keydown`,t=>{t.key===`Enter`&&O(e)}),n.focus()}async function O(e){let t=document.getElementById(`chat-user-input`),r=document.getElementById(`chat-send-btn`),i=t.value.trim();if(!i)return;t.disabled=!0,r.disabled=!0,s.push({role:`User`,text:i});let a=document.getElementById(`chat-messages-box`),o=document.createElement(`div`);o.className=`chat-bubble user`,o.innerText=i,a.appendChild(o),a.scrollTop=a.scrollHeight,t.value=``;let u=s.slice(-15),d=`Conversación interactiva en francés de Quebec (Nivel: ${c}, Tema: ${l}).
Estás actuando como un hablante nativo entablando un diálogo continuo.
Reglas estrictas de respuesta:
1) Escribe máximo dos frases cortas por turno para mantener la fluidez del diálogo.
2) Si cometí un error gramatical, ortográfico o calco del español en mi último mensaje, debes iniciar tu respuesta escribiendo primero la corrección en español al inicio de tu mensaje separada del diálogo en francés por un salto de línea doble, siguiendo este formato exacto:
[CORRECCIÓN: 
Explicación corta del error y cómo se expresa correctamente.]

Luego continúa el diálogo normalmente en tu personaje en francés. Si mi mensaje no contiene errores, NUNCA incluyas la sección [CORRECCIÓN: ...].
3) Si hay algún modismo o pronunciación típica de Quebec aplicable a lo que dices, añade al final de tu mensaje una nota corta explicativa en cursiva (ej: "*En Quebec se suele decir...*"). No añadas prefijos como "Nota para Quebec:".

Historial de la conversación:
${u.map(e=>`${e.role===`AI`?`Tú (Profesor)`:`Yo (Estudiante)`}: ${e.text}`).join(`
`)}

Por favor responde a mi último mensaje en francés de Quebec continuando el diálogo.`;try{let t=await n(e,d);s.push({role:`AI`,text:t});let r=document.createElement(`div`);r.className=`chat-bubble ai`,r.innerHTML=j(marked.parse(A(t))),a.appendChild(r),a.scrollTop=a.scrollHeight}catch(e){let t=document.createElement(`div`);t.className=`chat-bubble ai`,t.style.color=`var(--error)`,t.textContent=`Error al enviar mensaje: `+e.message,a.appendChild(t)}finally{t.disabled=!1,r.disabled=!1,t.focus()}}function k(e){window.speechSynthesis.cancel();let t=new SpeechSynthesisUtterance(e),n=()=>{let e=window.speechSynthesis.getVoices().filter(e=>e.lang.startsWith(`fr`));if(e.length>0){let n=e.find(e=>e.name.includes(`Natural`)||e.name.includes(`Online`)||e.name.includes(`Google`)||e.name.includes(`Premium`));n||=e.find(e=>e.lang.startsWith(`fr-CA`)),n||=e[0],t.voice=n}else t.lang=`fr-CA`;t.rate=u===void 0?.9:u,window.speechSynthesis.speak(t)};window.speechSynthesis.getVoices().length===0?window.speechSynthesis.onvoiceschanged=()=>{n(),window.speechSynthesis.onvoiceschanged=null}:n()}window.speakText=k;function A(e){return e.replace(/`(<span\b[^>]*>.*?<\/span>)`/gi,`$1`)}function j(e){e=e.replace(/(\*|_){1,2}\s*(?:🇨🇦|CA|ca)?\s*Nota (?:para|en|de|sobre) Quebec\s*(?:🇨🇦|CA|ca)?:?\s*(\*|_){1,2}\s*/gi,`<strong class="quebec-note-title">Nota en Quebec: </strong> `),e=e.replace(/(?:🇨🇦|CA|ca)?\s*Nota (?:para|en|de|sobre) Quebec\s*(?:🇨🇦|CA|ca)?:?\s*/gi,`<strong class="quebec-note-title">Nota en Quebec: </strong> `);let t=document.createElement(`div`);return t.innerHTML=e,t.querySelectorAll(`.fr-click`).forEach(e=>{e.querySelector(`.fr-word`)||(e.innerHTML=`${e.innerText.trim().split(/\s+/).map(e=>`<span class="fr-word">${e}</span>`).join(` `)} <span class="material-symbols-outlined fr-sentence-play" title="Reproducir frase completa">volume_up</span>`)}),t.innerHTML}function M(e){let t=`<div class="diccionario-result">`,n=(e.entrada_original||e.palabra_raiz).toLowerCase(),r=e.palabra_raiz.toLowerCase();if(t+=`<div class="diccionario-header" style="margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
        <h2 style="margin: 0; color: var(--text-primary); font-size: 2.2rem; display: flex; align-items: center; gap: 0.5rem;">
            <span class="fr-click">${n}</span>
        </h2>
        <div style="font-size: 1.1rem; color: var(--text-secondary); margin-top: 5px; margin-bottom: 12px;">
            [${e.fonetica_simplificada}]
        </div>
        
        <div style="font-size: 0.95rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px; margin-top: 15px;">
            <div><strong>Forma base:</strong> <span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${r}</span></div>`,e.verbo_relacionado&&e.verbo_relacionado.toLowerCase()!==r&&e.verbo_relacionado.toLowerCase()!==n&&(t+=`<div><strong>Verbo raíz:</strong> <span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${e.verbo_relacionado.toLowerCase()}</span></div>`),e.genero_y_numero&&e.genero_y_numero.toLowerCase()!==`n/a`&&(t+=`<div><strong>Género:</strong> ${e.genero_y_numero}</div>`),e.sinonimos&&Array.isArray(e.sinonimos)&&e.sinonimos.length>0){let n=e.sinonimos.filter(e=>e.frances&&e.frances.toLowerCase()!==`n/a`).map(e=>`<span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${e.frances}</span> <span style="color: var(--text-secondary); font-size: 0.9em;">(${e.espanol})</span>`).join(`, `);n&&(t+=`<div><strong>Sinónimos:</strong> ${n}</div>`)}return e.antonimo&&e.antonimo.frances&&e.antonimo.frances.toLowerCase()!==`n/a`&&(t+=`<div><strong>Antónimo:</strong> <span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${e.antonimo.frances}</span> <span style="color: var(--text-secondary); font-size: 0.9em;">(${e.antonimo.espanol})</span></div>`),t+=`</div>
    </div>`,e.traducciones&&e.traducciones.length>0&&(t+=`<h3><span class="material-symbols-outlined" style="vertical-align: middle;">translate</span> Traducciones</h3><ul style="list-style-type: none; padding-left: 0;">`,e.traducciones.forEach((e,n)=>{t+=`<li style="margin-bottom: 15px; padding: 15px; background: var(--bg-hover); border-radius: 8px;">
                <strong style="font-size: 1.2rem; color: var(--text-primary);">${n+1}. ${e.significado}</strong>
                ${e.ejemplo_frances?`<div style="margin-top: 8px; padding-left: 10px; border-left: 2px solid var(--border-color); font-size: 1rem;"><span class="fr-click">${e.ejemplo_frances}</span><br><span style="color: var(--text-secondary); font-size: 0.9em;">${e.ejemplo_espanol}</span></div>`:``}
            </li>`}),t+=`</ul>`),e.notas_gramaticales?.preposiciones&&e.notas_gramaticales.preposiciones.length>0&&(t+=`<h3><span class="material-symbols-outlined" style="vertical-align: middle;">rule</span> Preposiciones</h3>
            <ul style="list-style-type: none; padding-left: 0;">`,(Array.isArray(e.notas_gramaticales.preposiciones)?e.notas_gramaticales.preposiciones:[{frances:e.notas_gramaticales.preposiciones,espanol:``}]).forEach(e=>{typeof e==`string`?t+=`<li style="margin-bottom: 15px; padding: 15px; background: var(--bg-hover); border-radius: 8px;"><span class="fr-click">${e}</span></li>`:e.frances&&(t+=`<li style="margin-bottom: 15px; padding: 15px; background: var(--bg-hover); border-radius: 8px;">
                    <div><strong class="fr-click" style="font-size: 1.1rem; color: var(--text-primary);">${e.frances}</strong> ${e.espanol?`<span style="color: var(--text-secondary); font-size: 0.9em;">(${e.espanol})</span>`:``}</div>
                    ${e.ejemplo_frances?`<div style="margin-top: 8px; padding-left: 10px; border-left: 2px solid var(--border-color); font-size: 1rem;"><span class="fr-click">${e.ejemplo_frances}</span><br><span style="color: var(--text-secondary); font-size: 0.9em;">${e.ejemplo_espanol}</span></div>`:``}
                </li>`)}),t+=`</ul>`),e.colocaciones&&e.colocaciones.length>0&&(t+=`<h3><span class="material-symbols-outlined" style="vertical-align: middle;">link</span> Colocaciones</h3>
            <ul style="list-style-type: none; padding-left: 0;">`,e.colocaciones.forEach(e=>{typeof e==`string`?t+=`<li style="margin-bottom: 15px; padding: 15px; background: var(--bg-hover); border-radius: 8px;"><span class="fr-click">${e}</span></li>`:e.frances&&(t+=`<li style="margin-bottom: 15px; padding: 15px; background: var(--bg-hover); border-radius: 8px;">
                    <div><strong class="fr-click" style="font-size: 1.1rem; color: var(--text-primary);">${e.frances}</strong> ${e.espanol?`<span style="color: var(--text-secondary); font-size: 0.9em;">(${e.espanol})</span>`:``}</div>
                    ${e.ejemplo_frances?`<div style="margin-top: 8px; padding-left: 10px; border-left: 2px solid var(--border-color); font-size: 1rem;"><span class="fr-click">${e.ejemplo_frances}</span><br><span style="color: var(--text-secondary); font-size: 0.9em;">${e.ejemplo_espanol}</span></div>`:``}
                </li>`)}),t+=`</ul>`),e.diferencias_regionales&&e.diferencias_regionales.toLowerCase()!==`uso estándar`&&(t+=`<h3><span class="material-symbols-outlined" style="vertical-align: middle;">public</span> Diferencias Regionales</h3>
        <div style="margin-bottom: 15px; padding: 15px; background: var(--bg-hover); border-radius: 8px;">
            <p style="margin: 0; font-size: 1.05rem;">${e.diferencias_regionales}</p>
        </div>`),e.micro_historia&&(t+=`<h3><span class="material-symbols-outlined" style="vertical-align: middle;">auto_stories</span> Micro-historia</h3>
        <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 15px; padding: 15px; background: var(--bg-hover); border-radius: 8px;">
                <div style="font-size: 1.05rem; line-height: 1.6;"><span class="fr-click">${e.micro_historia.frances}</span></div>
                <div style="color: var(--text-secondary); font-size: 0.95em; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-color);">${e.micro_historia.espanol}</div>
            </li>
        </ul>`),t+=`</div>`,t}function N(e,t=`lectura`){let n=e.split(`
`),r=[],i=[],a=[],o=[],s=``;for(let e of n){let t=e.toLowerCase();if(s!==`nivel`&&(t.includes(`nivel detectado`)||t.includes(`nivel cefr`)||t.includes(`evaluación del nivel`)||t.includes(`evaluacion del nivel`))){s=`nivel`;continue}if(s!==`fr`&&(t.includes(`texto en francés`)||t.includes(`texto en frances`)||t.includes(`diálogo en francés`)||t.includes(`dialogo en frances`))){s=`fr`;continue}if(s!==`es`&&(t.includes(`traducción al español`)||t.includes(`traduccion al espanol`)||t.includes(`traducción`)&&!t.includes(`ejemplo`))){s=`es`;continue}if(s!==`explicacion`&&(t.includes(`glosario`)||t.includes(`explicación de la lectura`)||t.includes(`explicacion de la lectura`)||t.includes(`explicación del diálogo`)||t.includes(`explicacion del dialogo`)||t.includes(`explicación del texto`)||t.includes(`explicacion del texto`))){s=`explicacion`;continue}s===`nivel`?o.push(e):s===`fr`?r.push(e):s===`es`?i.push(e):s===`explicacion`&&a.push(e)}if(r.length===0&&i.length===0&&a.length===0&&o.length===0){let t=j(marked.parse(A(e)));return typeof DOMPurify<`u`?DOMPurify.sanitize(t,{ADD_ATTR:[`class`,`style`,`title`,`type`]}):t}let c=r.join(`
`).trim(),l=i.join(`
`).trim(),u=a.join(`
`).trim(),d=o.join(`
`).trim(),f=marked.parse(A(u));f=j(f);let p=``;d&&(p=marked.parse(A(d)),p=j(p));let m=document.createElement(`div`);m.innerHTML=f;let h=m.querySelectorAll(`.fr-word`),g=new Set,_=new Set(`le.la.les.l.un.une.des.du.de.d.au.aux.et.ou.où.mais.donc.or.ni.car.que.qui.quoi.dont.ce.cet.cette.ces.mon.ton.son.ma.ta.sa.mes.tes.ses.notre.votre.leur.nos.vos.leurs.je.tu.il.elle.on.nous.vous.ils.elles.me.te.se.y.en.lui.a.à.dans.par.pour.sur.sous.avec.sans.chez.est.sont.été.être.avoir.ai.as.avons.avez.ont.fait.plus.très.tout.tous.toute.toutes.bien.si.c.s.j.m.n.t.qu.n/a`.split(`.`));h.forEach(e=>{let t=e.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g,``).trim().toLowerCase();t&&t.length>2&&!_.has(t)&&g.add(t)});let v=e=>{let t=document.createElement(`div`);return t.innerHTML=e,t.querySelectorAll(`.fr-word`).forEach(e=>{let t=e.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g,``).trim().toLowerCase();g.has(t)&&e.classList.add(`glosario-highlight`)}),t.innerHTML},y=c.replace(/<br\s*\/?>/gi,`

`).replace(/<\/span>\s*(?:\n|<br\s*\/?>|\s)*<span/gi,`</span>

<span`),b=l.replace(/<br\s*\/?>/gi,`

`).replace(/<\/span>\s*(?:\n|<br\s*\/?>|\s)*<span/gi,`</span>

<span`),x=y.split(/\n\s*\n/).map(e=>e.trim()).filter(Boolean),S=b.split(/\n\s*\n/).map(e=>e.trim()).filter(Boolean);if(x.length===1&&y.split(`
`).filter(e=>e.trim().length>0).length>1){let e=y.split(`
`).map(e=>e.trim()).filter(Boolean);e.length>1&&(x=e)}if(S.length!==x.length&&x.length>1){let e=b.split(`
`).map(e=>e.trim()).filter(Boolean);(e.length===x.length||S.length===1&&e.length>1)&&(S=e)}if(x.length===1&&S.length===1){let e=y.split(`
`).map(e=>e.trim()).filter(Boolean),t=b.split(`
`).map(e=>e.trim()).filter(Boolean);e.length>1&&e.length===t.length&&(x=e,S=t)}let C=``,w=Math.max(x.length,S.length);for(let e=0;e<w;e++){let t=x[e]?j(marked.parse(A(x[e]))):``;t&&=v(t);let n=S[e]?marked.parse(A(S[e])):``;C+=`
        <div class="lectura-paragraph-group">
            <div class="lectura-fr-p">${t}</div>
            ${n?`
            <button class="btn-toggle-trad" type="button">
                <span class="material-symbols-outlined">visibility</span> Ver traducción
            </button>
            <div class="lectura-es-p hidden">${n}</div>
            `:``}
        </div>
        `}let T=t===`dialogo`,E=t===`analizador`,D=`Texto en Francés y Traducción`;T&&(D=`Diálogo en Francés y Traducción`),E&&(D=`Texto Fragmentado y Traducción`);let O=`menu_book`;T&&(O=`record_voice_over`),E&&(O=`document_scanner`);let k=`Explicación de la Lectura`;T&&(k=`Explicación del Diálogo`),E&&(k=`Explicación del Texto`);let M=`
    <div class="lectura-container">
        ${p?`
        <div class="analizador-nivel-badge">
            <h3 class="lectura-header" style="margin-top:0; border-bottom: none; padding-bottom: 0.5rem;"><span class="material-symbols-outlined">grade</span> Nivel Detectado y Evaluación</h3>
            <div class="nivel-badge-body">${p}</div>
        </div>
        `:``}
        <div class="lectura-main-text">
            <h3 class="lectura-header"><span class="material-symbols-outlined">${O}</span> ${D}</h3>
            <div class="lectura-paragraphs-wrapper">
                ${C}
            </div>
        </div>
        
        ${f?`
        <div class="lectura-explicacion">
            <h3 class="lectura-header"><span class="material-symbols-outlined">analytics</span> ${k}</h3>
            <div class="lectura-body">${f}</div>
        </div>
        `:``}
    </div>
    `;return typeof DOMPurify<`u`?DOMPurify.sanitize(M,{ADD_ATTR:[`class`,`style`,`title`,`type`]}):M}function P(e=``){a.dynamicInputs.innerHTML=`
      <div class="pronunciador-simple-view" style="padding: 1rem 0 2rem 0; text-align: center;">
        <div class="textarea-wrapper" style="position: relative; margin-bottom: 2.2rem; text-align: left;">
          <textarea id="pronunciador-simple-text" placeholder="Escribe aquí la frase en francés..." style="width: 100%; min-height: 180px; padding: 1.4rem; font-size: 1.25rem; border: 2px solid #e2e8f0; border-radius: 20px; outline: none; resize: vertical; font-family: var(--font-family); color: var(--text-primary); background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: border-color 0.2s, box-shadow 0.2s;"></textarea>
          <button type="button" id="pronunciador-clear-btn" class="hidden" title="Borrar texto" style="position: absolute; top: 1rem; right: 1rem; background: #f1f5f9; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s;"><span class="material-symbols-outlined" style="font-size: 1.1rem;">close</span></button>
        </div>
        
        <div style="display: flex; justify-content: center; margin-bottom: 1.6rem;">
          <button type="button" id="pronunciador-circle-btn" title="Escuchar pronunciación" style="width: 56px; height: 56px; border-radius: 50%; background: #232255; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px -4px rgba(35,34,85,0.4); transition: transform 0.15s ease, background-color 0.2s ease;">
            <span class="material-symbols-outlined" style="font-size: 1.8rem;">volume_up</span>
          </button>
        </div>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.8rem; flex-wrap: wrap;">
          <span style="font-size: 1rem; font-weight: 600; color: #64748b; margin-right: 0.2rem;">Velocidad:</span>
          <button type="button" class="btn-speed-pill ${u===1||u===.9?`active`:``}" data-rate="1.0">100%</button>
          <button type="button" class="btn-speed-pill ${u===.75||u===.7?`active`:``}" data-rate="0.75">75%</button>
          <button type="button" class="btn-speed-pill ${u===.5?`active`:``}" data-rate="0.5">50%</button>
          <button type="button" class="btn-speed-pill ${u===.25?`active`:``}" data-rate="0.25">25%</button>
        </div>
      </div>
    `;let t=document.getElementById(`pronunciador-simple-text`),n=document.getElementById(`pronunciador-clear-btn`),r=document.getElementById(`pronunciador-circle-btn`),i=document.querySelectorAll(`.btn-speed-pill`);t&&(e&&(t.value=e,n&&n.classList.remove(`hidden`)),t.addEventListener(`input`,()=>{t.value.trim()===``?n&&n.classList.add(`hidden`):n&&n.classList.remove(`hidden`)}),t.addEventListener(`focus`,()=>{t.style.borderColor=`#6366f1`,t.style.boxShadow=`0 0 0 4px rgba(99,102,241,0.1)`}),t.addEventListener(`blur`,()=>{t.style.borderColor=`#e2e8f0`,t.style.boxShadow=`0 4px 12px rgba(0,0,0,0.02)`}),n&&n.addEventListener(`click`,()=>{t.value=``,n.classList.add(`hidden`),t.focus(),window.speechSynthesis.cancel()})),r&&t&&(r.addEventListener(`mouseover`,()=>{r.style.transform=`scale(1.06)`,r.style.backgroundColor=`#1e1b4b`}),r.addEventListener(`mouseout`,()=>{r.style.transform=`scale(1)`,r.style.backgroundColor=`#232255`}),r.addEventListener(`mousedown`,()=>{r.style.transform=`scale(0.95)`}),r.addEventListener(`mouseup`,()=>{r.style.transform=`scale(1.06)`}),r.addEventListener(`click`,()=>{let e=t.value.trim();if(!e){t.focus(),t.style.borderColor=`#f87171`,setTimeout(()=>t.style.borderColor=`#6366f1`,1e3);return}k(e)})),i.forEach(e=>{e.addEventListener(`click`,()=>{i.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),u=parseFloat(e.dataset.rate)||1,t&&t.value.trim()&&k(t.value.trim())})})}f();