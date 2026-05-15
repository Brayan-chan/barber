// ════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════
const state = {
    mode: null,
    style: null,
    maintenance: null,
    length: 3,
    photoBase64: null,
    photoMime: null,
    analysis: null,
    recommendation: null,
};

const DEFAULT_ANALYSIS_MODEL = 'Claude-Opus-4.7';
const DEFAULT_IMAGE_MODEL = 'GPT-Image-1.5';
const LOW_COST_ANALYSIS_MODEL = 'GPT-4.1-mini';

// ════════════════════════════════════════════
//  POE API CONFIGURATION
// ════════════════════════════════════════════
function initApiConfig() {
    const configBtn = document.getElementById('api-config-btn');
    const modal = document.getElementById('api-modal');
    const input = document.getElementById('poe-api-input');
    const analysisModelSelect = document.getElementById('analysis-model-select');
    const imageModelSelect = document.getElementById('image-model-select');
    const saveBtn = document.getElementById('api-save-btn');
    const cancelBtn = document.getElementById('api-cancel-btn');
    const statusDiv = document.getElementById('api-status');
    const indicator = document.getElementById('api-indicator');

    function updateIndicator() {
        const hasKey = localStorage.getItem('poe_api_key') && localStorage.getItem('poe_api_key') !== 'YOUR_POE_API_KEY';
        if (hasKey) {
            indicator.style.background = 'var(--gold)';
            indicator.title = 'API Key configurada ✓';
        } else {
            indicator.style.background = 'var(--rust)';
            indicator.title = 'API Key no configurada';
        }
    }

    updateIndicator();

    configBtn.addEventListener('click', () => {
        input.value = localStorage.getItem('poe_api_key') || '';
        analysisModelSelect.value = localStorage.getItem('poe_analysis_model') || DEFAULT_ANALYSIS_MODEL;
        imageModelSelect.value = localStorage.getItem('poe_image_model') || DEFAULT_IMAGE_MODEL;
        modal.style.display = 'flex';
        input.focus();
    });

    saveBtn.addEventListener('click', () => {
        const key = input.value.trim();
        if (!key) {
            statusDiv.textContent = '⚠ La API Key no puede estar vacía';
            return;
        }
        localStorage.setItem('poe_api_key', key);
        localStorage.setItem('poe_analysis_model', analysisModelSelect.value || DEFAULT_ANALYSIS_MODEL);
        localStorage.setItem('poe_image_model', imageModelSelect.value || DEFAULT_IMAGE_MODEL);
        statusDiv.textContent = '✓ API Key guardada correctamente';
        updateIndicator();
        setTimeout(() => {
            modal.style.display = 'none';
            statusDiv.textContent = '';
        }, 1500);
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        statusDiv.textContent = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            statusDiv.textContent = '';
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveBtn.click();
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initApiConfig);

// ════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════
function goToPanel(n) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + n).classList.add('active');
    document.querySelectorAll('.step-dot').forEach((d, i) => {
        d.classList.toggle('active', i === n - 1);
        d.classList.toggle('done', i < n - 1);
    });
    document.getElementById('step-label').textContent = `Paso ${n} de 4`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Stop camera when leaving panel 2
    if (n !== 2) {
        stopCamera();
    }
}

// ════════════════════════════════════════════
//  MODE SELECTION
// ════════════════════════════════════════════
function selectMode(mode) {
    state.mode = mode;
    document.querySelectorAll('#panel-1 .option-card').forEach(c => c.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    document.getElementById('btn-mode-next').disabled = false;

    if (mode === 'surprise') {
        document.getElementById('photo-subtitle').textContent =
            '⚡ Modo Sorpresa — Solo sube tu foto. Yo me encargo del resto.';
    } else if (mode === 'discover') {
        document.getElementById('photo-subtitle').textContent =
            '🔮 Modo Descubrir — Analizaré tu rostro y te propondré tendencias modernas.';
    } else {
        document.getElementById('photo-subtitle').textContent =
            'Necesito ver tu rostro para analizarlo y personalizar la recomendación.';
    }
}

// ════════════════════════════════════════════
//  STYLE / MAINTENANCE SELECTION
// ════════════════════════════════════════════
function selectStyle(s) {
    state.style = s;
    document.querySelectorAll('#style-grid .option-card').forEach(c => c.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    checkReadyToAnalyze();
}

function selectMaint(m) {
    state.maintenance = m;
    // find the correct grid (3rd option-grid inside style-questions)
    const grids = document.querySelectorAll('#style-questions .option-grid');
    const maintGrid = grids[grids.length - 1];
    maintGrid.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    checkReadyToAnalyze();
}

function checkReadyToAnalyze() {
    const hasPhoto = !!state.photoBase64;
    let ready = hasPhoto;
    if (state.mode === 'guided') {
        ready = hasPhoto && state.style && state.maintenance;
    }
    document.getElementById('btn-analyze').disabled = !ready;
}

// ════════════════════════════════════════════
//  PHOTO UPLOAD
// ════════════════════════════════════════════
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
        showToast('La imagen es muy grande. Máximo 8MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        const base64 = dataUrl.split(',')[1];
        state.photoBase64 = base64;
        state.photoMime = file.type;

        const preview = document.getElementById('upload-preview');
        preview.src = dataUrl;
        preview.style.display = 'block';
        document.getElementById('upload-icon').style.display = 'none';
        document.getElementById('upload-text').textContent = '✓ Foto cargada correctamente';
        document.getElementById('upload-hint').textContent = file.name;

        // show style questions only for 'guided' mode
        if (state.mode === 'guided') {
            document.getElementById('style-questions').style.display = 'block';
        }
        checkReadyToAnalyze();
    };
    reader.readAsDataURL(file);
}

// ════════════════════════════════════════════
//  CAMERA FUNCTIONS
// ════════════════════════════════════════════
let cameraStream = null;
let capturedPhotoData = null;

function switchPhotoMode(mode) {
    const uploadMode = document.getElementById('upload-mode');
    const cameraMode = document.getElementById('camera-mode');
    const uploadBtn = document.getElementById('mode-upload-btn');
    const cameraBtn = document.getElementById('mode-camera-btn');

    document.querySelectorAll('#panel-2 .option-card').forEach(c => c.classList.remove('selected'));

    if (mode === 'camera') {
        uploadMode.style.display = 'none';
        cameraMode.style.display = 'block';
        cameraBtn.classList.add('selected');
        uploadBtn.classList.remove('selected');
        initializeCamera();
    } else {
        uploadMode.style.display = 'block';
        cameraMode.style.display = 'none';
        uploadBtn.classList.add('selected');
        cameraBtn.classList.remove('selected');
        stopCamera();
        resetCameraUI();
    }
}

async function initializeCamera() {
    const video = document.getElementById('camera-video');
    const loading = document.getElementById('camera-loading');
    const error = document.getElementById('camera-error');

    try {
        loading.style.display = 'flex';
        error.style.display = 'none';

        // Stop previous stream if exists
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1024 } },
            audio: false
        });

        video.srcObject = cameraStream;
        video.onloadedmetadata = () => {
            video.play();
            loading.style.display = 'none';
        };
    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'flex';
        error.textContent = '⚠ No se pudo acceder a la cámara. Verifica los permisos.';
        console.error('Camera error:', err);
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

