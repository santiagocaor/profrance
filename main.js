import { modules } from './js/modules.js';
import { generateContent } from './js/api.js';

let currentModule = modules[0];
let currentResponseText = '';

const dom = {
  nav: document.getElementById('module-nav'),
  title: document.getElementById('current-module-title'),
  desc: document.getElementById('current-module-desc'),
  dynamicInputs: document.getElementById('dynamic-inputs'),
  form: document.getElementById('input-form'),
  outputContent: document.getElementById('output-content'),
  loading: document.getElementById('loading'),
  submitBtn: document.getElementById('submit-btn'),
  apiKeyInput: document.getElementById('api-key'),
  saveBtn: document.getElementById('save-btn'),
  mobileMenuBtn: document.getElementById('mobile-menu-btn'),
  closeSidebarBtn: document.getElementById('close-sidebar-btn'),
  sidebar: document.querySelector('.sidebar'),
  exportBtn: document.getElementById('export-btn'),
  importBtn: document.getElementById('import-btn'),
  importFile: document.getElementById('import-file'),
  copyBtn: document.getElementById('copy-btn'),
};

let currentLessonTitle = '';
let chatHistory = [];
let currentChatLevel = '';
let currentChatTopic = '';

function init() {
  const savedKey = localStorage.getItem('geminiApiKey');
  if (savedKey) {
    dom.apiKeyInput.value = savedKey;
  }
  renderNav();
  selectModule(modules[0].id);
  setupEvents();
}

function renderNav() {
  dom.nav.innerHTML = '';
  modules.forEach(mod => {
    const btn = document.createElement('button');
    btn.className = 'nav-item';
    btn.textContent = mod.title;
    btn.dataset.id = mod.id;
    btn.addEventListener('click', () => selectModule(mod.id));
    dom.nav.appendChild(btn);
  });
}

function selectModule(id) {
  currentModule = modules.find(m => m.id === id);
  
  // Update Nav
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.id === id);
  });

  // Update Header
  dom.title.textContent = currentModule.title;
  dom.desc.textContent = currentModule.description;

  // Render Inputs
  renderInputs(currentModule.inputs);
  
  // Reset output
  dom.outputContent.innerHTML = '<p class="placeholder-text">La respuesta aparecerá aquí...</p>';
  dom.saveBtn.classList.add('hidden');
  dom.copyBtn.classList.add('hidden');
  currentResponseText = '';
  chatHistory = [];
  
  if(window.innerWidth <= 768) {
      dom.sidebar.classList.remove('open');
  }
}

function renderInputs(inputs) {
  dom.dynamicInputs.innerHTML = '';
  
  if (currentModule.id === 'saved_lessons') {
      dom.submitBtn.classList.add('hidden');
      renderSavedLessonsView();
      return;
  }
  
  dom.submitBtn.classList.remove('hidden');
  
  inputs.forEach(input => {
    const group = document.createElement('div');
    group.className = 'input-group';
    
    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = input.label;
    group.appendChild(label);
    
    let el;
    if (input.type === 'textarea') {
      el = document.createElement('textarea');
      el.placeholder = input.placeholder || '';
      // Ajustar altura automáticamente al escribir o pegar
      el.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
      });
    } else if (input.type === 'select') {
      el = document.createElement('select');
      input.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        el.appendChild(option);
      });
    } else {
      el = document.createElement('input');
      el.type = input.type;
      el.placeholder = input.placeholder || '';
    }
    
    el.id = input.id;
    el.name = input.id;
    el.required = true;
    
    group.appendChild(el);
    dom.dynamicInputs.appendChild(group);
  });
}

