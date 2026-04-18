// ==========================================
// ControlBarber - Booking Module
// ==========================================

class BookingManager {
    constructor() {
        this.barber = null;
        this.selectedService = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.currentStep = 1;
    }

    init(barberId, serviceId = null) {
        this.barber = window.authManager?.getBarberById(barberId);
        this.selectedService = serviceId ? this.barber?.services?.find(s => s.id === serviceId) : null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.currentStep = 1;
        this.render();
    }

    render() {
        const container = document.getElementById('booking-content');
        if (!container || !this.barber) return;

        container.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <!-- Back Button -->
                <button onclick="window.router.navigate('barber-profile', {id: '${this.barber.id}'})" class="mb-6 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <i class="fas fa-arrow-left"></i>
                    <span>Volver al perfil</span>
                </button>

                <!-- Header -->
                <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div class="flex items-center gap-4">
                        <div class="h-16 w-16 rounded-xl overflow-hidden bg-gray-200">
                            ${this.barber.avatar 
                                ? `<img src="${this.barber.avatar}" alt="${this.barber.name}" class="w-full h-full object-cover">`
                                : `<div class="w-full h-full flex items-center justify-center"><i class="fas fa-user text-gray-400 text-2xl"></i></div>`
                            }
                        </div>
                        <div>
                            <h1 class="text-xl font-bold text-gray-800">${this.barber.shopName}</h1>
                            <p class="text-gray-600">${this.barber.name}</p>
                            <p class="text-sm text-gray-500"><i class="fas fa-map-marker-alt mr-1"></i> ${this.barber.location?.city || 'Ubicacion no especificada'}</p>
                        </div>
                    </div>
                </div>

                <!-- Progress Steps -->
                <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3 ${this.currentStep >= 1 ? 'text-primary' : 'text-gray-400'}">
                            <div class="h-8 w-8 rounded-full ${this.currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center font-bold text-sm">1</div>
                            <span class="font-medium hidden sm:block">Servicio</span>
                        </div>
                        <div class="flex-1 h-1 mx-4 ${this.currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}"></div>
                        <div class="flex items-center gap-3 ${this.currentStep >= 2 ? 'text-primary' : 'text-gray-400'}">
                            <div class="h-8 w-8 rounded-full ${this.currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center font-bold text-sm">2</div>
                            <span class="font-medium hidden sm:block">Fecha y hora</span>
                        </div>
                        <div class="flex-1 h-1 mx-4 ${this.currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}"></div>
                        <div class="flex items-center gap-3 ${this.currentStep >= 3 ? 'text-primary' : 'text-gray-400'}">
                            <div class="h-8 w-8 rounded-full ${this.currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center font-bold text-sm">3</div>
                            <span class="font-medium hidden sm:block">Confirmar</span>
                        </div>
                    </div>
                </div>

                <!-- Step Content -->
                <div class="bg-white rounded-2xl shadow-lg p-6">
                    ${this.renderStepContent()}
                </div>
            </div>
        `;
    }

    renderStepContent() {
        switch (this.currentStep) {
            case 1:
                return this.renderServiceSelection();
            case 2:
                return this.renderDateTimeSelection();
            case 3:
                return this.renderConfirmation();
            case 4:
                return this.renderPayment();
            case 5:
                return this.renderSuccess();
            default:
                return this.renderServiceSelection();
        }
    }

    renderServiceSelection() {
        const services = this.barber.services || [];

        return `
            <h2 class="text-xl font-bold text-gray-800 mb-6">Selecciona un servicio</h2>
            
            ${services.length > 0 ? `
                <div class="space-y-3">
                    ${services.map(service => `
                        <label class="block cursor-pointer">
                            <input type="radio" name="service" value="${service.id}" class="peer sr-only" ${this.selectedService?.id === service.id ? 'checked' : ''}>
                            <div class="border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between peer-checked:border-primary peer-checked:bg-primary/5 hover:border-gray-300 transition-all">
                                <div class="flex items-center gap-4">
                                    <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <i class="fas fa-cut text-primary text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-800">${service.name}</h3>
                                        <p class="text-sm text-gray-500">${service.duration} minutos</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="text-xl font-bold text-primary">$${service.price}</span>
                                    <span class="text-sm text-gray-500 block">MXN</span>
                                </div>
                            </div>
                        </label>
                    `).join('')}
                </div>

                <div class="flex justify-end mt-8">
                    <button onclick="window.bookingManager.selectService()" class="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                        Continuar
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            ` : `
                <div class="text-center py-12">
                    <i class="fas fa-cut text-gray-400 text-5xl mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Sin servicios disponibles</h3>
                    <p class="text-gray-600">Este barbero aun no ha configurado sus servicios</p>
                </div>
            `}
        `;
    }

    renderDateTimeSelection() {
        const schedule = this.barber.schedule || {};
        const today = new Date();
        const dates = this.generateDates(14); // Next 14 days

        return `
            <h2 class="text-xl font-bold text-gray-800 mb-6">Selecciona fecha y hora</h2>
            
            <!-- Service Summary -->
            <div class="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <i class="fas fa-cut text-primary"></i>
                    </div>
                    <div>
                        <p class="font-medium text-gray-800">${this.selectedService.name}</p>
                        <p class="text-sm text-gray-500">${this.selectedService.duration} min</p>
                    </div>
                </div>
                <span class="font-bold text-primary">$${this.selectedService.price}</span>
            </div>

            <!-- Date Selection -->
            <div class="mb-6">
                <h3 class="font-medium text-gray-800 mb-3">Selecciona una fecha</h3>
                <div class="flex gap-2 overflow-x-auto pb-2">
                    ${dates.map(date => {
                        const dayName = date.toLocaleDateString('es-MX', { weekday: 'short' });
                        const dayNum = date.getDate();
                        const month = date.toLocaleDateString('es-MX', { month: 'short' });
                        const dateStr = date.toISOString().split('T')[0];
                        const dayKey = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                        const isAvailable = schedule[dayKey]?.available;
                        const isSelected = this.selectedDate === dateStr;

                        return `
                            <button onclick="window.bookingManager.selectDate('${dateStr}')" 
                                class="flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                                    !isAvailable 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : isSelected 
                                            ? 'bg-primary text-white' 
                                            : 'bg-white border border-gray-200 hover:border-primary text-gray-700'
                                }"
                                ${!isAvailable ? 'disabled' : ''}>
                                <span class="block text-xs uppercase">${dayName}</span>
                                <span class="block text-xl font-bold">${dayNum}</span>
                                <span class="block text-xs">${month}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Time Selection -->
            ${this.selectedDate ? `
                <div class="mb-6">
                    <h3 class="font-medium text-gray-800 mb-3">Selecciona una hora</h3>
                    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2" id="time-slots">
                        ${this.generateTimeSlots().map(time => {
                            const isSelected = this.selectedTime === time.value;
                            return `
                                <button onclick="window.bookingManager.selectTime('${time.value}')"
                                    class="py-3 rounded-lg text-sm font-medium transition-all ${
                                        !time.available 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' 
                                            : isSelected 
                                                ? 'bg-primary text-white' 
                                                : 'bg-white border border-gray-200 hover:border-primary text-gray-700'
                                    }"
                                    ${!time.available ? 'disabled' : ''}>
                                    ${time.label}
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : `
                <div class="bg-gray-50 rounded-xl p-8 text-center">
                    <i class="fas fa-calendar-alt text-gray-400 text-3xl mb-2"></i>
                    <p class="text-gray-600">Selecciona una fecha para ver los horarios disponibles</p>
                </div>
            `}

            <div class="flex justify-between mt-8">
                <button onclick="window.bookingManager.goToStep(1)" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <i class="fas fa-arrow-left"></i>
                    Atras
                </button>
                <button onclick="window.bookingManager.confirmDateTime()" 
                    class="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    ${!this.selectedDate || !this.selectedTime ? 'disabled' : ''}>
                    Continuar
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
    }

    renderConfirmation() {
        const date = new Date(this.selectedDate);
        const formattedDate = date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

        return `
            <h2 class="text-xl font-bold text-gray-800 mb-6">Confirma tu reservacion</h2>
            
            <!-- Booking Summary -->
            <div class="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 class="font-semibold text-gray-800 mb-4">Resumen de tu cita</h3>
                
                <div class="space-y-4">
                    <div class="flex items-center justify-between py-3 border-b border-gray-200">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-store text-primary w-5"></i>
                            <span class="text-gray-600">Barberia</span>
                        </div>
                        <span class="font-medium text-gray-800">${this.barber.shopName}</span>
                    </div>
                    
                    <div class="flex items-center justify-between py-3 border-b border-gray-200">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-cut text-primary w-5"></i>
                            <span class="text-gray-600">Servicio</span>
                        </div>
                        <span class="font-medium text-gray-800">${this.selectedService.name}</span>
                    </div>
                    
                    <div class="flex items-center justify-between py-3 border-b border-gray-200">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-calendar text-primary w-5"></i>
                            <span class="text-gray-600">Fecha</span>
                        </div>
                        <span class="font-medium text-gray-800">${formattedDate}</span>
                    </div>
                    
                    <div class="flex items-center justify-between py-3 border-b border-gray-200">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-clock text-primary w-5"></i>
                            <span class="text-gray-600">Hora</span>
                        </div>
                        <span class="font-medium text-gray-800">${this.selectedTime}</span>
                    </div>
                    
                    <div class="flex items-center justify-between py-3 border-b border-gray-200">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-hourglass-half text-primary w-5"></i>
                            <span class="text-gray-600">Duracion</span>
                        </div>
                        <span class="font-medium text-gray-800">${this.selectedService.duration} minutos</span>
                    </div>
                    
                    <div class="flex items-center justify-between py-3">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-map-marker-alt text-primary w-5"></i>
                            <span class="text-gray-600">Direccion</span>
                        </div>
                        <span class="font-medium text-gray-800 text-right">${this.barber.location?.address || 'No especificada'}</span>
                    </div>
                </div>
            </div>

            <!-- Total -->
            <div class="bg-primary/10 rounded-xl p-6 mb-6">
                <div class="flex items-center justify-between">
                    <span class="text-lg font-medium text-gray-800">Total a pagar</span>
                    <span class="text-2xl font-bold text-primary">$${this.selectedService.price} MXN</span>
                </div>
            </div>

            <div class="flex justify-between mt-8">
                <button onclick="window.bookingManager.goToStep(2)" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <i class="fas fa-arrow-left"></i>
                    Atras
                </button>
                <button onclick="window.bookingManager.proceedToPayment()" class="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                    <i class="fas fa-credit-card"></i>
                    Proceder al pago
                </button>
            </div>
        `;
    }

    renderPayment() {
        return `
            <h2 class="text-xl font-bold text-gray-800 mb-6">Metodo de pago</h2>
            
            <!-- Payment Options -->
            <div class="space-y-3 mb-6">
                <label class="block cursor-pointer">
                    <input type="radio" name="payment" value="card" class="peer sr-only" checked>
                    <div class="border-2 border-gray-200 rounded-xl p-4 flex items-center gap-4 peer-checked:border-primary peer-checked:bg-primary/5 hover:border-gray-300 transition-all">
                        <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <i class="fas fa-credit-card text-blue-600 text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-800">Tarjeta de credito/debito</h3>
                            <p class="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                        </div>
                    </div>
                </label>
                
                <label class="block cursor-pointer">
                    <input type="radio" name="payment" value="cash" class="peer sr-only">
                    <div class="border-2 border-gray-200 rounded-xl p-4 flex items-center gap-4 peer-checked:border-primary peer-checked:bg-primary/5 hover:border-gray-300 transition-all">
                        <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <i class="fas fa-money-bill-wave text-green-600 text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-800">Pago en efectivo</h3>
                            <p class="text-sm text-gray-500">Paga al momento de tu cita</p>
                        </div>
                    </div>
                </label>
            </div>

            <!-- Card Form -->
            <div id="card-form" class="space-y-4 mb-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Numero de tarjeta</label>
                    <div class="relative">
                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19"
                            class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i class="fas fa-credit-card text-gray-400"></i>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de expiracion</label>
                        <input type="text" id="card-expiry" placeholder="MM/AA" maxlength="5"
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input type="text" id="card-cvv" placeholder="123" maxlength="4"
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
                    <input type="text" id="card-name" placeholder="Como aparece en la tarjeta"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary">
                </div>
            </div>

            <!-- Total -->
            <div class="bg-gray-50 rounded-xl p-4 mb-6">
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Total a pagar</span>
                    <span class="text-xl font-bold text-primary">$${this.selectedService.price} MXN</span>
                </div>
            </div>

            <!-- Security Note -->
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <i class="fas fa-lock text-green-500"></i>
                <span>Tus datos de pago estan protegidos con encriptacion SSL</span>
            </div>

            <div class="flex justify-between">
                <button onclick="window.bookingManager.goToStep(3)" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <i class="fas fa-arrow-left"></i>
                    Atras
                </button>
                <button onclick="window.bookingManager.processPayment()" class="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                    <i class="fas fa-lock"></i>
                    Pagar $${this.selectedService.price} MXN
                </button>
            </div>
        `;
    }

    renderSuccess() {
        const date = new Date(this.selectedDate);
        const formattedDate = date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

        return `
            <div class="text-center py-8">
                <div class="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-check text-green-500 text-4xl"></i>
                </div>
                
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Reservacion confirmada!</h2>
                <p class="text-gray-600 mb-8">Tu cita ha sido agendada exitosamente</p>
                
                <!-- Booking Details Card -->
                <div class="bg-gradient-to-br from-primary to-barber rounded-2xl p-6 text-white text-left max-w-sm mx-auto mb-8">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-white/80">Confirmacion</span>
                        <span class="font-mono font-bold">#${Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="flex items-center gap-3">
                            <i class="fas fa-store w-5"></i>
                            <span>${this.barber.shopName}</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <i class="fas fa-cut w-5"></i>
                            <span>${this.selectedService.name}</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <i class="fas fa-calendar w-5"></i>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <i class="fas fa-clock w-5"></i>
                            <span>${this.selectedTime}</span>
                        </div>
                    </div>
                    
                    <div class="border-t border-white/20 mt-4 pt-4 flex items-center justify-between">
                        <span>Total pagado</span>
                        <span class="text-xl font-bold">$${this.selectedService.price} MXN</span>
                    </div>
                </div>
                
                <p class="text-sm text-gray-500 mb-6">
                    Se ha enviado un correo de confirmacion con los detalles de tu cita
                </p>
                
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onclick="window.router.navigate('client-dashboard')" class="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors">
                        Ver mis citas
                    </button>
                    <button onclick="window.router.navigate('home')" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                        Volver al inicio
                    </button>
                </div>
            </div>
        `;
    }

    // Navigation methods
    selectService() {
        const selected = document.querySelector('input[name="service"]:checked');
        if (!selected) {
            window.app?.showToast('Selecciona un servicio', 'error');
            return;
        }
        
        this.selectedService = this.barber.services.find(s => s.id === selected.value);
        this.goToStep(2);
    }

    selectDate(dateStr) {
        this.selectedDate = dateStr;
        this.selectedTime = null;
        this.render();
    }

    selectTime(time) {
        this.selectedTime = time;
        this.render();
    }

    confirmDateTime() {
        if (!this.selectedDate || !this.selectedTime) {
            window.app?.showToast('Selecciona fecha y hora', 'error');
            return;
        }
        this.goToStep(3);
    }

    proceedToPayment() {
        if (!window.authManager?.isLoggedIn()) {
            window.app?.showToast('Inicia sesion para continuar', 'error');
            window.router.navigate('auth', { redirect: 'booking' });
            return;
        }
        this.goToStep(4);
    }

    processPayment() {
        const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
        
        if (paymentMethod === 'card') {
            const cardNumber = document.getElementById('card-number')?.value;
            const cardExpiry = document.getElementById('card-expiry')?.value;
            const cardCvv = document.getElementById('card-cvv')?.value;
            const cardName = document.getElementById('card-name')?.value;

            if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
                window.app?.showToast('Completa todos los campos de la tarjeta', 'error');
                return;
            }
        }

        // Simulate payment processing
        window.app?.showToast('Procesando pago...', 'success');
        
        setTimeout(() => {
            this.createBooking(paymentMethod);
        }, 1500);
    }

    createBooking(paymentMethod) {
        const user = window.authManager?.currentUser;
        
        const booking = {
            id: `booking_${Date.now()}`,
            barberId: this.barber.id,
            clientId: user?.id,
            serviceId: this.selectedService.id,
            serviceName: this.selectedService.name,
            date: this.selectedDate,
            time: this.selectedTime,
            duration: this.selectedService.duration,
            price: this.selectedService.price,
            paymentMethod,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        this.goToStep(5);
    }

    goToStep(step) {
        this.currentStep = step;
        this.render();
    }

    // Helper methods
    generateDates(days) {
        const dates = [];
        const today = new Date();
        
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        
        return dates;
    }

    generateTimeSlots() {
        if (!this.selectedDate) return [];

        const date = new Date(this.selectedDate);
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const schedule = this.barber.schedule?.[dayKey];

        if (!schedule?.available) return [];

        const slots = [];
        const [openHour, openMin] = (schedule.open || '09:00').split(':').map(Number);
        const [closeHour, closeMin] = (schedule.close || '18:00').split(':').map(Number);
        
        let currentHour = openHour;
        let currentMin = openMin;

        // Get existing bookings for this date
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const dateBookings = bookings.filter(b => 
            b.barberId === this.barber.id && 
            b.date === this.selectedDate && 
            b.status !== 'cancelled'
        );
        const bookedTimes = dateBookings.map(b => b.time);

        while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
            const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
            const label = this.formatTime(currentHour, currentMin);
            
            // Check if slot is available
            const isBooked = bookedTimes.includes(timeStr);
            const isPast = this.isTimePast(currentHour, currentMin);

            slots.push({
                value: timeStr,
                label,
                available: !isBooked && !isPast
            });

            // Increment by 30 minutes
            currentMin += 30;
            if (currentMin >= 60) {
                currentMin = 0;
                currentHour++;
            }
        }

        return slots;
    }

    formatTime(hour, min) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${String(min).padStart(2, '0')} ${period}`;
    }

    isTimePast(hour, min) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        if (this.selectedDate !== today) return false;

        const currentHour = now.getHours();
        const currentMin = now.getMinutes();

        return hour < currentHour || (hour === currentHour && min <= currentMin);
    }
}

// Initialize globally
window.bookingManager = new BookingManager();