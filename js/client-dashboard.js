// ==========================================
// ControlBarber - Client Dashboard Module
// ==========================================

class ClientDashboard {
    constructor() {
        this.user = window.authManager?.currentUser;
        this.bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        this.reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        this.favorites = this.user?.profile?.favorites || [];
    }

    loadData() {
        this.user = window.authManager?.currentUser;
        this.bookings = JSON.parse(localStorage.getItem('bookings') || '[]').filter(b => b.clientId === this.user?.id);
        this.favorites = this.user?.profile?.favorites || [];
        this.render();
    }

    render() {
        const container = document.getElementById('client-dashboard-content');
        if (!container) return;

        const upcomingBookings = this.bookings.filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled');
        const pastBookings = this.bookings.filter(b => new Date(b.date) < new Date() || b.status === 'completed');

        container.innerHTML = `
            <div class="max-w-7xl mx-auto">
                <!-- Header -->
                <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <div class="h-16 w-16 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                                ${this.user?.profile?.avatar 
                                    ? `<img src="${this.user.profile.avatar}" alt="Avatar" class="w-full h-full object-cover">`
                                    : `<span class="text-white text-2xl font-bold">${(this.user?.profile?.name || 'U').charAt(0)}</span>`
                                }
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold text-gray-800">Hola, ${this.user?.profile?.name || 'Usuario'}</h1>
                                <p class="text-gray-600">Bienvenido a tu panel de cliente</p>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button onclick="window.router.navigate('home')" class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                                <i class="fas fa-search"></i>
                                Buscar barberos
                            </button>
                            <button onclick="window.clientDashboard.showEditProfile()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <i class="fas fa-cog"></i>
                                Editar perfil
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-white rounded-xl shadow p-6">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <i class="fas fa-calendar-check text-blue-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-800">${upcomingBookings.length}</p>
                                <p class="text-sm text-gray-600">Citas proximas</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow p-6">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <i class="fas fa-check-circle text-green-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-800">${pastBookings.length}</p>
                                <p class="text-sm text-gray-600">Citas completadas</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow p-6">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <i class="fas fa-star text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-800">${this.reviews.filter(r => r.clientId === this.user?.id).length}</p>
                                <p class="text-sm text-gray-600">Resenas escritas</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow p-6">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                                <i class="fas fa-heart text-red-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-800">${this.favorites.length}</p>
                                <p class="text-sm text-gray-600">Barberos favoritos</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div class="border-b border-gray-200">
                        <nav class="flex">
                            <button onclick="window.clientDashboard.showTab('upcoming')" class="client-tab active flex-1 py-4 text-center font-medium text-primary border-b-2 border-primary" data-tab="upcoming">
                                <i class="fas fa-calendar mr-2"></i>Proximas citas
                            </button>
                            <button onclick="window.clientDashboard.showTab('history')" class="client-tab flex-1 py-4 text-center font-medium text-gray-500 hover:text-gray-700" data-tab="history">
                                <i class="fas fa-history mr-2"></i>Historial
                            </button>
                            <button onclick="window.clientDashboard.showTab('favorites')" class="client-tab flex-1 py-4 text-center font-medium text-gray-500 hover:text-gray-700" data-tab="favorites">
                                <i class="fas fa-heart mr-2"></i>Favoritos
                            </button>
                            <button onclick="window.clientDashboard.showTab('reviews')" class="client-tab flex-1 py-4 text-center font-medium text-gray-500 hover:text-gray-700" data-tab="reviews">
                                <i class="fas fa-star mr-2"></i>Mis resenas
                            </button>
                        </nav>
                    </div>

                    <!-- Tab Content -->
                    <div class="p-6">
                        <!-- Upcoming Bookings -->
                        <div id="tab-upcoming" class="tab-content">
                            ${upcomingBookings.length > 0 ? `
                                <div class="space-y-4">
                                    ${upcomingBookings.map(booking => this.renderBookingCard(booking, 'upcoming')).join('')}
                                </div>
                            ` : `
                                <div class="text-center py-12">
                                    <div class="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i class="fas fa-calendar-times text-gray-400 text-3xl"></i>
                                    </div>
                                    <h3 class="text-lg font-medium text-gray-800 mb-2">No tienes citas proximas</h3>
                                    <p class="text-gray-600 mb-4">Encuentra el barbero perfecto y agenda tu proxima cita</p>
                                    <button onclick="window.router.navigate('home')" class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                                        Buscar barberos
                                    </button>
                                </div>
                            `}
                        </div>

                        <!-- History -->
                        <div id="tab-history" class="tab-content hidden">
                            ${pastBookings.length > 0 ? `
                                <div class="space-y-4">
                                    ${pastBookings.map(booking => this.renderBookingCard(booking, 'history')).join('')}
                                </div>
                            ` : `
                                <div class="text-center py-12">
                                    <div class="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i class="fas fa-history text-gray-400 text-3xl"></i>
                                    </div>
                                    <h3 class="text-lg font-medium text-gray-800 mb-2">Sin historial de citas</h3>
                                    <p class="text-gray-600">Aqui aparecera el historial de tus citas pasadas</p>
                                </div>
                            `}
                        </div>

                        <!-- Favorites -->
                        <div id="tab-favorites" class="tab-content hidden">
                            ${this.favorites.length > 0 ? `
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    ${this.favorites.map(barberId => {
                                        const barber = window.authManager?.getBarberById(barberId);
                                        return barber ? this.renderFavoriteCard(barber) : '';
                                    }).join('')}
                                </div>
                            ` : `
                                <div class="text-center py-12">
                                    <div class="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i class="fas fa-heart text-gray-400 text-3xl"></i>
                                    </div>
                                    <h3 class="text-lg font-medium text-gray-800 mb-2">Sin favoritos</h3>
                                    <p class="text-gray-600 mb-4">Guarda tus barberos favoritos para acceder rapidamente</p>
                                    <button onclick="window.router.navigate('home')" class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                                        Explorar barberos
                                    </button>
                                </div>
                            `}
                        </div>

                        <!-- Reviews -->
                        <div id="tab-reviews" class="tab-content hidden">
                            ${this.renderMyReviews()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderBookingCard(booking, type) {
        const barber = window.authManager?.getBarberById(booking.barberId);
        const date = new Date(booking.date);
        const formattedDate = date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
        
        const statusColors = {
            'pending': 'bg-amber-100 text-amber-800',
            'confirmed': 'bg-green-100 text-green-800',
            'completed': 'bg-blue-100 text-blue-800',
            'cancelled': 'bg-red-100 text-red-800'
        };

        const statusLabels = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmada',
            'completed': 'Completada',
            'cancelled': 'Cancelada'
        };

        return `
            <div class="bg-gray-50 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div class="flex-shrink-0">
                    <div class="h-16 w-16 rounded-xl overflow-hidden bg-gray-200">
                        ${barber?.avatar 
                            ? `<img src="${barber.avatar}" alt="${barber.name}" class="w-full h-full object-cover">`
                            : `<div class="w-full h-full flex items-center justify-center"><i class="fas fa-user text-gray-400"></i></div>`
                        }
                    </div>
                </div>
                <div class="flex-1">
                    <div class="flex items-start justify-between">
                        <div>
                            <h4 class="font-semibold text-gray-800">${barber?.shopName || 'Barberia'}</h4>
                            <p class="text-sm text-gray-600">${barber?.name || 'Barbero'}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || statusColors.pending}">
                            ${statusLabels[booking.status] || 'Pendiente'}
                        </span>
                    </div>
                    <div class="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                        <span><i class="fas fa-calendar mr-1"></i> ${formattedDate}</span>
                        <span><i class="fas fa-clock mr-1"></i> ${booking.time}</span>
                        <span><i class="fas fa-cut mr-1"></i> ${booking.serviceName}</span>
                        <span class="font-semibold text-primary">$${booking.price} MXN</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    ${type === 'upcoming' && booking.status !== 'cancelled' ? `
                        <button onclick="window.clientDashboard.cancelBooking('${booking.id}')" class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                            Cancelar
                        </button>
                    ` : ''}
                    ${type === 'history' && booking.status === 'completed' && !this.hasReview(booking.id) ? `
                        <button onclick="window.clientDashboard.showReviewModal('${booking.id}')" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
                            <i class="fas fa-star mr-1"></i> Dejar resena
                        </button>
                    ` : ''}
                    <button onclick="window.router.navigate('barber-profile', {id: '${booking.barberId}'})" class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors">
                        Ver perfil
                    </button>
                </div>
            </div>
        `;
    }

    renderFavoriteCard(barber) {
        return `
            <div class="bg-gray-50 rounded-xl overflow-hidden card-hover">
                <div class="h-32 bg-gray-200 relative">
                    ${barber.coverImage 
                        ? `<img src="${barber.coverImage}" alt="${barber.shopName}" class="w-full h-full object-cover">`
                        : ''
                    }
                    <button onclick="window.clientDashboard.removeFavorite('${barber.id}')" class="absolute top-2 right-2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors">
                        <i class="fas fa-heart text-red-500"></i>
                    </button>
                </div>
                <div class="p-4">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                            ${barber.avatar 
                                ? `<img src="${barber.avatar}" alt="${barber.name}" class="w-full h-full object-cover">`
                                : `<div class="w-full h-full flex items-center justify-center"><i class="fas fa-user text-gray-400"></i></div>`
                            }
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800">${barber.shopName}</h4>
                            <p class="text-xs text-gray-500">${barber.name}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 text-sm mb-3">
                        <div class="flex items-center text-amber-500">
                            <i class="fas fa-star"></i>
                            <span class="ml-1 font-medium">${barber.rating}</span>
                        </div>
                        <span class="text-gray-400">(${barber.reviewCount} resenas)</span>
                    </div>
                    <button onclick="window.router.navigate('barber-profile', {id: '${barber.id}'})" class="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors">
                        Ver perfil
                    </button>
                </div>
            </div>
        `;
    }

    renderMyReviews() {
        const myReviews = this.reviews.filter(r => r.clientId === this.user?.id);
        
        if (myReviews.length === 0) {
            return `
                <div class="text-center py-12">
                    <div class="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-star text-gray-400 text-3xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Sin resenas</h3>
                    <p class="text-gray-600">Despues de tus citas podras dejar resenas para ayudar a otros clientes</p>
                </div>
            `;
        }

        return `
            <div class="space-y-4">
                ${myReviews.map(review => {
                    const barber = window.authManager?.getBarberById(review.barberId);
                    return `
                        <div class="bg-gray-50 rounded-xl p-4">
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                                        ${barber?.avatar 
                                            ? `<img src="${barber.avatar}" alt="${barber?.name}" class="w-full h-full object-cover">`
                                            : `<div class="w-full h-full flex items-center justify-center"><i class="fas fa-user text-gray-400"></i></div>`
                                        }
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-800">${barber?.shopName || 'Barberia'}</h4>
                                        <p class="text-xs text-gray-500">${new Date(review.createdAt).toLocaleDateString('es-MX')}</p>
                                    </div>
                                </div>
                                <div class="flex items-center text-amber-500">
                                    ${Array(5).fill(0).map((_, i) => `
                                        <i class="fas fa-star ${i < review.rating ? 'text-amber-500' : 'text-gray-300'}"></i>
                                    `).join('')}
                                </div>
                            </div>
                            <p class="text-gray-700">${review.comment}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    showTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.client-tab').forEach(tab => {
            tab.classList.remove('active', 'text-primary', 'border-b-2', 'border-primary');
            tab.classList.add('text-gray-500');
        });
        
        const activeTab = document.querySelector(`.client-tab[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active', 'text-primary', 'border-b-2', 'border-primary');
            activeTab.classList.remove('text-gray-500');
        }

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        const activeContent = document.getElementById(`tab-${tabName}`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }
    }

    showEditProfile() {
        const modal = document.createElement('div');
        modal.id = 'edit-profile-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-gray-800">Editar perfil</h3>
                    <button onclick="document.getElementById('edit-profile-modal').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="edit-profile-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input type="text" id="edit-name" value="${this.user?.profile?.name || ''}"
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                        <input type="tel" id="edit-phone" value="${this.user?.profile?.phone || ''}"
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">URL de avatar</label>
                        <input type="url" id="edit-avatar" value="${this.user?.profile?.avatar || ''}" placeholder="https://..."
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary">
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" onclick="document.getElementById('edit-profile-modal').remove()" 
                            class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" class="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const result = window.authManager.updateProfile({
                name: document.getElementById('edit-name').value,
                phone: document.getElementById('edit-phone').value,
                avatar: document.getElementById('edit-avatar').value
            });
            
            if (result.success) {
                window.app?.showToast('Perfil actualizado', 'success');
                document.getElementById('edit-profile-modal').remove();
                this.loadData();
            }
        });
    }