function capturePhotoFromCamera() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip horizontally (mirror effect)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    // Get image data
    capturedPhotoData = canvas.toDataURL('image/jpeg', 0.9);

    // Show preview
    const preview = document.getElementById('camera-preview');
    preview.src = capturedPhotoData;
    preview.style.display = 'block';

    // Hide video, show buttons
    video.style.display = 'none';
    document.getElementById('camera-capture-btn').style.display = 'none';
    document.getElementById('camera-retake-btn').style.display = 'inline-block';
    document.getElementById('camera-confirm-btn').style.display = 'inline-block';
}

function retakeSelfie() {
    const video = document.getElementById('camera-video');
    const preview = document.getElementById('camera-preview');

    preview.style.display = 'none';
    video.style.display = 'block';
    capturedPhotoData = null;

    document.getElementById('camera-capture-btn').style.display = 'inline-block';
    document.getElementById('camera-retake-btn').style.display = 'none';
    document.getElementById('camera-confirm-btn').style.display = 'none';
}

function confirmCameraPhoto() {
    if (!capturedPhotoData) return;

    // Convert to base64
    const base64 = capturedPhotoData.split(',')[1];
    state.photoBase64 = base64;
    state.photoMime = 'image/jpeg';

    // Stop camera
    stopCamera();

    // Update UI and show style questions if needed
    if (state.mode === 'guided') {
        document.getElementById('style-questions').style.display = 'block';
    }

    checkReadyToAnalyze();

    // Switch back to upload mode view for consistency
    const uploadMode = document.getElementById('upload-mode');
    const cameraMode = document.getElementById('camera-mode');
    uploadMode.style.display = 'block';
    cameraMode.style.display = 'none';

    resetCameraUI();

    showToast('✓ Selfie capturada correctamente', 'info');
}

function resetCameraUI() {
    document.getElementById('camera-preview').style.display = 'none';
    document.getElementById('camera-video').style.display = 'block';
    document.getElementById('camera-capture-btn').style.display = 'inline-block';
    document.getElementById('camera-retake-btn').style.display = 'none';
    document.getElementById('camera-confirm-btn').style.display = 'none';
    document.getElementById('camera-loading').style.display = 'flex';
    document.getElementById('camera-error').style.display = 'none';
    capturedPhotoData = null;
}

// drag & drop
const zone = document.getElementById('upload-zone');
zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const dt = new DataTransfer();
        dt.items.add(file);
        document.getElementById('photo-input').files = dt.files;
        handlePhotoUpload({ target: { files: [file] } });
    }
});

// For surprise/discover modes: button is enabled when photo is uploaded
document.getElementById('photo-input').addEventListener('change', () => {
    if (state.mode !== 'guided') checkReadyToAnalyze();
});

// ════════════════════════════════════════════
//  ANALYSIS
// ════════════════════════════════════════════
async function startAnalysis() {
    const poeKey = localStorage.getItem('poe_api_key');
    if (!poeKey || poeKey === 'YOUR_POE_API_KEY') {
        showToast('Por favor configura tu API Key de Poe primero. Click en ⚙ Config', 'error');
        return;
    }
    if (!state.photoBase64) { showToast('Por favor sube una foto primero.', 'error'); return; }
    goToPanel(3);
    await runLoadingAnimation();
    await callClaudeAnalysis();
}

async function runLoadingAnimation() {
    const steps = ['ls-1', 'ls-2', 'ls-3', 'ls-4', 'ls-5'];
    const msgs = [
        'Detectando estructura facial...',
        'Analizando textura capilar...',
        'Evaluando proporciones...',
        'Procesando preferencias...',
        'Generando tu recomendación...'
    ];
    const fill = document.getElementById('progress-fill');

    for (let i = 0; i < steps.length; i++) {
        await sleep(600);
        document.getElementById(steps[i]).classList.add('done');
        document.getElementById('loading-msg').textContent = msgs[i];
        fill.style.width = ((i + 1) / steps.length * 100) + '%';
    }
}

