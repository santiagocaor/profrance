import { modules } from './js/modules.js';
import { generateContent } from './js/api.js';
import { 
  loginWithGoogle, 
  logoutUser, 
  onAuthChange, 
  saveLessonToCloud, 
  deleteLessonFromCloud, 
  subscribeToCloudLessons 
} from './js/firebase.js';

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
  inputPanel: document.getElementById('input-panel'),
  inputPanelToggle: document.getElementById('input-panel-toggle'),
  inputPanelSummaryText: document.getElementById('input-panel-summary-text'),
  btnToggleInputPanel: document.getElementById('btn-toggle-input-panel'),
  outputPanel: document.querySelector('.output-panel'),
  exportBtn: document.getElementById('export-btn'),
  importBtn: document.getElementById('import-btn'),
  importFile: document.getElementById('import-file'),
  copyBtn: document.getElementById('copy-btn'),
  googleLoginBtn: document.getElementById('google-login-btn'),
  googleLogoutBtn: document.getElementById('google-logout-btn'),
  authLoggedOut: document.getElementById('auth-logged-out'),
  authLoggedIn: document.getElementById('auth-logged-in'),
  userAvatar: document.getElementById('user-avatar'),
  userName: document.getElementById('user-name'),
};

let currentLessonTitle = '';
let chatHistory = [];
let currentChatLevel = '';
let currentChatTopic = '';
let currentAudioRate = 0.9;
let currentUser = null;
let unsubscribeCloudSync = null;

// Utilidad para escapar HTML en mensajes de error (prevención XSS)
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setInputPanelCollapsed(collapsed, summary = '') {
  if (!dom.inputPanel) return;
  if (currentModule && (currentModule.id === 'saved_lessons' || currentModule.id === 'pronunciador' || currentModule.id === 'chat')) {
    dom.inputPanel.classList.remove('collapsed');
    if (dom.inputPanelToggle) dom.inputPanelToggle.classList.add('hidden');
    return;
  }

  if (collapsed) {
    dom.inputPanel.classList.add('collapsed');
    if (dom.inputPanelToggle) {
      dom.inputPanelToggle.classList.remove('hidden');
      const icon = dom.btnToggleInputPanel ? dom.btnToggleInputPanel.querySelector('.material-symbols-outlined') : null;
      if (icon) icon.textContent = 'expand_more';
      if (dom.btnToggleInputPanel) dom.btnToggleInputPanel.title = 'Expandir texto original';
    }
    if (summary && dom.inputPanelSummaryText) {
      const cleanSummary = summary.length > 60 ? summary.substring(0, 60) + '...' : summary;
      dom.inputPanelSummaryText.innerHTML = `<span class="summary-label">Texto original:</span> <span class="summary-content">«${escapeHtml(cleanSummary)}»</span>`;
    }
  } else {
    dom.inputPanel.classList.remove('collapsed');
    if (dom.inputPanelToggle) {
      const icon = dom.btnToggleInputPanel ? dom.btnToggleInputPanel.querySelector('.material-symbols-outlined') : null;
      if (icon) icon.textContent = 'expand_less';
      if (dom.btnToggleInputPanel) dom.btnToggleInputPanel.title = 'Contraer texto original';
    }
  }
}

function init() {
  const savedKey = localStorage.getItem('geminiApiKey');
  if (savedKey) {
    dom.apiKeyInput.value = savedKey;
  }
  renderNav();
  selectModule(modules[0].id);
  setupEvents();
  setupAuth();
}

function setupAuth() {
  if (dom.googleLoginBtn) {
    dom.googleLoginBtn.addEventListener('click', async () => {
      try {
        await loginWithGoogle();
      } catch (e) {
        alert("Error al iniciar sesión con Google: " + e.message);
      }
    });
  }

  if (dom.googleLogoutBtn) {
    dom.googleLogoutBtn.addEventListener('click', async () => {
      try {
        await logoutUser();
      } catch (e) {
        console.error("Error al cerrar sesión:", e);
      }
    });
  }

  onAuthChange((user) => {
    currentUser = user;
    if (user) {
      if (dom.authLoggedOut) dom.authLoggedOut.classList.add('hidden');
      if (dom.authLoggedIn) dom.authLoggedIn.classList.remove('hidden');
      if (dom.userAvatar) dom.userAvatar.src = user.photoURL || 'logo.png';
      if (dom.userName) dom.userName.textContent = user.displayName || user.email || 'Usuario';

      // Sincronizar en tiempo real las lecciones de la nube
      if (unsubscribeCloudSync) unsubscribeCloudSync();
      unsubscribeCloudSync = subscribeToCloudLessons(user.uid, (cloudLessons) => {
        if (cloudLessons && Array.isArray(cloudLessons)) {
          localStorage.setItem('savedLessons', JSON.stringify(cloudLessons));
          if (currentModule && currentModule.id === 'saved_lessons') {
            renderSavedLessonsView();
          }
        }
      });
    } else {
      if (dom.authLoggedOut) dom.authLoggedOut.classList.remove('hidden');
      if (dom.authLoggedIn) dom.authLoggedIn.classList.add('hidden');
      if (unsubscribeCloudSync) {
        unsubscribeCloudSync();
        unsubscribeCloudSync = null;
      }
    }
  });
}

