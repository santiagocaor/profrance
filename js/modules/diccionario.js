export const diccionarioModule = {
  id: 'diccionario',
  title: 'Diccionario',
  icon: 'menu_book',
  description: 'Búsqueda lingüística completa con significados, fonética, expresiones, sinónimos y micro-historias.',
  inputs: [
    { id: 'input_palabra', label: 'Palabra en Francés', type: 'text', placeholder: 'Ej: boulot, allait, perdues...' }
  ],
  generatePrompt: (data) => `Eres un experto lingüista y desarrollador de diccionarios bilingües (Francés-Español). 
Tu tarea es analizar la palabra en francés ingresada por el usuario y devolver información estructurada, útil, contextualizada y adaptada para hispanohablantes.

Palabra a buscar: '${data.input_palabra}'

REGLAS ESTRÍCTAS:
1. Analiza la entrada del usuario. Si es una forma conjugada o plural, identifica el infinitivo o la raíz y construye tu respuesta basándote en la raíz principal.
2. Proporciona todos los significados y traducciones principales más relevantes y usados de la palabra (solo la palabra o frase corta por significado, sin explicaciones largas).
3. IMPORTANTE: En la sección "traducciones", debes proporcionar EXACTAMENTE un ejemplo (campos "ejemplo_frances" y "ejemplo_espanol") por cada significado. Asegúrate estrictamente de que los ejemplos entregados correspondan y apliquen tanto al significado principal como a los sinónimos proporcionados.
4. Para preposiciones y colocaciones, debes incluir siempre una frase de ejemplo completa que ilustre su uso (campos "ejemplo_frances" y "ejemplo_espanol").
5. Proporciona una transcripción fonética simplificada leída en español (ej. para "oiseau", usa "ua-zó").
6. Proporciona OBLIGATORIAMENTE entre 1 y MÁXIMO 2 sinónimos principales (NUNCA más de 2 sinónimos) y EXACTAMENTE 1 antónimo u opuesto conceptual relevante en francés con su traducción al español (ej. para 'boulot' -> 'travail'; antónimo -> 'chômage').
7. Genera una "micro-historia" creativa de 3 líneas en francés que utilice la palabra buscada, junto con su traducción al español.
8. NO incluyas NINGÚN texto conversacional antes o después del JSON. Tu respuesta debe ser ÚNICA y EXCLUSIVAMENTE un objeto JSON válido, sin delimitadores \`\`\`json, con esta estructura exacta:
{
  "entrada_original": "COPIA EXACTAMENTE la palabra que el usuario escribió, sin corregir ni alterar nada",
  "palabra_raiz": "La forma base de la palabra (infinitivo, o masculino singular)",
  "verbo_relacionado": "Si la palabra NO es un verbo, indica el verbo raíz relacionado (ej. travail -> travailler). Si ya es verbo o no aplica, déjalo vacío.",
  "genero_y_numero": "MÁXIMO 2 PALABRAS (Ej: Masc Singular, Fem Plural o N/A)",
  "sinonimos": [
    { "frances": "Sinónimo 1 en francés", "espanol": "Traducción al español 1" }
  ],
  "antonimo": { "frances": "Antónimo obligatorio en francés", "espanol": "Traducción del antónimo al español" },
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
}`
};