async function callClaudeAnalysis() {
    const styleMap = {
        clasico: 'Clásico / Elegante',
        urbano: 'Urbano / Streetwear',
        formal: 'Formal / Ejecutivo',
        casual: 'Casual / Relajado',
        rock: 'Rock / Alternativo',
        hipster: 'Hipster / Barbershop vintage'
    };
    const maintMap = { bajo: 'Bajo (mínimo cuidado)', medio: 'Medio', alto: 'Alto (perfeccionista)' };
    const lenMap = ['Muy corto (buzz cut)', 'Corto (1-3 cm)', 'Medio (4-7 cm)', 'Largo (8-15 cm)', 'Muy largo (>15 cm)'];
    const lengthPref = lenMap[parseInt(document.getElementById('length-slider').value) - 1];

    let modeContext = '';
    if (state.mode === 'surprise') {
        modeContext = `Modo SORPRESA: El usuario no dio preferencias. Propón algo audaz, moderno y que mejor se adapte a su rostro. Sé creativo con tendencias actuales de barbería.`;
    } else if (state.mode === 'discover') {
        modeContext = `Modo DESCUBRIR: Analiza el rostro y recomienda estilos modernos con tendencias 2024-2025 como degradados (fades), skin fades, drop fades, textured crops, quiff moderno, mid fade con fringe, o estilos contemporáneos. Prioriza tendencias de barbería masculina actual.`;
    } else {
        modeContext = `Modo GUIADO:
- Estilo preferido: ${styleMap[state.style] || 'No especificado'}
- Largo preferido: ${lengthPref}
- Disponibilidad de mantenimiento: ${maintMap[state.maintenance] || 'No especificado'}`;
    }

    const prompt = `Eres el sistema de análisis de BarberAI, un experto en barbería y análisis facial.

INSTRUCCIONES:
Analiza la imagen del cliente y proporciona:

1. ANÁLISIS FACIAL (basado en la imagen REAL):
   - Forma del rostro (oval, redondo, cuadrado, rectangular, diamante, corazón, triángulo invertido, oblongo)
   - Tipo de cabello detectado (usando sistema Andre Walker: 1A-4C, y descripción: liso/ondulado/rizado/afro)
   - Facciones destacadas (mandíbula, frente, pómulos, línea de cabello, etc.)
   - Densidad capilar estimada (fina, media, gruesa)
   - Proporciones faciales relevantes

2. NOMBRE DEL CORTE RECOMENDADO (concreto y específico, ej: "Mid Fade con Textura Francesa", "Pompadour Moderno", "Skin Fade con Crop Fringe")

3. DESCRIPCIÓN DE LA RECOMENDACIÓN (técnica):
   - Por qué este corte específico favorece su tipo de rostro
   - Técnicas de barbería específicas (números de máquina, tijeras, navajas)
   - Cómo el corte equilibra o potencia sus rasgos
   - Instrucciones de estilizado diario
   - Frecuencia de mantenimiento recomendada (cada cuántas semanas)
   - Productos sugeridos (wax, pomada, clay, etc.)

${modeContext}

SISTEMA DE CLASIFICACIÓN DE ROSTROS QUE DEBES USAR:
- Oval: Frente ligeramente más ancha que el mentón, cara alargada proporcionada. EL MÁS VERSÁTIL.
- Redondo: Ancho y largo similares, sin ángulos marcados, mejillas llenas.
- Cuadrado: Frente, mejillas y mandíbula de ancho similar. Mandíbula angulosa.
- Rectangular/Oblongo: Largo mayor que ancho. Mandíbula cuadrada.
- Diamante: Frente estrecha, pómulos anchos, mentón estrecho.
- Corazón: Frente ancha, mentón estrecho y puntiagudo.
- Triángulo invertido: Frente muy ancha, mandíbula estrecha.

REGLAS DE ORO DE BARBERÍA POR TIPO DE ROSTRO:
- Oval → Casi cualquier corte. Potencia con volumen lateral o superior.
- Redondo → Volumen en la parte superior, corto en los lados. Evitar redondez adicional.
- Cuadrado → Suavizar con textura arriba, lados no tan cortos. Evitar líneas muy rectas.
- Rectangular → Ancho en los lados, no tanto volumen en la cima. Flequillo puede ayudar.
- Diamante → Volumen en frente y mandíbula para equilibrar pómulos.
- Corazón → Volumen bajo, corto arriba. Fade que ensanche la zona inferior.
- Triángulo inv. → Volumen en mandíbula, corto en frente.

RESPONDE ÚNICAMENTE EN ESTE FORMATO JSON (sin markdown, sin texto extra):
{
  "rostro": "Tipo exacto de rostro",
  "cabello_tipo": "Tipo Andre Walker + descripción",
  "cabello_densidad": "Fina/Media/Gruesa",
  "facciones_destacadas": "Descripción de facciones principales",
  "proporciones": "Breve análisis de proporciones",
  "corte_nombre": "Nombre específico del corte recomendado",
  "corte_descripcion": "Descripción completa del corte y técnicas (3-4 párrafos detallados)",
  "mantenimiento": "Cada X semanas",
  "productos": "Productos recomendados",
  "por_que_funciona": "Explicación de por qué este corte favorece sus rasgos específicos",
  "instrucciones_estilizado": "Pasos para estilizar en casa"
}`;

    try {
        const selectedAnalysisModel = localStorage.getItem('poe_analysis_model') || DEFAULT_ANALYSIS_MODEL;
        let raw;

        try {
            raw = await requestAnalysisWithModel(selectedAnalysisModel, prompt);
        } catch (primaryErr) {
            const shouldFallback = isQuotaError(primaryErr?.message) && selectedAnalysisModel !== LOW_COST_ANALYSIS_MODEL;
            if (!shouldFallback) throw primaryErr;

            showToast(`Puntos bajos en ${selectedAnalysisModel}. Usando fallback ${LOW_COST_ANALYSIS_MODEL}...`, 'info');
            raw = await requestAnalysisWithModel(LOW_COST_ANALYSIS_MODEL, prompt);
        }

        let analysis;
        try {
            const cleaned = raw.replace(/```json|```/g, '').trim();
            analysis = JSON.parse(cleaned);
        } catch {
            // fallback if JSON parse fails
            analysis = {
                rostro: 'No determinado',
                cabello_tipo: 'No determinado',
                cabello_densidad: 'Media',
                facciones_destacadas: raw.substring(0, 300),
                proporciones: 'Proporciones equilibradas',
                corte_nombre: 'Corte Personalizado',
                corte_descripcion: raw,
                mantenimiento: 'Cada 3-4 semanas',
                productos: 'Consulta con tu barbero',
                por_que_funciona: 'Basado en el análisis de tus rasgos únicos.',
                instrucciones_estilizado: 'Consulta con tu barbero para el mejor estilizado.'
            };
        }

        state.analysis = analysis;
        renderResults(analysis);
        goToPanel(4);
        await generatePreviewImage(analysis);

    } catch (err) {
        console.error(err);
        goToPanel(4);
        renderErrorResults(err.message);
    }
}

