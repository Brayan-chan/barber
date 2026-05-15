// ════════════════════════════════════════════
//  BOOKINGS MANAGEMENT
// ════════════════════════════════════════════

function initializeBookingsButton() {
    const btn = document.getElementById('my-bookings-btn');
    if (btn) {
        btn.addEventListener('click', showMyBookings);
    }
}

function showMyBookings() {
    const bookings = JSON.parse(localStorage.getItem('barber_bookings') || '[]');
    
    if (bookings.length === 0) {
        showBookingsModal([], true);
        return;
    }
    
    showBookingsModal(bookings);
}

function showBookingsModal(bookings, isEmpty = false) {
    const modal = document.getElementById('bookings-modal');
    
    if (!modal) {
        createBookingsModal();
        showBookingsModal(bookings, isEmpty);
        return;
    }
    
    const container = document.getElementById('bookings-list-container');
    
    if (isEmpty) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 3rem; margin-bottom: 16px;">📅</div>
                <h3 style="font-size: 1.2rem; font-weight: bold; margin-bottom: 8px; color: #374151;">No tienes citas agendadas</h3>
                <p style="color: #6b7280; margin-bottom: 20px;">
                    Usa nuestro análisis de IA para encontrar el barbero perfecto y agendar tu cita.
                </p>
                <a href="views/analysis.html" onclick="closeBookingsModal()" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background: #2563eb;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                ">Iniciar análisis</a>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 1.3rem; font-weight: bold; margin-bottom: 16px; color: #1f2937;">
                    ✂ Tus citas agendadas (${bookings.length})
                </h3>
                ${bookings.map((booking, index) => renderBookingCard(booking, index)).join('')}
            </div>
        `;
    }
    
    modal.style.display = 'flex';
}

function renderBookingCard(booking, index) {
    const date = new Date(booking.date);
    const dateStr = date.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    return `
        <div style="
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        ">
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <img src="${booking.barber.images[0]}" alt="${booking.barber.name}" style="
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        object-fit: cover;
                        margin-right: 12px;
                    ">
                    <div>
                        <h4 style="font-weight: bold; font-size: 1rem; color: #1f2937; margin-bottom: 2px;">
                            ${booking.barber.name}
                        </h4>
                        <p style="font-size: 0.85rem; color: #6b7280;">
                            ${booking.barber.specialty}
                        </p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: auto auto; gap: 16px; margin-top: 12px; font-size: 0.9rem; color: #6b7280;">
                    <div>
                        <span style="color: #1f2937; font-weight: bold;">📅 Fecha:</span> ${dateStr}
                    </div>
                    <div>
                        <span style="color: #1f2937; font-weight: bold;">🕐 Hora:</span> ${booking.time}
                    </div>
                </div>
                
                <div style="margin-top: 8px; font-size: 0.9rem; color: #6b7280;">
                    <span style="color: #1f2937; font-weight: bold;">👤 Cliente:</span> ${booking.clientName} • ${booking.clientPhone}
                </div>
                
                ${booking.notes ? `
                    <div style="margin-top: 8px; font-size: 0.85rem; color: #6b7280;">
                        <span style="color: #1f2937; font-weight: bold;">📝 Notas:</span> ${booking.notes}
                    </div>
                ` : ''}
                
                <div style="margin-top: 12px; padding: 8px; background: #f3f4f6; border-radius: 4px;">
                    <p style="font-size: 0.8rem; color: #6b7280;">
                        <span style="color: #059669; font-weight: bold;">✓ Confirmada</span> • Creada el ${new Date(booking.createdAt).toLocaleDateString('es-MX')}
                    </p>
                </div>
            </div>
            
            <div style="margin-left: 12px; display: flex; gap: 8px;">
                <button onclick="editBooking(${index})" style="
                    padding: 8px 12px;
                    background: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.3s;
                " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                    ✎ Editar
                </button>
                <button onclick="cancelBooking(${index})" style="
                    padding: 8px 12px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.3s;
                " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                    ✕ Cancelar
                </button>
            </div>
        </div>
    `;
}

function createBookingsModal() {
    const modal = document.createElement('div');
    modal.id = 'bookings-modal';
    modal.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            padding: 32px;
            max-width: 700px;
            width: 95%;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3)
        ">
            <button onclick="closeBookingsModal()" style="
                float: right;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
            ">✕</button>
            <div id="bookings-list-container"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBookingsModal();
        }
    });
}

function closeBookingsModal() {
    const modal = document.getElementById('bookings-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function editBooking(index) {
    const bookings = JSON.parse(localStorage.getItem('barber_bookings') || '[]');
    const booking = bookings[index];
    
    if (!booking) return;
    
    // Show edit form (simplified)
    alert(`Función de edición no implementada aún.\n\nCita con ${booking.barber.name} el ${booking.date} a las ${booking.time}`);
}

function cancelBooking(index) {
    const bookings = JSON.parse(localStorage.getItem('barber_bookings') || '[]');
    const booking = bookings[index];
    
    if (!booking) return;
    
    if (confirm(`¿Deseas cancelar tu cita con ${booking.barber.name} el ${booking.date}?`)) {
        bookings.splice(index, 1);
        localStorage.setItem('barber_bookings', JSON.stringify(bookings));
        
        // Refresh the modal
        showMyBookings();
        showToast('✓ Cita cancelada correctamente', 'success');
    }
}

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
        info: '#3b82f6',
        error: '#ef4444',
        success: '#10b981'
    };
    
    toast.textContent = msg;
    toast.style.background = colors[type] || colors.info;
    toast.style.color = 'white';
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeBookingsButton);
