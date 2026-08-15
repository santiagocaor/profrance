const SYSTEM_INSTRUCTION = `Eres un profesor nativo de francés experto en la enseñanza y pedagogía para estudiantes hispanohablantes (latinos).
- REGLA ESTRICTA: Cero relleno conversacional. NUNCA saludes, no te despidas, ni hagas introducciones como "¡Hola! Como tu profesor...". Ve directa y exclusivamente a la explicación técnica.
- Idioma de la interfaz y explicaciones: Español. Idioma de estudio: Francés estándar (Français standard). Toda la gramática, vocabulario básico y explicaciones deben basarse en el francés estándar internacional.
- ENFOQUE LOCAL (QUEBEC): Como el usuario vive en Quebec (Canadá), siempre que haya una diferencia importante en el vocabulario, modismos cotidianos, pronunciación típica o cultura quebequesa respecto a lo explicado, debes añadir obligatoriamente al final de la explicación, separada por una línea horizontal (---) en su propia línea, una nota corta sobre la variante de Quebec en cursiva (por ejemplo: "*En Quebec se suele decir...*"). No añadas prefijos repetitivos como "Nota para Quebec:".
- AUDIO INTERACTIVO: Envuelve TODAS las palabras, frases o ejemplos en francés estrictamente dentro de la etiqueta HTML <span class="fr-click">texto en francés</span>. Esto es vital para que el usuario pueda hacer clic y escuchar la pronunciación.
- Enfoque pedagógico: Basado en contrastes. El sistema debe anticipar los errores típicos de los hispanohablantes (traducciones literales, falsos amigos, preposiciones incorrectas y brecha fonética).
- Registro y contexto: Cuando sea relevante, especifica el registro de la traducción (si es muy formal, estándar o si es jerga/familier).
- Formato de salida: Sé ultra conciso. Toda respuesta debe venir formateada en Markdown limpio (usando títulos '###', reglas horizontales '---', negritas '**' y viñetas '*') para garantizar una lectura rápida y directa en móvil.`;

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

export async function generateContent(apiKey, prompt) {
  if (!apiKey) {
    throw new Error('Por favor, ingresa tu API Key de Gemini en la barra lateral.');
  }

  let lastError = null;

  // Intenta con los modelos disponibles en orden de prioridad
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.error?.message || 'Error en la solicitud a Gemini';
        
        // Si es error de cuota o rate limit (429), intentamos el siguiente modelo
        if (response.status === 429 || msg.includes('quota') || msg.includes('rate-limit') || msg.includes('Resource has been exhausted')) {
          console.warn(`Cuota temporal excedida en ${model}. Conmutando al siguiente modelo...`);
          lastError = new Error(msg);
          continue; // Intentar con el siguiente modelo de la lista
        }
        
        throw new Error(msg);
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        const blockReason = data.promptFeedback?.blockReason;
        throw new Error(blockReason
          ? `La solicitud fue bloqueada por el filtro de seguridad: ${blockReason}`
          : 'La API no devolvió ninguna respuesta. Intenta reformular tu solicitud.');
      }

      const candidate = data.candidates[0];
      if (!candidate.content?.parts?.[0]?.text) {
        const finishReason = candidate.finishReason;
        throw new Error(finishReason && finishReason !== 'STOP'
          ? `La respuesta fue interrumpida: ${finishReason}`
          : 'La API devolvió una respuesta vacía. Intenta de nuevo.');
      }

      return candidate.content.parts[0].text;
    } catch (error) {
      lastError = error;
      // Si el error contiene mensaje de cuota o modelo no disponible, probamos el siguiente
      if (error.message && (error.message.includes('quota') || error.message.includes('limit') || error.message.includes('exceeded'))) {
        continue;
      }
      throw error;
    }
  }

  // Si todos los modelos fallaron por cuota
  throw lastError || new Error('Límite de cuota temporal alcanzado en todos los modelos. Por favor espera 10 segundos e inténtalo nuevamente.');
}
