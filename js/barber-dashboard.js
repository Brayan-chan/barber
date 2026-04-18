// ==========================================
// ControlBarber - Barber Dashboard Module
// ==========================================

class BarberDashboard {
    constructor() {
        this.user = window.authManager?.currentUser;
        this.appointments = [];
        this.currentTab = 'overview';
    }

    loadData() {
        this.user = window.authManager?.currentUser;
        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        this.appointments = allBookings.filter(b => b.barberId === this.user?.id);
        this.render();
    }

    render() {
        const container = document.getElementById('barber-dashboard-content');
        if (!container) return;

        const profile = this.user?.profile || {};
        const todayAppointments = this.getTodayAppointments();
        const pendingAppointments = this.appointments.filter(a => a.status === 'pending');
        const completedToday = todayAppointments.filter(a => a.status === 'completed');
        const todayRevenue = completedToday.reduce((sum, a) => sum + (a.price || 0), 0);

        container.innerHTML = `
            <div class="max-w-7xl mx-auto">
                <!-- Header -->
                <div class="bg-gradient-to-r from-barber to-primary rounded-2xl p-6 mb-8 text-white">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <div class="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/50">
                                ${profile.avatar 
                                    ? `<img src="${profile.avatar}" alt="Avatar" class="w-full h-full object-cover">`
                                    : `<i class="fas fa-user text-4xl text-white/70"></i>`
                                }
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold">${profile.shopName || 'Mi Barberia'}</h1>
                                <p class="text-white/80">${profile.name || 'Barbero'}</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <div class="flex items-center text-amber-400">
                                        <i class="fas fa-star"></i>
                                        <span class="ml-1 font-medium">${profile.rating || 0}</span>
                                    </div>
                                    <span class="text-white/60">(${profile.reviewCount || 0} resenas)</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button onclick="window.router.navigate('barber-profile', {id: '${this.user?.id}'})" class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                                <i class="fas fa-eye"></i>
                                Ver mi perfil publico
                            </button>
                            <button onclick="window.authManager.logout()" class="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                                <i class="fas fa-sign-out-alt"></i>
                                Cerrar sesion
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-white rounded-xl shadow p-6">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <i class="fas fa-calendar-day text-blue-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-800">${todayAppointments.length}</p>
                                <p class="text-sm text-gray-600">Citas hoy</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow p-6">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <i class="fas fa-clock text-amber-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-800">${pendingAppointments.length}</p>
                                <p class="text-sm text-gray-600">Pendientes</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow p-6">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-800">$${todayRevenue}</p>
                                <p class="text-sm text-gray-600">Ingresos hoy</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow p-6">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <i class="fas fa-users text-purple-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-gray-800">${this.getUniqueClients()}</p>
                                <p class="text-sm text-gray-600">Clientes totales</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <!-- Sidebar Navigation -->
                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-xl shadow p-4 sticky top-24">
                            <nav class="space-y-1">
                                <button onclick="window.barberDashboard.showTab('overview')" class="barber-nav-btn w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 ${this.currentTab === 'overview' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}">
                                    <i class="fas fa-home w-5"></i>
                                    <span>Resumen</span>
                                </button>
                                <button onclick="window.barberDashboard.showTab('appointments')" class="barber-nav-btn w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 ${this.currentTab === 'appointments' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}">
                                    <i class="fas fa-calendar-check w-5"></i>
                                    <span>Citas</span>
                                    ${pendingAppointments.length > 0 ? `<span class="ml-auto bg-amber-500 text-white text-xs px-2 py-1 rounded-full">${pendingAppointments.length}</span>` : ''}
                                </button>
                                <button onclick="window.barberDashboard.showTab('profile')" class="barber-nav-btn w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 ${this.currentTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}">
                                    <i class="fas fa-store w-5"></i>
                                    <span>Mi Perfil</span>
                                </button>
                                <button onclick="window.barberDashboard.showTab('services')" class="barber-nav-btn w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 ${this.currentTab === 'services' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}">
                                    <i class="fas fa-cut w-5"></i>
                                    <span>Servicios</span>
                                </button>
                                <button onclick="window.barberDashboard.showTab('schedule')" class="barber-nav-btn w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 ${this.currentTab === 'schedule' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}">
                                    <i class="fas fa-clock w-5"></i>
                                    <span>Horarios</span>
                                </button>
                                <button onclick="window.barberDashboard.showTab('gallery')" class="barber-nav-btn w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 ${this.currentTab === 'gallery' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}">
                                    <i class="fas fa-images w-5"></i>
                                    <span>Galeria</span>
                                </button>
                                <button onclick="window.barberDashboard.showTab('reviews')" class="barber-nav-btn w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 ${this.currentTab === 'reviews' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}">
                                    <i class="fas fa-star w-5"></i>
                                    <span>Resenas</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    <!-- Content Area -->
                    <div class="lg:col-span-3">
                        <div class="bg-white rounded-xl shadow">
                            <div id="barber-tab-content" class="p-6">
                                ${this.renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTabContent() {
        switch (this.currentTab) {
            case 'overview':
                return this.renderOverview();
            case 'appointments':
                return this.renderAppointments();
            case 'profile':
                return this.renderProfileEditor();
            case 'services':
                return this.renderServicesEditor();
            case 'schedule':
                return this.renderScheduleEditor();
            case 'gallery':
                return this.renderGalleryEditor();
            case 'reviews':
                return this.renderReviews();
            default:
                return this.renderOverview();
        }
    }

    renderOverview() {
        const todayAppointments = this.getTodayAppointments();
        const upcomingAppointments = this.appointments
            .filter(a => new Date(a.date) >= new Date() && a.status !== 'cancelled')
            .slice(0, 5);

        return `
            <h2 class="text-xl font-bold text-gray-800 mb-6">Resumen del dia</h2>
            
            <!-- Today's Schedule -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Citas de hoy (${todayAppointments.length})</h3>
                ${todayAppointments.length > 0 ? `
                    <div class="space-y-3">
                        ${todayAppointments.map(apt => this.renderAppointmentCard(apt)).join('')}
                    </div>
                ` : `
                    <div class="bg-gray-50 rounded-xl p-8 text-center">
                        <i class="fas fa-calendar-day text-gray-400 text-4xl mb-4"></i>
                        <p class="text-gray-600">No tienes citas programadas para hoy</p>
                    </div>
                `}
            </div>

            <!-- Upcoming Appointments -->
            <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Proximas citas</h3>
                ${upcomingAppointments.length > 0 ? `
                    <div class="space-y-3">
                        ${upcomingAppointments.map(apt => this.renderAppointmentCard(apt)).join('')}
                    </div>
                ` : `
                    <div class="bg-gray-50 rounded-xl p-8 text-center">
                        <i class="fas fa-calendar-times text-gray-400 text-4xl mb-4"></i>
                        <p class="text-gray-600">No tienes citas proximas</p>
                    </div>
                `}
            </div>
        `;
    }

    renderAppointments() {
        const pendingAppointments = this.appointments.filter(a => a.status === 'pending');
        const confirmedAppointments = this.appointments.filter(a => a.status === 'confirmed');
        const completedAppointments = this.appointments.filter(a => a.status === 'completed');

        return `
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-800">Gestionar citas</h2>
            </div>

            <!-- Tabs -->
            <div class="flex border-b border-gray-200 mb-6">
                <button onclick="window.barberDashboard.setAppointmentFilter('pending')" class="apt-filter-btn px-4 py-2 font-medium text-primary border-b-2 border-primary" data-filter="pending">
                    Pendientes (${pendingAppointments.length})
                </button>
                <button onclick="window.barberDashboard.setAppointmentFilter('confirmed')" class="apt-filter-btn px-4 py-2 font-medium text-gray-500 hover:text-gray-700" data-filter="confirmed">
                    Confirmadas (${confirmedAppointments.length})
                </button>
                <button onclick="window.barberDashboard.setAppointmentFilter('completed')" class="apt-filter-btn px-4 py-2 font-medium text-gray-500 hover:text-gray-700" data-filter="completed">
                    Completadas (${completedAppointments.length})
                </button>
            </div>

            <div id="appointments-list" class="space-y-4">
                ${pendingAppointments.length > 0 
                    ? pendingAppointments.map(apt => this.renderAppointmentCard(apt, true)).join('')
                    : '<div class="text-center py-8 text-gray-500">No hay citas pendientes</div>'
                }
            </div>
        `;
    }

    renderAppointmentCard(appointment, showActions = false) {
        const client = this.getClientInfo(appointment.clientId);
        const date = new Date(appointment.date);
        const formattedDate = date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
        
        const statusColors = {
            'pending': 'bg-amber-100 text-amber-800',
            'confirmed': 'bg-green-100 text-green-800',
            'completed': 'bg-blue-100 text-blue-800',
            'cancelled': 'bg-red-100 text-red-800'
        };

        return `
            <div class="bg-gray-50 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div class="flex items-center gap-3 flex-1">
                    <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span class="text-primary font-bold">${(client?.name || 'C').charAt(0)}</span>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-800">${client?.name || 'Cliente'}</h4>
                        <p class="text-sm text-gray-600">${appointment.serviceName}</p>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-4 text-sm">
                    <span class="text-gray-600"><i class="fas fa-calendar mr-1"></i> ${formattedDate}</span>
                    <span class="text-gray-600"><i class="fas fa-clock mr-1"></i> ${appointment.time}</span>
                    <span class="font-semibold text-primary">$${appointment.price} MXN</span>
                    <span class="px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}">
                        ${appointment.status === 'pending' ? 'Pendiente' : appointment.status === 'confirmed' ? 'Confirmada' : appointment.status === 'completed' ? 'Completada' : 'Cancelada'}
                    </span>
                </div>
                ${showActions && appointment.status === 'pending' ? `
                    <div class="flex gap-2">
                        <button onclick="window.barberDashboard.confirmAppointment('${appointment.id}')" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
                            <i class="fas fa-check mr-1"></i> Confirmar
                        </button>
                        <button onclick="window.barberDashboard.cancelAppointment('${appointment.id}')" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                            <i class="fas fa-times mr-1"></i> Rechazar
                        </button>
                    </div>
                ` : ''}
                ${showActions && appointment.status === 'confirmed' ? `
                    <div class="flex gap-2">
                        <button onclick="window.barberDashboard.completeAppointment('${appointment.id}')" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                            <i class="fas fa-check-double mr-1"></i> Completar
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderProfileEditor() {
        const profile = this.user?.profile || {};

        return `
            <h2 class="text-xl font-bold text-gray-800 mb-6">Editar perfil de mi barberia</h2>
            <form id="barber-profile-form" class="space-y-6">
                <!-- Basic Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del barbero</label>
                        <input type="text" id="bp-name" value="${profile.name || ''}" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Tu nombre">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la barberia</label>
                        <input type="text" id="bp-shopName" value="${profile.shopName || ''}" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Nombre de tu negocio">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                    <textarea id="bp-description" rows="3"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                        placeholder="Describe tu barberia y servicios...">${profile.description || ''}</textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                        <input type="tel" id="bp-phone" value="${profile.phone || ''}" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="+52 55 1234 5678">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">URL de avatar</label>
                        <input type="url" id="bp-avatar" value="${profile.avatar || ''}" 
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="https://...">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">URL de imagen de portada</label>
                    <input type="url" id="bp-coverImage" value="${profile.coverImage || ''}" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="https://...">
                </div>

                <!-- Location -->
                <div class="border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Ubicacion</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Direccion</label>
                            <input type="text" id="bp-address" value="${profile.location?.address || ''}" 
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Calle, numero, colonia">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                            <input type="text" id="bp-city" value="${profile.location?.city || ''}" 
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Ciudad">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <input type="text" id="bp-state" value="${profile.location?.state || ''}" 
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Estado">
                        </div>
                    </div>
                </div>

                <!-- Specialties -->
                <div class="border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Especialidades</h3>
                    <div class="flex flex-wrap gap-2 mb-3" id="specialties-tags">
                        ${(profile.specialties || []).map(s => `
                            <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                                ${s}
                                <button type="button" onclick="window.barberDashboard.removeSpecialty('${s}')" class="hover:text-red-500">&times;</button>
                            </span>
                        `).join('')}
                    </div>
                    <div class="flex gap-2">
                        <input type="text" id="new-specialty" 
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Agregar especialidad (ej: Fade, Barba, etc.)">
                        <button type="button" onclick="window.barberDashboard.addSpecialty()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                            Agregar
                        </button>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button type="submit" class="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                        Guardar cambios
                    </button>
                </div>
            </form>
        `;
    }

    renderServicesEditor() {
        const services = this.user?.profile?.services || [];

        return `
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-800">Mis servicios</h2>
                <button onclick="window.barberDashboard.showServiceModal()" class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    Agregar servicio
                </button>
            </div>

            ${services.length > 0 ? `
                <div class="space-y-4">
                    ${services.map(service => `
                        <div class="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <i class="fas fa-cut text-primary text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-800">${service.name}</h4>
                                    <p class="text-sm text-gray-600">${service.duration} minutos</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="text-xl font-bold text-primary">$${service.price}</span>
                                <button onclick="window.barberDashboard.editService('${service.id}')" class="p-2 text-gray-500 hover:text-primary transition-colors">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="window.barberDashboard.deleteService('${service.id}')" class="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="bg-gray-50 rounded-xl p-12 text-center">
                    <i class="fas fa-cut text-gray-400 text-5xl mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Sin servicios configurados</h3>
                    <p class="text-gray-600 mb-4">Agrega tus servicios para que los clientes puedan reservar</p>
                    <button onclick="window.barberDashboard.showServiceModal()" class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                        Agregar primer servicio
                    </button>
                </div>
            `}
        `;
    }

    renderScheduleEditor() {
        const schedule = this.user?.profile?.schedule || {};
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
            <h2 class="text-xl font-bold text-gray-800 mb-6">Configurar horarios</h2>
            <form id="schedule-form" class="space-y-4">
                ${days.map(day => {
                    const daySchedule = schedule[day.key] || { open: '09:00', close: '18:00', available: true };
                    return `
                        <div class="bg-gray-50 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4">
                            <div class="w-32">
                                <label class="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" class="custom-checkbox" data-day="${day.key}" ${daySchedule.available ? 'checked' : ''}>
                                    <span class="font-medium text-gray-800">${day.label}</span>
                                </label>
                            </div>
                            <div class="flex-1 flex items-center gap-4 ${!daySchedule.available ? 'opacity-50' : ''}">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-gray-600">Abre:</span>
                                    <input type="time" value="${daySchedule.open || '09:00'}" data-day="${day.key}" data-type="open"
                                        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        ${!daySchedule.available ? 'disabled' : ''}>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-gray-600">Cierra:</span>
                                    <input type="time" value="${daySchedule.close || '18:00'}" data-day="${day.key}" data-type="close"
                                        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        ${!daySchedule.available ? 'disabled' : ''}>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}

                <div class="flex justify-end pt-4">
                    <button type="submit" class="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                        Guardar horarios
                    </button>
                </div>
            </form>
        `;
    }

    renderGalleryEditor() {
        const gallery = this.user?.profile?.gallery || [];

        return `
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-800">Mi galeria de trabajos</h2>
                <button onclick="window.barberDashboard.showGalleryModal()" class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    Agregar imagen
                </button>
            </div>

            ${gallery.length > 0 ? `
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    ${gallery.map((img, index) => `
                        <div class="relative group aspect-square rounded-xl overflow-hidden bg-gray-200">
                            <img src="${img}" alt="Trabajo ${index + 1}" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onclick="window.barberDashboard.removeGalleryImage(${index})" class="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="bg-gray-50 rounded-xl p-12 text-center">
                    <i class="fas fa-images text-gray-400 text-5xl mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Sin imagenes en la galeria</h3>
                    <p class="text-gray-600 mb-4">Muestra tus mejores trabajos para atraer mas clientes</p>
                    <button onclick="window.barberDashboard.showGalleryModal()" class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                        Agregar primera imagen
                    </button>
                </div>
            `}
        `;
    }

    renderReviews() {
        const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        const myReviews = allReviews.filter(r => r.barberId === this.user?.id);

        return `
            <h2 class="text-xl font-bold text-gray-800 mb-6">Resenas de clientes (${myReviews.length})</h2>

            ${myReviews.length > 0 ? `
                <div class="space-y-4">
                    ${myReviews.map(review => `
                        <div class="bg-gray-50 rounded-xl p-4">
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span class="text-primary font-bold">${(review.clientName || 'C').charAt(0)}</span>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-800">${review.clientName || 'Cliente'}</h4>
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
                    `).join('')}
                </div>
            ` : `
                <div class="bg-gray-50 rounded-xl p-12 text-center">
                    <i class="fas fa-star text-gray-400 text-5xl mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Sin resenas aun</h3>
                    <p class="text-gray-600">Las resenas de tus clientes apareceran aqui</p>
                </div>
            `}
        `;
    }

    // Helper methods
    showTab(tabName) {
        this.currentTab = tabName;
        this.render();
        this.setupFormListeners();
    }

    setupFormListeners() {
        // Profile form
        document.getElementById('barber-profile-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Schedule form
        document.getElementById('schedule-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSchedule();
        });

        // Schedule checkboxes
        document.querySelectorAll('#schedule-form input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const day = e.target.dataset.day;
                const inputs = document.querySelectorAll(`#schedule-form input[data-day="${day}"][type="time"]`);
                const wrapper = e.target.closest('.bg-gray-50').querySelector('.flex-1');
                
                inputs.forEach(input => {
                    input.disabled = !e.target.checked;
                });
                wrapper.classList.toggle('opacity-50', !e.target.checked);
            });
        });
    }

    saveProfile() {
        const profileData = {
            name: document.getElementById('bp-name').value,
            shopName: document.getElementById('bp-shopName').value,
            description: document.getElementById('bp-description').value,
            phone: document.getElementById('bp-phone').value,
            avatar: document.getElementById('bp-avatar').value,
            coverImage: document.getElementById('bp-coverImage').value,
            location: {
                address: document.getElementById('bp-address').value,
                city: document.getElementById('bp-city').value,
                state: document.getElementById('bp-state').value
            }
        };

        const result = window.authManager.updateProfile(profileData);
        if (result.success) {
            window.app?.showToast('Perfil actualizado', 'success');
            this.loadData();
        }
    }

    saveSchedule() {
        const schedule = {};
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        days.forEach(day => {
            const checkbox = document.querySelector(`input[type="checkbox"][data-day="${day}"]`);
            const openInput = document.querySelector(`input[data-day="${day}"][data-type="open"]`);
            const closeInput = document.querySelector(`input[data-day="${day}"][data-type="close"]`);

            schedule[day] = {
                available: checkbox?.checked || false,
                open: openInput?.value || '09:00',
                close: closeInput?.value || '18:00'
            };
        });

        const result = window.authManager.updateProfile({ schedule });
        if (result.success) {
            window.app?.showToast('Horarios guardados', 'success');
        }
    }

    addSpecialty() {
        const input = document.getElementById('new-specialty');
        const specialty = input.value.trim();
        
        if (!specialty) return;

        const specialties = [...(this.user?.profile?.specialties || []), specialty];
        window.authManager.updateProfile({ specialties });
        input.value = '';
        this.loadData();
    }

    removeSpecialty(specialty) {
        const specialties = (this.user?.profile?.specialties || []).filter(s => s !== specialty);
        window.authManager.updateProfile({ specialties });
        this.loadData();
    }

    showServiceModal(service = null) {
        const modal = document.createElement('div');
        modal.id = 'service-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-gray-800">${service ? 'Editar' : 'Agregar'} servicio</h3>
                    <button onclick="document.getElementById('service-modal').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="service-form" class="space-y-4">
                    <input type="hidden" id="service-id" value="${service?.id || ''}">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del servicio</label>
                        <input type="text" id="service-name" value="${service?.name || ''}" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Ej: Corte clasico">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Precio (MXN)</label>
                            <input type="number" id="service-price" value="${service?.price || ''}" required min="1"
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="150">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Duracion (min)</label>
                            <input type="number" id="service-duration" value="${service?.duration || ''}" required min="5"
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="30">
                        </div>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" onclick="document.getElementById('service-modal').remove()" 
                            class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" class="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                            ${service ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('service-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveService();
        });
    }

    saveService() {
        const id = document.getElementById('service-id').value || `s_${Date.now()}`;
        const name = document.getElementById('service-name').value;
        const price = parseInt(document.getElementById('service-price').value);
        const duration = parseInt(document.getElementById('service-duration').value);

        let services = [...(this.user?.profile?.services || [])];
        const existingIndex = services.findIndex(s => s.id === id);

        if (existingIndex !== -1) {
            services[existingIndex] = { id, name, price, duration };
        } else {
            services.push({ id, name, price, duration });
        }

        window.authManager.updateProfile({ services });
        document.getElementById('service-modal').remove();
        window.app?.showToast('Servicio guardado', 'success');
        this.loadData();
    }

    editService(serviceId) {
        const service = this.user?.profile?.services?.find(s => s.id === serviceId);
        if (service) {
            this.showServiceModal(service);
        }
    }

    deleteService(serviceId) {
        if (!confirm('Eliminar este servicio?')) return;
        
        const services = (this.user?.profile?.services || []).filter(s => s.id !== serviceId);
        window.authManager.updateProfile({ services });
        window.app?.showToast('Servicio eliminado', 'success');
        this.loadData();
    }

    showGalleryModal() {
        const modal = document.createElement('div');
        modal.id = 'gallery-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-gray-800">Agregar imagen</h3>
                    <button onclick="document.getElementById('gallery-modal').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="gallery-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">URL de la imagen</label>
                        <input type="url" id="gallery-url" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="https://...">
                        <p class="text-xs text-gray-500 mt-1">Pega la URL de tu imagen de trabajo</p>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" onclick="document.getElementById('gallery-modal').remove()" 
                            class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" class="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('gallery-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const url = document.getElementById('gallery-url').value;
            const gallery = [...(this.user?.profile?.gallery || []), url];
            window.authManager.updateProfile({ gallery });
            document.getElementById('gallery-modal').remove();
            window.app?.showToast('Imagen agregada', 'success');
            this.loadData();
        });
    }

    removeGalleryImage(index) {
        if (!confirm('Eliminar esta imagen?')) return;
        
        const gallery = [...(this.user?.profile?.gallery || [])];
        gallery.splice(index, 1);
        window.authManager.updateProfile({ gallery });
        window.app?.showToast('Imagen eliminada', 'success');
        this.loadData();
    }

    // Appointment actions
    confirmAppointment(appointmentId) {
        this.updateAppointmentStatus(appointmentId, 'confirmed');
        window.app?.showToast('Cita confirmada', 'success');
    }

    cancelAppointment(appointmentId) {
        if (!confirm('Rechazar esta cita?')) return;
        this.updateAppointmentStatus(appointmentId, 'cancelled');
        window.app?.showToast('Cita rechazada', 'success');
    }

    completeAppointment(appointmentId) {
        this.updateAppointmentStatus(appointmentId, 'completed');
        window.app?.showToast('Cita completada', 'success');
    }

    updateAppointmentStatus(appointmentId, status) {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const index = bookings.findIndex(b => b.id === appointmentId);
        if (index !== -1) {
            bookings[index].status = status;
            localStorage.setItem('bookings', JSON.stringify(bookings));
            this.loadData();
        }
    }

    setAppointmentFilter(filter) {
        // Update buttons
        document.querySelectorAll('.apt-filter-btn').forEach(btn => {
            btn.classList.remove('text-primary', 'border-b-2', 'border-primary');
            btn.classList.add('text-gray-500');
        });
        const activeBtn = document.querySelector(`.apt-filter-btn[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('text-primary', 'border-b-2', 'border-primary');
            activeBtn.classList.remove('text-gray-500');
        }

        // Update list
        const filtered = this.appointments.filter(a => a.status === filter);
        const listContainer = document.getElementById('appointments-list');
        if (listContainer) {
            listContainer.innerHTML = filtered.length > 0 
                ? filtered.map(apt => this.renderAppointmentCard(apt, true)).join('')
                : `<div class="text-center py-8 text-gray-500">No hay citas ${filter === 'pending' ? 'pendientes' : filter === 'confirmed' ? 'confirmadas' : 'completadas'}</div>`;
        }
    }

    // Utility methods
    getTodayAppointments() {
        const today = new Date().toISOString().split('T')[0];
        return this.appointments.filter(a => a.date === today && a.status !== 'cancelled');
    }

    getUniqueClients() {
        const clientIds = new Set(this.appointments.map(a => a.clientId));
        return clientIds.size;
    }

    getClientInfo(clientId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === clientId);
        return user?.profile || { name: 'Cliente' };
    }
}

// Initialize globally
window.barberDashboard = new BarberDashboard();
