let currentStudent = null;

// Initialize data and check authentication
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    checkStudentAuth();
    setupDateFilter();
    loadAvailableRooms();
    loadMyReservations();
    setupRoomReservation();
});

// Initialize mock data in localStorage (same as in other files)
function initializeData() {
    // Check if data already exists
    if (localStorage.getItem('users') && localStorage.getItem('rooms') && localStorage.getItem('reservations')) {
        return;
    }

    // Mock Users Data
    const users = [
        { id: 1, name: 'João Silva', email: 'joao@email.com', type: 'admin', password: 'admin123' },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com', type: 'student', password: 'student123' },
        { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', type: 'student', password: 'student123' },
        { id: 4, name: 'Ana Oliveira', email: 'ana@email.com', type: 'student', password: 'student123' },
        { id: 5, name: 'Carlos Lima', email: 'carlos@email.com', type: 'student', password: 'student123' }
    ];

    // Mock Rooms Data
    const rooms = [
        { id: 1, name: 'Sala 101', capacity: 30, location: 'Bloco A' },
        { id: 2, name: 'Sala 102', capacity: 25, location: 'Bloco A' },
        { id: 3, name: 'Laboratório de Informática', capacity: 20, location: 'Bloco B' },
        { id: 4, name: 'Auditório Principal', capacity: 100, location: 'Bloco C' },
        { id: 5, name: 'Sala de Reuniões', capacity: 15, location: 'Bloco A' }
    ];

    // Mock Reservations Data
    const reservations = [
        {
            id: 1,
            studentId: 2,
            roomId: 1,
            date: '2024-01-15',
            startTime: '08:00',
            endTime: '10:00',
            purpose: 'Estudo em grupo',
            createdAt: '2024-01-10T10:30:00Z'
        },
        {
            id: 2,
            studentId: 3,
            roomId: 3,
            date: '2024-01-16',
            startTime: '14:00',
            endTime: '16:00',
            purpose: 'Projeto de programação',
            createdAt: '2024-01-11T09:15:00Z'
        },
        {
            id: 3,
            studentId: 4,
            roomId: 4,
            date: '2024-01-17',
            startTime: '19:00',
            endTime: '21:00',
            purpose: 'Apresentação de trabalho',
            createdAt: '2024-01-12T14:20:00Z'
        },
        {
            id: 4,
            studentId: 5,
            roomId: 2,
            date: '2024-01-18',
            startTime: '10:00',
            endTime: '12:00',
            purpose: 'Reunião de grupo',
            createdAt: '2024-01-13T11:45:00Z'
        },
        {
            id: 5,
            studentId: 2,
            roomId: 5,
            date: '2024-01-19',
            startTime: '15:00',
            endTime: '17:00',
            purpose: 'Estudo individual',
            createdAt: '2024-01-14T08:30:00Z'
        }
    ];

    // Store data in localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('rooms', JSON.stringify(rooms));
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Check if user is logged in as student
function checkStudentAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || currentUser.type !== 'student') {
        alert('Acesso negado. Apenas alunos podem acessar esta página.');
        window.location.href = 'login.html';
        return false;
    }

    currentStudent = currentUser;
    document.getElementById('student-name').textContent = currentUser.name;
    return true;
}

// Setup date filter
function setupDateFilter() {
    const dateFilter = document.getElementById('dateFilter');

    // Get today's date in GMT-3 timezone
    const today = getTodayInGMTMinus3();

    // Set today as default
    dateFilter.value = today;
    dateFilter.min = today;

    // Add event listener for date changes
    dateFilter.addEventListener('change', function() {
        loadAvailableRooms();
    });
}

// Get today's date in GMT-3 timezone
function getTodayInGMTMinus3() {
    const now = new Date();
    const gmtMinus3 = new Date(now.getTime() - (3 * 60 * 60 * 1000));
    return gmtMinus3.toISOString().split('T')[0];
}

// Load and display available rooms
function loadAvailableRooms() {
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const selectedDate = document.getElementById('dateFilter').value;

    if (!selectedDate) return;

    // Generate time slots (8:00 to 18:00, 1-hour intervals)
    const timeSlots = generateTimeSlots();

    // Check room availability for selected date
    const roomsWithStatus = rooms.map(room => {
        const roomReservations = reservations.filter(reservation =>
            reservation.roomId === room.id &&
            reservation.date === selectedDate
        );

        const availableSlots = getAvailableTimeSlots(timeSlots, roomReservations);
        const isFullyOccupied = availableSlots.length === 0;

        return {
            ...room,
            status: isFullyOccupied ? 'ocupada' : 'livre',
            availableSlots: availableSlots,
            selectedDate: selectedDate
        };
    });

    renderAvailableRooms(roomsWithStatus);
}

