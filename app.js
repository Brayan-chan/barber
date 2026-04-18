import { GoogleGenerativeAI } from "@google/generative-ai";

// ==========================================
// ControlBarber - AI-Powered Barber Platform
// ==========================================

class ControlBarber {
    constructor() {
        this.apiKey = localStorage.getItem('gemini_api_key') || '';
        this.geminiModel = null;
        this.currentStep = 1;
        this.uploadedImage = null;
        this.uploadedImageBase64 = null;
        this.analysisResult = null;
        this.generatedHaircut = null;
        this.history = JSON.parse(localStorage.getItem('analysis_history') || '[]');
        this.userPreferences = JSON.parse(localStorage.getItem('user_preferences') || '{}');
        this.selectedBarber = null;
        this.selectedService = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.galleryIndex = 0;
        this.searchTerm = '';
        this.activeCatalogView = 'home';

        this.init();
    }

    // ==========================================
    // Initialization
    // ==========================================

    init() {
        this.setupEventListeners();
        this.checkApiKey();
        this.loadBarbers();
        this.loadHistory();
        this.loadUserPreferences();
    }

    setupEventListeners() {
        // Settings Modal
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettingsModal());
        document.getElementById('configureApiBtn')?.addEventListener('click', () => this.openSettingsModal());
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.closeSettingsModal());

        // API Key Management
        document.getElementById('saveApiKeyBtn').addEventListener('click', () => this.saveApiKey());
        document.getElementById('removeApiKeyBtn').addEventListener('click', () => this.removeApiKey());
        document.getElementById('toggleApiKeyBtn').addEventListener('click', () => this.toggleApiKeyVisibility());

        // Photo Upload
        document.getElementById('selectPhotoBtn').addEventListener('click', () => {
            document.getElementById('photoInput').click();
        });
        document.getElementById('photoInput').addEventListener('change', (e) => this.handlePhotoUpload(e));
        document.getElementById('uploadArea').addEventListener('click', () => {
            document.getElementById('photoInput').click();
        });
        document.getElementById('removeImage').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeUploadedImage();
        });

        // Drag and Drop
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Camera
        document.getElementById('takeSelfieBtn').addEventListener('click', () => this.openCamera());
        document.getElementById('closeCameraBtn').addEventListener('click', () => this.closeCamera());
        document.getElementById('captureBtn').addEventListener('click', () => this.capturePhoto());

        // Analysis Steps
        document.getElementById('analyzeBtn').addEventListener('click', () => this.startAnalysis());
        document.getElementById('backToStep1').addEventListener('click', () => this.goToStep(1));
        document.getElementById('generateHaircutBtn').addEventListener('click', () => this.generateHaircut());
        document.getElementById('backToStep2').addEventListener('click', () => this.goToStep(2));
        document.getElementById('regenerateBtn').addEventListener('click', () => this.regenerateHaircut());
        document.getElementById('findBarbersBtn').addEventListener('click', () => this.findMatchingBarbers());
        document.getElementById('backToStep3').addEventListener('click', () => this.goToStep(3));
        document.getElementById('startOverBtn').addEventListener('click', () => this.startOver());

        // History
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());

        // User Preferences
        document.getElementById('stylePreference').addEventListener('change', () => this.saveUserPreferences());
        document.getElementById('maintenanceLevel').addEventListener('change', () => this.saveUserPreferences());

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Search
        const mainSearchInput = document.getElementById('search-input');
        if (mainSearchInput) {
            mainSearchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.trim().toLowerCase();
                if (this.activeCatalogView !== 'ai-advisor') {
                    this.loadBarbers(this.activeCatalogView);
                }
            });
        }

        // Close modals on backdrop click
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') this.closeSettingsModal();
        });
        document.getElementById('cameraModal').addEventListener('click', (e) => {
            if (e.target.id === 'cameraModal') this.closeCamera();
        });
        document.getElementById('barberDetailModal').addEventListener('click', (e) => {
            if (e.target.id === 'barberDetailModal') this.closeBarberModal();
        });
    }

    // ==========================================
    // API Key Management
    // ==========================================

    checkApiKey() {
        if (this.apiKey) {
            this.initializeGemini(this.apiKey);
            document.getElementById('apiKeyAlert').classList.add('hidden');
            document.getElementById('apiKeyInput').value = this.apiKey;
            document.getElementById('removeApiKeyBtn').classList.remove('hidden');
            this.showApiKeyStatus('API Key configurada correctamente', 'success');
        } else {
            document.getElementById('apiKeyAlert').classList.remove('hidden');
        }
    }

    async initializeGemini(apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            this.geminiModel = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
            return true;
        } catch (error) {
            console.error("Error initializing Gemini:", error);
            throw new Error("API Key inválida o error de inicialización");
        }
    }

    async saveApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();

        if (!apiKey) {
            this.showToast('Por favor ingresa una API Key', 'error');
            return;
        }

        try {
            await this.initializeGemini(apiKey);
            this.apiKey = apiKey;
            localStorage.setItem('gemini_api_key', apiKey);
            document.getElementById('apiKeyAlert').classList.add('hidden');
            document.getElementById('removeApiKeyBtn').classList.remove('hidden');
            this.showApiKeyStatus('API Key guardada correctamente', 'success');
            this.showToast('API Key configurada con éxito', 'success');
        } catch (error) {
            this.showApiKeyStatus('Error: API Key inválida', 'error');
            this.showToast('API Key inválida', 'error');
        }
    }

    removeApiKey() {
        localStorage.removeItem('gemini_api_key');
        this.apiKey = '';
        this.geminiModel = null;
        document.getElementById('apiKeyInput').value = '';
        document.getElementById('apiKeyAlert').classList.remove('hidden');
        document.getElementById('removeApiKeyBtn').classList.add('hidden');
        this.showApiKeyStatus('', '');
        this.showToast('API Key eliminada', 'success');
    }

    toggleApiKeyVisibility() {
        const input = document.getElementById('apiKeyInput');
        const btn = document.getElementById('toggleApiKeyBtn');
        if (input.type === 'password') {
            input.type = 'text';
            btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            input.type = 'password';
            btn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    showApiKeyStatus(message, type) {
        const status = document.getElementById('apiKeyStatus');
        if (message) {
            status.classList.remove('hidden', 'text-green-600', 'text-red-600');
            status.classList.add(type === 'success' ? 'text-green-600' : 'text-red-600');
            status.textContent = message;
        } else {
            status.classList.add('hidden');
        }
    }

    // ==========================================
    // Settings Modal
    // ==========================================

    openSettingsModal() {
        document.getElementById('settingsModal').classList.remove('hidden');
    }

    closeSettingsModal() {
        document.getElementById('settingsModal').classList.add('hidden');
    }

    // ==========================================
    // Photo Upload & Camera
    // ==========================================

    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImage(file);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            this.processImage(file);
        } else {
            this.showToast('Por favor sube una imagen válida', 'error');
        }
    }

    processImage(file) {
        if (file.size > 10 * 1024 * 1024) {
            this.showToast('La imagen es muy grande (máx. 10MB)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedImage = e.target.result;
            this.uploadedImageBase64 = e.target.result.split(',')[1];
            this.showImagePreview(e.target.result);
            document.getElementById('analyzeBtn').disabled = false;
        };
        reader.readAsDataURL(file);
    }

    showImagePreview(src) {
        document.getElementById('uploadPlaceholder').classList.add('hidden');
        document.getElementById('previewContainer').classList.remove('hidden');
        document.getElementById('imagePreview').src = src;
    }

    removeUploadedImage() {
        this.uploadedImage = null;
        this.uploadedImageBase64 = null;
        document.getElementById('uploadPlaceholder').classList.remove('hidden');
        document.getElementById('previewContainer').classList.add('hidden');
        document.getElementById('imagePreview').src = '';
        document.getElementById('photoInput').value = '';
        document.getElementById('analyzeBtn').disabled = true;
    }

    openCamera() {
        const modal = document.getElementById('cameraModal');
        const video = document.getElementById('cameraFeed');

        modal.classList.remove('hidden');

        navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
        })
            .then(stream => {
                video.srcObject = stream;
                this.cameraStream = stream;
            })
            .catch(err => {
                console.error('Error accessing camera:', err);
                this.showToast('No se pudo acceder a la cámara', 'error');
                this.closeCamera();
            });
    }

    closeCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
        document.getElementById('cameraModal').classList.add('hidden');
    }

    capturePhoto() {
        const video = document.getElementById('cameraFeed');
        const canvas = document.getElementById('cameraCanvas');
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Flip horizontally to match mirror view
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        this.uploadedImage = dataUrl;
        this.uploadedImageBase64 = dataUrl.split(',')[1];

        this.showImagePreview(dataUrl);
        document.getElementById('analyzeBtn').disabled = false;
        this.closeCamera();
        this.showToast('Foto capturada con éxito', 'success');
    }

    // ==========================================
    // AI Analysis
    // ==========================================

    async startAnalysis() {
        if (!this.apiKey || !this.geminiModel) {
            this.showToast('Configura tu API Key primero', 'error');
            this.openSettingsModal();
            return;
        }

        if (!this.uploadedImageBase64) {
            this.showToast('Sube una foto primero', 'error');
            return;
        }

        this.goToStep(2);
        document.getElementById('analysisImage').src = this.uploadedImage;
        document.getElementById('analysisLoading').classList.remove('hidden');
        document.getElementById('analysisResult').classList.add('hidden');
        document.getElementById('generateHaircutBtn').disabled = true;

        try {
            const prompt = this.buildAnalysisPrompt();

            const result = await this.geminiModel.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: this.uploadedImageBase64
                    }
                }
            ]);

            const response = await result.response;
            this.analysisResult = response.text();

            this.renderAnalysis(this.analysisResult);
            document.getElementById('analysisLoading').classList.add('hidden');
            document.getElementById('analysisResult').classList.remove('hidden');
            document.getElementById('generateHaircutBtn').disabled = false;

        } catch (error) {
            console.error('Analysis error:', error);
            document.getElementById('analysisLoading').classList.add('hidden');

            let errorHtml = '';
            const errorMessage = error.message || '';

            if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Quota')) {
                errorHtml = `
                    <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-800">
                        <div class="flex items-start gap-3">
                            <svg class="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            <div>
                                <p class="font-bold text-lg mb-2">Cuota de API excedida</p>
                                <p class="mb-4">Tu API Key de Google Gemini ha alcanzado el limite de uso gratuito. Tienes estas opciones:</p>
                                <ul class="list-disc list-inside space-y-1 text-sm mb-4">
                                    <li>Espera unos minutos y vuelve a intentarlo</li>
                                    <li>Actualiza tu plan en <a href="https://ai.google.dev/pricing" target="_blank" class="underline font-medium hover:text-amber-900">Google AI Studio</a></li>
                                    <li>Usa una API Key diferente</li>
                                </ul>
                                <a href="https://ai.google.dev/gemini-api/docs/rate-limits" target="_blank" class="inline-flex items-center gap-2 text-sm font-medium underline hover:text-amber-900">
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Mas informacion sobre limites
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                this.showToast('Cuota de API excedida - revisa tu plan', 'error');
            } else if (errorMessage.includes('API') || errorMessage.includes('key') || errorMessage.includes('Key')) {
                errorHtml = `
                    <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
                        <div class="flex items-start gap-3">
                            <svg class="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            <div>
                                <p class="font-bold text-lg mb-2">Error de API Key</p>
                                <p class="mb-3">La API Key no es valida o hay un problema de configuracion.</p>
                                <button onclick="document.getElementById('settingsBtn').click()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                                    Configurar API Key
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                this.showToast('API Key invalida', 'error');
            } else {
                errorHtml = `
                    <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
                        <div class="flex items-start gap-3">
                            <svg class="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            <div>
                                <p class="font-bold text-lg mb-2">Error al analizar la imagen</p>
                                <p class="text-sm mb-3">${error.message}</p>
                                <button onclick="location.reload()" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
                                    Reintentar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                this.showToast('Error en el analisis', 'error');
            }

            document.getElementById('analysisResult').innerHTML = errorHtml;
            document.getElementById('analysisResult').classList.remove('hidden');
        }
    }

    buildAnalysisPrompt() {
        const style = this.userPreferences.stylePreference || 'moderno';
        const maintenance = this.userPreferences.maintenanceLevel || 'medio';

        return `Eres BarberAI, un experto en imagen personal masculina y barbería moderna.

INSTRUCCIONES:
Analiza la imagen proporcionada y genera un análisis detallado del rostro y cabello de la persona.

PREFERENCIAS DEL USUARIO:
- Estilo preferido: ${style}
- Nivel de mantenimiento: ${maintenance}

RESPONDE EN ESPAÑOL con el siguiente formato en Markdown:

## 🔍 Análisis de tu Rostro y Cabello

### Tipo de Rostro
[Identifica: ovalado, redondo, cuadrado, rectangular, corazón, diamante, etc.]
[Explica brevemente las características que observas]

### Tipo de Cabello
[Identifica: liso, ondulado, rizado, afro, etc.]
[Grosor: fino, medio, grueso]
[Densidad: baja, media, alta]

### Rasgos Destacados
- **Frente:** [descripción]
- **Pómulos:** [descripción]
- **Mandíbula:** [descripción]
- **Proporciones:** [descripción]

### Objetivo Estético
[Qué se debe buscar visualmente para favorecer el rostro]

---

## ✂️ Corte Recomendado

### 🔥 Opción Principal: [Nombre del corte]

**Por qué te queda perfecto:**
[Lista de razones específicas basadas en el análisis]

**Cómo pedirlo al barbero:**
- Fade: [nivel y tipo]
- Arriba: [longitud y estilo]
- Textura: [técnica recomendada]
- Acabado: [natural, definido, etc.]

**Nivel de dificultad:** [Fácil/Medio/Difícil]
**Mantenimiento:** [Bajo/Medio/Alto]

---

### 🔁 Alternativas

**Opción 2: [Nombre]**
[Breve descripción y por qué funcionaría]

**Opción 3: [Nombre]**
[Breve descripción y por qué funcionaría]

---

## 🚫 Qué Evitar

[Lista de cortes o estilos que NO favorecen este tipo de rostro y por qué]

---

## 💈 Tips de Styling

- **Productos recomendados:** [cera mate, pomada, polvo texturizante, etc.]
- **Cómo peinarlo:** [técnica básica]
- **Frecuencia de corte:** [cada cuántas semanas]

---

Sé específico, técnico y profesional. Usa emojis moderadamente para hacer la lectura más amigable.`;
    }

    renderAnalysis(markdown) {
        const html = DOMPurify.sanitize(marked.parse(markdown));
        document.getElementById('analysisResult').innerHTML = html;
    }

    // ==========================================
    // Haircut Generation
    // ==========================================

    async generateHaircut() {
        if (!this.analysisResult) {
            this.showToast('Primero necesitas el análisis', 'error');
            return;
        }

        this.goToStep(3);
        document.getElementById('beforeImage').src = this.uploadedImage;
        document.getElementById('generatingLoading').classList.remove('hidden');
        document.getElementById('generatedImage').classList.add('hidden');
        document.getElementById('haircutDetails').classList.add('hidden');

        try {
            const prompt = this.buildGenerationPrompt();

            const result = await this.geminiModel.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: this.uploadedImageBase64
                    }
                }
            ]);

            const response = await result.response;

            // Check if the response contains an image
            const parts = response.candidates[0].content.parts;
            let hasGeneratedImage = false;
            let haircutDescription = '';

            for (const part of parts) {
                if (part.inlineData) {
                    // We have an image
                    const imageData = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType;
                    this.generatedHaircut = `data:${mimeType};base64,${imageData}`;
                    document.getElementById('generatedImage').src = this.generatedHaircut;
                    hasGeneratedImage = true;
                }
                if (part.text) {
                    haircutDescription = part.text;
                }
            }

            document.getElementById('generatingLoading').classList.add('hidden');

            if (hasGeneratedImage) {
                document.getElementById('generatedImage').classList.remove('hidden');
            } else {
                // If no image was generated, show a placeholder message
                document.getElementById('generatedImage').src = this.uploadedImage;
                document.getElementById('generatedImage').classList.remove('hidden');
                this.showToast('Vista previa del estilo (imagen conceptual)', 'success');
            }

            if (haircutDescription) {
                const html = DOMPurify.sanitize(marked.parse(haircutDescription));
                document.getElementById('haircutDescription').innerHTML = html;
                document.getElementById('haircutDetails').classList.remove('hidden');
            }

            // Save to history
            this.saveToHistory();

        } catch (error) {
            console.error('Generation error:', error);
            document.getElementById('generatingLoading').classList.add('hidden');

            const errorMessage = error.message || '';

            if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Quota')) {
                // Show quota error in the image container
                document.getElementById('generatedImageContainer').innerHTML = `
                    <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-800">
                        <div class="text-center">
                            <svg class="h-12 w-12 text-amber-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            <p class="font-bold text-lg mb-2">Cuota de API excedida</p>
                            <p class="text-sm mb-4">Tu API Key ha alcanzado el limite de uso.</p>
                            <a href="https://ai.google.dev/pricing" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
                                Ver planes de Gemini
                            </a>
                        </div>
                    </div>
                `;
                this.showToast('Cuota de API excedida', 'error');
            } else {
                // Show the original image with the analysis as fallback
                document.getElementById('generatedImage').src = this.uploadedImage;
                document.getElementById('generatedImage').classList.remove('hidden');
                this.showToast('Mostrando recomendacion basada en analisis', 'success');
            }

            // Extract haircut details from analysis
            const fallbackDetails = this.extractHaircutDetails(this.analysisResult);
            document.getElementById('haircutDescription').innerHTML = DOMPurify.sanitize(marked.parse(fallbackDetails));
            document.getElementById('haircutDetails').classList.remove('hidden');
        }
    }

    buildGenerationPrompt() {
        return `Basándote en el análisis anterior y la imagen proporcionada, genera una imagen realista de esta persona con el corte de cabello recomendado.

INSTRUCCIONES IMPORTANTES:
1. NO modifiques el rostro de la persona - mantén exactamente los mismos rasgos faciales
2. SOLO modifica el cabello aplicando el corte recomendado
3. Mantén la misma iluminación y fondo de la foto original
4. El resultado debe verse natural y realista

El corte a aplicar es:
- Low Fade (desvanecido bajo)
- Texturizado en la parte superior
- Volumen arriba para alargar el rostro
- Transición limpia pero natural

Además, proporciona una descripción detallada del corte en español con formato Markdown:

## 💈 Detalles del Corte Generado

### Nivel del Corte
- **Desvanecido:** [descripción]
- **Intensidad:** [escala del 1-10]
- **Transición:** [descripción]

### Especificaciones Técnicas
[Lista de especificaciones que el cliente puede mostrar al barbero]

### Productos para Mantenerlo
[Recomendaciones de productos]

### Frecuencia de Mantenimiento
[Cada cuánto debe cortarse]`;
    }

    extractHaircutDetails(analysis) {
        // Extract the "Corte Recomendado" section from the analysis
        const sections = analysis.split('---');
        let haircutSection = '';

        for (const section of sections) {
            if (section.includes('Corte Recomendado') || section.includes('Opción Principal')) {
                haircutSection = section;
                break;
            }
        }

        if (haircutSection) {
            return haircutSection;
        }

        return `## 💈 Tu Corte Recomendado

Basado en tu análisis, te recomendamos un **Low Fade + Texturizado**.

### Características:
- Desvanecido bajo que limpia sin exagerar
- Volumen en la parte superior para estilizar
- Textura natural que favorece tu tipo de rostro

### Cómo pedirlo:
- Fade bajo (0 → 1.5)
- Arriba: 5-7 cm
- Texturizado con tijera
- Contorno natural`;
    }

    async regenerateHaircut() {
        await this.generateHaircut();
    }

    // ==========================================
    // Barber Matching
    // ==========================================

    findMatchingBarbers() {
        this.goToStep(4);

        // Set recommended cut info
        if (this.generatedHaircut) {
            document.getElementById('recommendedCutThumb').src = this.generatedHaircut;
        } else {
            document.getElementById('recommendedCutThumb').src = this.uploadedImage;
        }

        // Load matching barbers
        this.loadRecommendedBarbers();
    }

    loadRecommendedBarbers() {
        const container = document.getElementById('recommendedBarbers');
        container.innerHTML = '';

        const catalog = this.getBarberCatalog();

        // Filter barbers that specialize in fades and modern cuts
        const matchingBarbers = catalog.filter(barber =>
            barber.specialty.toLowerCase().includes('fade') ||
            barber.specialty.toLowerCase().includes('moderno') ||
            barber.specialty.toLowerCase().includes('diseño') ||
            barber.specialty.toLowerCase().includes('clásico')
        );

        // If no specific matches, show all barbers sorted by rating
        const barbersToShow = matchingBarbers.length > 0 ? matchingBarbers :
            [...catalog].sort((a, b) => b.rating - a.rating).slice(0, 6);

        barbersToShow.forEach(barber => {
            const barberHTML = `
                <div class="bg-white rounded-xl shadow-md overflow-hidden barber-card cursor-pointer" onclick="app.showBarberDetail('${barber.id}')">
                    <div class="relative">
                        <img src="${barber.images[0]}" alt="${barber.name}" class="w-full h-48 object-cover">
                        <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                            <i class="fas fa-star text-amber-500"></i>
                            <span class="font-medium text-sm">${barber.rating}</span>
                        </div>
                        ${barber.matchScore ? `
                        <div class="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            ${barber.matchScore}% Match
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="p-4">
                        <h4 class="font-bold text-gray-800">${barber.name}</h4>
                        <p class="text-sm text-gray-600 mb-2">${barber.specialty}</p>
                        
                        <div class="flex items-center text-sm text-gray-500 mb-3">
                            <i class="fas fa-map-marker-alt mr-1"></i>
                            <span>${barber.location}</span>
                            <span class="mx-2">•</span>
                            <span>${barber.experience} años exp.</span>
                        </div>
                        
                        <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                            <div>
                                <span class="font-bold text-gray-800">$${barber.price} MXN</span>
                            </div>
                            <button class="bg-primary hover:bg-primary-dark text-white text-sm font-medium py-2 px-4 rounded-lg transition-all">
                                Ver perfil
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += barberHTML;
        });
    }

    // ==========================================
    // Barber Details
    // ==========================================

    showBarberDetail(barberId) {
        const barber = this.getBarberCatalog().find(b => String(b.id) === String(barberId));
        if (!barber) return;

        this.selectedBarber = barber;
        this.selectedService = barber.services[0] || null;
        this.selectedDate = this.getDefaultBookingDate();
        this.selectedTime = '11:00 AM';
        this.galleryIndex = 0;

        const modal = document.getElementById('barberDetailModal');
        const content = document.getElementById('barberDetailContent');

        content.innerHTML = `
            <div class="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">${barber.name}</h2>
                    <div class="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <i class="fas fa-star text-amber-500"></i>
                        <span class="font-medium text-gray-800">${barber.rating}</span>
                        <span>(${barber.reviews} reseñas)</span>
                        <span class="text-gray-400">•</span>
                        <span><i class="fas fa-map-marker-alt mr-1"></i>${barber.location}</span>
                    </div>
                </div>
                <button onclick="app.closeBarberModal()" class="h-10 w-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-all">
                    <i class="fas fa-times text-gray-700"></i>
                </button>
            </div>

            <div class="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                    <div class="rounded-2xl overflow-hidden bg-gray-100 mb-3">
                        <img id="barber-modal-main-image" src="${barber.images[0]}" alt="${barber.name}" class="w-full h-64 md:h-80 object-cover">
                    </div>
                    <div id="barber-modal-thumbnails" class="grid grid-cols-4 gap-3 mb-6"></div>

                    <p class="text-gray-700 mb-6">${barber.description}</p>

                    <h3 class="font-bold text-gray-800 mb-3">Servicios disponibles</h3>
                    <div id="barber-modal-services" class="space-y-3 mb-6"></div>
                </div>

                <div>
                    <div class="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-card p-5">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">Reservar cita</h3>

                        <div class="mb-5">
                            <p class="font-medium text-gray-700 mb-2">Fecha</p>
                            <div id="barber-booking-calendar" class="grid grid-cols-2 sm:grid-cols-3 gap-2"></div>
                        </div>

                        <div class="mb-5">
                            <p class="font-medium text-gray-700 mb-2">Horario</p>
                            <div id="barber-booking-times" class="grid grid-cols-2 gap-2"></div>
                        </div>

                        <div class="border-t border-gray-200 pt-4 mb-4">
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-600">Servicio</span>
                                <span id="booking-summary-service" class="font-medium text-gray-800">-</span>
                            </div>
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-600">Fecha y hora</span>
                                <span id="booking-summary-datetime" class="font-medium text-gray-800">-</span>
                            </div>
                            <div class="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
                                <span>Total</span>
                                <span id="booking-summary-total">$0 MXN</span>
                            </div>
                        </div>

                        <button onclick="app.confirmBarberBooking()" class="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all">
                            <i class="fas fa-calendar-check mr-2"></i>Confirmar reserva
                        </button>
                        <p class="text-xs text-gray-500 mt-3 text-center">La reserva se guarda localmente para demo</p>
                    </div>
                </div>
            </div>
        `;

        this.renderBarberGallery();
        this.renderBarberServices();
        this.renderBookingCalendar();
        this.renderBookingTimes();
        this.updateBookingSummary();

        modal.classList.remove('hidden');
    }

    getDefaultBookingDate() {
        const date = new Date();
        date.setDate(date.getDate() + 2);
        return date.toISOString().split('T')[0];
    }

    getNextBookingDates(total = 9) {
        const dates = [];
        const base = new Date();
        for (let i = 0; i < total; i++) {
            const d = new Date(base);
            d.setDate(base.getDate() + i);
            dates.push(d);
        }
        return dates;
    }

    renderBarberGallery() {
        if (!this.selectedBarber) return;
        const container = document.getElementById('barber-modal-thumbnails');
        if (!container) return;

        container.innerHTML = this.selectedBarber.images.map((image, index) => `
            <button onclick="app.selectBarberImage(${index})" class="gallery-item rounded-xl overflow-hidden border-2 ${index === this.galleryIndex ? 'border-primary' : 'border-transparent'}">
                <img src="${image}" alt="Trabajo ${index + 1}" class="w-full h-20 object-cover">
            </button>
        `).join('');
    }

    selectBarberImage(index) {
        if (!this.selectedBarber) return;
        this.galleryIndex = index;
        const mainImage = document.getElementById('barber-modal-main-image');
        if (mainImage) {
            mainImage.src = this.selectedBarber.images[index] || this.selectedBarber.images[0];
        }
        this.renderBarberGallery();
    }

    renderBarberServices() {
        if (!this.selectedBarber) return;
        const container = document.getElementById('barber-modal-services');
        if (!container) return;

        container.innerHTML = this.selectedBarber.services.map((service, index) => {
            const isSelected = this.selectedService && this.selectedService.name === service.name;
            return `
                <button onclick="app.selectBookingService(${index})" class="w-full flex justify-between items-center rounded-xl p-3 border-2 transition-all text-left ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/40'}">
                    <div>
                        <p class="font-medium text-gray-800">${service.name}</p>
                        <p class="text-sm text-gray-500">${service.duration}</p>
                    </div>
                    <span class="font-bold ${isSelected ? 'text-primary' : 'text-gray-800'}">$${service.price} MXN</span>
                </button>
            `;
        }).join('');
    }

    selectBookingService(index) {
        if (!this.selectedBarber) return;
        this.selectedService = this.selectedBarber.services[index] || this.selectedBarber.services[0];
        this.renderBarberServices();
        this.updateBookingSummary();
    }

    renderBookingCalendar() {
        const container = document.getElementById('barber-booking-calendar');
        if (!container) return;

        const dates = this.getNextBookingDates();
        container.innerHTML = dates.map(date => {
            const iso = date.toISOString().split('T')[0];
            const isSelected = iso === this.selectedDate;
            const day = date.toLocaleDateString('es-MX', { weekday: 'short' }).replace('.', '');
            const dayNum = date.getDate();
            const month = date.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '');

            return `
                <button onclick="app.selectBookingDate('${iso}')" class="calendar-day rounded-xl py-2 px-1 text-center border transition-all ${isSelected ? 'selected border-primary bg-primary text-white' : 'border-gray-200 hover:border-primary text-gray-700'}">
                    <span class="block text-xs uppercase">${day}</span>
                    <span class="block font-bold">${dayNum}</span>
                    <span class="block text-xs">${month}</span>
                </button>
            `;
        }).join('');
    }

    selectBookingDate(isoDate) {
        this.selectedDate = isoDate;
        this.selectedTime = null;
        this.renderBookingCalendar();
        this.renderBookingTimes();
        this.updateBookingSummary();
    }

    getAvailableBookingTimes() {
        const allTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
        if (!this.selectedDate || !this.selectedBarber) {
            return allTimes.map(time => ({ label: time, available: true }));
        }

        return allTimes.map((time, index) => {
            const key = `${this.selectedBarber.id}-${this.selectedDate}-${index}`;
            let hash = 0;
            for (let i = 0; i < key.length; i++) {
                hash = (hash + key.charCodeAt(i)) % 11;
            }
            return {
                label: time,
                available: hash > 1
            };
        });
    }

    renderBookingTimes() {
        const container = document.getElementById('barber-booking-times');
        if (!container) return;

        const times = this.getAvailableBookingTimes();
        container.innerHTML = times.map(time => {
            const isSelected = this.selectedTime === time.label;
            return `
                <button onclick="app.selectBookingTime('${time.label}')" ${time.available ? '' : 'disabled'} class="time-slot py-2 rounded-lg border text-sm font-medium transition-all ${!time.available ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed line-through' : isSelected ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 hover:border-primary text-gray-700'}">
                    ${time.label}
                </button>
            `;
        }).join('');
    }

    selectBookingTime(timeLabel) {
        this.selectedTime = timeLabel;
        this.renderBookingTimes();
        this.updateBookingSummary();
    }

    formatBookingDate(isoDate) {
        if (!isoDate) return '-';
        const date = new Date(`${isoDate}T12:00:00`);
        return date.toLocaleDateString('es-MX', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    }

    updateBookingSummary() {
        const serviceEl = document.getElementById('booking-summary-service');
        const datetimeEl = document.getElementById('booking-summary-datetime');
        const totalEl = document.getElementById('booking-summary-total');

        if (serviceEl) {
            serviceEl.textContent = this.selectedService ? this.selectedService.name : '-';
        }
        if (datetimeEl) {
            const dateText = this.formatBookingDate(this.selectedDate);
            datetimeEl.textContent = this.selectedTime ? `${dateText}, ${this.selectedTime}` : dateText;
        }
        if (totalEl) {
            totalEl.textContent = this.selectedService ? `$${this.selectedService.price} MXN` : '$0 MXN';
        }
    }

    confirmBarberBooking() {
        if (!this.selectedBarber || !this.selectedService || !this.selectedDate || !this.selectedTime) {
            this.showToast('Selecciona servicio, fecha y horario', 'error');
            return;
        }

        const currentUser = window.authManager?.currentUser;
        if (!currentUser) {
            this.showToast('Inicia sesión como cliente para continuar', 'error');
            window.showAuthModal('login', 'client');
            return;
        }

        if (currentUser.userType !== 'client') {
            this.showToast('Solo los clientes pueden reservar citas', 'error');
            return;
        }

        if (window.router) {
            window.router.navigate('booking', {
                barberId: String(this.selectedBarber.id),
                serviceId: String(this.selectedService.id || '')
            });
            this.closeBarberModal();
            return;
        }

        this.showToast('No se pudo abrir el flujo de reserva', 'error');
    }

    closeBarberModal() {
        document.getElementById('barberDetailModal').classList.add('hidden');
    }

    // ==========================================
    // Step Navigation
    // ==========================================

    goToStep(step) {
        this.currentStep = step;

        // Update step indicators
        document.querySelectorAll('.step-item').forEach((item, index) => {
            const stepNum = index + 1;
            item.classList.remove('active', 'completed');

            if (stepNum < step) {
                item.classList.add('completed');
                item.querySelector('.step-circle').classList.remove('bg-gray-300', 'text-gray-600', 'bg-primary');
                item.querySelector('.step-circle').classList.add('bg-green-500', 'text-white');
            } else if (stepNum === step) {
                item.classList.add('active');
                item.querySelector('.step-circle').classList.remove('bg-gray-300', 'text-gray-600', 'bg-green-500');
                item.querySelector('.step-circle').classList.add('bg-primary', 'text-white');
            } else {
                item.querySelector('.step-circle').classList.remove('bg-primary', 'bg-green-500', 'text-white');
                item.querySelector('.step-circle').classList.add('bg-gray-300', 'text-gray-600');
            }
        });

        // Update step lines
        document.querySelectorAll('.step-line').forEach((line, index) => {
            if (index < step - 1) {
                line.classList.add('completed');
                line.style.backgroundColor = '#10b981';
            } else {
                line.classList.remove('completed');
                line.style.backgroundColor = '#d1d5db';
            }
        });

        // Show/hide step content
        document.querySelectorAll('.step-content').forEach((content, index) => {
            if (index + 1 === step) {
                content.classList.remove('hidden');
                content.classList.add('active');
            } else {
                content.classList.add('hidden');
                content.classList.remove('active');
            }
        });
    }

    startOver() {
        this.removeUploadedImage();
        this.analysisResult = null;
        this.generatedHaircut = null;
        this.goToStep(1);
    }

    // ==========================================
    // History Management
    // ==========================================

    saveToHistory() {
        const historyItem = {
            id: Date.now(),
            date: new Date().toLocaleDateString('es-MX'),
            originalImage: this.uploadedImage,
            generatedImage: this.generatedHaircut || this.uploadedImage,
            analysis: this.analysisResult
        };

        this.history.unshift(historyItem);
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }

        localStorage.setItem('analysis_history', JSON.stringify(this.history));
        this.loadHistory();
    }

    loadHistory() {
        const container = document.getElementById('historyList');
        const section = document.getElementById('historySection');

        if (this.history.length === 0) {
            section.classList.add('hidden');
            return;
        }

        section.classList.remove('hidden');
        container.innerHTML = '';

        this.history.forEach(item => {
            const itemHTML = `
                <div class="history-item bg-gray-50 rounded-xl p-4 cursor-pointer" onclick="app.loadHistoryItem(${item.id})">
                    <div class="flex gap-4">
                        <img src="${item.generatedImage}" alt="Análisis" class="w-20 h-20 object-cover rounded-lg">
                        <div class="flex-1">
                            <p class="font-medium text-gray-800">${item.date}</p>
                            <p class="text-sm text-gray-600 line-clamp-2">${item.analysis.substring(0, 100)}...</p>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += itemHTML;
        });
    }

    loadHistoryItem(id) {
        const item = this.history.find(h => h.id === id);
        if (!item) return;

        this.uploadedImage = item.originalImage;
        this.uploadedImageBase64 = item.originalImage.split(',')[1];
        this.analysisResult = item.analysis;
        this.generatedHaircut = item.generatedImage;

        this.showImagePreview(item.originalImage);
        document.getElementById('analyzeBtn').disabled = false;

        // Go to step 3 to show the result
        this.goToStep(3);
        document.getElementById('beforeImage').src = item.originalImage;
        document.getElementById('generatingLoading').classList.add('hidden');
        document.getElementById('generatedImage').src = item.generatedImage;
        document.getElementById('generatedImage').classList.remove('hidden');

        const fallbackDetails = this.extractHaircutDetails(item.analysis);
        document.getElementById('haircutDescription').innerHTML = DOMPurify.sanitize(marked.parse(fallbackDetails));
        document.getElementById('haircutDetails').classList.remove('hidden');
    }

    clearHistory() {
        if (confirm('¿Estás seguro de que deseas eliminar todo el historial?')) {
            this.history = [];
            localStorage.removeItem('analysis_history');
            this.loadHistory();
            this.showToast('Historial eliminado', 'success');
        }
    }

    // ==========================================
    // User Preferences
    // ==========================================

    loadUserPreferences() {
        if (this.userPreferences.stylePreference) {
            document.getElementById('stylePreference').value = this.userPreferences.stylePreference;
        }
        if (this.userPreferences.maintenanceLevel) {
            document.getElementById('maintenanceLevel').value = this.userPreferences.maintenanceLevel;
        }
    }

    saveUserPreferences() {
        this.userPreferences = {
            stylePreference: document.getElementById('stylePreference').value,
            maintenanceLevel: document.getElementById('maintenanceLevel').value
        };
        localStorage.setItem('user_preferences', JSON.stringify(this.userPreferences));
    }

    // ==========================================
    // Navigation
    // ==========================================

    handleNavigation(e) {
        const view = e.currentTarget.dataset.view;
        this.activeCatalogView = view;

        if (window.router && !['home', 'ai-advisor'].includes(window.router.currentRoute)) {
            window.router.navigate('home');
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'border-b-2', 'border-primary', 'text-primary');
            link.classList.add('text-gray-700');
        });

        e.currentTarget.classList.add('active', 'border-b-2', 'border-primary', 'text-primary');
        e.currentTarget.classList.remove('text-gray-700');

        if (view === 'ai-advisor') {
            document.getElementById('ai-advisor-section').classList.remove('hidden');
            document.getElementById('barbers-section').classList.add('hidden');
        } else {
            document.getElementById('ai-advisor-section').classList.add('hidden');
            document.getElementById('barbers-section').classList.remove('hidden');
            this.loadBarbers(view);
        }
    }

    // ==========================================
    // Barbers Loading
    // ==========================================

    getBarberCatalog() {
        const authBarbers = window.authManager?.getAllBarbers?.() || [];
        if (authBarbers.length > 0) {
            return authBarbers.map((barber) => {
                const services = (barber.services || []).map((service) => ({
                    id: service.id,
                    name: service.name,
                    price: Number(service.price || 0),
                    duration: `${service.duration || 30} min`
                }));

                const minPrice = services.length > 0
                    ? Math.min(...services.map((service) => service.price))
                    : 0;

                return {
                    id: barber.id,
                    name: barber.name || 'Barbero',
                    specialty: barber.specialties?.[0] || 'Corte personalizado',
                    experience: barber.experience || 5,
                    location: barber.location?.city || 'Ubicación no especificada',
                    rating: Number(barber.rating || 0),
                    reviews: Number(barber.reviewCount || 0),
                    price: minPrice,
                    description: barber.description || 'Barbero profesional disponible para reserva.',
                    services,
                    images: barber.gallery?.length
                        ? barber.gallery
                        : [barber.avatar || barber.coverImage || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                    isFeatured: Number(barber.rating || 0) >= 4.7
                };
            });
        }

        return barbersData;
    }

    getFilteredBarbers(view = this.activeCatalogView) {
        const catalog = this.getBarberCatalog();
        let result = [...catalog];

        if (this.searchTerm) {
            result = result.filter((barber) => {
                const indexed = `${barber.name} ${barber.specialty} ${barber.location}`.toLowerCase();
                return indexed.includes(this.searchTerm);
            });
        }

        if (view === 'top-rated') {
            result.sort((a, b) => (b.rating - a.rating) || (b.reviews - a.reviews));
        } else if (view === 'nearby') {
            result.sort((a, b) => b.rating - a.rating);
        } else {
            result.sort((a, b) => (b.reviews - a.reviews) || (b.rating - a.rating));
        }

        return result;
    }

    loadBarbers(view = this.activeCatalogView) {
        const container = document.getElementById('barbers-list');
        if (!container) return;

        container.innerHTML = '';

        const list = this.getFilteredBarbers(view);

        if (list.length === 0) {
            container.innerHTML = `
                <div class="col-span-full bg-white rounded-2xl shadow p-8 text-center empty-state">
                    <i class="fas fa-search text-gray-400 text-4xl mb-3"></i>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">No encontramos barberos</h3>
                    <p class="text-gray-600">Prueba con otra ciudad, nombre o especialidad.</p>
                </div>
            `;
            return;
        }

        list.forEach(barber => {
            const barberHTML = `
                <div class="bg-white rounded-xl shadow-md overflow-hidden barber-card cursor-pointer" onclick="app.showBarberDetail('${barber.id}')">
                    <div class="relative">
                        <img src="${barber.images[0]}" alt="${barber.name}" class="w-full h-56 object-cover">
                        <button class="absolute top-4 right-4 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-all" onclick="event.stopPropagation()">
                            <i class="far fa-heart text-gray-700"></i>
                        </button>
                    </div>
                    
                    <div class="p-5">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h3 class="font-bold text-gray-800 text-lg">${barber.name}</h3>
                                <p class="text-gray-600 text-sm">${barber.specialty}</p>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-star text-amber-500 mr-1"></i>
                                <span class="font-medium">${barber.rating}</span>
                            </div>
                        </div>
                        
                        <div class="flex items-center text-gray-600 text-sm mb-4">
                            <i class="fas fa-map-marker-alt mr-2"></i>
                            <span>${barber.location}</span>
                            <span class="mx-2">•</span>
                            <i class="fas fa-briefcase mr-1"></i>
                            <span>${barber.experience} años</span>
                        </div>
                        
                        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div>
                                <span class="font-bold text-gray-800">Desde $${barber.price} MXN</span>
                                <p class="text-gray-500 text-sm">por servicio</p>
                            </div>
                            <button class="text-primary font-medium hover:text-primary-dark transition-all">
                                Ver detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += barberHTML;
        });
    }

    // ==========================================
    // Utility Functions
    // ==========================================

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// ==========================================
// Barbers Data (Mock)
// ==========================================

const barbersData = [
    {
        id: 1,
        name: "Carlos Martínez",
        specialty: "Fade y degradados",
        experience: 8,
        location: "Centro Histórico",
        rating: 4.8,
        reviews: 45,
        price: 250,
        description: "Especializado en fades modernos y degradados precisos con más de 8 años de experiencia. Carlos se destaca por su atención al detalle y transiciones impecables.",
        services: [
            { name: "Low Fade", price: 250, duration: "35 min" },
            { name: "Mid Fade", price: 280, duration: "40 min" },
            { name: "High Fade", price: 280, duration: "40 min" },
            { name: "Skin Fade", price: 300, duration: "45 min" }
        ],
        images: [
            "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        isFeatured: true
    },
    {
        id: 2,
        name: "Luis Fernández",
        specialty: "Diseño moderno",
        experience: 5,
        location: "Polanco",
        rating: 4.6,
        reviews: 32,
        price: 300,
        description: "Experto en cortes modernos y diseños personalizados. Luis tiene un ojo excepcional para crear estilos únicos que complementan cada tipo de rostro.",
        services: [
            { name: "Corte moderno", price: 300, duration: "40 min" },
            { name: "Diseño con navaja", price: 350, duration: "50 min" },
            { name: "Texturizado", price: 280, duration: "35 min" }
        ],
        images: [
            "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        isFeatured: true
    },
    {
        id: 3,
        name: "Miguel Ángel",
        specialty: "Cortes clásicos",
        experience: 10,
        location: "Roma Norte",
        rating: 4.9,
        reviews: 67,
        price: 350,
        description: "Maestro barbero con técnica depurada. Miguel combina lo mejor de la barbería clásica con tendencias actuales para resultados excepcionales.",
        services: [
            { name: "Corte clásico", price: 350, duration: "45 min" },
            { name: "Afeitado tradicional", price: 280, duration: "35 min" },
            { name: "Corte + Barba", price: 500, duration: "60 min" }
        ],
        images: [
            "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        isFeatured: true
    },
    {
        id: 4,
        name: "Antonio García",
        specialty: "Fade y texturizado",
        experience: 4,
        location: "Del Valle",
        rating: 4.7,
        reviews: 26,
        price: 220,
        description: "Especialista en fades y técnicas de texturizado modernas. Antonio crea transiciones perfectas y estilos juveniles que destacan.",
        services: [
            { name: "Fade completo", price: 220, duration: "40 min" },
            { name: "Texturizado", price: 200, duration: "30 min" },
            { name: "Fade + Diseño", price: 280, duration: "50 min" }
        ],
        images: [
            "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        isFeatured: false
    },
    {
        id: 5,
        name: "Roberto Sánchez",
        specialty: "Barbas y bigotes",
        experience: 7,
        location: "Coyoacán",
        rating: 4.5,
        reviews: 41,
        price: 200,
        description: "Experto en diseño y mantenimiento de barbas. Roberto utiliza técnicas tradicionales combinadas con productos premium.",
        services: [
            { name: "Diseño de barba", price: 200, duration: "30 min" },
            { name: "Afeitado clásico", price: 180, duration: "25 min" },
            { name: "Corte + Barba", price: 350, duration: "50 min" }
        ],
        images: [
            "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        isFeatured: false
    },
    {
        id: 6,
        name: "Fernando López",
        specialty: "Estilos urbanos",
        experience: 6,
        location: "Condesa",
        rating: 4.8,
        reviews: 38,
        price: 280,
        description: "Especialista en estilos urbanos y streetwear. Fernando está siempre actualizado con las últimas tendencias de TikTok e Instagram.",
        services: [
            { name: "Corte urbano", price: 280, duration: "40 min" },
            { name: "Diseño artístico", price: 350, duration: "55 min" },
            { name: "Coloración", price: 450, duration: "60 min" }
        ],
        images: [
            "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        isFeatured: false
    }
];

// Initialize the application
const app = new ControlBarber();

// Make app accessible globally for onclick handlers
window.app = app;

// ==========================================
// Global UI Functions
// ==========================================

// User Dropdown Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }
    
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenu');
    
    if (mobileMenuBtn && mobileMenuDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOverlay?.classList.remove('hidden');
            mobileMenuDrawer.classList.remove('translate-x-full');
        });
    }
    
    if (closeMobileMenuBtn) {
        closeMobileMenuBtn.addEventListener('click', window.closeMobileMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', window.closeMobileMenu);
    }
    
    // Auth modal form handlers
    const authModalLoginForm = document.getElementById('auth-modal-login-form');
    const authModalRegisterForm = document.getElementById('auth-modal-register-form');
    
    if (authModalLoginForm) {
        authModalLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-modal-login-email').value;
            const password = document.getElementById('auth-modal-login-password').value;
            
            const result = window.authManager.login(email, password);
            if (result.success) {
                window.closeAuthModal();
                window.app?.showToast('Bienvenido de vuelta!', 'success');
                const userType = result.user.userType;
                if (userType === 'barber') {
                    window.router.navigate('barber-dashboard');
                } else {
                    window.router.navigate('client-dashboard');
                }
            } else {
                window.app?.showToast(result.error, 'error');
            }
        });
    }
    
    if (authModalRegisterForm) {
        authModalRegisterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userType = document.querySelector('input[name="auth-modal-user-type"]:checked')?.value || 'client';
            const name = document.getElementById('auth-modal-register-name').value;
            const email = document.getElementById('auth-modal-register-email').value;
            const phone = document.getElementById('auth-modal-register-phone').value;
            const password = document.getElementById('auth-modal-register-password').value;
            
            const result = window.authManager.register({ email, password, userType, name, phone });
            if (result.success) {
                // Auto login after registration
                const loginResult = window.authManager.login(email, password);
                if (loginResult.success) {
                    window.closeAuthModal();
                    window.app?.showToast('Cuenta creada exitosamente!', 'success');
                    if (userType === 'barber') {
                        window.router.navigate('barber-dashboard');
                    } else {
                        window.router.navigate('client-dashboard');
                    }
                }
            } else {
                window.app?.showToast(result.error, 'error');
            }
        });
    }
    
    // Close auth modal when clicking backdrop
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                window.closeAuthModal();
            }
        });
    }
});

// Show Auth Modal
window.showAuthModal = function(tab = 'login', userType = null) {
    const modal = document.getElementById('authModal');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userDropdown) userDropdown.classList.add('hidden');
    if (modal) {
        modal.classList.remove('hidden');
        window.switchAuthTab(tab);
        
        // Pre-select user type if provided
        if (userType && tab === 'register') {
            setTimeout(() => {
                const radio = document.querySelector(`input[name="auth-modal-user-type"][value="${userType}"]`);
                if (radio) radio.checked = true;
            }, 100);
        }
    }
};

// Close Auth Modal
window.closeAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('hidden');
};

// Switch Auth Tab
window.switchAuthTab = function(tab) {
    const loginTab = document.getElementById('auth-modal-tab-login');
    const registerTab = document.getElementById('auth-modal-tab-register');
    const loginForm = document.getElementById('auth-modal-login-form');
    const registerForm = document.getElementById('auth-modal-register-form');
    
    if (tab === 'login') {
        loginTab?.classList.add('text-primary', 'border-b-2', 'border-primary');
        loginTab?.classList.remove('text-gray-500');
        registerTab?.classList.remove('text-primary', 'border-b-2', 'border-primary');
        registerTab?.classList.add('text-gray-500');
        loginForm?.classList.remove('hidden');
        registerForm?.classList.add('hidden');
    } else {
        registerTab?.classList.add('text-primary', 'border-b-2', 'border-primary');
        registerTab?.classList.remove('text-gray-500');
        loginTab?.classList.remove('text-primary', 'border-b-2', 'border-primary');
        loginTab?.classList.add('text-gray-500');
        registerForm?.classList.remove('hidden');
        loginForm?.classList.add('hidden');
    }
};

// Close Mobile Menu
window.closeMobileMenu = function() {
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
    
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('hidden');
    if (mobileMenuDrawer) mobileMenuDrawer.classList.add('translate-x-full');
};

// Handle Nearby Click (geolocation)
window.handleNearbyClick = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                window.app?.showToast('Ubicacion obtenida. Mostrando barberos cercanos...', 'success');
                // For now, just show all barbers - in production this would filter by distance
                const navLink = document.querySelector('.nav-link[data-view="nearby"]');
                if (navLink) {
                    navLink.click();
                }
            },
            (error) => {
                window.app?.showToast('No se pudo obtener tu ubicacion', 'error');
            }
        );
    } else {
        window.app?.showToast('Tu navegador no soporta geolocalizacion', 'error');
    }
};

// Show Top Rated Barbers
window.showTopRated = function() {
    const navLink = document.querySelector('.nav-link[data-view="top-rated"]');
    if (navLink) {
        navLink.click();
    }
};

// Show Auth Tab (legacy support)
window.showAuthTab = function(tab) {
    const loginTab = document.getElementById('auth-tab-login');
    const registerTab = document.getElementById('auth-tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (tab === 'login') {
        loginTab?.classList.add('text-primary', 'border-b-2', 'border-primary');
        loginTab?.classList.remove('text-gray-500');
        registerTab?.classList.remove('text-primary', 'border-b-2', 'border-primary');
        registerTab?.classList.add('text-gray-500');
        loginForm?.classList.remove('hidden');
        registerForm?.classList.add('hidden');
    } else {
        registerTab?.classList.add('text-primary', 'border-b-2', 'border-primary');
        registerTab?.classList.remove('text-gray-500');
        loginTab?.classList.remove('text-primary', 'border-b-2', 'border-primary');
        loginTab?.classList.add('text-gray-500');
        registerForm?.classList.remove('hidden');
        loginForm?.classList.add('hidden');
    }
};