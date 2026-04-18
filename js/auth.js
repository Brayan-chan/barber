// ==========================================
// ControlBarber - Authentication Module
// ==========================================

class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.barbers = JSON.parse(localStorage.getItem('barbers')) || [];
        this.init();
    }

    init() {
        this.createDefaultBarbers();
        this.updateAuthUI();
    }

    // Create default barbers for demo
    createDefaultBarbers() {
        if (this.barbers.length === 0) {
            const defaultBarbers = [
                {
                    id: 'barber_1',
                    email: 'carlos@barbershop.com',
                    password: 'demo123',
                    userType: 'barber',
                    profile: {
                        name: 'Carlos Mendez',
                        shopName: 'Barber Kings',
                        description: 'Barberia premium con mas de 10 anos de experiencia en cortes modernos y clasicos.',
                        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                        coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=400&fit=crop',
                        phone: '+52 55 1234 5678',
                        location: {
                            address: 'Av. Insurgentes Sur 1234, Col. Del Valle',
                            city: 'Ciudad de Mexico',
                            state: 'CDMX',
                            lat: 19.3910,
                            lng: -99.1774
                        },
                        specialties: ['Fade', 'Pompadour', 'Beard Trim', 'Hot Towel Shave'],
                        rating: 4.9,
                        reviewCount: 156,
                        gallery: [
                            'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=400&fit=crop'
                        ],
                        services: [
                            { id: 's1', name: 'Corte Clasico', price: 150, duration: 30 },
                            { id: 's2', name: 'Corte + Barba', price: 250, duration: 45 },
                            { id: 's3', name: 'Fade Premium', price: 200, duration: 40 },
                            { id: 's4', name: 'Hot Towel Shave', price: 180, duration: 35 }
                        ],
                        schedule: {
                            monday: { open: '09:00', close: '20:00', available: true },
                            tuesday: { open: '09:00', close: '20:00', available: true },
                            wednesday: { open: '09:00', close: '20:00', available: true },
                            thursday: { open: '09:00', close: '20:00', available: true },
                            friday: { open: '09:00', close: '21:00', available: true },
                            saturday: { open: '10:00', close: '18:00', available: true },
                            sunday: { open: null, close: null, available: false }
                        },
                        blockedDates: [],
                        createdAt: new Date().toISOString()
                    }
                },
                {
                    id: 'barber_2',
                    email: 'miguel@urbancutz.com',
                    password: 'demo123',
                    userType: 'barber',
                    profile: {
                        name: 'Miguel Torres',
                        shopName: 'Urban Cutz',
                        description: 'Especialistas en estilos urbanos, desvanecidos y disenos personalizados.',
                        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                        coverImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=400&fit=crop',
                        phone: '+52 55 9876 5432',
                        location: {
                            address: 'Calle Reforma 567, Col. Polanco',
                            city: 'Ciudad de Mexico',
                            state: 'CDMX',
                            lat: 19.4326,
                            lng: -99.2012
                        },
                        specialties: ['Skin Fade', 'Disenos', 'Cejas', 'Line Up'],
                        rating: 4.7,
                        reviewCount: 89,
                        gallery: [
                            'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=400&h=400&fit=crop'
                        ],
                        services: [
                            { id: 's1', name: 'Corte Urban', price: 180, duration: 35 },
                            { id: 's2', name: 'Skin Fade', price: 220, duration: 45 },
                            { id: 's3', name: 'Diseno Personalizado', price: 300, duration: 60 },
                            { id: 's4', name: 'Cejas', price: 80, duration: 15 }
                        ],
                        schedule: {
                            monday: { open: '10:00', close: '19:00', available: true },
                            tuesday: { open: '10:00', close: '19:00', available: true },
                            wednesday: { open: '10:00', close: '19:00', available: true },
                            thursday: { open: '10:00', close: '19:00', available: true },
                            friday: { open: '10:00', close: '20:00', available: true },
                            saturday: { open: '09:00', close: '17:00', available: true },
                            sunday: { open: '10:00', close: '14:00', available: true }
                        },
                        blockedDates: [],
                        createdAt: new Date().toISOString()
                    }
                },
                {
                    id: 'barber_3',
                    email: 'roberto@classicbarber.com',
                    password: 'demo123',
                    userType: 'barber',
                    profile: {
                        name: 'Roberto Sanchez',
                        shopName: 'Classic Barber Shop',
                        description: 'Barberia tradicional con tecnicas clasicas y ambiente retro.',
                        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                        coverImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=400&fit=crop',
                        phone: '+52 33 5555 1234',
                        location: {
                            address: 'Av. Chapultepec 890, Col. Americana',
                            city: 'Guadalajara',
                            state: 'Jalisco',
                            lat: 20.6745,
                            lng: -103.3665
                        },
                        specialties: ['Corte Clasico', 'Navaja', 'Barbas', 'Bigote'],
                        rating: 4.8,
                        reviewCount: 234,
                        gallery: [
                            'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=400&h=400&fit=crop',
                            'https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?w=400&h=400&fit=crop'
                        ],
                        services: [
                            { id: 's1', name: 'Corte Tradicional', price: 120, duration: 25 },
                            { id: 's2', name: 'Afeitado con Navaja', price: 150, duration: 30 },
                            { id: 's3', name: 'Corte + Afeitado', price: 230, duration: 50 },
                            { id: 's4', name: 'Arreglo de Barba', price: 100, duration: 20 }
                        ],
                        schedule: {
                            monday: { open: '08:00', close: '18:00', available: true },
                            tuesday: { open: '08:00', close: '18:00', available: true },
                            wednesday: { open: '08:00', close: '18:00', available: true },
                            thursday: { open: '08:00', close: '18:00', available: true },
                            friday: { open: '08:00', close: '18:00', available: true },
                            saturday: { open: '08:00', close: '15:00', available: true },
                            sunday: { open: null, close: null, available: false }
                        },
                        blockedDates: [],
                        createdAt: new Date().toISOString()
                    }
                }
            ];

            this.barbers = defaultBarbers;
            localStorage.setItem('barbers', JSON.stringify(this.barbers));
        }
    }

    // Register new user
    register(userData) {
        const { email, password, userType, name, phone } = userData;

        // Validate email format
        if (!this.validateEmail(email)) {
            return { success: false, error: 'Email invalido' };
        }

        // Check if user already exists
        const existingUser = this.users.find(u => u.email === email);
        const existingBarber = this.barbers.find(b => b.email === email);
        
        if (existingUser || existingBarber) {
            return { success: false, error: 'Este email ya esta registrado' };
        }

        // Validate password
        if (password.length < 6) {
            return { success: false, error: 'La contrasena debe tener al menos 6 caracteres' };
        }

        const newUser = {
            id: `${userType}_${Date.now()}`,
            email,
            password,
            userType,
            createdAt: new Date().toISOString()
        };

        if (userType === 'client') {
            newUser.profile = {
                name: name || '',
                phone: phone || '',
                avatar: null,
                favorites: [],
                bookings: [],
                reviews: []
            };
            this.users.push(newUser);
            localStorage.setItem('users', JSON.stringify(this.users));
        } else if (userType === 'barber') {
            newUser.profile = {
                name: name || '',
                shopName: '',
                description: '',
                avatar: null,
                coverImage: null,
                phone: phone || '',
                location: {
                    address: '',
                    city: '',
                    state: '',
                    lat: null,
                    lng: null
                },
                specialties: [],
                rating: 0,
                reviewCount: 0,
                gallery: [],
                services: [],
                schedule: {
                    monday: { open: '09:00', close: '18:00', available: true },
                    tuesday: { open: '09:00', close: '18:00', available: true },
                    wednesday: { open: '09:00', close: '18:00', available: true },
                    thursday: { open: '09:00', close: '18:00', available: true },
                    friday: { open: '09:00', close: '18:00', available: true },
                    saturday: { open: '09:00', close: '14:00', available: true },
                    sunday: { open: null, close: null, available: false }
                },
                blockedDates: [],
                appointments: [],
                clients: []
            };
            this.barbers.push(newUser);
            localStorage.setItem('barbers', JSON.stringify(this.barbers));
        }

        return { success: true, user: newUser };
    }

    // Login user
    login(email, password) {
        // Check in users (clients)
        let user = this.users.find(u => u.email === email && u.password === password);
        
        // Check in barbers
        if (!user) {
            user = this.barbers.find(b => b.email === email && b.password === password);
        }

        if (!user) {
            return { success: false, error: 'Email o contrasena incorrectos' };
        }

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.updateAuthUI();

        return { success: true, user };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateAuthUI();
        
        // Redirect to home
        if (typeof window.router !== 'undefined') {
            window.router.navigate('home');
        } else {
            window.location.reload();
        }
    }

    // Update profile
    updateProfile(profileData) {
        if (!this.currentUser) {
            return { success: false, error: 'No hay sesion activa' };
        }

        if (this.currentUser.userType === 'client') {
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex].profile = { ...this.users[userIndex].profile, ...profileData };
                this.currentUser = this.users[userIndex];
                localStorage.setItem('users', JSON.stringify(this.users));
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
        } else if (this.currentUser.userType === 'barber') {
            const barberIndex = this.barbers.findIndex(b => b.id === this.currentUser.id);
            if (barberIndex !== -1) {
                this.barbers[barberIndex].profile = { ...this.barbers[barberIndex].profile, ...profileData };
                this.currentUser = this.barbers[barberIndex];
                localStorage.setItem('barbers', JSON.stringify(this.barbers));
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
        }

        return { success: true };
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user type
    getUserType() {
        return this.currentUser?.userType || null;
    }

    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Update UI based on auth state
    updateAuthUI() {
        const userMenuBtn = document.getElementById('user-menu-btn');
        const dropdownGuest = document.getElementById('dropdown-guest');
        const dropdownClient = document.getElementById('dropdown-client');
        const dropdownBarber = document.getElementById('dropdown-barber');
        const mobileUserSection = document.getElementById('mobile-user-section');
        
        if (this.currentUser) {
            const displayName = this.currentUser.profile?.name || this.currentUser.email.split('@')[0];
            const avatar = this.currentUser.profile?.avatar;
            const userType = this.currentUser.userType;
            const userTypeLabel = userType === 'barber' ? 'Barbero' : 'Cliente';
            const shopName = this.currentUser.profile?.shopName || 'Mi Barberia';

            // Update main button
            if (userMenuBtn) {
                const bgColor = userType === 'barber' ? 'bg-barber' : 'bg-primary';
                userMenuBtn.innerHTML = `
                    <div class="h-8 w-8 rounded-full overflow-hidden ${bgColor} flex items-center justify-center">
                        ${avatar 
                            ? `<img src="${avatar}" alt="${displayName}" class="w-full h-full object-cover">`
                            : `<span class="text-white font-medium text-sm">${displayName.charAt(0).toUpperCase()}</span>`
                        }
                    </div>
                    <div class="text-left hidden lg:block">
                        <span class="font-medium text-sm block">${displayName}</span>
                        <span class="text-xs text-gray-500">${userTypeLabel}</span>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 text-xs hidden lg:block"></i>
                `;
            }

            // Show appropriate dropdown section
            if (dropdownGuest) dropdownGuest.classList.add('hidden');
            
            if (userType === 'client') {
                if (dropdownClient) {
                    dropdownClient.classList.remove('hidden');
                    const clientAvatar = document.getElementById('dropdown-client-avatar');
                    const clientName = document.getElementById('dropdown-client-name');
                    if (clientAvatar) {
                        clientAvatar.innerHTML = avatar 
                            ? `<img src="${avatar}" alt="${displayName}" class="w-full h-full object-cover rounded-full">`
                            : `<span class="text-white font-bold text-lg">${displayName.charAt(0).toUpperCase()}</span>`;
                    }
                    if (clientName) clientName.textContent = displayName;
                }
                if (dropdownBarber) dropdownBarber.classList.add('hidden');
            } else if (userType === 'barber') {
                if (dropdownBarber) {
                    dropdownBarber.classList.remove('hidden');
                    const barberAvatar = document.getElementById('dropdown-barber-avatar');
                    const barberName = document.getElementById('dropdown-barber-name');
                    const barberShop = document.getElementById('dropdown-barber-shop');
                    if (barberAvatar) {
                        barberAvatar.innerHTML = avatar 
                            ? `<img src="${avatar}" alt="${displayName}" class="w-full h-full object-cover rounded-full">`
                            : `<span class="text-white font-bold text-lg">${displayName.charAt(0).toUpperCase()}</span>`;
                    }
                    if (barberName) barberName.textContent = displayName;
                    if (barberShop) barberShop.textContent = shopName;
                    
                    // Update pending appointments badge
                    this.updatePendingBadge();
                }
                if (dropdownClient) dropdownClient.classList.add('hidden');
            }

            // Update mobile menu user section
            if (mobileUserSection) {
                mobileUserSection.innerHTML = `
                    <div class="flex items-center gap-3 mb-4">
                        <div class="h-12 w-12 rounded-full overflow-hidden ${userType === 'barber' ? 'bg-barber' : 'bg-primary'} flex items-center justify-center">
                            ${avatar 
                                ? `<img src="${avatar}" alt="${displayName}" class="w-full h-full object-cover">`
                                : `<span class="text-white font-bold text-lg">${displayName.charAt(0).toUpperCase()}</span>`
                            }
                        </div>
                        <div>
                            <p class="font-semibold text-gray-800">${displayName}</p>
                            <p class="text-xs ${userType === 'barber' ? 'text-barber' : 'text-primary'} font-medium">${userTypeLabel}</p>
                        </div>
                    </div>
                    <div class="space-y-1">
                        ${userType === 'barber' ? `
                            <button onclick="window.router.navigate('barber-dashboard'); window.closeMobileMenu();" class="w-full px-3 py-2 text-left hover:bg-gray-100 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                                <i class="fas fa-chart-line w-4 text-gray-400"></i> Mi Dashboard
                            </button>
                        ` : `
                            <button onclick="window.router.navigate('client-dashboard'); window.closeMobileMenu();" class="w-full px-3 py-2 text-left hover:bg-gray-100 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                                <i class="fas fa-home w-4 text-gray-400"></i> Mi Panel
                            </button>
                        `}
                        <button onclick="window.authManager.logout(); window.closeMobileMenu();" class="w-full px-3 py-2 text-left hover:bg-red-50 rounded-lg text-sm text-red-600 flex items-center gap-2">
                            <i class="fas fa-sign-out-alt w-4"></i> Cerrar Sesion
                        </button>
                    </div>
                `;
            }
        } else {
            // Not logged in
            if (userMenuBtn) {
                userMenuBtn.innerHTML = `
                    <div class="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-gray-600"></i>
                    </div>
                    <span class="font-medium hidden lg:block">Iniciar sesion</span>
                `;
            }

            // Show guest dropdown
            if (dropdownGuest) dropdownGuest.classList.remove('hidden');
            if (dropdownClient) dropdownClient.classList.add('hidden');
            if (dropdownBarber) dropdownBarber.classList.add('hidden');

            // Update mobile menu
            if (mobileUserSection) {
                mobileUserSection.innerHTML = `
                    <p class="text-sm text-gray-600 mb-3">Inicia sesion para acceder a todas las funciones</p>
                    <div class="space-y-2">
                        <button onclick="window.showAuthModal('login', 'client'); window.closeMobileMenu();" class="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-sm transition-colors">
                            Soy Cliente
                        </button>
                        <button onclick="window.showAuthModal('login', 'barber'); window.closeMobileMenu();" class="w-full px-4 py-2 bg-barber hover:bg-opacity-90 text-white rounded-lg font-medium text-sm transition-colors">
                            Soy Barbero
                        </button>
                    </div>
                `;
            }
        }
    }

    // Update pending appointments badge
    updatePendingBadge() {
        const badge = document.getElementById('pending-appointments-badge');
        if (badge && this.currentUser?.userType === 'barber') {
            const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const pendingCount = allBookings.filter(b => b.barberId === this.currentUser.id && b.status === 'pending').length;
            if (pendingCount > 0) {
                badge.textContent = pendingCount;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    // Get all barbers
    getAllBarbers() {
        return this.barbers.map(b => ({
            id: b.id,
            ...b.profile
        }));
    }

    // Get barber by ID
    getBarberById(id) {
        const barber = this.barbers.find(b => b.id === id);
        if (barber) {
            return {
                id: barber.id,
                email: barber.email,
                ...barber.profile
            };
        }
        return null;
    }

    // Search barbers
    searchBarbers(query, filters = {}) {
        let results = this.getAllBarbers();

        // Text search
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(b => 
                b.name?.toLowerCase().includes(q) ||
                b.shopName?.toLowerCase().includes(q) ||
                b.location?.city?.toLowerCase().includes(q) ||
                b.specialties?.some(s => s.toLowerCase().includes(q))
            );
        }

        // Filter by city
        if (filters.city) {
            results = results.filter(b => 
                b.location?.city?.toLowerCase() === filters.city.toLowerCase()
            );
        }

        // Filter by specialty
        if (filters.specialty) {
            results = results.filter(b => 
                b.specialties?.some(s => s.toLowerCase().includes(filters.specialty.toLowerCase()))
            );
        }

        // Filter by rating
        if (filters.minRating) {
            results = results.filter(b => b.rating >= filters.minRating);
        }

        // Sort
        if (filters.sortBy === 'rating') {
            results.sort((a, b) => b.rating - a.rating);
        } else if (filters.sortBy === 'reviews') {
            results.sort((a, b) => b.reviewCount - a.reviewCount);
        } else if (filters.sortBy === 'price') {
            results.sort((a, b) => {
                const aMin = Math.min(...(a.services?.map(s => s.price) || [0]));
                const bMin = Math.min(...(b.services?.map(s => s.price) || [0]));
                return aMin - bMin;
            });
        }

        return results;
    }
}

// Initialize auth manager globally
window.authManager = new AuthManager();