// ════════════════════════════════════════════
//  RENDER RESULTS
// ════════════════════════════════════════════
function renderResults(a) {
    // Save analysis to bookingState
    if (typeof bookingState !== 'undefined') {
        bookingState.analysis = a;
    }
    
    const traits = [
        { key: 'Forma del Rostro', val: a.rostro },
        { key: 'Tipo de Cabello', val: a.cabello_tipo },
        { key: 'Densidad Capilar', val: a.cabello_densidad },
        { key: 'Mantenimiento', val: a.mantenimiento },
    ];

    document.getElementById('traits-grid').innerHTML = traits.map(t => `
    <div class="trait-item">
      <div class="trait-key">${t.key}</div>
      <div class="trait-val">${t.val || '—'}</div>
    </div>
  `).join('');

    document.getElementById('analysis-text').innerHTML = `
    <strong style="color:var(--gold);font-size:0.75rem;font-family:'Space Mono',monospace;letter-spacing:1.5px;text-transform:uppercase;">
      Facciones Destacadas
    </strong><br>
    <span style="font-size:0.85rem;color:rgba(245,240,232,0.8)">${a.facciones_destacadas || '—'}</span><br><br>
    <strong style="color:var(--gold);font-size:0.75rem;font-family:'Space Mono',monospace;letter-spacing:1.5px;text-transform:uppercase;">
      Proporciones
    </strong><br>
    <span style="font-size:0.85rem;color:rgba(245,240,232,0.8)">${a.proporciones || '—'}</span>
  `;

    document.getElementById('rec-cut-name').textContent = a.corte_nombre || 'Corte Recomendado';
    document.getElementById('rec-body-text').innerHTML = `
    <p style="margin-bottom:12px">${a.por_que_funciona || ''}</p>
    <p style="margin-bottom:12px">${a.corte_descripcion || ''}</p>
    <p style="margin-bottom:12px"><strong style="color:var(--gold)">🧴 Productos:</strong> ${a.productos || '—'}</p>
    <p><strong style="color:var(--gold)">💈 Estilizado en casa:</strong> ${a.instrucciones_estilizado || '—'}</p>
  `;
    
    // Show barber recommendations
    if (typeof recommendBarbers !== 'undefined' && typeof renderBarberRecommendations !== 'undefined') {
        const recommended = recommendBarbers(a);
        renderBarberRecommendations(recommended);
    }
}

function renderErrorResults(msg) {
    document.getElementById('traits-grid').innerHTML = '';
    document.getElementById('analysis-text').innerHTML = `
    <div class="api-error">
      <strong>⚠ Error al procesar el análisis</strong><br>
      ${msg}<br><br>
      Posibles causas: imagen muy oscura, rostro no visible, o error temporal de conexión.
      Intenta con una foto más clara y con buena iluminación frontal.
    </div>
  `;
    document.getElementById('rec-cut-name').textContent = 'Análisis no completado';
    document.getElementById('rec-body-text').textContent = 'Por favor intenta nuevamente con una foto diferente.';
    document.getElementById('preview-wrapper').innerHTML = `
    <p style="color:var(--muted);font-size:0.85rem">No se pudo generar la preview sin el análisis completo.</p>
  `;
}