function renderNav() {
  dom.nav.innerHTML = '';
  modules.forEach(mod => {
    const btn = document.createElement('button');
    btn.className = 'nav-item';
    if (mod.icon) {
      btn.innerHTML = `<span class="material-symbols-outlined nav-icon">${mod.icon}</span><span>${mod.title}</span>`;
    } else {
      btn.textContent = mod.title;
    }
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
  if (currentModule.icon) {
    dom.title.innerHTML = `<span class="material-symbols-outlined header-icon">${currentModule.icon}</span><span>${currentModule.title}</span>`;
  } else {
    dom.title.textContent = currentModule.title;
  }
  dom.desc.textContent = currentModule.description;

  // Render Inputs
  renderInputs(currentModule.inputs);
  
  // Reset output
  dom.outputContent.innerHTML = '<p class="placeholder-text">La respuesta aparecerá aquí...</p>';
  dom.saveBtn.classList.add('hidden');
  dom.copyBtn.classList.add('hidden');
  setInputPanelCollapsed(false);
  if (dom.inputPanelToggle) dom.inputPanelToggle.classList.add('hidden');
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
      if (dom.outputPanel) dom.outputPanel.style.display = '';
      if (dom.inputPanel) { dom.inputPanel.style.flex = ''; dom.inputPanel.style.maxWidth = ''; dom.inputPanel.style.margin = ''; }
      renderSavedLessonsView();
      return;
  }
  
  if (currentModule.id === 'pronunciador') {
      dom.submitBtn.classList.add('hidden');
      if (dom.outputPanel) dom.outputPanel.style.display = 'none';
      if (dom.inputPanel) {
          dom.inputPanel.style.flex = '1';
          dom.inputPanel.style.maxWidth = '640px';
          dom.inputPanel.style.margin = '0 auto';
      }
      renderPronunciadorView();
      return;
  }
  
  if (dom.outputPanel) dom.outputPanel.style.display = '';
  if (dom.inputPanel) { dom.inputPanel.style.flex = ''; dom.inputPanel.style.maxWidth = ''; dom.inputPanel.style.margin = ''; }
  dom.submitBtn.classList.remove('hidden');
  
  inputs.forEach(input => {
    const group = document.createElement('div');
    group.className = 'input-group';
    
    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = input.label;
    group.appendChild(label);
    
    let el;
    let wrapper = null;
    let clearBtn = null;
    
    if (input.type === 'textarea' || input.type === 'text') {
      wrapper = document.createElement('div');
      wrapper.className = 'input-wrapper';
      
      if (input.type === 'textarea') {
        el = document.createElement('textarea');
        el.placeholder = input.placeholder || '';
        el.addEventListener('input', function() {
          this.style.height = 'auto';
          this.style.height = this.scrollHeight + 'px';
        });
      } else {
        el = document.createElement('input');
        el.type = 'text';
        el.placeholder = input.placeholder || '';
        if (input.datalist && Array.isArray(input.datalist)) {
          const dlId = input.id + '-datalist';
          el.setAttribute('list', dlId);
          const dl = document.createElement('datalist');
          dl.id = dlId;
          input.datalist.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            dl.appendChild(opt);
          });
          wrapper.appendChild(dl);
        }
      }
      
      el.id = input.id;
      el.name = input.id;
      el.required = true;
      
      // Crear botón "x" de limpieza
      clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'clear-input-btn hidden';
      clearBtn.title = 'Borrar texto';
      clearBtn.innerHTML = '<span class="material-symbols-outlined">close</span>';
      
      // Mostrar/ocultar botón según el contenido
      el.addEventListener('input', function() {
        if (this.value.trim() !== '') {
          clearBtn.classList.remove('hidden');
        } else {
          clearBtn.classList.add('hidden');
        }
      });
      
      // Acción al hacer clic en el botón de borrar
      clearBtn.addEventListener('click', function() {
        el.value = '';
        if (input.type === 'textarea') {
          el.style.height = 'auto';
        }
        clearBtn.classList.add('hidden');
        el.focus();
      });
      
      wrapper.appendChild(el);
      wrapper.appendChild(clearBtn);
    } else if (input.type === 'select') {
      el = document.createElement('select');
      input.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        el.appendChild(option);
      });
      el.id = input.id;
      el.name = input.id;
      el.required = true;
    } else {
      el = document.createElement('input');
      el.type = input.type;
      el.placeholder = input.placeholder || '';
      el.id = input.id;
      el.name = input.id;
      el.required = true;
    }
    
    if (wrapper) {
      group.appendChild(wrapper);
    } else {
      group.appendChild(el);
    }
    
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
      dom.apiKeyInput.focus();
      dom.apiKeyInput.style.borderColor = 'var(--md-sys-color-error)';
      dom.outputContent.innerHTML = `<div style="color: var(--md-sys-color-on-error-container); font-weight: 500; padding: 1.2rem; background: var(--md-sys-color-error-container); border-radius: 16px; display: flex; align-items: center; gap: 0.6rem;">
        <span class="material-symbols-outlined" style="font-size: 1.5rem;">key</span>
        <span>Por favor, ingresa tu <strong>Gemini API Key</strong> en la barra lateral izquierda para traducir.</span>
      </div>`;
      setTimeout(() => { dom.apiKeyInput.style.borderColor = ''; }, 3000);
      return;
    }
    // Guardar la key al usarla
    localStorage.setItem('geminiApiKey', apiKey);

    // --- LÓGICA DE GROUNDING (CEFR) solo para módulos que lo usan ---
    if (data.input_nivel && ['chat', 'lectura', 'dialogo'].includes(currentModule.id)) {
        try {
            const levelFileUrl = `./data/levels/Niveau_${data.input_nivel}.md`;
            const response = await fetch(levelFileUrl);
            if (response.ok) {
                data.level_context = await response.text();
            } else {
                console.warn(`No se pudo cargar el archivo de nivel: ${levelFileUrl}`);
            }
        } catch (e) {
            console.error("Error al cargar el archivo de nivel:", e);
        }
    }
    // ----------------------------------

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
            dom.outputContent.innerHTML = `<div class="error-message">Error: ${escapeHtml(error.message)}</div>`;
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

  // Control de velocidad de audio 🐢/🐇
  const speedButtons = document.querySelectorAll('.btn-speed');
  speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      speedButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAudioRate = parseFloat(btn.dataset.rate) || 0.9;
    });
  });

  // Toggle de la tarjeta de entrada colapsable
  if (dom.inputPanelToggle) {
    dom.inputPanelToggle.addEventListener('click', () => {
      const isCollapsed = dom.inputPanel.classList.contains('collapsed');
      setInputPanelCollapsed(!isCollapsed);
    });
  }

  // Atajo de teclado Ctrl+Enter / Cmd+Enter para enviar
  dom.form.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      dom.form.requestSubmit();
    }
  });
}

