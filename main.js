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
  sidebar: document.querySelector('.sidebar')
};

let currentLessonTitle = '';

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
  currentResponseText = '';
  
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
    
    const prompt = currentModule.generatePrompt(data);
    const apiKey = dom.apiKeyInput.value.trim();
    
    if (apiKey) {
      localStorage.setItem('geminiApiKey', apiKey);
    }
    
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
}

async function executePrompt(apiKey, prompt) {
  try {
    setLoading(true);
    
    const responseText = await generateContent(apiKey, prompt);
    currentResponseText = responseText;
    
    // Check if marked is loaded globally
    if (typeof marked !== 'undefined') {
      dom.outputContent.innerHTML = marked.parse(responseText);
    } else {
      dom.outputContent.innerHTML = `<pre style="white-space: pre-wrap;">${responseText}</pre>`;
    }

    // Activar botones
    dom.saveBtn.classList.remove('hidden');

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
      dom.outputContent.innerHTML = marked.parse(lesson.content);
    } else {
      dom.outputContent.innerHTML = `<pre style="white-space: pre-wrap;">${lesson.content}</pre>`;
    }
    
    dom.saveBtn.classList.add('hidden'); // Ya está guardada
    
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

// Re-añadir el global listener para los textos en francés de lecciones cargadas
dom.outputContent.addEventListener('click', (e) => {
  if (e.target.classList.contains('fr-click')) {
    window.speechSynthesis.cancel();
    const textToRead = e.target.innerText;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
});

// Iniciar app
init();
