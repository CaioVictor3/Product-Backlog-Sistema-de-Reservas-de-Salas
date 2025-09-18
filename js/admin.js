// Initialize data and check authentication
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    checkAdminAuth();
    loadReservations();
});

// Initialize mock data in localStorage
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

// Check if user is logged in as admin
function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || currentUser.type !== 'admin') {
        alert('Acesso negado. Apenas administradores podem acessar esta página.');
        window.location.href = 'login.html'; // Redirect to login page
        return false;
    }

    // Update admin name in navbar
    document.getElementById('admin-name').textContent = currentUser.name;
    return true;
}

// Load and display reservations
function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');

    const tableBody = document.getElementById('reservations-table-body');
    const noReservationsDiv = document.getElementById('no-reservations');

    if (reservations.length === 0) {
        tableBody.innerHTML = '';
        noReservationsDiv.style.display = 'block';
        return;
    }

    noReservationsDiv.style.display = 'none';

    // Sort reservations by date and time (newest first)
    const sortedReservations = reservations.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.startTime);
        const dateB = new Date(b.date + 'T' + b.startTime);
        return dateB - dateA;
    });

    tableBody.innerHTML = sortedReservations.map((reservation, index) => {
        const student = users.find(user => user.id === reservation.studentId);
        const room = rooms.find(room => room.id === reservation.roomId);

        return `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>
                    <i class="bi bi-person-circle me-2"></i>
                    ${student ? student.name : 'Usuário não encontrado'}
                </td>
                <td>
                    <i class="bi bi-door-open me-2"></i>
                    ${room ? room.name : 'Sala não encontrada'}
                    <small class="text-muted d-block">${room ? room.location : ''}</small>
                </td>
                <td>
                    <i class="bi bi-calendar3 me-2"></i>
                    ${formatDate(reservation.date)}
                </td>
                <td>
                    <i class="bi bi-clock me-2"></i>
                    ${reservation.startTime} - ${reservation.endTime}
                </td>
            </tr>
        `;
    }).join('');
}


// Format date to Brazilian format (GMT-3)
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00-03:00');
    return date.toLocaleDateString('pt-BR');
}

// Refresh reservations
function refreshReservations() {
    loadReservations();

    // Show refresh feedback
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="bi bi-check-circle me-1"></i>Atualizado!';
    button.classList.add('btn-success');
    button.classList.remove('btn-primary');

    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
    }, 2000);
}

// Logout function
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}
