// Estado da aplicação
const state = {
    isLoggedIn: false,
    currentUser: null,
    salas: [
        {
            id: 1,
            nome: "Sala 101",
            capacidade: 30,
            status: "livre",
            horario: "08:00 - 10:00"
        },
        {
            id: 2,
            nome: "Sala 202",
            capacidade: 20,
            status: "ocupada",
            horario: "10:00 - 12:00"
        },
        {
            id: 3,
            nome: "Laboratório de Informática",
            capacidade: 40,
            status: "livre",
            horario: "14:00 - 16:00"
        }
    ],
    salaParaReservar: null
};

// Dados do usuário fixo
const USER_DATA = {
    email: "caio.victor@gmail.com",
    password: "123"
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Verificar se já está logado
    const savedState = localStorage.getItem('salaReservaState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.isLoggedIn) {
            state.isLoggedIn = true;
            state.currentUser = parsedState.currentUser;
            state.salas = parsedState.salas || state.salas;
            showMainScreen();
        }
    }

    // Event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('confirmReserva').addEventListener('click', confirmarReserva);
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    if (email === USER_DATA.email && password === USER_DATA.password) {
        // Login bem-sucedido
        state.isLoggedIn = true;
        state.currentUser = { email: email };

        // Salvar estado no localStorage
        saveState();

        // Esconder erro se existir
        errorDiv.classList.add('hidden');

        // Mostrar tela principal
        showMainScreen();
    } else {
        // Login falhou
        errorDiv.classList.remove('hidden');
    }
}

function showMainScreen() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainScreen').classList.remove('hidden');
    document.getElementById('userEmail').textContent = state.currentUser.email;
    renderSalas();
}

function renderSalas() {
    const container = document.getElementById('salasContainer');
    const livresCount = state.salas.filter(sala => sala.status === 'livre').length;
    const ocupadasCount = state.salas.filter(sala => sala.status === 'ocupada').length;

    // Atualizar contadores
    document.getElementById('livresCount').textContent = livresCount;
    document.getElementById('ocupadasCount').textContent = ocupadasCount;

    // Renderizar salas
    container.innerHTML = state.salas.map(sala => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card card-sala h-100">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="card-title mb-0">${sala.nome}</h5>
                        <span class="badge ${sala.status === 'livre' ? 'bg-success' : 'bg-danger'}">
                            <i class="fas ${sala.status === 'livre' ? 'fa-check' : 'fa-times'} me-1"></i>
                            ${sala.status === 'livre' ? 'Livre' : 'Ocupada'}
                        </span>
                    </div>

                    <div class="mb-3">
                        <div class="d-flex align-items-center mb-2">
                            <i class="fas fa-users text-muted me-2"></i>
                            <span>Capacidade: ${sala.capacidade} pessoas</span>
                        </div>
                        <div class="d-flex align-items-center">
                            <i class="fas fa-clock text-muted me-2"></i>
                            <span>Horário: ${sala.horario}</span>
                        </div>
                    </div>

                    <div class="mt-auto">
                        <button
                            class="btn ${sala.status === 'livre' ? 'btn-primary' : 'btn-secondary'} btn-reservar w-100"
                            ${sala.status === 'ocupada' ? 'disabled' : ''}
                            onclick="abrirModalReserva(${sala.id})"
                        >
                            <i class="fas ${sala.status === 'livre' ? 'fa-calendar-plus' : 'fa-ban'} me-1"></i>
                            ${sala.status === 'livre' ? 'Reservar' : 'Indisponível'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function abrirModalReserva(salaId) {
    const sala = state.salas.find(s => s.id === salaId);
    if (!sala || sala.status !== 'livre') return;

    state.salaParaReservar = sala;

    document.getElementById('modalSalaNome').textContent = sala.nome;
    document.getElementById('modalSalaHorario').textContent = sala.horario;
    document.getElementById('modalSalaCapacidade').textContent = sala.capacidade;

    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

function confirmarReserva() {
    if (!state.salaParaReservar) return;

    // Atualizar status da sala
    const salaIndex = state.salas.findIndex(s => s.id === state.salaParaReservar.id);
    if (salaIndex !== -1) {
        state.salas[salaIndex].status = 'ocupada';

        // Salvar estado
        saveState();

        // Re-renderizar salas
        renderSalas();

        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
        modal.hide();

        // Mostrar mensagem de sucesso
        showAlert('Reserva realizada com sucesso!', 'success');
    }
}

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

function logout() {
    state.isLoggedIn = false;
    state.currentUser = null;

    // Limpar localStorage
    localStorage.removeItem('salaReservaState');

    // Mostrar tela de login
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');

    // Limpar formulário
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').classList.add('hidden');
}

function saveState() {
    localStorage.setItem('salaReservaState', JSON.stringify({
        isLoggedIn: state.isLoggedIn,
        currentUser: state.currentUser,
        salas: state.salas
    }));
}