// ════════════════════════════════════════════
//  GENERATE PREVIEW IMAGE
// ════════════════════════════════════════════
async function generatePreviewImage(analysis) {
    const wrapper = document.getElementById('preview-wrapper');
    const cutName = analysis.corte_nombre || 'Corte Personalizado';
    const originalPhotoSrc = `data:${state.photoMime};base64,${state.photoBase64}`;

    wrapper.innerHTML = `
    <span class="preview-badge">PREVIEW — ${cutName}</span>
    <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start;width:100%;justify-content:center">
      <div style="text-align:center;flex:1;min-width:220px">
        <div style="font-family:'Space Mono',monospace;font-size:0.6rem;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">ACTUAL</div>
        <img src="${originalPhotoSrc}" style="max-width:220px;max-height:280px;border-radius:6px;border:1px solid rgba(201,168,76,0.3);object-fit:cover">
      </div>
      <div style="text-align:center;flex:1;min-width:220px;display:flex;flex-direction:column;align-items:center">
        <div style="font-family:'Space Mono',monospace;font-size:0.6rem;color:var(--gold);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">CON EL NUEVO CORTE</div>
        <div id="ai-preview-area" style="width:220px;min-height:280px;border-radius:6px;border:1px solid rgba(201,168,76,0.4);background:rgba(201,168,76,0.05);display:flex;align-items:center;justify-content:center;flex-direction:column;padding:16px">
          <div class="loading-spinner" style="width:36px;height:36px"></div>
          <div style="font-size:0.72rem;color:var(--muted);margin-top:12px;text-align:center">Generando imagen realista...</div>
        </div>
      </div>
    </div>`;

    try {
        const generatedImage = await generateHaircutImage(analysis, originalPhotoSrc);
        const previewArea = document.getElementById('ai-preview-area');
        previewArea.innerHTML = `
      <img src="${generatedImage}" class="preview-image" alt="Preview de corte" style="width:100%;border-radius:6px;object-fit:cover;max-height:280px">
      <div style="margin-top:10px;font-family:'Space Mono',monospace;font-size:0.58rem;color:var(--gold);text-align:center;letter-spacing:1px">${cutName}</div>
    `;
    } catch (err) {
        const previewArea = document.getElementById('ai-preview-area');
        const fallbackMessage = isQuotaError(err?.message)
            ? 'Puntos agotados para imagen. Mostrando preview local de bajo costo.'
            : `No se pudo generar la imagen realista: ${err.message}`;

        if (isQuotaError(err?.message)) {
            showToast('Puntos agotados en imagen. Activando fallback local.', 'info');
            previewArea.innerHTML = buildLowCostPreview(analysis, originalPhotoSrc);
            return;
        }

        previewArea.innerHTML = `
      <div style="text-align:center;padding:20px">
        <div style="font-size:1rem;color:var(--rust);margin-bottom:12px">⚠ Error</div>
        <div style="font-size:0.75rem;color:var(--muted);line-height:1.6">${fallbackMessage}</div>
      </div>`;
    }
}

async function generateHaircutImage(analysis, originalPhotoSrc) {
    const poeKey = localStorage.getItem('poe_api_key');
    if (!poeKey || poeKey === 'YOUR_POE_API_KEY') {
        throw new Error('API Key de Poe no configurada');
    }

    const cutName = analysis.corte_nombre || 'corte moderno';
    const styleDescription = analysis.corte_descripcion || 'Un corte moderno y profesional que realce los rasgos del cliente.';
    const selectedImageModel = localStorage.getItem('poe_image_model') || DEFAULT_IMAGE_MODEL;

    console.log('[BarberAI][Image] model:', selectedImageModel);
    console.log('[BarberAI][Image] cut:', cutName);

    const prompt = `Toma la foto adjunta y genera únicamente una imagen editada del mismo cliente con el nuevo corte de cabello: ${cutName}.\n\n` +
        `Instrucciones estrictas:\n` +
        `- Conserva el rostro EXACTO, la piel, los ojos, la nariz, los labios, las cejas y las proporciones faciales.\n` +
        `- No modifiques ningún rasgo facial ni el tono de piel.\n` +
        `- Solo cambia el cabello: largo, textura, fade, forma y estilo según el corte.\n` +
        `- El resultado debe verse como una fotografía realista tomada en un barbershop, con la misma iluminación general y el mismo ángulo de la foto original.\n` +
        `- No pongas texto adicional, logos, bordes ni artefactos. Devuelve solo la imagen.\n` +
        `- El cabello debe verse natural y profesional, con la técnica sugerida: ${styleDescription}.`;

    const response = await fetch('https://api.poe.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + poeKey
        },
        body: JSON.stringify({
            model: selectedImageModel,
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: { url: originalPhotoSrc }
                    },
                    {
                        type: 'text',
                        text: prompt
                    }
                ]
            }]
        })
    });

    if (!response.ok) {
        const err = await response.json();
        console.log('[BarberAI][Image] non-OK response:', err);
        throw new Error(err.error?.message || 'Error en la API de imagen');
    }

    const data = await response.json();
    console.log('[BarberAI][Image] raw JSON response:', data);

    const extracted = extractImageSourceWithDebug(data);
    console.log('[BarberAI][Image] extraction result:', extracted);
    if (typeof window !== 'undefined') {
        window.__barberAIImageDebug = {
            model: selectedImageModel,
            cutName,
            rawResponse: data,
            extracted,
        };
    }

    const imageSource = extracted.source;

    if (!imageSource) {
        throw new Error('La API respondió, pero no se pudo detectar una imagen utilizable.');
    }

    return imageSource;
}

async function requestAnalysisWithModel(model, prompt) {
    const response = await fetch('https://api.poe.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (localStorage.getItem('poe_api_key') || 'YOUR_POE_API_KEY')
        },
        body: JSON.stringify({
            model,
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: { url: `data:${state.photoMime || 'image/jpeg'};base64,${state.photoBase64}` }
                    },
                    { type: 'text', text: prompt }
                ]
            }]
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Error en la API');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

function isQuotaError(msg = '') {
    const text = String(msg).toLowerCase();
    return (
        text.includes('used up your points') ||
        text.includes('not enough points') ||
        text.includes('insufficient points') ||
        text.includes('out of points') ||
        text.includes('quota exceeded')
    );
}

