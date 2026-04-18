// ==========================================
// ControlBarber - Public Barber Profile Module
// ==========================================

class BarberProfile {
    constructor() {
        this.barber = null;
        this.reviews = [];
    }

    loadBarber(barberId) {
        this.barber = window.authManager?.getBarberById(barberId);
        this.reviews = JSON.parse(localStorage.getItem('reviews') || '[]').filter(r => r.barberId === barberId);
        this.render();
    }

    render() {
        const container = document.getElementById('barber-profile-content');
        if (!container || !this.barber) {
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-20">
                        <i class="fas fa-user-slash text-gray-400 text-5xl mb-4"></i>
                        <h2 class="text-xl font-bold text-gray-800 mb-2">Barbero no encontrado</h2>
                        <p class="text-gray-600 mb-4">El perfil que buscas no existe o ha sido eliminado</p>
                        <button onclick="window.router.navigate('home')" class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                            Volver al inicio
                        </button>
                    </div>
                `;
            }
            return;
        }

        const isFavorite = this.checkIsFavorite();
        const isOwner = window.authManager?.currentUser?.id === this.barber.id;

        container.innerHTML = `
            <div class="max-w-5xl mx-auto">
                <!-- Back Button -->
                <button onclick="window.history.back()" class="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <i class="fas fa-arrow-left"></i>
                    <span>Volver</span>
                </button>

                <!-- Cover Image -->
                <div class="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-barber to-primary mb-20">
                    ${this.barber.coverImage 
                        ? `<img src="${this.barber.coverImage}" alt="Cover" class="w-full h-full object-cover">`
                        : ''
                    }
                    
                    <!-- Profile Picture -->
                    <div class="absolute -bottom-16 left-6 md:left-10">
                        <div class="h-32 w-32 rounded-2xl bg-white p-1 shadow-xl">
                            <div class="h-full w-full rounded-xl overflow-hidden bg-gray-200">
                                ${this.barber.avatar 
                                    ? `<img src="${this.barber.avatar}" alt="${this.barber.name}" class="w-full h-full object-cover">`
                                    : `<div class="w-full h-full flex items-center justify-center bg-primary"><i class="fas fa-user text-white text-4xl"></i></div>`
                                }
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="absolute bottom-4 right-4 flex gap-2">
                        ${!isOwner ? `
                            <button onclick="window.barberProfile.toggleFavorite()" class="h-10 w-10 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} flex items-center justify-center shadow hover:scale-105 transition-all">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button onclick="window.barberProfile.shareProfile()" class="h-10 w-10 rounded-full bg-white text-gray-600 flex items-center justify-center shadow hover:scale-105 transition-all">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Profile Info -->
                <div class="px-4 md:px-0">
                    <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800">${this.barber.shopName || 'Barberia'}</h1>
                            <p class="text-lg text-gray-600">${this.barber.name}</p>
                            <div class="flex items-center gap-4 mt-2">
                                <div class="flex items-center gap-1">
                                    <div class="flex items-center text-amber-500">
                                        ${Array(5).fill(0).map((_, i) => `
                                            <i class="fas fa-star ${i < Math.floor(this.barber.rating || 0) ? 'text-amber-500' : 'text-gray-300'} text-sm"></i>
                                        `).join('')}
                                    </div>
                                    <span class="font-bold text-gray-800">${this.barber.rating || 0}</span>
                                    <span class="text-gray-500">(${this.barber.reviewCount || 0} resenas)</span>
                                </div>
                                ${this.barber.location?.city ? `
                                    <span class="text-gray-500">
                                        <i class="fas fa-map-marker-alt mr-1"></i>
                                        ${this.barber.location.city}
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                        
                        ${!isOwner ? `
                            <div class="mt-4 md:mt-0">
                                <button onclick="window.router.navigate('booking', {barberId: '${this.barber.id}'})" class="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                                    <i class="fas fa-calendar-plus"></i>
                                    Reservar cita
                                </button>
                            </div>
                        ` : `
                            <div class="mt-4 md:mt-0">
                                <button onclick="window.router.navigate('barber-dashboard')" class="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                                    <i class="fas fa-cog"></i>
                                    Editar mi perfil
                                </button>
                            </div>
                        `}
                    </div>

                    <!-- Description -->
                    ${this.barber.description ? `
                        <p class="text-gray-600 mb-6 leading-relaxed">${this.barber.description}</p>
                    ` : ''}

                    <!-- Specialties -->
                    ${this.barber.specialties?.length > 0 ? `
                        <div class="flex flex-wrap gap-2 mb-8">
                            ${this.barber.specialties.map(s => `
                                <span class="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">${s}</span>
                            `).join('')}
                        </div>
                    ` : ''}

                    <!-- Tabs -->
                    <div class="border-b border-gray-200 mb-6">
                        <nav class="flex gap-8">
                            <button onclick="window.barberProfile.showTab('services')" class="profile-tab active py-4 font-medium text-primary border-b-2 border-primary" data-tab="services">
                                Servicios
                            </button>
                            <button onclick="window.barberProfile.showTab('gallery')" class="profile-tab py-4 font-medium text-gray-500 hover:text-gray-700" data-tab="gallery">
                                Galeria
                            </button>
                            <button onclick="window.barberProfile.showTab('reviews')" class="profile-tab py-4 font-medium text-gray-500 hover:text-gray-700" data-tab="reviews">
                                Resenas (${this.reviews.length})
                            </button>
                            <button onclick="window.barberProfile.showTab('info')" class="profile-tab py-4 font-medium text-gray-500 hover:text-gray-700" data-tab="info">
                                Informacion
                            </button>
                        </nav>
                    </div>

                    <!-- Tab Content -->
                    <div id="profile-tab-content">
                        ${this.renderServices()}
                    </div>
                </div>
            </div>
        `;
    }

    renderServices() {
        const services = this.barber.services || [];
        const isOwner = window.authManager?.currentUser?.id === this.barber.id;

        if (services.length === 0) {
            return `
                <div class="text-center py-12 bg-gray-50 rounded-xl">
                    <i class="fas fa-cut text-gray-400 text-4xl mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Sin servicios configurados</h3>
                    <p class="text-gray-600">Este barbero aun no ha agregado sus servicios</p>
                </div>
            `;
        }

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${services.map(service => `
                    <div class="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <i class="fas fa-cut text-primary text-xl"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-800">${service.name}</h3>
                                <p class="text-sm text-gray-500">${service.duration} min</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-xl font-bold text-primary">$${service.price}</span>
                            ${!isOwner ? `
                                <button onclick="window.router.navigate('booking', {barberId: '${this.barber.id}', serviceId: '${service.id}'})" 
                                    class="block mt-1 text-sm text-primary hover:underline">
                                    Reservar
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderGallery() {
        const gallery = this.barber.gallery || [];

        if (gallery.length === 0) {
            return `
                <div class="text-center py-12 bg-gray-50 rounded-xl">
                    <i class="fas fa-images text-gray-400 text-4xl mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Sin imagenes en la galeria</h3>
                    <p class="text-gray-600">Este barbero aun no ha subido fotos de sus trabajos</p>
                </div>
            `;
        }

        return `
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${gallery.map((img, index) => `
                    <div class="aspect-square rounded-xl overflow-hidden bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity" 
                        onclick="window.barberProfile.openLightbox(${index})">
                        <img src="${img}" alt="Trabajo ${index + 1}" class="w-full h-full object-cover">
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderReviews() {
        if (this.reviews.length === 0) {
            return `
                <div class="text-center py-12 bg-gray-50 rounded-xl">
                    <i class="fas fa-star text-gray-400 text-4xl mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Sin resenas aun</h3>
                    <p class="text-gray-600">Se el primero en dejar una resena despues de tu cita</p>
                </div>
            `;
        }

        const avgRating = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;

        return `
            <!-- Rating Summary -->
            <div class="bg-gray-50 rounded-xl p-6 mb-6">
                <div class="flex items-center gap-6">
                    <div class="text-center">
                        <span class="text-5xl font-bold text-gray-800">${avgRating.toFixed(1)}</span>
                        <div class="flex items-center justify-center mt-1 text-amber-500">
                            ${Array(5).fill(0).map((_, i) => `
                                <i class="fas fa-star ${i < Math.floor(avgRating) ? 'text-amber-500' : 'text-gray-300'}"></i>
                            `).join('')}
                        </div>
                        <p class="text-sm text-gray-500 mt-1">${this.reviews.length} resenas</p>
                    </div>
                    <div class="flex-1">
                        ${[5, 4, 3, 2, 1].map(stars => {
                            const count = this.reviews.filter(r => r.rating === stars).length;
                            const percentage = (count / this.reviews.length) * 100;
                            return `
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-sm text-gray-600 w-8">${stars} <i class="fas fa-star text-amber-500 text-xs"></i></span>
                                    <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div class="h-full bg-amber-500 rounded-full" style="width: ${percentage}%"></div>
                                    </div>
                                    <span class="text-sm text-gray-500 w-8">${count}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>

            <!-- Review List -->
            <div class="space-y-4">
                ${this.reviews.map(review => `
                    <div class="bg-white border border-gray-200 rounded-xl p-4">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex items-center gap-3">
                                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span class="text-primary font-bold">${(review.clientName || 'C').charAt(0)}</span>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-800">${review.clientName || 'Cliente'}</h4>
                                    <p class="text-xs text-gray-500">${new Date(review.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div class="flex items-center text-amber-500">
                                ${Array(5).fill(0).map((_, i) => `
                                    <i class="fas fa-star ${i < review.rating ? 'text-amber-500' : 'text-gray-300'} text-sm"></i>
                                `).join('')}
                            </div>
                        </div>
                        <p class="text-gray-700">${review.comment}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderInfo() {
        const schedule = this.barber.schedule || {};
        const days = [
            { key: 'monday', label: 'Lunes' },
            { key: 'tuesday', label: 'Martes' },
            { key: 'wednesday', label: 'Miercoles' },
            { key: 'thursday', label: 'Jueves' },
            { key: 'friday', label: 'Viernes' },
            { key: 'saturday', label: 'Sabado' },
            { key: 'sunday', label: 'Domingo' }
        ];

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Contact Info -->
                <div class="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-address-card text-primary mr-2"></i>
                        Contacto
                    </h3>
                    <div class="space-y-3">
                        ${this.barber.phone ? `
                            <div class="flex items-center gap-3">
                                <i class="fas fa-phone text-gray-400 w-5"></i>
                                <a href="tel:${this.barber.phone}" class="text-primary hover:underline">${this.barber.phone}</a>
                            </div>
                        ` : ''}
                        ${this.barber.location?.address ? `
                            <div class="flex items-start gap-3">
                                <i class="fas fa-map-marker-alt text-gray-400 w-5 mt-1"></i>
                                <div>
                                    <p class="text-gray-700">${this.barber.location.address}</p>
                                    <p class="text-gray-500">${this.barber.location.city}, ${this.barber.location.state}</p>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Schedule -->
                <div class="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-clock text-primary mr-2"></i>
                        Horario
                    </h3>
                    <div class="space-y-2">
                        ${days.map(day => {
                            const daySchedule = schedule[day.key];
                            const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day.key;
                            
                            return `
                                <div class="flex items-center justify-between py-1 ${isToday ? 'font-semibold' : ''}">
                                    <span class="${isToday ? 'text-primary' : 'text-gray-700'}">${day.label}</span>
                                    ${daySchedule?.available 
                                        ? `<span class="text-gray-600">${daySchedule.open} - ${daySchedule.close}</span>`
                                        : `<span class="text-red-500">Cerrado</span>`
                                    }
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    showTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.classList.remove('active', 'text-primary', 'border-b-2', 'border-primary');
            tab.classList.add('text-gray-500');
        });
        
        const activeTab = document.querySelector(`.profile-tab[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active', 'text-primary', 'border-b-2', 'border-primary');
            activeTab.classList.remove('text-gray-500');
        }

        // Update content
        const contentContainer = document.getElementById('profile-tab-content');
        if (contentContainer) {
            switch (tabName) {
                case 'services':
                    contentContainer.innerHTML = this.renderServices();
                    break;
                case 'gallery':
                    contentContainer.innerHTML = this.renderGallery();
                    break;
                case 'reviews':
                    contentContainer.innerHTML = this.renderReviews();
                    break;
                case 'info':
                    contentContainer.innerHTML = this.renderInfo();
                    break;
            }
        }
    }

    checkIsFavorite() {
        const user = window.authManager?.currentUser;
        if (!user || user.userType !== 'client') return false;
        return user.profile?.favorites?.includes(this.barber.id) || false;
    }

    toggleFavorite() {
        if (!window.authManager?.isLoggedIn()) {
            window.app?.showToast('Inicia sesion para guardar favoritos', 'error');
            window.router.navigate('auth');
            return;
        }

        if (window.authManager?.getUserType() !== 'client') {
            window.app?.showToast('Solo los clientes pueden guardar favoritos', 'error');
            return;
        }

        if (window.clientDashboard) {
            const isFavorite = this.checkIsFavorite();
            if (isFavorite) {
                window.clientDashboard.removeFavorite(this.barber.id);
            } else {
                window.clientDashboard.addFavorite(this.barber.id);
            }
            this.render();
        }
    }

    shareProfile() {
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: this.barber.shopName,
                text: `Mira este barbero en ControlBarber: ${this.barber.shopName}`,
                url: url
            });
        } else {
            navigator.clipboard.writeText(url);
            window.app?.showToast('Enlace copiado al portapapeles', 'success');
        }
    }

    openLightbox(index) {
        const gallery = this.barber.gallery || [];
        if (gallery.length === 0) return;

        const modal = document.createElement('div');
        modal.id = 'lightbox-modal';
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center';
        modal.innerHTML = `
            <button onclick="document.getElementById('lightbox-modal').remove()" class="absolute top-4 right-4 text-white/70 hover:text-white text-3xl">
                <i class="fas fa-times"></i>
            </button>
            <button onclick="window.barberProfile.lightboxPrev()" class="absolute left-4 text-white/70 hover:text-white text-3xl">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button onclick="window.barberProfile.lightboxNext()" class="absolute right-4 text-white/70 hover:text-white text-3xl">
                <i class="fas fa-chevron-right"></i>
            </button>
            <img id="lightbox-image" src="${gallery[index]}" alt="Gallery image" class="max-w-[90vw] max-h-[90vh] object-contain">
        `;
        document.body.appendChild(modal);
        this.currentLightboxIndex = index;
    }

    lightboxPrev() {
        const gallery = this.barber.gallery || [];
        this.currentLightboxIndex = (this.currentLightboxIndex - 1 + gallery.length) % gallery.length;
        document.getElementById('lightbox-image').src = gallery[this.currentLightboxIndex];
    }

    lightboxNext() {
        const gallery = this.barber.gallery || [];
        this.currentLightboxIndex = (this.currentLightboxIndex + 1) % gallery.length;
        document.getElementById('lightbox-image').src = gallery[this.currentLightboxIndex];
    }
}

// Initialize globally
window.barberProfile = new BarberProfile();
