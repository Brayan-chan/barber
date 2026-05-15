// ════════════════════════════════════════════
//  BARBERSHOP DATABASE
// ════════════════════════════════════════════
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
        description: "Especializado en cortes clásicos y tradicionales con más de 8 años de experiencia.",
        specialties: ["clásico", "elegante", "ejecutivo", "formal"],
        images: ["https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
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
        description: "Experto en diseño y mantenimiento de barbas.",
        specialties: ["barba", "diseño", "mantenimiento"],
        images: ["https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
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
        description: "Pionero en cortes modernos y de vanguardia con técnicas tradicionales.",
        specialties: ["moderno", "fade", "degradado", "texturado", "urbano", "contemporáneo"],
        images: ["https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
    },
    {
        id: 4,
        name: "Antonio García",
        specialty: "Fade y degradados",
        experience: 4,
        location: "Del Valle",
        rating: 4.4,
        reviews: 26,
        price: 320,
        description: "Maestro en técnicas de fade y degradados con transiciones perfectas.",
        specialties: ["fade", "degradado", "skin fade", "drop fade", "textura"],
        images: ["https://images.unsplash.com/photo-1567894340315-6d5f4c2e5c58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
    },
    {
        id: 5,
        name: "David Hernández",
        specialty: "Cortes ejecutivos",
        experience: 9,
        location: "Santa Fe",
        rating: 4.8,
        reviews: 52,
        price: 300,
        description: "Especializado en cortes para profesionales de alta calidad.",
        specialties: ["ejecutivo", "formal", "profesional", "clásico", "moderno"],
        images: ["https://images.unsplash.com/photo-1593702275686-2b4b3d0f5f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
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
        description: "Especialista en estilos retro y vintage con toque moderno.",
        specialties: ["retro", "vintage", "clásico", "pompadour", "slick"],
        images: ["https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]
    }
];

// ════════════════════════════════════════════
//  BOOKING STATE
// ════════════════════════════════════════════
const bookingState = {
    selectedBarber: null,
    selectedDate: null,
    selectedTime: null,
    clientName: null,
    clientPhone: null,
    clientEmail: null,
    analysis: null
};

// ════════════════════════════════════════════
//  RECOMMEND BARBERS
// ════════════════════════════════════════════
function recommendBarbers(analysis) {
    const cutName = (analysis.corte_nombre || '').toLowerCase();
    const faceType = (analysis.rostro || '').toLowerCase();
    
    // Score each barber based on their specialties
    const scoredBarbers = barbersData.map(barber => {
        let score = 0;
        
        // Check for specialty matches
        barber.specialties.forEach(spec => {
            if (cutName.includes(spec) || spec.includes(cutName.split(' ')[0])) {
                score += 3;
            }
        });
        
        // Match common patterns
        if ((cutName.includes('fade') || cutName.includes('degradado')) && 
            barber.specialties.some(s => s.includes('fade') || s.includes('degradado'))) {
            score += 5;
        }
        
        if ((cutName.includes('pompadour') || cutName.includes('quiff')) && 
            barber.specialties.some(s => s.includes('retro') || s.includes('moderno'))) {
            score += 4;
        }
        
        if ((cutName.includes('clásico') || cutName.includes('ejecutivo') || cutName.includes('formal')) &&
            barber.specialties.some(s => s.includes('clásico') || s.includes('ejecutivo') || s.includes('formal'))) {
            score += 5;
        }
        
        if ((cutName.includes('urbano') || cutName.includes('moderno') || cutName.includes('contemporáneo')) &&
            barber.specialties.some(s => s.includes('moderno') || s.includes('urbano') || s.includes('contemporáneo'))) {
            score += 5;
        }
        
        // Add rating boost
        score += (barber.rating / 5) * 2;
        
        return { barber, score };
    });
    
    // Sort by score descending
    return scoredBarbers
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => item.barber);
}

// ════════════════════════════════════════════
//  RENDER BARBER RECOMMENDATIONS
// ════════════════════════════════════════════
function renderBarberRecommendations(recommendations) {
    const container = document.getElementById('barber-recommendations-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="recommendations-header">
            <h3 style="font-size:1.5rem;font-weight:bold;margin-bottom:8px">
                <span style="color:var(--gold)">💈 Barberos Recomendados</span>
            </h3>
            <p style="color:var(--muted);font-size:0.9rem;margin-bottom:20px">
                Basado en tu análisis, estos barberos pueden realizar tu corte perfectamente.
            </p>
        </div>
        
        <div class="recommendations-grid">
            ${recommendations.map(barber => `
                <div class="recommendation-card">
                    <div class="recommendation-image">
                        <img src="${barber.images[0]}" alt="${barber.name}" style="width:100%;height:200px;object-fit:cover;border-radius:8px 8px 0 0">
                        <div style="position:absolute;top:10px;right:10px;background:var(--gold);color:var(--ink);padding:4px 8px;border-radius:4px;font-size:0.8rem;font-weight:bold">
                            ⭐ ${barber.rating}
                        </div>
                    </div>
                    
                    <div class="recommendation-info">
                        <h4 style="font-weight:bold;margin-bottom:4px;color:var(--paper)">${barber.name}</h4>
                        <p style="font-size:0.85rem;color:var(--gold);margin-bottom:8px">${barber.specialty}</p>
                        
                        <div style="display:flex;gap:8px;margin-bottom:12px;font-size:0.8rem;color:var(--muted)">
                            <span>📍 ${barber.location}</span>
                            <span>•</span>
                            <span>💼 ${barber.experience} años</span>
                        </div>
                        
                        <p style="font-size:0.85rem;color:var(--muted);margin-bottom:12px;line-height:1.4">
                            ${barber.description}
                        </p>
                        
                        <div style="border-top:1px solid rgba(201,168,76,0.2);padding-top:12px;margin-top:12px;display:flex;justify-content:space-between;align-items:center">
                            <span style="font-size:0.9rem;font-weight:bold;color:var(--paper)">
                                💰 Desde $${barber.price} MXN
                            </span>
                            <button onclick="openBookingModal(${barber.id})" style="
                                background:var(--gold);
                                color:var(--ink);
                                border:none;
                                padding:6px 12px;
                                border-radius:4px;
                                cursor:pointer;
                                font-weight:bold;
                                font-size:0.8rem;
                                transition:all 0.3s
                            " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                                Agendar cita →
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ════════════════════════════════════════════
//  BOOKING MODAL
// ════════════════════════════════════════════
function openBookingModal(barberId) {
    const barber = barbersData.find(b => b.id === barberId);
    if (!barber) return;
    
    bookingState.selectedBarber = barber;
    
    const modal = document.getElementById('booking-modal');
    if (!modal) {
        createBookingModal();
        openBookingModal(barberId);
        return;
    }
    
    modal.style.display = 'flex';
    renderBookingForm(barber);
}

function createBookingModal() {
    const modal = document.createElement('div');
    modal.id = 'booking-modal';
    modal.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 9999;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(2px);
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--ink);
            border: 1px solid rgba(201,168,76,0.3);
            border-radius: 12px;
            padding: 32px;
            max-width: 600px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.8)
        " id="booking-modal-content">
            <button onclick="closeBookingModal()" style="
                float: right;
                background: none;
                border: none;
                color: var(--gold);
                font-size: 1.5rem;
                cursor: pointer;
            ">✕</button>
            <div id="booking-form-container"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBookingModal();
        }
    });
}

function renderBookingForm(barber) {
    const container = document.getElementById('booking-form-container');
    
    container.innerHTML = `
        <div style="margin-bottom: 20px">
            <h2 style="color: var(--gold); font-size: 1.5rem; margin-bottom: 8px">
                💈 Agendar Cita con ${barber.name}
            </h2>
            <p style="color: var(--muted); font-size: 0.9rem">
                ${barber.specialty} • ${barber.location}
            </p>
        </div>
        
        <form id="booking-form" onsubmit="submitBooking(event)">
            <!-- Personal Information -->
            <div style="margin-bottom: 16px">
                <label style="color: var(--paper); font-weight: bold; display: block; margin-bottom: 6px">Tu nombre</label>
                <input type="text" id="client-name" required style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid rgba(201,168,76,0.3);
                    border-radius: 6px;
                    background: rgba(201,168,76,0.05);
                    color: var(--paper);
                    font-size: 0.95rem;
                " placeholder="Juan Pérez">
            </div>
            
            <div style="margin-bottom: 16px">
                <label style="color: var(--paper); font-weight: bold; display: block; margin-bottom: 6px">Tu teléfono</label>
                <input type="tel" id="client-phone" required style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid rgba(201,168,76,0.3);
                    border-radius: 6px;
                    background: rgba(201,168,76,0.05);
                    color: var(--paper);
                    font-size: 0.95rem;
                " placeholder="+55 9999-9999">
            </div>
            
            <div style="margin-bottom: 16px">
                <label style="color: var(--paper); font-weight: bold; display: block; margin-bottom: 6px">Tu correo</label>
                <input type="email" id="client-email" required style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid rgba(201,168,76,0.3);
                    border-radius: 6px;
                    background: rgba(201,168,76,0.05);
                    color: var(--paper);
                    font-size: 0.95rem;
                " placeholder="juan@example.com">
            </div>
            
            <!-- Date & Time -->
            <div style="margin-bottom: 16px">
                <label style="color: var(--paper); font-weight: bold; display: block; margin-bottom: 6px">Fecha preferida</label>
                <input type="date" id="booking-date" required style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid rgba(201,168,76,0.3);
                    border-radius: 6px;
                    background: rgba(201,168,76,0.05);
                    color: var(--paper);
                    font-size: 0.95rem;
                ">
            </div>
            
            <div style="margin-bottom: 16px">
                <label style="color: var(--paper); font-weight: bold; display: block; margin-bottom: 6px">Hora preferida</label>
                <select id="booking-time" required style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid rgba(201,168,76,0.3);
                    border-radius: 6px;
                    background: rgba(201,168,76,0.05);
                    color: var(--paper);
                    font-size: 0.95rem;
                ">
                    <option value="">Selecciona una hora</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="09:30">09:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="14:30">2:30 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="15:30">3:30 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="16:30">4:30 PM</option>
                    <option value="17:00">5:00 PM</option>
                </select>
            </div>
            
            <!-- Notes -->
            <div style="margin-bottom: 20px">
                <label style="color: var(--paper); font-weight: bold; display: block; margin-bottom: 6px">Notas adicionales (opcional)</label>
                <textarea id="booking-notes" style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid rgba(201,168,76,0.3);
                    border-radius: 6px;
                    background: rgba(201,168,76,0.05);
                    color: var(--paper);
                    font-size: 0.95rem;
                    resize: vertical;
                    min-height: 80px;
                    font-family: inherit;
                " placeholder="Ej: Traer mi análisis de IA, referencia de mi corte favorito..."></textarea>
            </div>
            
            <!-- Buttons -->
            <div style="display: flex; gap: 12px">
                <button type="submit" style="
                    flex: 1;
                    padding: 12px;
                    background: var(--gold);
                    color: var(--ink);
                    border: none;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                    ✓ Confirmar Cita
                </button>
                <button type="button" onclick="closeBookingModal()" style="
                    flex: 1;
                    padding: 12px;
                    background: rgba(201,168,76,0.1);
                    color: var(--gold);
                    border: 1px solid rgba(201,168,76,0.3);
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                    Cancelar
                </button>
            </div>
        </form>
    `;
}

function submitBooking(event) {
    event.preventDefault();
    
    const name = document.getElementById('client-name').value;
    const phone = document.getElementById('client-phone').value;
    const email = document.getElementById('client-email').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const notes = document.getElementById('booking-notes').value;
    
    const booking = {
        id: Date.now(),
        barber: bookingState.selectedBarber,
        clientName: name,
        clientPhone: phone,
        clientEmail: email,
        date: date,
        time: time,
        notes: notes,
        analysis: bookingState.analysis,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem('barber_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('barber_bookings', JSON.stringify(bookings));
    
    // Close modal
    closeBookingModal();
    
    // Show success message
    showToast(`✓ ¡Cita agendada con ${bookingState.selectedBarber.name}! Te confirmaremos pronto a ${email}`, 'info');
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ════════════════════════════════════════════
//  TOAST NOTIFICATION
// ════════════════════════════════════════════
function showToast(msg, type = 'info') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 16px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        document.body.appendChild(toast);
    }
    
    const colors = {
        info: 'var(--gold)',
        error: 'var(--rust)',
        success: '#4ade80'
    };
    
    toast.textContent = msg;
    toast.style.background = colors[type] || colors.info;
    toast.style.color = type === 'info' ? 'var(--ink)' : 'white';
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}