function buildLowCostPreview(analysis, originalPhotoSrc) {
    return `
    <div style="position:relative;width:100%;max-width:220px;border-radius:8px;overflow:hidden;border:1px solid rgba(201,168,76,0.35)">
      <img src="${originalPhotoSrc}" alt="Preview lite" style="width:100%;height:280px;object-fit:cover;display:block;filter:contrast(1.04) saturate(1.05)">
      <div style="position:absolute;left:0;right:0;top:0;height:38%;background:linear-gradient(to bottom, rgba(18,14,10,0.75), rgba(18,14,10,0.15));mix-blend-mode:multiply"></div>
      <div style="position:absolute;top:8px;left:8px;background:rgba(201,168,76,0.92);color:var(--ink);font-family:'Space Mono',monospace;font-size:0.55rem;letter-spacing:1px;padding:4px 8px;border-radius:3px;text-transform:uppercase">Preview Lite</div>
      <div style="position:absolute;left:8px;right:8px;bottom:8px;background:rgba(0,0,0,0.45);backdrop-filter:blur(2px);padding:6px 8px;border-radius:4px;color:var(--paper);font-size:0.65rem;line-height:1.4">Simulación rápida sobre tu foto real mientras no hay puntos para render IA.</div>
    </div>
    <div style="margin-top:10px;font-family:'Space Mono',monospace;font-size:0.58rem;color:var(--gold);text-align:center;letter-spacing:1px">${analysis.corte_nombre || 'Corte recomendado'}</div>
    <div style="font-size:0.68rem;color:var(--muted);text-align:center;margin-top:4px;line-height:1.5">Fallback local activo para ahorrar puntos.</div>
  `;
}

