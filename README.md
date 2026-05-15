# Sistema de Agendamiento de Citas - ControlBarber

## 🎯 Funcionalidades Implementadas

### 1. **Análisis de IA** (`views/analysis.html`)
- Carga de foto (upload o cámara)
- Análisis facial automatizado
- Recomendación de corte personalizado
- Preview visual del corte

### 2. **Recomendación de Barberos** 
Después del análisis, el sistema:
- Analiza el corte recomendado
- Busca barberos especializados en ese tipo de corte
- Muestra los 3 mejores barberos
- Permite ver detalles de cada barbero

### 3. **Sistema de Agendamiento**
- Agendar cita directamente desde la recomendación de barbero
- Recopilar datos del cliente (nombre, teléfono, email)
- Seleccionar fecha y hora
- Guardar notas adicionales

### 4. **Gestión de Citas**
- Ver todas las citas agendadas
- Botón "Mis citas" en la navegación principal
- Cancelar citas
- Opción para editar (framework para futuro)

## 📁 Estructura de Archivos

```
barber/
├── js/
│   ├── booking.js           # Sistema de recomendación y agendamiento
│   ├── bookings-ui.js       # Interfaz de gestión de citas
│   ├── ai_analysis.js       # Análisis de IA
│   └── index.js             # Funcionalidades principales
├── css/
│   ├── analysis.css         # Estilos del análisis
│   └── recommendations.css  # Estilos de recomendaciones
├── views/
│   └── analysis.html        # Página de análisis
├── index.html               # Página principal
└── README.md                # Este archivo
```

## 🚀 Cómo Funciona el Flujo

### Paso 1: Usuario carga la página principal
- Ve el sistema de IA promocionado
- Botón "Comenzar Análisis Ahora"

### Paso 2: Usuario va a análisis.html
- Elige modo (Guiado, Descubrir, Sorpresa)
- Sube foto o toma selfie
- Responde preguntas (si es modo guiado)

### Paso 3: IA Genera Análisis
- La IA analiza el rostro
- Genera recomendación de corte
- Genera preview visual

### Paso 4: Sistema Recomienda Barberos
- Busca 3 barberos especializados
- Los ordena por puntuación (especialidad + rating)
- Muestra detalles de cada uno

### Paso 5: Usuario Elige Barbero y Agenda Cita
- Hace clic en "Agendar cita"
- Rellena formulario con sus datos
- Elige fecha y hora
- Cita se guarda en localStorage

### Paso 6: Usuario Puede Ver Sus Citas
- Botón "Mis citas" en navegación
- Ve todas sus citas agendadas
- Puede cancelar citas

## 💾 Almacenamiento de Datos

Las citas se guardan en `localStorage` con esta estructura:

```javascript
{
    id: timestamp,
    barber: { /* datos del barbero */ },
    clientName: "Juan Pérez",
    clientPhone: "+55 9999-9999",
    clientEmail: "juan@example.com",
    date: "2026-05-20",
    time: "14:00",
    notes: "Traer foto del corte que quiero",
    analysis: { /* análisis de IA completo */ },
    createdAt: "2026-05-14T10:30:00Z"
}
```

## 🔌 API Keys Necesarias

1. **Poe API Key**: Para análisis de IA
   - Obtén tu API Key en: https://poe.com/api/keys
   - Configura en el modal de análisis (⚙ Config)

## 🎨 Personalización

### Agregar Barberos
Edita `js/booking.js` y agrega a `barbersData`:

```javascript
{
    id: 9,
    name: "Tu Nombre",
    specialty: "Tu especialidad",
    experience: años,
    location: "Tu ubicación",
    rating: 4.8,
    reviews: 30,
    price: 350,
    description: "Tu descripción",
    specialties: ["corte", "fade", "moderno"],
    images: ["url-imagen"]
}
```

### Cambiar Horarios Disponibles
En `js/booking.js`, función `renderBookingForm()`, edita el `<select>` de horas:

```javascript
<option value="09:00">09:00 AM</option>
<!-- Agrega más horas aquí -->
```

## 🐛 Solución de Problemas

### "No se puede acceder a la cámara"
- Verifica permisos de navegador
- Usa HTTPS en producción
- Intenta usar upload en lugar de cámara

### "Puntos agotados en la API"
- El sistema automáticamente usa fallback de bajo costo
- Verifica tu saldo de puntos en https://poe.com

### Las citas no se guardan
- Verifica que localStorage esté habilitado
- Abre DevTools (F12) → Application → Local Storage
- Confirma que la URL es file:// o http://localhost

## 📋 Funcionalidades Futuras

- [ ] Confirmación de cita por email
- [ ] Sistema de pagos
- [ ] Historial de cortes del usuario
- [ ] Calificación de servicios
- [ ] Recordatorios de cita
- [ ] Base de datos en backend
- [ ] Perfil de barbero mejorado
- [ ] Disponibilidad en tiempo real

## 👨‍💻 Desarrollado con

- HTML5, CSS3, JavaScript
- Tailwind CSS
- Poe API (IA)
- LocalStorage (almacenamiento)

## 📄 Licencia

Este proyecto es de código abierto para uso educativo y personal.