function setupEvents() {
  dom.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(dom.form);
    const data = Object.fromEntries(formData.entries());
    
    const apiKey = dom.apiKeyInput.value.trim();
    if (!apiKey) {
      alert('Por favor, ingresa tu Gemini API Key en la barra lateral.');
      return;
    }
    
    if (apiKey) {
      localStorage.setItem('geminiApiKey', apiKey);
    }

    if (currentModule.id === 'chat') {
        chatHistory = [];
        currentChatLevel = data.input_nivel;
        currentChatTopic = data.input_tema;
        
        try {
            setLoading(true);
            const prompt = currentModule.generatePrompt(data);
            const greeting = await generateContent(apiKey, prompt);
            
            chatHistory.push({ role: 'AI', text: greeting });
            renderChatInterface(apiKey);
        } catch (error) {
            dom.outputContent.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        } finally {
            setLoading(false);
        }
        return;
    }
    
    const prompt = currentModule.generatePrompt(data);
    
    // Auto-generar título basado en el input más relevante del módulo
    let rawTitle = data.input_tema || data.input_lista || data.input_regla || data.input_estudio || data.input_texto || currentModule.title;
    if (rawTitle.length > 35 && rawTitle !== currentModule.title) {
        currentLessonTitle = rawTitle.substring(0, 35) + '...';
    } else {
        currentLessonTitle = rawTitle;
    }
    
    await executePrompt(apiKey, prompt);
  });
  
  // Mobile Menu
  dom.mobileMenuBtn.addEventListener('click', () => {
      dom.sidebar.classList.add('open');
  });
  dom.closeSidebarBtn.addEventListener('click', () => {
      dom.sidebar.classList.remove('open');
  });
  
  // Save Lesson
  dom.saveBtn.addEventListener('click', saveCurrentLesson);
  
  // Copy to clipboard
  dom.copyBtn.addEventListener('click', copyToClipboard);

  // Export / Import
  dom.exportBtn.addEventListener('click', exportLessons);
  dom.importBtn.addEventListener('click', () => dom.importFile.click());
  dom.importFile.addEventListener('change', importLessons);
}