// Generate time slots for 24 hours (00:00 to 23:00)
function generateTimeSlots() {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
        slots.push({
            start: startTime,
            end: endTime,
            label: `${startTime} - ${endTime}`
        });
    }
    return slots;
}

// Get available time slots for a room
function getAvailableTimeSlots(timeSlots, reservations) {
    return timeSlots.filter(slot => {
        return !reservations.some(reservation => {
            const resStart = reservation.startTime;
            const resEnd = reservation.endTime;

            // Check if slot conflicts with reservation
            // Slot is available if it doesn't overlap with any reservation
            return (slot.start < resEnd && slot.end > resStart);
        });
    });
}

// Render available rooms cards
function renderAvailableRooms(rooms) {
    const container = document.getElementById('salasContainer');
    const livresCount = rooms.filter(room => room.status === 'livre').length;
    const ocupadasCount = rooms.filter(room => room.status === 'ocupada').length;

    // Atualizar contadores
    document.getElementById('livresCount').textContent = livresCount;
    document.getElementById('ocupadasCount').textContent = ocupadasCount;

    // Renderizar salas
    container.innerHTML = rooms.map(room => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card card-sala h-100">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="card-title mb-0">${room.name}</h5>
                        <span class="badge ${room.status === 'livre' ? 'bg-success' : 'bg-danger'}">
                            <i class="bi ${room.status === 'livre' ? 'bi-check' : 'bi-x'} me-1"></i>
                            ${room.status === 'livre' ? 'Livre' : 'Ocupada'}
                        </span>
                    </div>

                    <div class="mb-3">
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-people text-muted me-2"></i>
                            <span>Capacidade: ${room.capacity} pessoas</span>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-geo-alt text-muted me-2"></i>
                            <span>Local: ${room.location}</span>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-calendar3 text-muted me-2"></i>
                            <span>Data: ${formatDate(room.selectedDate)}</span>
                        </div>
                        <div class="d-flex align-items-start">
                            <i class="bi bi-clock text-muted me-2 mt-1"></i>
                            <div>
                                <small class="text-muted d-block">Horários disponíveis:</small>
                                ${room.status === 'livre' ?
                                    `<div class="mt-1">
                                        ${room.availableSlots.slice(0, 3).map(slot =>
                                            `<span class="badge bg-light text-dark me-1 mb-1">${slot.start.split(':')[0]}h-${slot.end.split(':')[0]}h</span>`
                                        ).join('')}
                                        ${room.availableSlots.length > 3 ? `<small class="text-muted">+${room.availableSlots.length - 3} mais</small>` : ''}
                                    </div>` :
                                    '<small class="text-danger">Nenhum horário disponível</small>'
                                }
                            </div>
                        </div>
                    </div>

                    <div class="mt-auto">
                        <button
                            class="btn ${room.status === 'livre' ? 'btn-primary' : 'btn-secondary'} btn-reservar w-100"
                            ${room.status === 'ocupada' ? 'disabled' : ''}
                            onclick="abrirModalReserva(${room.id})"
                        >
                            <i class="bi ${room.status === 'livre' ? 'bi-calendar-plus' : 'bi-ban'} me-1"></i>
                            ${room.status === 'livre' ? 'Reservar' : 'Indisponível'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup room reservation functionality
function setupRoomReservation() {
    document.getElementById('confirmModalReservation').addEventListener('click', confirmModalReservation);
}

// Open reservation modal
function abrirModalReserva(roomId) {
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const selectedDate = document.getElementById('dateFilter').value;
    const room = rooms.find(r => r.id === roomId);

    if (!room) return;

    // Get room with availability data
    const roomWithSlots = getRoomWithAvailability(roomId, selectedDate);
    if (!roomWithSlots || roomWithSlots.status === 'ocupada') return;

    // Fill modal with room info
    document.getElementById('modalSalaNome').textContent = room.name;
    document.getElementById('modalSalaLocal').textContent = room.location;
    document.getElementById('modalSalaCapacidade').textContent = room.capacity;
    document.getElementById('modalSalaData').textContent = formatDate(selectedDate);

    // Clear previous selections
    document.getElementById('modalStartTime').value = '';
    document.getElementById('modalEndTime').value = '';
    document.getElementById('modalPurpose').value = '';

    // Fill time selectors with available slots
    fillTimeSelectors(roomWithSlots.availableSlots);

    const modal = new bootstrap.Modal(document.getElementById('reservationModal'));
    modal.show();
}

// Get room with availability data
function getRoomWithAvailability(roomId, selectedDate) {
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const timeSlots = generateTimeSlots();

    const room = rooms.find(r => r.id === roomId);
    if (!room) return null;

    // Filter reservations for this room and date
    const roomReservations = reservations.filter(reservation =>
        reservation.roomId === roomId &&
        reservation.date === selectedDate
    );

    // Get available time slots (remove reserved intervals)
    const availableSlots = getAvailableTimeSlots(timeSlots, roomReservations);
    const isFullyOccupied = availableSlots.length === 0;

    return {
        ...room,
        status: isFullyOccupied ? 'ocupada' : 'livre',
        availableSlots: availableSlots,
        selectedDate: selectedDate
    };
}

// Fill time selectors with available slots (hours only)
function fillTimeSelectors(availableSlots) {
    const startTimeSelect = document.getElementById('modalStartTime');
    const endTimeSelect = document.getElementById('modalEndTime');

    // Clear existing options
    startTimeSelect.innerHTML = '<option value="">Selecione o horário</option>';
    endTimeSelect.innerHTML = '<option value="">Selecione o horário</option>';

    // Remove any existing event listeners
    startTimeSelect.replaceWith(startTimeSelect.cloneNode(true));
    const newStartTimeSelect = document.getElementById('modalStartTime');

    // Add available slots to start time (only hours)
    availableSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.start;
        option.textContent = `${slot.start.split(':')[0]}h`;
        newStartTimeSelect.appendChild(option);
    });

    // Add event listener for start time change
    newStartTimeSelect.addEventListener('change', function() {
        updateEndTimeOptions(this.value, availableSlots);
    });
}

// Update end time options based on start time
function updateEndTimeOptions(startTime, availableSlots) {
    const endTimeSelect = document.getElementById('modalEndTime');
    endTimeSelect.innerHTML = '<option value="">Selecione o horário</option>';

    if (!startTime) return;

    // Find available end times after start time
    const startIndex = availableSlots.findIndex(slot => slot.start === startTime);
    if (startIndex === -1) return;

    // Add consecutive slots as end time options (only hours)
    // Only show slots that are consecutive from the start time
    for (let i = startIndex; i < availableSlots.length; i++) {
        const slot = availableSlots[i];

        // Check if this slot is consecutive (starts where previous ended)
        if (i === startIndex || slot.start === availableSlots[i-1].end) {
            const option = document.createElement('option');
            option.value = slot.end;
            option.textContent = `${slot.end.split(':')[0]}h`;
            endTimeSelect.appendChild(option);
        } else {
            // If not consecutive, stop adding options
            break;
        }
    }
}

// Confirm modal reservation
function confirmModalReservation() {
    const startTime = document.getElementById('modalStartTime').value;
    const endTime = document.getElementById('modalEndTime').value;
    const purpose = document.getElementById('modalPurpose').value;
    const selectedDate = document.getElementById('dateFilter').value;

    if (!startTime || !endTime) {
        alert('Por favor, selecione os horários de início e término.');
        return;
    }

    // Get room info from modal
    const roomName = document.getElementById('modalSalaNome').textContent;
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const room = rooms.find(r => r.name === roomName);

    if (!room) {
        alert('Erro: Sala não encontrada.');
        return;
    }

    // Validate reservation
    if (!validateModalReservation(room.id, selectedDate, startTime, endTime)) {
        return;
    }

    // Create new reservation
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const newReservation = {
        id: reservations.length > 0 ? Math.max(...reservations.map(r => r.id)) + 1 : 1,
        studentId: currentStudent.id,
        roomId: room.id,
        date: selectedDate,
        startTime: startTime,
        endTime: endTime,
        purpose: purpose || 'Sem descrição',
        createdAt: new Date().toISOString()
    };

    // Add to reservations
    reservations.push(newReservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('reservationModal'));
    modal.hide();

    // Clear the purpose field
    document.getElementById('modalPurpose').value = '';

    // Show success message
    showAlert('Reserva criada com sucesso!', 'success');

    // Refresh available rooms and my reservations
    loadAvailableRooms();
    loadMyReservations();
}

// Validate modal reservation
function validateModalReservation(roomId, date, startTime, endTime) {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');

    // Check if student already has a reservation for this date
    const existingReservation = reservations.find(r =>
        r.studentId === currentStudent.id &&
        r.date === date
    );

    if (existingReservation) {
        alert('Você já possui uma reserva para esta data.');
        return false;
    }

    // Check if room is available for this time slot
    const conflictingReservation = reservations.find(r =>
        r.roomId === roomId &&
        r.date === date &&
        ((startTime >= r.startTime && startTime < r.endTime) ||
         (endTime > r.startTime && endTime <= r.endTime) ||
         (startTime <= r.startTime && endTime >= r.endTime))
    );

    if (conflictingReservation) {
        alert('A sala já está reservada para este horário.');
        return false;
    }

    // Check if reservation is at least 1 hour in advance (GMT-3)
    const now = new Date();
    const gmtMinus3Now = new Date(now.getTime() - (3 * 60 * 60 * 1000));
    const reservationDateTime = new Date(`${date}T${startTime}`);
    const diffHours = (reservationDateTime - gmtMinus3Now) / (1000 * 60 * 60);

    if (diffHours < 1) {
        alert('Reservas devem ser feitas com pelo menos 1 hora de antecedência.');
        return false;
    }

    return true;
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // Remover automaticamente após 3 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 3000);
}


// Validate reservation
function validateReservation(roomId, date, startTime, endTime) {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');

    // Check if student already has a reservation for this date
    const existingReservation = reservations.find(r =>
        r.studentId === currentStudent.id &&
        r.date === date
    );

    if (existingReservation) {
        alert('Você já possui uma reserva para esta data.');
        return false;
    }

    // Check if room is available for this time slot
    const conflictingReservation = reservations.find(r =>
        r.roomId === roomId &&
        r.date === date &&
        ((startTime >= r.startTime && startTime < r.endTime) ||
         (endTime > r.startTime && endTime <= r.endTime) ||
         (startTime <= r.startTime && endTime >= r.endTime))
    );

    if (conflictingReservation) {
        alert('A sala já está reservada para este horário.');
        return false;
    }

    // Check if reservation is at least 1 hour in advance (GMT-3)
    const now = new Date();
    const gmtMinus3Now = new Date(now.getTime() - (3 * 60 * 60 * 1000));
    const reservationDateTime = new Date(`${date}T${startTime}`);
    const diffHours = (reservationDateTime - gmtMinus3Now) / (1000 * 60 * 60);

    if (diffHours < 1) {
        alert('Reservas devem ser feitas com pelo menos 1 hora de antecedência.');
        return false;
    }

    return true;
}

// Load and display student's reservations
function loadMyReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');

    const myReservations = reservations.filter(r => r.studentId === currentStudent.id);
    const reservationsList = document.getElementById('my-reservations-list');
    const noReservationsDiv = document.getElementById('no-my-reservations');

    if (myReservations.length === 0) {
        reservationsList.innerHTML = '';
        noReservationsDiv.style.display = 'block';
        return;
    }

    noReservationsDiv.style.display = 'none';

    // Sort reservations by date and time (newest first)
    const sortedReservations = myReservations.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.startTime);
        const dateB = new Date(b.date + 'T' + b.startTime);
        return dateB - dateA;
    });

    reservationsList.innerHTML = sortedReservations.map(reservation => {
        const room = rooms.find(room => room.id === reservation.roomId);

        return `
            <div class="card reservation-card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-10">
                            <h6 class="card-title mb-1">
                                <i class="bi bi-door-open me-2"></i>
                                ${room ? room.name : 'Sala não encontrada'}
                            </h6>
                            <p class="card-text text-muted mb-1">
                                <i class="bi bi-geo-alt me-1"></i>
                                ${room ? room.location : ''}
                            </p>
                            <p class="card-text mb-1">
                                <i class="bi bi-calendar3 me-1"></i>
                                ${formatDate(reservation.date)} -
                                <i class="bi bi-clock me-1"></i>
                                ${reservation.startTime} às ${reservation.endTime}
                            </p>
                            ${reservation.purpose ? `<p class="card-text text-muted mb-0"><i class="bi bi-chat-text me-1"></i>${reservation.purpose}</p>` : ''}
                        </div>
                        <div class="col-md-2 text-end">
                            <small class="text-muted">
                                <i class="bi bi-clock me-1"></i>
                                Criada em ${formatDateTime(reservation.createdAt)}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}


// Format date to Brazilian format (GMT-3)
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00-03:00');
    return date.toLocaleDateString('pt-BR');
}

// Format date and time to Brazilian format
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}


// Logout function
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}
