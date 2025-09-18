// Initialize data when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
});

// Initialize mock data in localStorage (same as in index.html)
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

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Store current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Show success message
        const button = document.querySelector('.btn-login');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check-circle me-2"></i>Entrando...';
        button.classList.add('btn-success');
        button.classList.remove('btn-primary');

        // Redirect based on user type
        setTimeout(() => {
            if (user.type === 'admin') {
                window.location.href = 'index.html';
            } else if (user.type === 'student') {
                window.location.href = 'student-dashboard.html';
            } else {
                alert('Tipo de usuário não reconhecido.');
                button.innerHTML = originalText;
                button.classList.remove('btn-success');
                button.classList.add('btn-primary');
            }
        }, 1500);
    } else {
        // Show error message
        const button = document.querySelector('.btn-login');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-x-circle me-2"></i>Credenciais inválidas';
        button.classList.add('btn-danger');
        button.classList.remove('btn-primary');

        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('btn-danger');
            button.classList.add('btn-primary');
        }, 2000);
    }
});