async function executePrompt(apiKey, prompt) {
  try {
    setLoading(true);
    
    const responseText = await generateContent(apiKey, prompt);
    currentResponseText = responseText;
    
    // Check if marked is loaded globally
    if (typeof marked !== 'undefined') {
      const html = marked.parse(responseText);
      dom.outputContent.innerHTML = processFrenchText(html);
    } else {
      dom.outputContent.innerHTML = `<pre style="white-space: pre-wrap;">${responseText}</pre>`;
    }

    // Activar botones
    dom.saveBtn.classList.remove('hidden');
    dom.copyBtn.classList.remove('hidden');

  } catch (error) {
    let errorMsg = error.message;
    
    // Si el error es de modelo no encontrado, intentamos listar los modelos disponibles para ayudar al usuario
    if (errorMsg.includes("is not found") || errorMsg.includes("not supported")) {
        try {
            const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
            const listRes = await fetch(listUrl);
            const listData = await listRes.json();
            
            if (listData.models) {
                const availableModels = listData.models
                  .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
                  .map(m => m.name.replace('models/', ''))
                  .join(', ');
                
                errorMsg += `<br><br><strong>Modelos disponibles para tu API Key:</strong><br>${availableModels}`;
            }
        } catch(e) {
            console.error("Error fetching models:", e);
        }
    }
    
    dom.outputContent.innerHTML = `<div style="color: var(--error);"><strong>Error:</strong> ${errorMsg}</div>`;
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  if (isLoading) {
    dom.loading.classList.remove('hidden');
    dom.outputContent.classList.add('hidden');
    dom.submitBtn.disabled = true;
  } else {
    dom.loading.classList.add('hidden');
    dom.outputContent.classList.remove('hidden');
    dom.submitBtn.disabled = false;
  }
}

function getSavedLessons() {
    const saved = localStorage.getItem('savedLessons');
    return saved ? JSON.parse(saved) : [];
}

function saveCurrentLesson() {
    if(!currentResponseText) return;
    
    const lessons = getSavedLessons();
    // Prevenir duplicados (si el usuario hace clic varias veces)
    if(lessons.some(l => l.content === currentResponseText)) {
        alert("Esta lección ya está guardada.");
        return;
    }

    lessons.push({
        id: Date.now().toString(),
        title: currentLessonTitle,
        content: currentResponseText,
        module: currentModule.title
    });
    
    localStorage.setItem('savedLessons', JSON.stringify(lessons));
    
    // Si estamos en el módulo de guardadas (raro, pero posible), actualizamos
    if(currentModule.id === 'saved_lessons') renderSavedLessonsView();
    
    // Feedback visual en el botón
    const originalText = dom.saveBtn.innerHTML;
    dom.saveBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span>';
    setTimeout(() => { dom.saveBtn.innerHTML = originalText; }, 2000);
}

function renderSavedLessonsView(selectedModuleFilter = null) {
    const lessons = getSavedLessons();
    dom.dynamicInputs.innerHTML = '';
    
    if (lessons.length === 0) {
        dom.dynamicInputs.innerHTML = '<p class="placeholder-text">Aún no hay lecciones guardadas.</p>';
        return;
    }
    
    if (!selectedModuleFilter) {
        // --- VISTA DE CARPETAS ---
        const modulesWithLessons = [...new Set(lessons.map(l => l.module))];
        
        modulesWithLessons.forEach(modName => {
            const count = lessons.filter(l => l.module === modName).length;
            
            const folder = document.createElement('div');
            folder.style.border = '1px solid var(--border-color)';
            folder.style.borderRadius = 'var(--radius)';
            folder.style.padding = '1.2rem';
            folder.style.marginBottom = '1rem';
            folder.style.display = 'flex';
            folder.style.justifyContent = 'space-between';
            folder.style.alignItems = 'center';
            folder.style.backgroundColor = 'var(--bg-color)';
            folder.style.cursor = 'pointer';
            folder.style.transition = 'opacity 0.2s';
            
            folder.addEventListener('mouseover', () => folder.style.opacity = '0.8');
            folder.addEventListener('mouseout', () => folder.style.opacity = '1');
            
            folder.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <span class="material-symbols-outlined" style="color: var(--text-secondary); margin-right: 0.8rem; font-size: 2rem;">folder</span>
                    <strong>${modName}</strong>
                </div>
                <span style="color: var(--text-secondary); font-size: 0.9em; margin-left: auto;">${count} guardadas</span>
            `;
            
            folder.addEventListener('click', () => renderSavedLessonsView(modName));
            dom.dynamicInputs.appendChild(folder);
        });
    } else {
        // --- VISTA DE LECCIONES DEL MÓDULO ---
        const backBtn = document.createElement('button');
        backBtn.className = 'btn-primary';
        backBtn.style.marginBottom = '1.5rem';
        backBtn.style.padding = '0.8rem';
        backBtn.style.background = 'var(--bg-color)';
        backBtn.style.color = 'var(--text-primary)';
        backBtn.style.border = '1px solid var(--border-color)';
        backBtn.style.display = 'flex';
        backBtn.style.alignItems = 'center';
        backBtn.style.gap = '0.5rem';
        backBtn.innerHTML = '<span class="material-symbols-outlined">arrow_back</span> Volver a Carpetas';
        backBtn.addEventListener('click', () => renderSavedLessonsView(null));
        dom.dynamicInputs.appendChild(backBtn);
        
        const filtered = lessons.filter(l => l.module === selectedModuleFilter);
        
        filtered.forEach(lesson => {
            const card = document.createElement('div');
            card.style.border = '1px solid var(--border-color)';
            card.style.borderRadius = 'var(--radius)';
            card.style.padding = '1rem';
            card.style.marginBottom = '1rem';
            card.style.display = 'flex';
            card.style.justifyContent = 'space-between';
            card.style.alignItems = 'center';
            card.style.backgroundColor = 'var(--bg-color)';
            card.style.cursor = 'pointer';
            
            const info = document.createElement('div');
            info.innerHTML = `<strong>${lesson.title}</strong><br><small style="color: var(--text-secondary)">${new Date(parseInt(lesson.id)).toLocaleDateString()}</small>`;
            
            const delBtn = document.createElement('button');
            delBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
            delBtn.style.background = 'transparent';
            delBtn.style.border = 'none';
            delBtn.style.cursor = 'pointer';
            delBtn.style.color = 'var(--text-secondary)';
            delBtn.title = "Eliminar lección";
            delBtn.addEventListener('mouseover', () => delBtn.style.color = 'var(--error)');
            delBtn.addEventListener('mouseout', () => delBtn.style.color = 'var(--text-secondary)');
            
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteLesson(lesson.id, selectedModuleFilter);
            });
            
            card.addEventListener('click', () => loadLesson(lesson));
            
            card.appendChild(info);
            card.appendChild(delBtn);
            dom.dynamicInputs.appendChild(card);
        });
    }
}

function loadLesson(lesson) {
    currentResponseText = lesson.content;
    
    if (typeof marked !== 'undefined') {
      const html = marked.parse(lesson.content);
      dom.outputContent.innerHTML = processFrenchText(html);
    } else {
      dom.outputContent.innerHTML = `<pre style="white-space: pre-wrap;">${lesson.content}</pre>`;
    }
    
    dom.saveBtn.classList.add('hidden'); // Ya está guardada
    dom.copyBtn.classList.remove('hidden'); // Permitir copiar lecciones cargadas
    
    if(window.innerWidth <= 768) {
        dom.sidebar.classList.remove('open');
    }
}

function deleteLesson(id, currentFilter) {
    if(!confirm("¿Seguro que quieres borrar esta lección?")) return;
    let lessons = getSavedLessons();
    lessons = lessons.filter(l => l.id !== id);
    localStorage.setItem('savedLessons', JSON.stringify(lessons));
    renderSavedLessonsView(currentFilter);
}

async function copyToClipboard() {
    if (!currentResponseText) return;
    try {
        await navigator.clipboard.writeText(currentResponseText);
        const originalText = dom.copyBtn.innerHTML;
        dom.copyBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span>';
        setTimeout(() => { dom.copyBtn.innerHTML = originalText; }, 2000);
    } catch(err) {
        alert("No se pudo copiar: " + err);
    }
}

// --- EXPORT / IMPORT LOGIC ---
function exportLessons() {
    const lessons = getSavedLessons();
    if(lessons.length === 0) {
        alert("No tienes lecciones guardadas para exportar.");
        return;
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lessons, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lecciones_frances_quebec_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importLessons(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const imported = JSON.parse(evt.target.result);
            if (!Array.isArray(imported)) throw new Error("El archivo no contiene un listado válido.");
            
            // Validar estructura básica
            if (imported.length > 0 && (!imported[0].id || !imported[0].title || !imported[0].content)) {
                throw new Error("El formato de las lecciones no es compatible.");
            }
            
            const existing = getSavedLessons();
            
            // Evitar duplicados basados en ID o contenido
            const merged = [...existing];
            imported.forEach(imp => {
                if(!existing.some(ext => ext.content === imp.content)) {
                    merged.push(imp);
                }
            });
            
            localStorage.setItem('savedLessons', JSON.stringify(merged));
            alert(`¡Importación exitosa! Se añadieron ${merged.length - existing.length} lecciones nuevas.`);
            
            if(currentModule.id === 'saved_lessons') {
                renderSavedLessonsView();
            }
        } catch(err) {
            alert("Error al importar el archivo: " + err.message);
        }
        // Reset file input
        dom.importFile.value = '';
    };
    reader.readAsText(file);
}

// Re-añadir el global listener para los textos en francés de lecciones cargadas y tarjetas
dom.outputContent.addEventListener('click', (e) => {
  // 1. Clic en palabra individual
  if (e.target.classList.contains('fr-word')) {
    const word = e.target.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g,"").trim();
    speakText(word);
    e.stopPropagation();
    return;
  }
  
  // 2. Clic en reproducir frase completa (altavoz)
  if (e.target.classList.contains('fr-sentence-play')) {
    const parent = e.target.closest('.fr-click');
    if (parent) {
        const clone = parent.cloneNode(true);
        const playIcon = clone.querySelector('.fr-sentence-play');
        if (playIcon) playIcon.remove();
        const textToRead = clone.innerText.trim();
        speakText(textToRead);
    }
    e.stopPropagation();
    return;
  }
  
  // 3. Compatibilidad por si queda algún fr-click crudo sin procesar
  if (e.target.classList.contains('fr-click')) {
    const textToRead = e.target.innerText;
    speakText(textToRead);
    e.stopPropagation();
    return;
  }
  
  // Lógica de giro para tarjetas 3D
  const cardInner = e.target.closest('.flashcard-inner');
  if(cardInner) {
      cardInner.parentElement.classList.toggle('flipped');
  }
});

// --- INTERACTIVE CHAT ENGINE ---
function renderChatInterface(apiKey) {
    dom.saveBtn.classList.add('hidden'); // Desactivar botón guardar mientras chatea
    dom.copyBtn.classList.add('hidden');
    
    dom.outputContent.innerHTML = `
      <div class="chat-container">
        <div class="chat-messages" id="chat-messages-box"></div>
        <div class="chat-input-bar">
          <input type="text" id="chat-user-input" placeholder="Responde en francés de Quebec...">
          <button id="chat-send-btn"><span class="material-symbols-outlined">send</span> Enviar</button>
        </div>
      </div>
    `;
    
    const box = document.getElementById('chat-messages-box');
    const input = document.getElementById('chat-user-input');
    const btn = document.getElementById('chat-send-btn');
    
    // Renderizar mensajes del historial
    chatHistory.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${msg.role.toLowerCase()}`;
        
        if (msg.role === 'AI') {
            bubble.innerHTML = processFrenchText(marked.parse(msg.text));
        } else {
            bubble.innerText = msg.text;
        }
        box.appendChild(bubble);
    });
    box.scrollTop = box.scrollHeight;
    
    // Eventos del input
    btn.addEventListener('click', () => sendChatMessage(apiKey));
    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            sendChatMessage(apiKey);
        }
    });
    
    input.focus();
}