    cancelBooking(bookingId) {
        if (!confirm('Estas seguro de cancelar esta cita?')) return;

        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const index = bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            bookings[index].status = 'cancelled';
            localStorage.setItem('bookings', JSON.stringify(bookings));
            window.app?.showToast('Cita cancelada', 'success');
            this.loadData();
        }
    }

    hasReview(bookingId) {
        return this.reviews.some(r => r.bookingId === bookingId);
    }

    showReviewModal(bookingId) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) return;

        const modal = document.createElement('div');
        modal.id = 'review-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-gray-800">Dejar resena</h3>
                    <button onclick="document.getElementById('review-modal').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="review-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Calificacion</label>
                        <div class="flex gap-2" id="rating-stars">
                            ${[1,2,3,4,5].map(i => `
                                <button type="button" data-rating="${i}" class="rating-star text-3xl text-gray-300 hover:text-amber-500 transition-colors">
                                    <i class="fas fa-star"></i>
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" id="review-rating" value="0" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tu comentario</label>
                        <textarea id="review-comment" rows="4" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                            placeholder="Cuenta tu experiencia..."></textarea>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" onclick="document.getElementById('review-modal').remove()" 
                            class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" class="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors">
                            Publicar resena
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Rating stars interaction
        document.querySelectorAll('.rating-star').forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                document.getElementById('review-rating').value = rating;
                document.querySelectorAll('.rating-star').forEach((s, i) => {
                    s.classList.toggle('text-amber-500', i < rating);
                    s.classList.toggle('text-gray-300', i >= rating);
                });
            });
        });

        document.getElementById('review-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const rating = parseInt(document.getElementById('review-rating').value);
            const comment = document.getElementById('review-comment').value;

            if (rating === 0) {
                window.app?.showToast('Selecciona una calificacion', 'error');
                return;
            }

            this.submitReview(bookingId, booking.barberId, rating, comment);
            document.getElementById('review-modal').remove();
        });
    }

    submitReview(bookingId, barberId, rating, comment) {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        const newReview = {
            id: `review_${Date.now()}`,
            bookingId,
            barberId,
            clientId: this.user?.id,
            clientName: this.user?.profile?.name || 'Cliente',
            rating,
            comment,
            createdAt: new Date().toISOString()
        };
        reviews.push(newReview);
        localStorage.setItem('reviews', JSON.stringify(reviews));

        // Update barber rating
        this.updateBarberRating(barberId);
        
        window.app?.showToast('Resena publicada', 'success');
        this.loadData();
    }

    updateBarberRating(barberId) {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        const barberReviews = reviews.filter(r => r.barberId === barberId);
        
        if (barberReviews.length > 0) {
            const avgRating = barberReviews.reduce((sum, r) => sum + r.rating, 0) / barberReviews.length;
            const barbers = JSON.parse(localStorage.getItem('barbers') || '[]');
            const barberIndex = barbers.findIndex(b => b.id === barberId);
            
            if (barberIndex !== -1) {
                barbers[barberIndex].profile.rating = Math.round(avgRating * 10) / 10;
                barbers[barberIndex].profile.reviewCount = barberReviews.length;
                localStorage.setItem('barbers', JSON.stringify(barbers));
            }
        }
    }

    addFavorite(barberId) {
        if (!this.user) {
            window.router.navigate('auth');
            return;
        }

        if (!this.favorites.includes(barberId)) {
            this.favorites.push(barberId);
            window.authManager.updateProfile({ favorites: this.favorites });
            window.app?.showToast('Agregado a favoritos', 'success');
        }
    }

    removeFavorite(barberId) {
        this.favorites = this.favorites.filter(id => id !== barberId);
        window.authManager.updateProfile({ favorites: this.favorites });
        window.app?.showToast('Eliminado de favoritos', 'success');
        this.loadData();
    }
}

// Initialize globally
window.clientDashboard = new ClientDashboard();