function extractImageSourceWithDebug(payload) {
    if (!payload) return { source: null, path: null };
    const debug = { source: null, path: null };

    const normalizeUrl = (url) => {
        if (!url) return null;
        let cleaned = url.trim();
        cleaned = cleaned.replace(/[)\]>,.;]+$/g, '');
        return cleaned;
    };

    const rankUrl = (url) => {
        const value = String(url).toLowerCase();
        let score = 0;
        if (/\.(png|jpe?g|webp|gif)(\?|$)/i.test(value)) score += 10;
        if (value.includes('poe') || value.includes('poecdn') || value.includes('cf2')) score += 8;
        if (value.includes('image') || value.includes('img') || value.includes('render')) score += 6;
        if (/[?&]w=\d+/i.test(value) || /[?&]h=\d+/i.test(value)) score += 4;
        return score;
    };

    const fromString = (value) => {
        if (typeof value !== 'string') return null;

        const dataUrl = value.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
        if (dataUrl) return { source: dataUrl[0], via: 'data-url' };

        const markdownImage = value.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/i);
        if (markdownImage) {
            return { source: normalizeUrl(markdownImage[1]), via: 'markdown-image' };
        }

        const markdownLink = value.match(/\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/i);
        if (markdownLink) {
            return { source: normalizeUrl(markdownLink[1]), via: 'markdown-link' };
        }

        const urlMatches = Array.from(value.matchAll(/https?:\/\/[^\s'"`<>]+/gi)).map((m) => normalizeUrl(m[0])).filter(Boolean);
        if (!urlMatches.length) return null;

        const best = urlMatches
            .map((url) => ({ url, score: rankUrl(url) }))
            .sort((a, b) => b.score - a.score)[0];

        return { source: best.url, via: 'raw-url' };
    };

    const checkCandidate = (candidate, path) => {
        if (!candidate) return null;
        if (typeof candidate === 'string') {
            const found = fromString(candidate);
            if (found) {
                return { source: found.source, path: `${path} (${found.via})` };
            }
            if (/^[A-Za-z0-9+/=]+$/.test(candidate) && candidate.length > 500) {
                return { source: `data:image/png;base64,${candidate}`, path: `${path} (base64)` };
            }
            return null;
        }

        if (typeof candidate === 'object') {
            const nested = extractImageSourceWithDebug(candidate);
            if (nested?.source) {
                return { source: nested.source, path: nested.path || path };
            }
        }

        return null;
    };

    const directCandidates = [
        ['payload.image_url', payload.image_url],
        ['payload.url', payload.url],
        ['payload.b64_json', payload.b64_json],
        ['payload.image', payload.image],
        ['payload.output_image', payload.output_image],
        ['payload.file_data', payload.file_data],
        ['payload.image_url.url', payload?.image_url?.url],
        ['payload.file.file_data', payload?.file?.file_data],
        ['payload.data[0].url', payload?.data?.[0]?.url],
        ['payload.data[0].b64_json', payload?.data?.[0]?.b64_json],
        ['payload.output[0].url', payload?.output?.[0]?.url],
        ['payload.output[0].b64_json', payload?.output?.[0]?.b64_json],
        ['payload.choices[0].message.image_url', payload?.choices?.[0]?.message?.image_url],
        ['payload.choices[0].message.image_url.url', payload?.choices?.[0]?.message?.image_url?.url],
        ['payload.choices[0].message.content', payload?.choices?.[0]?.message?.content],
        ['payload.choices[0].content', payload?.choices?.[0]?.content]
    ];

    for (const [path, candidate] of directCandidates) {
        const found = checkCandidate(candidate, path);
        if (found) return found;
    }

    if (Array.isArray(payload)) {
        for (let index = 0; index < payload.length; index += 1) {
            const found = extractImageSourceWithDebug(payload[index]);
            if (found?.source) return found;
        }
    }

    if (typeof payload === 'object') {
        for (const key of Object.keys(payload)) {
            const value = payload[key];
            const found = extractImageSourceWithDebug(value);
            if (found?.source) {
                return {
                    source: found.source,
                    path: found.path ? `${key} -> ${found.path}` : key,
                };
            }
        }
    }

    return debug;
}

// ════════════════════════════════════════════
//  SVG HAIRCUT MOCKUP BUILDER
// ════════════════════════════════════════════
function buildHaircutSVG(vis, analysis, skinColor, hairColor) {
    const topStyle = vis.top_style || 'textured';
    const sidesLen = vis.sides_length || 'short';
    const topLen = vis.top_length || 'medium';
    const cutName = (analysis.corte_nombre || '').toLowerCase();

    // Detect cut type for SVG style
    const isFade = cutName.includes('fade') || cutName.includes('degradado');
    const isQuiff = cutName.includes('quiff') || cutName.includes('pompadour');
    const isCrop = cutName.includes('crop') || cutName.includes('french');
    const isBuzz = cutName.includes('buzz') || cutName.includes('machine') || cutName.includes('militar');
    const isCurly = cutName.includes('curl') || cutName.includes('afro') || cutName.includes('rizado');
    const isSlick = cutName.includes('slick') || cutName.includes('peinado') || cutName.includes('back');
    const isUndercut = cutName.includes('undercut');

    // Side hair opacity based on fade type
    let sideOpacity = '0.9';
    let sideGradient = `<linearGradient id="fadeGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${hairColor}" stop-opacity="0"/>
    <stop offset="${isFade ? '60%' : '100%'}" stop-color="${hairColor}" stop-opacity="${sideOpacity}"/>
  </linearGradient>`;

    let topHair = '';
    if (isBuzz) {
        topHair = `<ellipse cx="110" cy="68" rx="62" ry="20" fill="${hairColor}" opacity="0.9"/>`;
    } else if (isQuiff) {
        topHair = `
      <path d="M55 88 Q80 30 110 25 Q140 30 165 88" fill="${hairColor}" opacity="0.95"/>
      <path d="M70 85 Q95 40 110 38 Q125 40 150 85" fill="${hairColor}" opacity="0.6"/>
      <line x1="90" y1="50" x2="95" y2="85" stroke="${hairColor}" stroke-width="1.5" opacity="0.4"/>
      <line x1="105" y1="40" x2="108" y2="82" stroke="${hairColor}" stroke-width="1.5" opacity="0.4"/>
      <line x1="120" y1="45" x2="118" y2="83" stroke="${hairColor}" stroke-width="1.5" opacity="0.4"/>`;
    } else if (isCrop) {
        topHair = `
      <path d="M55 88 Q60 62 110 60 Q160 62 165 88" fill="${hairColor}" opacity="0.95"/>
      <line x1="70" y1="68" x2="150" y2="68" stroke="${hairColor}" stroke-width="1" opacity="0.3"/>
      <line x1="65" y1="72" x2="155" y2="72" stroke="${hairColor}" stroke-width="1" opacity="0.2"/>
      <path d="M80 62 L80 88 M95 60 L95 88 M110 60 L110 88 M125 60 L125 88 M140 62 L140 88" stroke="${adjustColor(hairColor, -20)}" stroke-width="1.5" opacity="0.35"/>`;
    } else if (isCurly) {
        topHair = `
      <path d="M52 88 Q55 45 110 38 Q165 45 168 88" fill="${hairColor}" opacity="0.9"/>
      ${Array.from({ length: 12 }, (_, i) => {
            const x = 65 + (i % 4) * 16 + (Math.floor(i / 4) % 2) * 8;
            const y = 48 + Math.floor(i / 4) * 12;
            return `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${hairColor}" stroke-width="2" opacity="0.6"/>`;
        }).join('')}`;
    } else if (isSlick) {
        topHair = `
      <path d="M55 88 Q65 50 110 45 Q155 50 165 88" fill="${hairColor}" opacity="0.95"/>
      <path d="M68 85 Q80 55 110 52 Q140 55 152 85" fill="${adjustColor(hairColor, 20)}" opacity="0.3"/>
      <line x1="75" y1="58" x2="150" y2="52" stroke="${adjustColor(hairColor, 30)}" stroke-width="1" opacity="0.4"/>
      <line x1="72" y1="64" x2="152" y2="60" stroke="${adjustColor(hairColor, 30)}" stroke-width="1" opacity="0.3"/>`;
    } else if (isUndercut) {
        topHair = `
      <path d="M55 88 Q62 48 110 42 Q158 48 165 88" fill="${hairColor}" opacity="0.95"/>
      <path d="M72 80 Q90 55 110 52 Q130 55 148 80" fill="${adjustColor(hairColor, 15)}" opacity="0.4"/>`;
    } else {
        // default textured / modern
        topHair = `
      <path d="M55 88 Q60 55 110 48 Q160 55 165 88" fill="${hairColor}" opacity="0.92"/>
      ${Array.from({ length: 8 }, (_, i) => {
            const x = 72 + i * 12;
            const y = 58 + (i % 2) * 6;
            return `<path d="M${x} 88 Q${x + 3} ${y} ${x + 6} ${y + 4}" fill="none" stroke="${adjustColor(hairColor, 20)}" stroke-width="1.8" opacity="0.5"/>`;
        }).join('')}`;
    }

    // Side hair
    const leftSideHair = isFade
        ? `<path d="M48 88 Q44 110 46 140 Q56 145 62 140 Q60 115 62 88" fill="url(#fadeGrad)" opacity="0.85"/>`
        : `<path d="M48 88 Q44 108 46 132 Q54 138 62 132 Q60 110 62 88" fill="${hairColor}" opacity="0.85"/>`;

    const rightSideHair = isFade
        ? `<path d="M172 88 Q176 110 174 140 Q164 145 158 140 Q160 115 158 88" fill="url(#fadeGrad)" opacity="0.85"/>`
        : `<path d="M172 88 Q176 108 174 132 Q166 138 158 132 Q160 110 158 88" fill="${hairColor}" opacity="0.85"/>`;

    return `<svg viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg" width="200" height="240" style="display:block">
  <defs>
    ${sideGradient}
    <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${adjustColor(skinColor, 15)}"/>
      <stop offset="100%" stop-color="${adjustColor(skinColor, -10)}"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="1.2"/></filter>
  </defs>
  <!-- NECK -->
  <rect x="90" y="195" width="40" height="45" rx="4" fill="${skinColor}" opacity="0.9"/>
  <!-- HEAD -->
  <ellipse cx="110" cy="130" rx="68" ry="80" fill="url(#skinGrad)"/>
  <!-- EAR LEFT -->
  <ellipse cx="43" cy="138" rx="9" ry="13" fill="${adjustColor(skinColor, -8)}" opacity="0.9"/>
  <ellipse cx="44" cy="138" rx="5" ry="9" fill="${adjustColor(skinColor, -15)}" opacity="0.5"/>
  <!-- EAR RIGHT -->
  <ellipse cx="177" cy="138" rx="9" ry="13" fill="${adjustColor(skinColor, -8)}" opacity="0.9"/>
  <ellipse cx="176" cy="138" rx="5" ry="9" fill="${adjustColor(skinColor, -15)}" opacity="0.5"/>
  <!-- SIDE HAIR -->
  ${leftSideHair}
  ${rightSideHair}
  <!-- FACIAL FEATURES -->
  <!-- Eyebrows -->
  <path d="M78 118 Q90 113 100 116" stroke="${adjustColor(hairColor, -10)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M120 116 Q130 113 142 118" stroke="${adjustColor(hairColor, -10)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Eyes -->
  <ellipse cx="89" cy="126" rx="10" ry="7" fill="white"/>
  <circle cx="89" cy="126" r="5" fill="${darkenColor(skinColor)}"/>
  <circle cx="89" cy="126" r="3" fill="#1a1a1a"/>
  <circle cx="91" cy="124" r="1.2" fill="white"/>
  <ellipse cx="131" cy="126" rx="10" ry="7" fill="white"/>
  <circle cx="131" cy="126" r="5" fill="${darkenColor(skinColor)}"/>
  <circle cx="131" cy="126" r="3" fill="#1a1a1a"/>
  <circle cx="133" cy="124" r="1.2" fill="white"/>
  <!-- Nose -->
  <path d="M107 130 Q105 148 100 152 Q110 157 120 152 Q115 148 113 130" fill="${adjustColor(skinColor, -12)}" opacity="0.5"/>
  <ellipse cx="103" cy="151" rx="5" ry="3.5" fill="${adjustColor(skinColor, -18)}" opacity="0.6"/>
  <ellipse cx="117" cy="151" rx="5" ry="3.5" fill="${adjustColor(skinColor, -18)}" opacity="0.6"/>
  <!-- Lips -->
  <path d="M93 168 Q110 163 127 168" stroke="${adjustColor(skinColor, -25)}" stroke-width="1.5" fill="none"/>
  <path d="M93 168 Q102 175 110 176 Q118 175 127 168 Q118 172 110 172 Q102 172 93 168Z" fill="${adjustColor(skinColor, -20)}" opacity="0.8"/>
  <!-- Chin shadow -->
  <ellipse cx="110" cy="200" rx="30" ry="6" fill="${adjustColor(skinColor, -15)}" opacity="0.3"/>
  <!-- TOP HAIR (on top of head) -->
  ${topHair}
  <!-- Hairline definition -->
  <path d="M55 88 Q110 78 165 88" fill="none" stroke="${hairColor}" stroke-width="1" opacity="0.3"/>