async function sendChatMessage(apiKey) {
    const input = document.getElementById('chat-user-input');
    const btn = document.getElementById('chat-send-btn');
    const text = input.value.trim();
    if(!text) return;
    
    // Deshabilitar inputs
    input.disabled = true;
    btn.disabled = true;
    
    // Guardar mensaje de usuario
    chatHistory.push({ role: 'User', text: text });
    
    // Renderizado inmediato
    const box = document.getElementById('chat-messages-box');
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.innerText = text;
    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
    
    input.value = '';
    
    // Prompt dinámico acumulativo con historial
    const prompt = `Conversación interactiva en francés de Quebec (Nivel: ${currentChatLevel}, Tema: ${currentChatTopic}).
Estás actuando como un hablante nativo entablando un diálogo continuo.
Reglas estrictas de respuesta:
1) Escribe máximo dos frases cortas por turno para mantener la fluidez del diálogo.
2) Si cometí un error gramatical, ortográfico o calco del español en mi último mensaje, debes iniciar tu respuesta escribiendo "[CORRECCIÓN: ...]" en español aclarando el error de forma muy directa y amigable. Luego continúa el diálogo normalmente dentro de tu personaje en francés. Si mi mensaje no contiene errores, no añadas ninguna sección de corrección.
3) Si hay algún modismo o pronunciación típica de Quebec aplicable a lo que dices, añade al final de tu mensaje una nota corta explicativa en cursiva (ej: "*En Quebec se suele decir...*"). No añadas prefijos como "Nota para Quebec:".

Historial de la conversación:
${chatHistory.map(m => `${m.role === 'AI' ? 'Tú (Profesor)' : 'Yo (Estudiante)'}: ${m.text}`).join('\n')}

Por favor responde a mi último mensaje en francés de Quebec continuando el diálogo.`;

    try {
        const responseText = await generateContent(apiKey, prompt);
        chatHistory.push({ role: 'AI', text: responseText });
        
        const aiBubble = document.createElement('div');
        aiBubble.className = 'chat-bubble ai';
        aiBubble.innerHTML = processFrenchText(marked.parse(responseText));
        box.appendChild(aiBubble);
        box.scrollTop = box.scrollHeight;
        
    } catch(error) {
        const errBubble = document.createElement('div');
        errBubble.className = 'chat-bubble ai';
        errBubble.style.color = 'var(--error)';
        errBubble.innerText = "Error al enviar mensaje: " + error.message;
        box.appendChild(errBubble);
    } finally {
        input.disabled = false;
        btn.disabled = false;
        input.focus();
    }
}

