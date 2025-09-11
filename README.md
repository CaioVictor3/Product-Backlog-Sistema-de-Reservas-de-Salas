# Sistema de Reserva de Salas

Este é um protótipo de front-end totalmente funcional para um sistema de reserva de salas. O projeto simula um ambiente de aplicação completo, com autenticação de usuário, painéis distintos para administradores e alunos, e persistência de dados, tudo implementado utilizando apenas tecnologias de front-end (HTML, CSS, e JavaScript). O `localStorage` do navegador é utilizado para simular um banco de dados, armazenando informações de usuários, salas e reservas.

## ✨ Principais Funcionalidades

O sistema oferece diferentes funcionalidades dependendo do tipo de usuário logado.

### Funcionalidades para Alunos
- **Autenticação Segura**: Login para acessar o painel do aluno.
- **Visualização de Salas**: Veja uma lista de todas as salas disponíveis, com filtros por data.
- **Status de Disponibilidade**: Identifique facilmente se uma sala está livre ou ocupada em uma data específica.
- **Reserva de Salas**: Faça reservas para horários específicos em salas disponíveis através de um modal interativo.
- **Histórico de Reservas**: Acesse uma aba para visualizar todas as suas reservas passadas e futuras.
- **Validações**: O sistema impede reservas duplicadas na mesma data e exige que as reservas sejam feitas com antecedência.

### Funcionalidades para Administradores
- **Painel de Controle Centralizado**: Visualize todas as reservas feitas por todos os alunos em um único dashboard.
- **Visão Geral**: Tenha acesso a informações detalhadas de cada reserva, incluindo nome do aluno, sala, data e horário.
- **Autenticação de Admin**: Acesso a uma rota protegida exclusiva para administradores.

## 🚀 Tecnologias Utilizadas

- **HTML5**: Para a estrutura semântica das páginas.
- **CSS3**: Para estilização, com uso de gradientes e layouts flexbox.
- **Bootstrap 5**: Framework CSS para criar um design responsivo e moderno rapidamente.
- **Bootstrap Icons**: Para a utilização de ícones em toda a interface.
- **JavaScript (ES6)**: Para toda a lógica da aplicação, incluindo manipulação do DOM, interatividade e gerenciamento de estado.
- **localStorage**: Para persistir os dados da aplicação (usuários, salas, reservas) no navegador, simulando um banco de dados.

## ⚙️ Como Executar o Projeto

Nenhuma instalação ou build é necessária para executar este projeto.

1.  **Clone ou baixe** os arquivos para o seu computador.
2.  **Abra o arquivo `login.html`** no seu navegador de preferência (Google Chrome, Firefox, etc.).
3.  Pronto! A aplicação estará funcionando.

## 🔑 Credenciais para Demonstração

Utilize as seguintes credenciais na tela de login para explorar os diferentes painéis:

### Administrador
- **Email**: `joao@email.com`
- **Senha**: `admin123`

### Aluno
- **Email**: `maria@email.com` (ou `pedro@email.com`, `ana@email.com`, etc.)
- **Senha**: `student123`

## 📂 Estrutura do Projeto

-   `login.html`: A página de login inicial para todos os usuários.
-   `index.html`: O painel do administrador, que exibe todas as reservas do sistema.
-   `student-dashboard.html`: O painel do aluno, onde é possível ver e reservar salas, além de gerenciar as próprias reservas.
-   `available-rooms.html`: **(Arquivo legado)** Um protótipo inicial e mais simples do sistema. Não faz parte do fluxo principal da aplicação.
