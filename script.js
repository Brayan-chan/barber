// Datos de ejemplo de barberos
const barbersData = [
    {
        id: 1,
        name: "Carlos Martínez",
        specialty: "Cortes clásicos",
        experience: 8,
        location: "Centro Histórico",
        rating: 4.8,
        reviews: 45,
        price: 250,
        description: "Especializado en cortes clásicos y tradicionales con más de 8 años de experiencia. Carlos se destaca por su atención al detalle y su habilidad para crear estilos que se adaptan a la personalidad de cada cliente.",
        services: [
            { name: "Corte clásico", price: 250, duration: "30 min" },
            { name: "Afeitado con navaja", price: 180, duration: "25 min" },
            { name: "Corte y afeitado", price: 380, duration: "50 min" },
            { name: "Arreglo de barba", price: 120, duration: "20 min" }
        ],
        images: [
            "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        ],
        isFeatured: true
    },
    {
        id: 2,
        name: "Luis Fernández",
        specialty: "Barbas y bigotes",
        experience: 5,
        location: "Polanco",
        rating: 4.6,
        reviews: 32,
        price: 300,
        description: "Experto en diseño y mantenimiento de barbas. Luis tiene un ojo excepcional para la simetría y la forma, creando estilos de barba que complementan la estructura facial de cada cliente.",
        services: [
            { name: "Diseño de barba", price: 300, duration: "40 min" },
            { name: "Mantenimiento de barba", price: 180, duration: "25 min" },
            { name: "Afeitado tradicional", price: 220, duration: "30 min" }
        ],
        images: [
            "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        ],
        isFeatured: true
    },
    {
        id: 3,
        name: "Miguel Ángel",
        specialty: "Diseño moderno",
        experience: 10,
        location: "Roma Norte",
        rating: 4.9,
        reviews: 67,
        price: 350,
        description: "Pionero en cortes modernos y de vanguardia. Miguel combina técnicas tradicionales con las últimas tendencias para crear looks únicos y personalizados.",
        services: [
            { name: "Corte moderno", price: 350, duration: "45 min" },
            { name: "Diseño con navaja", price: 280, duration: "35 min" },
            { name: "Coloración profesional", price: 500, duration: "60 min" }
        ],
        images: [
            "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
        ],
        isFeatured: true
    },
    {
        id: 4,
        name: "Jorge Ramírez",
        specialty: "Corte infantil",
        experience: 3,
        location: "Condesa",
        rating: 4.3,
        reviews: 18,
        price: 180,
        description: "Especialista en cortes para niños, Jorge hace que la experiencia sea divertida y sin estrés. Su paciencia y habilidad lo hacen el favorito de las familias.",
        services: [
            { name: "Corte infantil", price: 180, duration: "25 min" },
            { name: "Corte para adolescentes", price: 220, duration: "30 min" }
        ],
        images: [
            "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
        ],
        isFeatured: false
    },
    {
        id: 5,
        name: "Roberto Sánchez",
        specialty: "Tratamientos capilares",
        experience: 7,
        location: "Coyoacán",
        rating: 4.7,
        reviews: 41,
        price: 400,
        description: "Experto en salud capilar y tratamientos especializados. Roberto utiliza productos de alta calidad y técnicas avanzadas para mejorar la salud del cabello.",
        services: [
            { name: "Tratamiento capilar", price: 400, duration: "50 min" },
            { name: "Corte y tratamiento", price: 550, duration: "70 min" }
        ],
        images: [
            "https://i.pinimg.com/1200x/6b/85/7f/6b857f717acab8c97f57a325e6fd6a4d.jpg"
        ],
        isFeatured: false
    },
    {
        id: 6,
        name: "Fernando López",
        specialty: "Estilos retro",
        experience: 6,
        location: "Nápoles",
        rating: 4.5,
        reviews: 29,
        price: 280,
        description: "Especialista en estilos retro y vintage. Fernando domina técnicas de los años 20s a los 70s, recreando looks icónicos con un toque moderno.",
        services: [
            { name: "Corte retro", price: 280, duration: "40 min" },
            { name: "Afeitado clásico", price: 200, duration: "30 min" }
        ],
        images: [
            "https://i.pinimg.com/736x/61/84/f8/6184f814c0e45527e449f9a5ba8ad6d4.jpg"
        ],
        isFeatured: false
    },
    {
        id: 7,
        name: "Antonio García",
        specialty: "Fade y degradados",
        experience: 4,
        location: "Del Valle",
        rating: 4.4,
        reviews: 26,
        price: 320,
        description: "Maestro en técnicas de fade y degradados. Antonio crea transiciones perfectas y diseños precisos que destacan por su limpieza y definición.",
        services: [
            { name: "Fade completo", price: 320, duration: "45 min" },
            { name: "Degradado con diseño", price: 380, duration: "55 min" }
        ],
        images: [
            "https://i.pinimg.com/736x/43/da/46/43da4640187f96c54ba316980fba090b.jpg"
        ],
        isFeatured: false
    },
    {
        id: 8,
        name: "David Hernández",
        specialty: "Cortes ejecutivos",
        experience: 9,
        location: "Santa Fe",
        rating: 4.8,
        reviews: 52,
        price: 300,
        description: "Especializado en cortes para profesionales. David ofrece un servicio expedito y de alta calidad para clientes con agendas ocupadas, sin sacrificar atención al detalle.",
        services: [
            { name: "Corte ejecutivo", price: 300, duration: "30 min" },
            { name: "Servicio exprés", price: 250, duration: "25 min" }
        ],
        images: [
            "https://i.pinimg.com/474x/6f/4b/c5/6f4bc567ad70479f58c36bf0ef14b48e.jpg"
        ],
        isFeatured: false
    }
];

// Datos de reseñas
const reviewsData = [
    {
        id: 1,
        barberId: 1,
        clientName: "Juan Pérez",
        rating: 5,
        comment: "Excelente servicio, Carlos es muy profesional y atento a los detalles. Mi corte quedó perfecto.",
        date: "Hace 2 semanas"
    },
    {
        id: 2,
        barberId: 1,
        clientName: "Roberto Gómez",
        rating: 4,
        comment: "Muy buen trabajo, el lugar es limpio y cómodo. Volveré sin duda.",
        date: "Hace 1 mes"
    },
    {
        id: 3,
        barberId: 2,
        clientName: "Fernando López",
        rating: 5,
        comment: "Luis es el mejor para el cuidado de barbas. Siempre queda impecable.",
        date: "Hace 3 semanas"
    },
    {
        id: 4,
        barberId: 3,
        clientName: "Andrés Sánchez",
        rating: 5,
        comment: "Miguel es un artista. Siempre innovando con estilos modernos.",
        date: "Hace 2 meses"
    }
];

// Variables globales
let currentBarberDetail = null;
let selectedDate = null;
let selectedTime = null;
let selectedService = null;

// Cargar lista de barberos
function loadBarbers() {
    const container = document.getElementById('barbers-list');
    container.innerHTML = '';

    barbersData.forEach(barber => {
        const barberHTML = `
                    <div class="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all cursor-pointer" onclick="showBarberDetail(${barber.id})">
                        <div class="relative">
                            <img src="${barber.images[0]}" alt="${barber.name}" class="w-full h-56 object-cover">
                            <button class="absolute top-4 right-4 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-all">
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
                                    <i class="fas fa-star text-yellow-500 mr-1"></i>
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
                                <button class="text-blue-600 font-medium hover:text-blue-800 transition-all">
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    </div>
                `;
        container.innerHTML += barberHTML;
    });
}

// Cargar barberos destacados
function loadFeaturedBarbers() {
    const container = document.getElementById('featured-barbers');
    container.innerHTML = '';

    const featured = barbersData.filter(barber => barber.isFeatured).slice(0, 3);

    featured.forEach(barber => {
        const barberHTML = `
                    <div class="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all cursor-pointer" onclick="showBarberDetail(${barber.id})">
                        <div class="relative">
                            <img src="${barber.images[0]}" alt="${barber.name}" class="w-full h-64 object-cover">
                            <div class="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                Destacado
                            </div>
                        </div>
                        
                        <div class="p-5">
                            <div class="flex justify-between items-start mb-3">
                                <h3 class="font-bold text-gray-800 text-xl">${barber.name}</h3>
                                <div class="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                    <i class="fas fa-star mr-1"></i>
                                    <span class="font-bold">${barber.rating}</span>
                                </div>
                            </div>
                            
                            <p class="text-gray-600 mb-4">${barber.specialty} • ${barber.experience} años de experiencia</p>
                            
                            <div class="flex justify-between items-center">
                                <div>
                                    <span class="font-bold text-gray-800 text-lg">$${barber.price} MXN</span>
                                    <p class="text-gray-500 text-sm">servicio básico</p>
                                </div>
                                <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-all">
                                    Reservar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
        container.innerHTML += barberHTML;
    });
}

// Mostrar detalles del barbero
function showBarberDetail(barberId) {
    const barber = barbersData.find(b => b.id === barberId);
    if (!barber) return;

    currentBarberDetail = barber;

    // Actualizar información en el modal
    document.getElementById('barber-modal-name').textContent = barber.name;
    document.getElementById('barber-modal-rating').textContent = barber.rating;
    document.getElementById('barber-modal-reviews').textContent = `${barber.reviews} evaluaciones`;
    document.getElementById('barber-modal-location').textContent = barber.location;
    document.getElementById('barber-modal-main-image').src = barber.images[0];
    document.getElementById('barber-modal-avatar').textContent = barber.name.charAt(0);
    document.getElementById('barber-modal-full-name').textContent = barber.name;
    document.getElementById('barber-modal-specialty').textContent = barber.specialty;
    document.getElementById('barber-modal-experience').textContent = `${barber.experience} años de experiencia`;
    document.getElementById('barber-modal-description').textContent = barber.description;

    // Cargar servicios
    const servicesContainer = document.getElementById('barber-modal-services');
    servicesContainer.innerHTML = '';
    barber.services.forEach(service => {
        const serviceHTML = `
                    <div class="flex justify-between items-center bg-white rounded-lg p-3">
                        <div>
                            <p class="font-medium text-gray-800">${service.name}</p>
                            <p class="text-sm text-gray-500">${service.duration}</p>
                        </div>
                        <span class="font-bold text-gray-800">$${service.price} MXN</span>
                    </div>
                `;
        servicesContainer.innerHTML += serviceHTML;
    });

    // Cargar servicios para reserva
    const bookingServicesContainer = document.getElementById('booking-services');
    bookingServicesContainer.innerHTML = '';
    barber.services.forEach(service => {
        const serviceHTML = `
                    <div class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-all cursor-pointer" onclick="selectService(${service.price}, '${service.name}')">
                        <div class="h-5 w-5 border border-gray-300 rounded-full mr-3 flex items-center justify-center">
                            <div class="h-3 w-3 bg-blue-500 rounded-full hidden"></div>
                        </div>
                        <div class="flex-1">
                            <p class="font-medium text-gray-800">${service.name}</p>
                            <p class="text-sm text-gray-500">${service.duration}</p>
                        </div>
                        <span class="font-bold text-gray-800">$${service.price} MXN</span>
                    </div>
                `;
        bookingServicesContainer.innerHTML += serviceHTML;
    });

    // Cargar reseñas
    const barberReviews = reviewsData.filter(r => r.barberId === barberId);
    const reviewsContainer = document.getElementById('barber-modal-reviews-list');
    reviewsContainer.innerHTML = '';

    barberReviews.forEach(review => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= review.rating) {
                stars += '<i class="fas fa-star text-yellow-500"></i>';
            } else {
                stars += '<i class="far fa-star text-gray-300"></i>';
            }
        }

        const reviewHTML = `
                    <div class="border-b border-gray-100 pb-6">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h5 class="font-bold text-gray-800">${review.clientName}</h5>
                                <div class="flex items-center mt-1">
                                    ${stars}
                                </div>
                            </div>
                            <span class="text-gray-500 text-sm">${review.date}</span>
                        </div>
                        <p class="text-gray-700">${review.comment}</p>
                    </div>
                `;
        reviewsContainer.innerHTML += reviewHTML;
    });

    // Generar calendario
    generateCalendar();

    // Generar horarios disponibles
    generateTimeSlots();

    // Mostrar modal
    const modal = document.getElementById('barber-detail-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Seleccionar primer servicio por defecto
    if (barber.services.length > 0) {
        selectService(barber.services[0].price, barber.services[0].name);
    }
}

// Generar calendario
function generateCalendar() {
    const container = document.getElementById('calendar-days');
    container.innerHTML = '';

    // Días del mes actual (ejemplo)
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Primer día del mes
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Último día del mes
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Días de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    const firstDayOfWeek = firstDay.getDay();
    // Ajustar para que la semana empiece en lunes
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Días del mes anterior (para completar la primera semana)
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

    // Generar días del mes anterior
    for (let i = offset - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const dayElement = document.createElement('div');
        dayElement.className = 'text-gray-300 calendar-day disabled';
        dayElement.textContent = day;
        container.appendChild(dayElement);
    }

    // Generar días del mes actual
    const totalDays = lastDay.getDate();
    const todayDate = today.getDate();

    for (let day = 1; day <= totalDays; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'py-2 cursor-pointer hover:bg-gray-100 rounded-full transition-all calendar-day';
        dayElement.textContent = day;

        // Marcar hoy
        if (day === todayDate) {
            dayElement.classList.add('font-bold', 'text-blue-600');
        }

        // Seleccionar una fecha por defecto (hoy + 3 días)
        if (day === todayDate + 3) {
            dayElement.classList.add('selected');
            selectedDate = `${day}/${currentMonth + 1}/${currentYear}`;
        }

        dayElement.addEventListener('click', () => {
            // Remover selección anterior
            document.querySelectorAll('.calendar-day.selected').forEach(el => {
                el.classList.remove('selected');
            });

            // Seleccionar nuevo día
            dayElement.classList.add('selected');
            selectedDate = `${day}/${currentMonth + 1}/${currentYear}`;
        });

        container.appendChild(dayElement);
    }

    // Calcular días restantes para completar la última semana (6 filas)
    const totalCells = 42; // 6 semanas * 7 días
    const remainingCells = totalCells - (offset + totalDays);

    // Generar días del siguiente mes
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'text-gray-300 calendar-day disabled';
        dayElement.textContent = day;
        container.appendChild(dayElement);
    }
}

// Generar horarios disponibles
function generateTimeSlots() {
    const container = document.getElementById('time-slots');
    container.innerHTML = '';

    const timeSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '1:00 PM', '2:00 PM',
        '3:00 PM', '4:00 PM', '5:00 PM'
    ];

    timeSlots.forEach(time => {
        const timeElement = document.createElement('button');
        timeElement.type = 'button';
        timeElement.className = 'py-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all';
        timeElement.textContent = time;

        // Seleccionar un horario por defecto
        if (time === '11:00 AM') {
            timeElement.classList.add('border-blue-500', 'bg-blue-50');
            selectedTime = time;
        }

        timeElement.addEventListener('click', () => {
            // Remover selección anterior
            document.querySelectorAll('#time-slots button').forEach(el => {
                el.classList.remove('border-blue-500', 'bg-blue-50');
            });

            // Seleccionar nuevo horario
            timeElement.classList.add('border-blue-500', 'bg-blue-50');
            selectedTime = time;
        });

        container.appendChild(timeElement);
    });
}

// Seleccionar servicio
function selectService(price, name) {
    selectedService = { price, name };

    // Actualizar UI
    document.querySelectorAll('#booking-services > div').forEach(el => {
        const radio = el.querySelector('.h-3.w-3');
        radio.classList.add('hidden');
    });

    // Marcar como seleccionado
    event.currentTarget.querySelector('.h-3.w-3').classList.remove('hidden');

    // Actualizar resumen de reserva
    document.querySelector('#booking-services + .border-t .flex:first-child span:last-child').textContent = `$${price} MXN`;
    document.querySelector('#booking-services + .border-t .flex:last-child span:last-child').textContent = `$${price + 50} MXN`;
}

// Mostrar modal de login
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Cerrar modal
function closeModal() {
    document.getElementById('barber-detail-modal').classList.add('hidden');
    document.getElementById('barber-detail-modal').classList.remove('flex');

    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('login-modal').classList.remove('flex');
}

// Inicializar la aplicación
function initApp() {
    // Cargar barberos
    loadBarbers();
    loadFeaturedBarbers();

    // Configurar eventos de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Filtrar barberos según la categoría
            const filter = this.textContent.trim();
            // En una implementación real, aquí filtrarías los barberos
        });
    });

    // Configurar botón de cambio de ubicación
    document.getElementById('change-location-btn').addEventListener('click', () => {
        const city = prompt('Ingresa tu ciudad:');
        if (city) {
            document.getElementById('current-city').textContent = city;
        }
    });

    // Configurar búsqueda
    document.getElementById('search-input').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        // En una implementación real, aquí filtrarías los barberos
    });

    // Configurar botón de usuario
    document.getElementById('user-menu-btn').addEventListener('click', showLoginModal);

    // Configurar cierre de modales
    document.getElementById('close-barber-modal').addEventListener('click', closeModal);
    document.getElementById('close-login-modal').addEventListener('click', closeModal);

    // Configurar formulario de login
    document.getElementById('login-form').addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Inicio de sesión exitoso (simulado). En una aplicación real, aquí se validarían las credenciales.');
        closeModal();
    });

    // Configurar cambio a registro
    document.getElementById('switch-to-register').addEventListener('click', function () {
        document.querySelector('#login-modal h3').textContent = 'Registrarse';
        document.querySelector('#login-form button[type="submit"]').textContent = 'Registrarse';
        document.querySelector('#switch-to-register').textContent = 'Iniciar sesión';
    });

    // Configurar botón de reserva
    document.getElementById('book-now-btn').addEventListener('click', function () {
        if (!selectedDate || !selectedTime || !selectedService) {
            alert('Por favor, selecciona fecha, hora y servicio antes de reservar.');
            return;
        }

        if (!currentBarberDetail) return;

        const confirmBooking = confirm(`¿Confirmar reserva con ${currentBarberDetail.name}?\n\nFecha: ${selectedDate}\nHora: ${selectedTime}\nServicio: ${selectedService.name}\nTotal: $${selectedService.price + 50} MXN`);

        if (confirmBooking) {
            alert('¡Reserva confirmada! Te hemos enviado un correo con los detalles. En una aplicación real, aquí se procesaría el pago.');
            closeModal();
        }
    });

    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('barber-detail-modal')) {
            closeModal();
        }
        if (event.target === document.getElementById('login-modal')) {
            closeModal();
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);