</svg>`;
}

function adjustColor(hex, amount) {
    try {
        let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    } catch { return hex; }
}
function darkenColor(hex) { return adjustColor(hex, -60); }

// ════════════════════════════════════════════
//  UTILITIES
// ════════════════════════════════════════════
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function showToast(msg, type = 'info') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast show ${type}`;
    setTimeout(() => t.classList.remove('show'), 4000);
}

function resetAll() {
    state.mode = null; state.style = null; state.maintenance = null;
    state.photoBase64 = null; state.photoMime = null; state.analysis = null;
    
    // Clean booking state
    if (typeof bookingState !== 'undefined') {
        bookingState.selectedBarber = null;
        bookingState.analysis = null;
    }
    
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('btn-mode-next').disabled = true;
    document.getElementById('btn-analyze').disabled = true;
    document.getElementById('upload-preview').style.display = 'none';
    document.getElementById('upload-icon').style.display = 'block';
    document.getElementById('upload-text').textContent = 'Arrastra tu foto aquí o haz clic para seleccionar';
    document.getElementById('upload-hint').textContent = 'JPG, PNG o WEBP · Máx 8MB · Frente al rostro, buena iluminación';
    document.getElementById('style-questions').style.display = 'none';
    document.getElementById('photo-input').value = '';
    document.getElementById('loading-steps').querySelectorAll('li').forEach(l => l.classList.remove('done'));
    document.getElementById('progress-fill').style.width = '0%';

    // Clean up camera
    stopCamera();
    resetCameraUI();
    document.getElementById('upload-mode').style.display = 'block';
    document.getElementById('camera-mode').style.display = 'none';
    document.getElementById('mode-upload-btn').classList.add('selected');
    document.getElementById('mode-camera-btn').classList.remove('selected');

    goToPanel(1);
}

// Panel 2: show style questions only if needed
document.getElementById('btn-mode-next').addEventListener('click', () => {
    if (state.mode === 'surprise' || state.mode === 'discover') {
        document.getElementById('style-questions').style.display = 'none';
    }
});