export const conjugadorModule = {
  id: 'conjugador',
  title: 'Conjugador',
  icon: 'table_chart',
  description: 'Conjugación de verbos con autocompletado inteligente, significado y ejemplos prácticos con pronunciación individual.',
  inputs: [
    { 
      id: 'input_verbo', 
      label: 'Verbo a conjugar (empieza a escribir y selecciona una coincidencia o escribe cualquier otro)', 
      type: 'text', 
      placeholder: 'Ej: être, avoir, aller, faire, vouloir, devoir, manger, partir, prendre...',
      datalist: [
        "acheter", "adorer", "aider", "aimer", "aller", "amener", "appeler", "apporter", "apprendre", "arriver", "attendre", "avoir", 
        "boire", "bouger", "changer", "chanter", "chercher", "choisir", "commencer", "comprendre", "conduire", "connaître", "continuer", "courir", "coûter", "craindre", "créer", "croire", 
        "décider", "demander", "descendre", "devenir", "devoir", "dire", "donner", "dormir", "douter", 
        "écouter", "écrire", "emmener", "entendre", "entrer", "envoyer", "espérer", "essayer", "être", "étudier", "exister", "expliquer", 
        "faire", "falloir", "fermer", "finir", "gagner", "garder", "goûter", "habiter", "hésiter", 
        "inviter", "jouer", "laisser", "laver", "lever", "lire", "manger", "marcher", "mettre", "monter", "montrer", "mourir", 
        "naître", "naviguer", "nettoyer", "offrir", "oublier", "ouvrir", "parler", "partager", "partir", "passer", "payer", "penser", "perdre", "permettre", "plaire", "pleurer", "porter", "pouvoir", "préférer", "prendre", "préparer", "promettre", "proposer", 
        "raconter", "rappeler", "recevoir", "reconnaître", "réfléchir", "regarder", "rendre", "rentrer", "répondre", "ressembler", "rester", "réussir", "revendiquer", "revenir", "rêver", "rire", 
        "savoir", "sembler", "sentir", "servir", "sortir", "souffrir", "sourire", "se souvenir", "suivre", 
        "taire", "tenir", "tomber", "toucher", "travailler", "traverser", "trouver", "utiliser", "valoir", "vendre", "venir", "vivre", "voir", "voler", "vouloir", "voyager"
      ]
    },
    { 
      id: 'input_tiempo', 
      label: 'Tiempo / Modo verbal', 
      type: 'select', 
      options: [
        "Todos los tiempos esenciales (Resumen Completo)",
        "Présent de l'indicatif",
        "Passé Composé",
        "L'Imparfait",
        "Futur Proche",
        "Conditionnel Présent",
        "Subjonctif Présent",
        "Futur Simple",
        "Plus-que-parfait"
      ]
    }
  ],
  generatePrompt: (data) => `Actúa como un profesor nativo y experto lingüista de francés.
El usuario desea conjugar el verbo: '${data.input_verbo}' en el tiempo/modo: '${data.input_tiempo}'.

REGLAS Y ESTRUCTURA DE RESPUESTA EN MARKDOWN:
### <span class="material-symbols-outlined">info</span> Ficha del Verbo
- **Significado:** Significado principal y preciso del verbo en español (ejemplo: si el verbo es aller, el significado sería: Ir). NO incluyas sinónimos, antónimos ni ninguna otra información técnica aquí.

- Si el usuario eligió "Todos los tiempos esenciales (Resumen Completo)", genera las secciones de Conjugación y Ejemplos para cada uno de los 8 tiempos clave del francés en orden: Présent, Passé Composé, L'Imparfait, Futur Proche, Conditionnel Présent, Subjonctif Présent, Futur Simple y Plus-que-parfait.
- Si eligió un tiempo específico, genera las secciones únicamente para ese tiempo.

### <span class="material-symbols-outlined">table_chart</span> Conjugación (${data.input_tiempo})
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

### <span class="material-symbols-outlined">lightbulb</span> Ejemplos (${data.input_tiempo})
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
- REGLA ESTRICTA DE NOTAS: Cualquier nota explicativa, de uso cotidiano, aclaración gramatical o nota sobre Quebec (incluyendo la nota de Quebec que el sistema te indique en las instrucciones generales) debe ir SIEMPRE Y ESTRICTAMENTE al final de todo el documento en esta sección final. NUNCA insertes notas intermedias entre las tablas ni entre los ejemplos.`
};
