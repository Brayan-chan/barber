// ==========================================
// ControlBarber - Router Module
// ==========================================

class Router {
    constructor() {
        this.routes = {
            'home': this.showHome,
            'auth': this.showAuth,
            'client-dashboard': this.showClientDashboard,
            'barber-dashboard': this.showBarberDashboard,
            'barber-profile': this.showBarberProfile,
            'booking': this.showBooking,
            'search': this.showSearch,
            'ai-advisor': this.showAIAdvisor
        };
        this.currentRoute = 'home';
        this.init();
    }

    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.route) {
                this.navigate(e.state.route, e.state.params, false);
            }
        });

        // Check initial route from URL hash
        const hash = window.location.hash.slice(1);
        if (hash && this.routes[hash]) {
            this.navigate(hash);
        }
    }

    navigate(route, params = {}, pushState = true) {
        if (!this.routes[route]) {
            console.error('Route not found:', route);
            return;
        }

        // Check auth requirements
        if (this.requiresAuth(route) && !window.authManager?.isLoggedIn()) {
            this.navigate('auth', { redirect: route });
            return;
        }

        // Check role requirements
        if (this.requiresRole(route)) {
            const requiredRole = this.requiresRole(route);
            const userRole = window.authManager?.getUserType();
            if (userRole !== requiredRole) {
                window.app?.showToast('No tienes acceso a esta seccion', 'error');
                return;
            }
        }

        this.currentRoute = route;
        this.currentParams = params;

        if (pushState) {
            window.history.pushState({ route, params }, '', `#${route}`);
        }

        // Hide all sections
        this.hideAllSections();

        // Show requested section
        this.routes[route].call(this, params);

        // Update navigation
        this.updateNavigation(route);

        // Scroll to top
        window.scrollTo(0, 0);
    }

    requiresAuth(route) {
        const authRoutes = ['client-dashboard', 'barber-dashboard', 'booking'];
        return authRoutes.includes(route);
    }

    requiresRole(route) {
        const roleRoutes = {
            'client-dashboard': 'client',
            'barber-dashboard': 'barber'
        };
        return roleRoutes[route] || null;
    }

    hideAllSections() {
        const sections = [
            'home-section',
            'auth-section',
            'client-dashboard-section',
            'barber-dashboard-section',
            'barber-profile-section',
            'booking-section',
            'search-section',
            'ai-advisor-section',
            'barbers-section'
        ];

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
    }

    showHome() {
        const section = document.getElementById('home-section');
        if (section) section.classList.remove('hidden');
        
        // Show AI advisor by default on home
        const aiSection = document.getElementById('ai-advisor-section');
        if (aiSection) aiSection.classList.remove('hidden');
        const barbersSection = document.getElementById('barbers-section');
        if (barbersSection) barbersSection.classList.add('hidden');

        // Load popular barbers
        if (window.app) {
            window.app.loadBarbers();
        }
    }

    showAuth(params = {}) {
        let section = document.getElementById('auth-section');
        if (!section) {
            this.createAuthSection();
            section = document.getElementById('auth-section');
        }
        section.classList.remove('hidden');

        // Show appropriate tab
        if (params.tab === 'register') {
            document.getElementById('auth-tab-register')?.click();
        }
        if (params.userType) {
            setTimeout(() => {
                const userTypeSelect = document.getElementById('register-user-type');
                if (userTypeSelect) userTypeSelect.value = params.userType;
            }, 100);
        }
    }

    showClientDashboard() {
        let section = document.getElementById('client-dashboard-section');
        if (!section) {
            this.createClientDashboard();
            section = document.getElementById('client-dashboard-section');
        }
        section.classList.remove('hidden');
        
        if (window.clientDashboard) {
            window.clientDashboard.loadData();
        }
    }

    showBarberDashboard() {
        let section = document.getElementById('barber-dashboard-section');
        if (!section) {
            this.createBarberDashboard();
            section = document.getElementById('barber-dashboard-section');
        }
        section.classList.remove('hidden');
        
        if (window.barberDashboard) {
            window.barberDashboard.loadData();
        }
    }

    showBarberProfile(params = {}) {
        let section = document.getElementById('barber-profile-section');
        if (!section) {
            this.createBarberProfileSection();
            section = document.getElementById('barber-profile-section');
        }
        section.classList.remove('hidden');
        
        if (params.id && window.barberProfile) {
            window.barberProfile.loadBarber(params.id);
        }
    }

    showBooking(params = {}) {
        let section = document.getElementById('booking-section');
        if (!section) {
            this.createBookingSection();
            section = document.getElementById('booking-section');
        }
        section.classList.remove('hidden');
        
        if (params.barberId && window.bookingManager) {
            window.bookingManager.init(params.barberId, params.serviceId);
        }
    }

    showSearch(params = {}) {
        let section = document.getElementById('search-section');
        if (!section) {
            this.createSearchSection();
            section = document.getElementById('search-section');
        }
        section.classList.remove('hidden');
        
        if (window.searchManager) {
            window.searchManager.search(params.query, params.filters);
        }
    }

    showAIAdvisor() {
        const homeSection = document.getElementById('home-section');
        if (homeSection) homeSection.classList.remove('hidden');
        const section = document.getElementById('ai-advisor-section');
        if (section) section.classList.remove('hidden');
        const barbersSection = document.getElementById('barbers-section');
        if (barbersSection) barbersSection.classList.add('hidden');
    }

    updateNavigation(route) {
        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'border-b-2', 'border-primary', 'text-primary');
            link.classList.add('text-gray-700');
        });

        const activeLink = document.querySelector(`.nav-link[data-view="${route}"]`);
        if (activeLink) {
            activeLink.classList.add('active', 'border-b-2', 'border-primary', 'text-primary');
            activeLink.classList.remove('text-gray-700');
        }
    }

    // Create Auth Section HTML
    createAuthSection() {
        const section = document.createElement('section');
        section.id = 'auth-section';
        section.className = 'hidden';
        section.innerHTML = `
            <div class="min-h-[80vh] flex items-center justify-center py-12 px-4">
                <div class="max-w-md w-full">
                    <div class="bg-white rounded-2xl shadow-xl p-8">
                        <!-- Logo -->
                        <div class="text-center mb-8">
                            <div class="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-cut text-white text-2xl"></i>
                            </div>
                            <h2 class="text-2xl font-bold text-gray-800">ControlBarber</h2>
                            <p class="text-gray-600 mt-2">Conectamos clientes con los mejores barberos</p>
                        </div>

                        <!-- Tabs -->
                        <div class="flex border-b border-gray-200 mb-6">
                            <button id="auth-tab-login" class="flex-1 py-3 text-center font-medium text-primary border-b-2 border-primary" onclick="window.showAuthTab('login')">
                                Iniciar Sesion
                            </button>
                            <button id="auth-tab-register" class="flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700" onclick="window.showAuthTab('register')">
                                Registrarse
                            </button>
                        </div>

                        <!-- Login Form -->
                        <form id="login-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-envelope text-gray-400"></i>
                                    </div>
                                    <input type="email" id="login-email" required
                                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="tu@email.com">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-lock text-gray-400"></i>
                                    </div>
                                    <input type="password" id="login-password" required
                                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Tu contrasena">
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="flex items-center">
                                    <input type="checkbox" class="custom-checkbox mr-2">
                                    <span class="text-sm text-gray-600">Recordarme</span>
                                </label>
                                <a href="#" class="text-sm text-primary hover:underline">Olvide mi contrasena</a>
                            </div>
                            <button type="submit" class="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                                Iniciar Sesion
                            </button>
                        </form>

                        <!-- Register Form -->
                        <form id="register-form" class="space-y-4 hidden">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de cuenta</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="user-type" value="client" class="peer sr-only" checked>
                                        <div class="p-4 border-2 border-gray-200 rounded-xl text-center peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                                            <i class="fas fa-user text-2xl text-gray-600 peer-checked:text-primary mb-2"></i>
                                            <p class="font-medium">Cliente</p>
                                            <p class="text-xs text-gray-500">Busco barberos</p>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="user-type" value="barber" class="peer sr-only">
                                        <div class="p-4 border-2 border-gray-200 rounded-xl text-center peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                                            <i class="fas fa-cut text-2xl text-gray-600 peer-checked:text-primary mb-2"></i>
                                            <p class="font-medium">Barbero</p>
                                            <p class="text-xs text-gray-500">Ofrezco servicios</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-user text-gray-400"></i>
                                    </div>
                                    <input type="text" id="register-name" required
                                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Tu nombre">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-envelope text-gray-400"></i>
                                    </div>
                                    <input type="email" id="register-email" required
                                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="tu@email.com">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-phone text-gray-400"></i>
                                    </div>
                                    <input type="tel" id="register-phone"
                                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="+52 55 1234 5678">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-lock text-gray-400"></i>
                                    </div>
                                    <input type="password" id="register-password" required minlength="6"
                                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Minimo 6 caracteres">
                                </div>
                            </div>
                            <div>
                                <label class="flex items-start">
                                    <input type="checkbox" required class="custom-checkbox mr-2 mt-1">
                                    <span class="text-sm text-gray-600">Acepto los <a href="#" class="text-primary hover:underline">terminos y condiciones</a> y la <a href="#" class="text-primary hover:underline">politica de privacidad</a></span>
                                </label>
                            </div>
                            <button type="submit" class="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                                Crear cuenta
                            </button>
                        </form>

                        <!-- Social Login -->
                        <div class="mt-6">
                            <div class="relative">
                                <div class="absolute inset-0 flex items-center">
                                    <div class="w-full border-t border-gray-200"></div>
                                </div>
                                <div class="relative flex justify-center text-sm">
                                    <span class="px-4 bg-white text-gray-500">O continua con</span>
                                </div>
                            </div>
                            <button class="mt-4 w-full py-3 border border-gray-300 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                                <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5">
                                Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.querySelector('main').appendChild(section);
        this.setupAuthListeners();
    }

    setupAuthListeners() {
        // Login form
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const result = window.authManager.login(email, password);
            if (result.success) {
                window.app?.showToast('Bienvenido de vuelta!', 'success');
                const userType = result.user.userType;
                this.navigate(userType === 'barber' ? 'barber-dashboard' : 'home');
            } else {
                window.app?.showToast(result.error, 'error');
            }
        });

        // Register form
        document.getElementById('register-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const userType = document.querySelector('input[name="user-type"]:checked')?.value || 'client';
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value;
            const password = document.getElementById('register-password').value;
            
            const result = window.authManager.register({ email, password, userType, name, phone });
            if (result.success) {
                window.app?.showToast('Cuenta creada exitosamente!', 'success');
                // Auto login
                window.authManager.login(email, password);
                this.navigate(userType === 'barber' ? 'barber-dashboard' : 'home');
            } else {
                window.app?.showToast(result.error, 'error');
            }
        });
    }

    createClientDashboard() {
        const section = document.createElement('section');
        section.id = 'client-dashboard-section';
        section.className = 'hidden';
        section.innerHTML = `<div id="client-dashboard-content"></div>`;
        document.querySelector('main').appendChild(section);
        
        // Initialize client dashboard module
        if (typeof ClientDashboard !== 'undefined') {
            window.clientDashboard = new ClientDashboard();
        }
    }

    createBarberDashboard() {
        const section = document.createElement('section');
        section.id = 'barber-dashboard-section';
        section.className = 'hidden';
        section.innerHTML = `<div id="barber-dashboard-content"></div>`;
        document.querySelector('main').appendChild(section);
        
        // Initialize barber dashboard module
        if (typeof BarberDashboard !== 'undefined') {
            window.barberDashboard = new BarberDashboard();
        }
    }

    createBarberProfileSection() {
        const section = document.createElement('section');
        section.id = 'barber-profile-section';
        section.className = 'hidden';
        section.innerHTML = `<div id="barber-profile-content"></div>`;
        document.querySelector('main').appendChild(section);
    }

    createBookingSection() {
        const section = document.createElement('section');
        section.id = 'booking-section';
        section.className = 'hidden';
        section.innerHTML = `<div id="booking-content"></div>`;
        document.querySelector('main').appendChild(section);
    }

    createSearchSection() {
        const section = document.createElement('section');
        section.id = 'search-section';
        section.className = 'hidden';
        section.innerHTML = `<div id="search-content"></div>`;
        document.querySelector('main').appendChild(section);
    }
}

// Helper function for auth tabs
window.showAuthTab = function(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('auth-tab-login');
    const registerTab = document.getElementById('auth-tab-register');

    if (tab === 'login') {
        loginForm?.classList.remove('hidden');
        registerForm?.classList.add('hidden');
        loginTab?.classList.add('text-primary', 'border-b-2', 'border-primary');
        loginTab?.classList.remove('text-gray-500');
        registerTab?.classList.remove('text-primary', 'border-b-2', 'border-primary');
        registerTab?.classList.add('text-gray-500');
    } else {
        loginForm?.classList.add('hidden');
        registerForm?.classList.remove('hidden');
        registerTab?.classList.add('text-primary', 'border-b-2', 'border-primary');
        registerTab?.classList.remove('text-gray-500');
        loginTab?.classList.remove('text-primary', 'border-b-2', 'border-primary');
        loginTab?.classList.add('text-gray-500');
    }
};

// Initialize router globally
window.router = new Router();