// --- HELPER AUDIO & PARSER FUNCTIONS ---
function speakText(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const frVoices = voices.filter(v => v.lang.startsWith('fr-CA') || v.lang.startsWith('fr-FR') || v.lang.startsWith('fr-'));
    
    if (frVoices.length > 0) {
        let bestVoice = frVoices.find(v => v.lang.startsWith('fr-CA') && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Premium')));
        if (!bestVoice) bestVoice = frVoices.find(v => v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Premium'));
        if (!bestVoice) bestVoice = frVoices.find(v => v.lang.startsWith('fr-CA'));
        if (!bestVoice) bestVoice = frVoices[0];
        
        utterance.voice = bestVoice;
    } else {
        utterance.lang = 'fr-CA'; 
    }
    
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

function processFrenchText(html) {
    // Limpiar prefijos redundantes de Quebec para que solo se vea la explicación
    html = html.replace(/(\*|_){1,2}\s*(?:🇨🇦\s*)?Nota para Quebec:?\s*(\*|_){1,2}\s*/gi, '');
    html = html.replace(/(?:🇨🇦\s*)?Nota para Quebec:?\s*/gi, '');
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const clickElements = tempDiv.querySelectorAll('.fr-click');
    clickElements.forEach(el => {
        if (el.querySelector('.fr-word')) return; // Ya procesado
        
        const rawText = el.innerText.trim();
        const words = rawText.split(/\s+/);
        
        const newContent = words.map(w => `<span class="fr-word">${w}</span>`).join(' ');
        
        el.innerHTML = `${newContent} <span class="material-symbols-outlined fr-sentence-play" title="Reproducir frase completa">volume_up</span>`;
    });
    
    return tempDiv.innerHTML;
}

// Iniciar app
init();