async function executePrompt(apiKey, prompt) {
  try {
    setLoading(true);
    
    const responseText = await generateContent(apiKey, prompt);
    currentResponseText = responseText;
    
    // Check if marked is loaded globally
    if (currentModule.id === 'diccionario') {
      try {
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("No se encontró JSON en la respuesta.");
        }
        const jsonString = responseText.substring(firstBrace, lastBrace + 1);
        const data = JSON.parse(jsonString);
        const rawHtml = processFrenchText(renderDiccionarioHTML(data));
        dom.outputContent.innerHTML = typeof DOMPurify !== 'undefined'
          ? DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['class', 'style', 'title'] })
          : rawHtml;
      } catch (e) {
        dom.outputContent.innerHTML = `<div class="error-message">Error parseando respuesta: ${escapeHtml(e.message)}</div>`;
      }
    } else if (typeof marked !== 'undefined') {
      if (currentModule.id === 'lectura' || currentModule.id === 'dialogo' || currentModule.id === 'analizador') {
        dom.outputContent.innerHTML = renderLecturaLayout(responseText, currentModule.id);
      } else {
        const html = processFrenchText(marked.parse(preprocessMarkdown(responseText)));
        dom.outputContent.innerHTML = typeof DOMPurify !== 'undefined'
          ? DOMPurify.sanitize(html, { ADD_ATTR: ['class', 'style', 'title'] })
          : html;
      }
    } else {
      dom.outputContent.innerHTML = `<pre style="white-space: pre-wrap;">${responseText}</pre>`;
    }

    // Activar botones
    dom.saveBtn.classList.remove('hidden');
    dom.copyBtn.classList.remove('hidden');

    // Contraer automáticamente la tarjeta de entrada para maximizar el espacio vertical
    const inputEl = dom.dynamicInputs.querySelector('textarea, input[type="text"]');
    const userText = inputEl ? inputEl.value.trim() : '';
    setInputPanelCollapsed(true, userText);

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
    
    dom.outputContent.innerHTML = `<div style="color: var(--error-text);"><strong>Error:</strong> ${escapeHtml(errorMsg)}</div>`;
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
    // Prevenir duplicados comparando contenido
    if(lessons.some(l => l.content === currentResponseText)) {
        alert("Esta lección ya está guardada.");
        return;
    }

    const newLesson = {
        id: Date.now().toString(),
        title: currentLessonTitle,
        content: currentResponseText,
        module: currentModule.title
    };

    lessons.push(newLesson);
    localStorage.setItem('savedLessons', JSON.stringify(lessons));
    
    if (currentUser) {
        saveLessonToCloud(currentUser.uid, newLesson).catch(e => console.error("Error guardando en nube:", e));
    }
    
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
            folder.className = 'saved-folder';
            
            folder.innerHTML = `
                <div class="saved-folder-info">
                    <span class="material-symbols-outlined saved-folder-icon">folder</span>
                    <strong>${modName}</strong>
                </div>
                <span class="saved-folder-count">${count} guardadas</span>
            `;
            
            folder.addEventListener('click', () => renderSavedLessonsView(modName));
            dom.dynamicInputs.appendChild(folder);
        });
    } else {
        // --- VISTA DE LECCIONES DEL MÓDULO ---
        const backBtn = document.createElement('button');
        backBtn.className = 'saved-back-btn';
        backBtn.innerHTML = '<span class="material-symbols-outlined">arrow_back</span> Volver a Carpetas';
        backBtn.addEventListener('click', () => renderSavedLessonsView(null));
        dom.dynamicInputs.appendChild(backBtn);
        
        const filtered = lessons.filter(l => l.module === selectedModuleFilter);
        
        filtered.forEach(lesson => {
            const card = document.createElement('div');
            card.className = 'saved-card';
            
            const info = document.createElement('div');
            info.innerHTML = `<strong>${lesson.title}</strong><br><small style="color: var(--text-secondary)">${new Date(parseInt(lesson.id)).toLocaleDateString()}</small>`;
            
            const delBtn = document.createElement('button');
            delBtn.className = 'saved-delete-btn';
            delBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
            delBtn.title = "Eliminar lección";
            
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
      if (lesson.module === 'Práctica de Lectura' || lesson.module === 'Práctica de Diálogo' || lesson.module === 'Analizador de Texto') {
        const modType = lesson.module === 'Práctica de Diálogo' ? 'dialogo' : (lesson.module === 'Analizador de Texto' ? 'analizador' : 'lectura');
        dom.outputContent.innerHTML = renderLecturaLayout(lesson.content, modType);
      } else if (lesson.module === 'Pronunciador' || lesson.module === 'Pronunciador y Fonética') {
        selectModule('pronunciador');
        const cleanText = lesson.content.replace(/<[^>]*>/g, '').trim();
        renderPronunciadorView(cleanText);
        return;
      } else {
        const html = marked.parse(lesson.content);
        dom.outputContent.innerHTML = typeof DOMPurify !== 'undefined'
          ? DOMPurify.sanitize(processFrenchText(html), { ADD_ATTR: ['class', 'style', 'title'] })
          : processFrenchText(html);
      }
    } else {
      dom.outputContent.innerHTML = `<pre style="white-space: pre-wrap;">${lesson.content}</pre>`;
    }
    
    dom.saveBtn.classList.add('hidden'); // Ya está guardada
    dom.copyBtn.classList.remove('hidden'); // Permitir copiar lecciones cargadas
    
    if(window.innerWidth <= 768) {
        dom.sidebar.classList.remove('open');
    }
}

function deleteLesson(id, selectedModuleFilter) {
    if(!confirm("¿Seguro que quieres borrar esta lección?")) return;
    let lessons = getSavedLessons();
    lessons = lessons.filter(l => l.id !== id);
    localStorage.setItem('savedLessons', JSON.stringify(lessons));
    
    if (currentUser) {
        deleteLessonFromCloud(currentUser.uid, id).catch(e => console.error("Error al eliminar de la nube:", e));
    }
    
    renderSavedLessonsView(selectedModuleFilter);
}

async function copyToClipboard() {
    if (!currentResponseText) return;
    
    let textToCopy = currentResponseText;
    
    if (currentModule && currentModule.id === 'traductor') {
        const parts = currentResponseText.split('###');
        const traduccionPart = parts.find(p => p.toLowerCase().includes('traducción') || p.toLowerCase().includes('traduccion'));
        if (traduccionPart) {
            let cleanText = traduccionPart.replace(/<span[^>]*>.*?<\/span> Traducción/i, '').trim();
            cleanText = cleanText.replace(/<span class="fr-click">/gi, '').replace(/<\/span>/gi, '').trim();
            textToCopy = cleanText;
        }
    } else {
        textToCopy = textToCopy.replace(/<span class="fr-click">/gi, '').replace(/<\/span>/gi, '');
    }

    try {
        await navigator.clipboard.writeText(textToCopy);
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
    
    // Patrón moderno: no inserta nada en el DOM
    const blob = new Blob([JSON.stringify(lessons, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `lecciones_frances_quebec_${new Date().toISOString().slice(0,10)}.json`;
    downloadAnchor.click();
    URL.revokeObjectURL(url); // Liberar memoria inmediatamente
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
  
  // Botón de mostrar/ocultar traducción en Práctica de Lectura
  const toggleBtn = e.target.closest('.btn-toggle-trad');
  if (toggleBtn) {
    const esDiv = toggleBtn.nextElementSibling;
    if (esDiv && esDiv.classList.contains('lectura-es-p')) {
      esDiv.classList.toggle('hidden');
      const isHidden = esDiv.classList.contains('hidden');
      toggleBtn.innerHTML = isHidden
        ? '<span class="material-symbols-outlined">visibility</span> Ver traducción'
        : '<span class="material-symbols-outlined">visibility_off</span> Ocultar traducción';
    }
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
            bubble.innerHTML = processFrenchText(marked.parse(preprocessMarkdown(msg.text)));
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
    
    // Prompt dinámico acumulativo con historial (máximo 15 mensajes para evitar límite de tokens)
    const recentHistory = chatHistory.slice(-15);
    const prompt = `Conversación interactiva en francés de Quebec (Nivel: ${currentChatLevel}, Tema: ${currentChatTopic}).
Estás actuando como un hablante nativo entablando un diálogo continuo.
Reglas estrictas de respuesta:
1) Escribe máximo dos frases cortas por turno para mantener la fluidez del diálogo.
2) Si cometí un error gramatical, ortográfico o calco del español en mi último mensaje, debes iniciar tu respuesta escribiendo primero la corrección en español al inicio de tu mensaje separada del diálogo en francés por un salto de línea doble, siguiendo este formato exacto:
[CORRECCIÓN: 
Explicación corta del error y cómo se expresa correctamente.]

Luego continúa el diálogo normalmente en tu personaje en francés. Si mi mensaje no contiene errores, NUNCA incluyas la sección [CORRECCIÓN: ...].
3) Si hay algún modismo o pronunciación típica de Quebec aplicable a lo que dices, añade al final de tu mensaje una nota corta explicativa en cursiva (ej: "*En Quebec se suele decir...*"). No añadas prefijos como "Nota para Quebec:".

Historial de la conversación:
${recentHistory.map(m => `${m.role === 'AI' ? 'Tú (Profesor)' : 'Yo (Estudiante)'}: ${m.text}`).join('\n')}

Por favor responde a mi último mensaje en francés de Quebec continuando el diálogo.`;

    try {
        const responseText = await generateContent(apiKey, prompt);
        chatHistory.push({ role: 'AI', text: responseText });
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ai';
        bubble.innerHTML = processFrenchText(marked.parse(preprocessMarkdown(responseText)));
        box.appendChild(bubble);
        box.scrollTop = box.scrollHeight;
        
    } catch(error) {
        const errBubble = document.createElement('div');
        errBubble.className = 'chat-bubble ai';
        errBubble.style.color = 'var(--error)';
        errBubble.textContent = "Error al enviar mensaje: " + error.message;
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
    
    const playVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const frVoices = voices.filter(v => v.lang.startsWith('fr'));
        
        if (frVoices.length > 0) {
            let bestVoice = frVoices.find(v => v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Premium'));
            if (!bestVoice) bestVoice = frVoices.find(v => v.lang.startsWith('fr-CA'));
            if (!bestVoice) bestVoice = frVoices[0];
            
            utterance.voice = bestVoice;
        } else {
            utterance.lang = 'fr-CA'; 
        }
        
        utterance.rate = typeof currentAudioRate !== 'undefined' ? currentAudioRate : 0.9;
        window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
            playVoice();
            window.speechSynthesis.onvoiceschanged = null;
        };
    } else {
        playVoice();
    }
}
window.speakText = speakText;

function preprocessMarkdown(text) {
    // Si la IA envolvió el span HTML en backticks de código, removemos los backticks para que se renderice como HTML vivo
    return text.replace(/`(<span\b[^>]*>.*?<\/span>)`/gi, '$1');
}

function processFrenchText(html) {
    html = html.replace(/(\*|_){1,2}\s*(?:🇨🇦|CA|ca)?\s*Nota (?:para|en|de|sobre) Quebec\s*(?:🇨🇦|CA|ca)?:?\s*(\*|_){1,2}\s*/gi, '<strong class="quebec-note-title">Nota en Quebec: </strong> ');
    html = html.replace(/(?:🇨🇦|CA|ca)?\s*Nota (?:para|en|de|sobre) Quebec\s*(?:🇨🇦|CA|ca)?:?\s*/gi, '<strong class="quebec-note-title">Nota en Quebec: </strong> ');
    
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

function renderDiccionarioHTML(data) {
    let html = `<div class="diccionario-result">`;
    
    let originalWord = (data.entrada_original || data.palabra_raiz).toLowerCase();
    let rootWord = data.palabra_raiz.toLowerCase();

    // Cabecera
    html += `<div class="diccionario-header" style="margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
        <h2 style="margin: 0; color: var(--text-primary); font-size: 2.2rem; display: flex; align-items: center; gap: 0.5rem;">
            <span class="fr-click">${originalWord}</span>
        </h2>
        <div style="font-size: 1.1rem; color: var(--text-secondary); margin-top: 5px; margin-bottom: 12px;">
            [${data.fonetica_simplificada}]
        </div>
        
        <div style="font-size: 0.95rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px; margin-top: 15px;">
            <div><strong>Forma base:</strong> <span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${rootWord}</span></div>`;
            
    if (data.verbo_relacionado && data.verbo_relacionado.toLowerCase() !== rootWord && data.verbo_relacionado.toLowerCase() !== originalWord) {
        html += `<div><strong>Verbo raíz:</strong> <span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${data.verbo_relacionado.toLowerCase()}</span></div>`;
    }
            
    if (data.genero_y_numero && data.genero_y_numero.toLowerCase() !== 'n/a') {
        html += `<div><strong>Género:</strong> ${data.genero_y_numero}</div>`;
    }

    // Sinónimos (soporta array, objeto o string)
    const sinonimosData = data.sinonimos || data.sinonimo;
    if (sinonimosData) {
        let sinItems = '';
        if (Array.isArray(sinonimosData)) {
            sinItems = sinonimosData
                .filter(s => s && ((s.frances && s.frances.toLowerCase() !== 'n/a') || (typeof s === 'string' && s.toLowerCase() !== 'n/a')))
                .slice(0, 2)
                .map(s => typeof s === 'string' 
                    ? `<span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${s}</span>`
                    : `<span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${s.frances}</span> <span style="color: var(--text-secondary); font-size: 0.9em;">(${s.espanol || ''})</span>`)
                .join(', ');
        } else if (typeof sinonimosData === 'object' && sinonimosData.frances && sinonimosData.frances.toLowerCase() !== 'n/a') {
            sinItems = `<span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${sinonimosData.frances}</span> <span style="color: var(--text-secondary); font-size: 0.9em;">(${sinonimosData.espanol || ''})</span>`;
        } else if (typeof sinonimosData === 'string' && sinonimosData.trim() && sinonimosData.toLowerCase() !== 'n/a') {
            sinItems = `<span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${sinonimosData}</span>`;
        }
        if (sinItems) {
            html += `<div><strong>Sinónimos:</strong> ${sinItems}</div>`;
        }
    }
    
    // Antónimos (soporta objeto, array o string)
    const antonimoData = data.antonimo || data.antonimos;
    if (antonimoData) {
        let antItems = '';
        if (Array.isArray(antonimoData)) {
            antItems = antonimoData
                .filter(a => a && ((a.frances && a.frances.toLowerCase() !== 'n/a') || (typeof a === 'string' && a.toLowerCase() !== 'n/a')))
                .map(a => typeof a === 'string'
                    ? `<span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${a}</span>`
                    : `<span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${a.frances}</span> <span style="color: var(--text-secondary); font-size: 0.9em;">(${a.espanol || ''})</span>`)
                .join(', ');
        } else if (typeof antonimoData === 'object' && antonimoData.frances && antonimoData.frances.toLowerCase() !== 'n/a') {
            antItems = `<span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${antonimoData.frances}</span> <span style="color: var(--text-secondary); font-size: 0.9em;">(${antonimoData.espanol || ''})</span>`;
        } else if (typeof antonimoData === 'string' && antonimoData.trim() && antonimoData.toLowerCase() !== 'n/a') {
            antItems = `<span class="fr-click" style="font-weight: bold; color: var(--text-primary);">${antonimoData}</span>`;
        }
        if (antItems) {
            html += `<div><strong>Antónimo:</strong> ${antItems}</div>`;
        }
    }

    html += `</div>
    </div>`;

    // Traducciones
    if (data.traducciones && data.traducciones.length > 0) {
        html += `<h3><span class="material-symbols-outlined" style="vertical-align: middle;">translate</span> Traducciones</h3><ul style="list-style-type: none; padding-left: 0;">`;
        data.traducciones.forEach((trad, idx) => {
            html += `<li style="margin-bottom: 15px; padding: 5px 0;">
                <strong style="font-size: 1.2rem; color: var(--text-primary);">${idx + 1}. ${trad.significado}</strong>
                ${trad.ejemplo_frances ? `<div style="margin-top: 8px; padding-left: 10px; border-left: 2px solid var(--border-color); font-size: 1rem;"><span class="fr-click">${trad.ejemplo_frances}</span><br><span style="color: var(--text-secondary); font-size: 0.9em;">${trad.ejemplo_espanol}</span></div>` : ''}
            </li>`;
        });
        html += `</ul>`;
    }

    // Notas y colocaciones
    if (data.notas_gramaticales?.preposiciones && data.notas_gramaticales.preposiciones.length > 0) {
        html += `<h3><span class="material-symbols-outlined" style="vertical-align: middle;">rule</span> Preposiciones</h3>
            <ul style="list-style-type: none; padding-left: 0;">`;
        const preps = Array.isArray(data.notas_gramaticales.preposiciones) ? data.notas_gramaticales.preposiciones : [ { frances: data.notas_gramaticales.preposiciones, espanol: "" } ];
        preps.forEach(prep => {
            if (typeof prep === 'string') {
                html += `<li style="margin-bottom: 15px; padding: 5px 0;"><span class="fr-click">${prep}</span></li>`;
            } else if (prep.frances) {
                html += `<li style="margin-bottom: 15px; padding: 5px 0;">
                    <div><strong class="fr-click" style="font-size: 1.1rem; color: var(--text-primary);">${prep.frances}</strong> ${prep.espanol ? `<span style="color: var(--text-secondary); font-size: 0.9em;">(${prep.espanol})</span>` : ''}</div>
                    ${prep.ejemplo_frances ? `<div style="margin-top: 8px; padding-left: 10px; border-left: 2px solid var(--border-color); font-size: 1rem;"><span class="fr-click">${prep.ejemplo_frances}</span><br><span style="color: var(--text-secondary); font-size: 0.9em;">${prep.ejemplo_espanol}</span></div>` : ''}
                </li>`;
            }
        });
        html += `</ul>`;
    }
    
    if (data.colocaciones && data.colocaciones.length > 0) {
        html += `<h3><span class="material-symbols-outlined" style="vertical-align: middle;">link</span> Colocaciones</h3>
            <ul style="list-style-type: none; padding-left: 0;">`;
        data.colocaciones.forEach(col => {
            if (typeof col === 'string') {
                html += `<li style="margin-bottom: 15px; padding: 5px 0;"><span class="fr-click">${col}</span></li>`;
            } else if (col.frances) {
                html += `<li style="margin-bottom: 15px; padding: 5px 0;">
                    <div><strong class="fr-click" style="font-size: 1.1rem; color: var(--text-primary);">${col.frances}</strong> ${col.espanol ? `<span style="color: var(--text-secondary); font-size: 0.9em;">(${col.espanol})</span>` : ''}</div>
                    ${col.ejemplo_frances ? `<div style="margin-top: 8px; padding-left: 10px; border-left: 2px solid var(--border-color); font-size: 1rem;"><span class="fr-click">${col.ejemplo_frances}</span><br><span style="color: var(--text-secondary); font-size: 0.9em;">${col.ejemplo_espanol}</span></div>` : ''}
                </li>`;
            }
        });
        html += `</ul>`;
    }

    // Diferencias regionales
    if (data.diferencias_regionales && data.diferencias_regionales.toLowerCase() !== 'uso estándar') {
        html += `<h3><span class="material-symbols-outlined" style="vertical-align: middle;">public</span> Diferencias Regionales</h3>
        <div style="margin-bottom: 15px; padding: 5px 0;">
            <p style="margin: 0; font-size: 1.05rem;">${data.diferencias_regionales}</p>
        </div>`;
    }

    // Micro-historia
    if (data.micro_historia) {
        html += `<h3><span class="material-symbols-outlined" style="vertical-align: middle;">auto_stories</span> Micro-historia</h3>
        <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 15px; padding: 5px 0;">
                <div style="font-size: 1.05rem; line-height: 1.6;"><span class="fr-click">${data.micro_historia.frances}</span></div>
                <div style="color: var(--text-secondary); font-size: 0.95em; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-color);">${data.micro_historia.espanol}</div>
            </li>
        </ul>`;
    }

    html += `</div>`;
    return html;
}

function renderLecturaLayout(text, moduleType = 'lectura') {
    const lines = text.split('\n');
    let frenchLines = [];
    let spanishLines = [];
    let explicacionLines = [];
    let nivelLines = [];
    
    let currentSection = ''; // 'fr', 'es', 'explicacion', 'nivel'
    
    for (let line of lines) {
        const lowerLine = line.toLowerCase();
        if (currentSection !== 'nivel' && (lowerLine.includes('nivel detectado') || lowerLine.includes('nivel cefr') || lowerLine.includes('evaluación del nivel') || lowerLine.includes('evaluacion del nivel'))) {
            currentSection = 'nivel';
            continue;
        } else if (currentSection !== 'fr' && (lowerLine.includes('texto en francés') || lowerLine.includes('texto en frances') || lowerLine.includes('diálogo en francés') || lowerLine.includes('dialogo en frances'))) {
            currentSection = 'fr';
            continue;
        } else if (currentSection !== 'es' && (lowerLine.includes('traducción al español') || lowerLine.includes('traduccion al espanol') || (lowerLine.includes('traducción') && !lowerLine.includes('ejemplo')))) {
            currentSection = 'es';
            continue;
        } else if (currentSection !== 'explicacion' && (lowerLine.includes('glosario') || lowerLine.includes('explicación de la lectura') || lowerLine.includes('explicacion de la lectura') || lowerLine.includes('explicación del diálogo') || lowerLine.includes('explicacion del dialogo') || lowerLine.includes('explicación del texto') || lowerLine.includes('explicacion del texto'))) {
            currentSection = 'explicacion';
            continue;
        }
        
        if (currentSection === 'nivel') {
            nivelLines.push(line);
        } else if (currentSection === 'fr') {
            frenchLines.push(line);
        } else if (currentSection === 'es') {
            spanishLines.push(line);
        } else if (currentSection === 'explicacion') {
            explicacionLines.push(line);
        }
    }
    
    if (frenchLines.length === 0 && spanishLines.length === 0 && explicacionLines.length === 0 && nivelLines.length === 0) {
        const fallbackHtml = processFrenchText(marked.parse(preprocessMarkdown(text)));
        return typeof DOMPurify !== 'undefined'
          ? DOMPurify.sanitize(fallbackHtml, { ADD_ATTR: ['class', 'style', 'title', 'type'] })
          : fallbackHtml;
    }
    
    const frenchMd = frenchLines.join('\n').trim();
    const spanishMd = spanishLines.join('\n').trim();
    const explicacionMd = explicacionLines.join('\n').trim();
    const nivelMd = nivelLines.join('\n').trim();
    
    let explicacionHtml = marked.parse(preprocessMarkdown(explicacionMd));
    explicacionHtml = processFrenchText(explicacionHtml);
    
    let nivelHtml = '';
    if (nivelMd) {
        nivelHtml = marked.parse(preprocessMarkdown(nivelMd));
        nivelHtml = processFrenchText(nivelHtml);
    }
    
    // Extracción de palabras/expresiones de la explicación para el resaltado especial en el texto
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = explicacionHtml;
    const expSpans = tempDiv.querySelectorAll('.fr-word');
    const expWords = new Set();
    const stopWords = new Set([
      'le', 'la', 'les', 'l', 'un', 'une', 'des', 'du', 'de', 'd', 'au', 'aux',
      'et', 'ou', 'où', 'mais', 'donc', 'or', 'ni', 'car', 'que', 'qui', 'quoi', 'dont',
      'ce', 'cet', 'cette', 'ces', 'mon', 'ton', 'son', 'ma', 'ta', 'sa', 'mes', 'tes', 'ses',
      'notre', 'votre', 'leur', 'nos', 'vos', 'leurs', 'je', 'tu', 'il', 'elle', 'on', 'nous',
      'vous', 'ils', 'elles', 'me', 'te', 'se', 'y', 'en', 'lui', 'a', 'à', 'dans',
      'par', 'pour', 'sur', 'sous', 'avec', 'sans', 'chez', 'est', 'sont', 'été', 'être', 'avoir',
      'ai', 'as', 'avons', 'avez', 'ont', 'fait', 'plus', 'très', 'tout', 'tous', 'toute', 'toutes',
      'bien', 'si', 'c', 's', 'j', 'm', 'n', 't', 'qu', 'n/a'
    ]);
    
    expSpans.forEach(span => {
        const word = span.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g,"").trim().toLowerCase();
        if (word && word.length > 2 && !stopWords.has(word)) {
            expWords.add(word);
        }
    });
    
    const highlightWordsInHtml = (html) => {
        const tempFr = document.createElement('div');
        tempFr.innerHTML = html;
        const frSpans = tempFr.querySelectorAll('.fr-word');
        frSpans.forEach(span => {
            const textClean = span.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g,"").trim().toLowerCase();
            if (expWords.has(textClean)) {
                span.classList.add('glosario-highlight');
            }
        });
        return tempFr.innerHTML;
    };
    
    // Separar párrafos en francés y español (soportando saltos dobles, saltos simples, <br> o etiquetas span adyacentes)
    let normFrenchMd = frenchMd.replace(/<br\s*\/?>/gi, '\n\n').replace(/<\/span>\s*(?:\n|<br\s*\/?>|\s)*<span/gi, '</span>\n\n<span');
    let normSpanishMd = spanishMd.replace(/<br\s*\/?>/gi, '\n\n').replace(/<\/span>\s*(?:\n|<br\s*\/?>|\s)*<span/gi, '</span>\n\n<span');
    
    let frParagraphs = normFrenchMd.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    let esParagraphs = normSpanishMd.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    
    // Resiliencia: Si el LLM no separó con doble salto de línea pero hay múltiples líneas o párrafos
    if (frParagraphs.length === 1 && normFrenchMd.split('\n').filter(p => p.trim().length > 0).length > 1) {
        const lines = normFrenchMd.split('\n').map(p => p.trim()).filter(Boolean);
        if (lines.length > 1) frParagraphs = lines;
    }
    if (esParagraphs.length !== frParagraphs.length && frParagraphs.length > 1) {
        const esLines = normSpanishMd.split('\n').map(p => p.trim()).filter(Boolean);
        if (esLines.length === frParagraphs.length) {
            esParagraphs = esLines;
        } else if (esParagraphs.length === 1 && esLines.length > 1) {
            esParagraphs = esLines;
        }
    }
    if (frParagraphs.length === 1 && esParagraphs.length === 1) {
        const frLines = normFrenchMd.split('\n').map(p => p.trim()).filter(Boolean);
        const esLines = normSpanishMd.split('\n').map(p => p.trim()).filter(Boolean);
        if (frLines.length > 1 && frLines.length === esLines.length) {
            frParagraphs = frLines;
            esParagraphs = esLines;
        }
    }
    
    let paragraphsHtml = '';
    const maxLen = Math.max(frParagraphs.length, esParagraphs.length);
    
    for (let i = 0; i < maxLen; i++) {
        let frHtml = frParagraphs[i] ? processFrenchText(marked.parse(preprocessMarkdown(frParagraphs[i]))) : '';
        if (frHtml) {
            frHtml = highlightWordsInHtml(frHtml);
        }
        
        let esHtml = esParagraphs[i] ? marked.parse(preprocessMarkdown(esParagraphs[i])) : '';
        
        paragraphsHtml += `
        <div class="lectura-paragraph-group">
            <div class="lectura-fr-p">${frHtml}</div>
            ${esHtml ? `
            <button class="btn-toggle-trad" type="button">
                <span class="material-symbols-outlined">visibility</span> Ver traducción
            </button>
            <div class="lectura-es-p hidden">${esHtml}</div>
            ` : ''}
        </div>
        `;
    }
    
    const isDialogo = moduleType === 'dialogo';
    const isAnalizador = moduleType === 'analizador';
    let headerTitle = 'Texto en Francés y Traducción';
    if (isDialogo) headerTitle = 'Diálogo en Francés y Traducción';
    if (isAnalizador) headerTitle = 'Texto Fragmentado y Traducción';

    let headerIcon = 'menu_book';
    if (isDialogo) headerIcon = 'record_voice_over';
    if (isAnalizador) headerIcon = 'document_scanner';

    let expTitle = 'Explicación de la Lectura';
    if (isDialogo) expTitle = 'Explicación del Diálogo';
    if (isAnalizador) expTitle = 'Explicación del Texto';

    const finalHtml = `
    <div class="lectura-container">
        ${nivelHtml ? `
        <div class="analizador-nivel-badge">
            <h3 class="lectura-header" style="margin-top:0; border-bottom: none; padding-bottom: 0.5rem;"><span class="material-symbols-outlined">grade</span> Nivel Detectado y Evaluación</h3>
            <div class="nivel-badge-body">${nivelHtml}</div>
        </div>
        ` : ''}
        <div class="lectura-main-text">
            <h3 class="lectura-header"><span class="material-symbols-outlined">${headerIcon}</span> ${headerTitle}</h3>
            <div class="lectura-paragraphs-wrapper">
                ${paragraphsHtml}
            </div>
        </div>
        
        ${explicacionHtml ? `
        <div class="lectura-explicacion">
            <h3 class="lectura-header"><span class="material-symbols-outlined">analytics</span> ${expTitle}</h3>
            <div class="lectura-body">${explicacionHtml}</div>
        </div>
        ` : ''}
    </div>
    `;
    
    return typeof DOMPurify !== 'undefined'
      ? DOMPurify.sanitize(finalHtml, { ADD_ATTR: ['class', 'style', 'title', 'type'] })
      : finalHtml;
}

function renderPronunciadorView(initialText = '') {
    dom.dynamicInputs.innerHTML = `
      <div class="pronunciador-simple-view" style="padding: 1rem 0 2rem 0; text-align: center;">
        <div class="textarea-wrapper" style="position: relative; margin-bottom: 2.2rem; text-align: left;">
          <textarea id="pronunciador-simple-text" placeholder="Escribe aquí la frase en francés..." style="width: 100%; min-height: 180px; padding: 1.4rem; font-size: 1.25rem; border: 2px solid var(--md-sys-color-outline-variant); border-radius: 16px; outline: none; resize: vertical; font-family: var(--font-family); color: var(--text-primary); background: var(--md-sys-color-surface-container-high); box-shadow: none; transition: border-color 0.2s, background-color 0.2s;"></textarea>
          <button type="button" id="pronunciador-clear-btn" class="hidden" title="Borrar texto" style="position: absolute; top: 1rem; right: 1rem; background: var(--md-sys-color-surface-container-highest); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--md-sys-color-on-surface-variant); transition: all 0.2s;"><span class="material-symbols-outlined" style="font-size: 1.1rem;">close</span></button>
        </div>
        
        <div style="display: flex; justify-content: center; margin-bottom: 1.6rem;">
          <button type="button" id="pronunciador-circle-btn" title="Escuchar pronunciación" style="width: 56px; height: 56px; border-radius: 50%; background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: var(--elevation-1); transition: transform 0.15s ease, background-color 0.2s ease, box-shadow 0.2s ease;">
            <span class="material-symbols-outlined" style="font-size: 1.8rem;">volume_up</span>
          </button>
        </div>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.8rem; flex-wrap: wrap;">
          <span style="font-size: 1rem; font-weight: 600; color: var(--md-sys-color-on-surface-variant); margin-right: 0.2rem;">Velocidad:</span>
          <button type="button" class="btn-speed-pill ${currentAudioRate === 1.0 || currentAudioRate === 0.9 ? 'active' : ''}" data-rate="1.0">100%</button>
          <button type="button" class="btn-speed-pill ${currentAudioRate === 0.75 || currentAudioRate === 0.7 ? 'active' : ''}" data-rate="0.75">75%</button>
          <button type="button" class="btn-speed-pill ${currentAudioRate === 0.5 ? 'active' : ''}" data-rate="0.5">50%</button>
          <button type="button" class="btn-speed-pill ${currentAudioRate === 0.25 ? 'active' : ''}" data-rate="0.25">25%</button>
        </div>
      </div>
    `;

    const textarea = document.getElementById('pronunciador-simple-text');
    const clearBtn = document.getElementById('pronunciador-clear-btn');
    const circleBtn = document.getElementById('pronunciador-circle-btn');
    const speedPills = document.querySelectorAll('.btn-speed-pill');

    if (textarea) {
        if (initialText) {
            textarea.value = initialText;
            if (clearBtn) clearBtn.classList.remove('hidden');
        }
        textarea.addEventListener('input', () => {
            if (textarea.value.trim() !== '') {
                if (clearBtn) clearBtn.classList.remove('hidden');
            } else {
                if (clearBtn) clearBtn.classList.add('hidden');
            }
        });
        textarea.addEventListener('focus', () => {
            textarea.style.borderColor = 'var(--md-sys-color-primary)';
            textarea.style.backgroundColor = 'var(--md-sys-color-surface-container-highest)';
        });
        textarea.addEventListener('blur', () => {
            textarea.style.borderColor = 'var(--md-sys-color-outline-variant)';
            textarea.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
        });
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                textarea.value = '';
                clearBtn.classList.add('hidden');
                textarea.focus();
                window.speechSynthesis.cancel();
            });
        }
    }

    if (circleBtn && textarea) {
        circleBtn.addEventListener('mouseover', () => {
            circleBtn.style.transform = 'scale(1.06)';
            circleBtn.style.backgroundColor = 'var(--md-sys-color-primary)';
            circleBtn.style.color = 'var(--md-sys-color-on-primary)';
            circleBtn.style.boxShadow = 'var(--elevation-2)';
        });
        circleBtn.addEventListener('mouseout', () => {
            circleBtn.style.transform = 'scale(1)';
            circleBtn.style.backgroundColor = 'var(--md-sys-color-primary-container)';
            circleBtn.style.color = 'var(--md-sys-color-on-primary-container)';
            circleBtn.style.boxShadow = 'var(--elevation-1)';
        });
        circleBtn.addEventListener('mousedown', () => {
            circleBtn.style.transform = 'scale(0.95)';
        });
        circleBtn.addEventListener('mouseup', () => {
            circleBtn.style.transform = 'scale(1.06)';
        });

        circleBtn.addEventListener('click', () => {
            const text = textarea.value.trim();
            if (!text) {
                textarea.focus();
                textarea.style.borderColor = '#f87171';
                setTimeout(() => textarea.style.borderColor = '#6366f1', 1000);
                return;
            }
            speakText(text);
        });
    }

    speedPills.forEach(pill => {
        pill.addEventListener('click', () => {
            speedPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            currentAudioRate = parseFloat(pill.dataset.rate) || 1.0;
            if (textarea && textarea.value.trim()) {
                speakText(textarea.value.trim());
            }
        });
    });
}

// Iniciar app
init();
