// --- SELETORES GERAIS ---
const screenLogin = document.getElementById('login-screen');
const screenSignup = document.getElementById('signup-screen');
const screenDash = document.getElementById('dashboard-screen');
const screenRank = document.getElementById('ranking-screen');
const screenSubject = document.getElementById('subject-screen');
const screenQuiz = document.getElementById('quiz-overlay');

// Ranking Selectors
const rankingListContainer = document.getElementById('ranking-list-container');
const statsXP = document.getElementById('stats-xp');
const statsCompleted = document.getElementById('stats-completed');
const dashRankPos = document.getElementById('dash-rank-pos');

// Quiz Selectors
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizQCurrent = document.getElementById('q-current');
const quizQTotal = document.getElementById('q-total');
const btnQuizNext = document.getElementById('btn-quiz-next');

// Navegação e Outros
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('menu-overlay');
const listaContainer = document.getElementById('lista-materias');
const subjectTitle = document.getElementById('subject-title');
const subjectTopic = document.getElementById('subject-topic');
const subjectProgress = document.getElementById('subject-progress');
const btnMarkDone = document.getElementById('btn-mark-done');
const btnPlayVideo = document.getElementById('btn-play-video');

let materiaAtualId = null;

// --- DADOS DOS CURSOS ---
const materias = [
    { id: 1, nome: 'HTML5', topico: 'Estrutura', progresso: 20, cor: '#e34c26', icon: 'fa-html5', link: 'https://youtu.be/ZOXyfxSU9tU', concluido: false },
    { id: 2, nome: 'CSS3', topico: 'Estilo', progresso: 10, cor: '#264de4', icon: 'fa-css3-alt', link: 'https://www.youtube.com/watch?v=CTjUpZqTJDg', concluido: false },
    { id: 3, nome: 'JavaScript', topico: 'Lógica', progresso: 5, cor: '#f0db4f', icon: 'fa-js', link: 'https://www.youtube.com/watch?v=WRlfwBof66s', concluido: false },
    { id: 4, nome: 'React', topico: 'App', progresso: 0, cor: '#61dbfb', icon: 'fa-react', link: 'https://www.youtube.com/watch?v=O6TnaSkSC48', concluido: false },
    { id: 5, nome: 'Node.js', topico: 'API', progresso: 0, cor: '#68a063', icon: 'fa-node', link: 'https://www.youtube.com/watch?v=GKR6uSvEj8w', concluido: false },
    { id: 6, nome: 'Python', topico: 'Scripts', progresso: 0, cor: '#306998', icon: 'fa-python', link: 'https://www.youtube.com/watch?v=N-VMAIvm3W4', concluido: false }
];

// --- DADOS DO RANKING (COMPETIDORES) ---
const competidores = [
    { nome: 'Ana Dev', xp: 2500 },
    { nome: 'Carlos JS', xp: 1800 },
    { nome: 'Pedro Py', xp: 1200 },
    { nome: 'Mariana Web', xp: 800 },
    { nome: 'Lucas Full', xp: 3000 }
];

// --- BANCO DE QUESTÕES ---
const questoes = {
    generic: [
        { p: "O que é uma variável?", opcoes: ["Um valor fixo", "Um espaço na memória", "Um erro"], correta: 1 },
        { p: "Qual o resultado de 1 + '1' no JS?", opcoes: ["2", "11", "Erro"], correta: 1 },
        { p: "Onde o CSS é usado?", opcoes: ["No Banco de Dados", "No Servidor", "No Estilo Visual"], correta: 2 }
    ]
};

// --- NAVEGAÇÃO ---
function goToScreen(screenName) {
    const screens = [screenLogin, screenSignup, screenDash, screenRank, screenSubject, screenQuiz];
    screens.forEach(s => s.classList.add('hidden'));
    
    sidebar.classList.remove('open');
    overlay.classList.remove('open');

    if(screenName === 'login') screenLogin.classList.remove('hidden');
    if(screenName === 'signup') screenSignup.classList.remove('hidden');
    if(screenName === 'dashboard') {
        screenDash.classList.remove('hidden');
        renderMaterias();
        atualizarRankingInfo();
    }
    if(screenName === 'ranking') {
        screenRank.classList.remove('hidden');
        renderRankingPage();
    }
    if(screenName === 'subject') screenSubject.classList.remove('hidden');
    if(screenName === 'quiz') screenQuiz.classList.remove('hidden');
}

// --- LÓGICA DO RANKING ---
function calcularMeuXP() {
    let totalXP = 0;
    let totalConcluidos = 0;
    materias.forEach(m => {
        totalXP += m.progresso * 10; 
        if(m.concluido) totalConcluidos++;
    });
    return { xp: totalXP, concluidos: totalConcluidos };
}

function renderRankingPage() {
    const meusDados = calcularMeuXP();
    
    statsXP.innerText = meusDados.xp + " XP";
    statsCompleted.innerText = meusDados.concluidos;

    let listaCompleta = [...competidores];
    listaCompleta.push({ nome: 'Você', xp: meusDados.xp, isMe: true });

    listaCompleta.sort((a, b) => b.xp - a.xp);

    rankingListContainer.innerHTML = '';
    listaCompleta.forEach((user, index) => {
        let medalhaClass = '';
        if(index === 0) medalhaClass = 'medal-gold';
        else if(index === 1) medalhaClass = 'medal-silver';
        else if(index === 2) medalhaClass = 'medal-bronze';

        const iconePos = medalhaClass 
            ? `<i class="fa-solid fa-medal ${medalhaClass}"></i>` 
            : `<span style="font-weight:bold; color:#ccc; width:20px; text-align:center;">${index + 1}º</span>`;

        const classeItem = user.isMe ? 'rank-item is-me' : 'rank-item';
        
        rankingListContainer.innerHTML += `
            <div class="${classeItem}">
                <div class="rank-pos">${iconePos}</div>
                <div style="flex:1; margin-left:10px;">
                    <h5>${user.nome}</h5>
                    <small style="color:#aaa">Dev Student</small>
                </div>
                <strong style="color: #f1c40f;">${user.xp} XP</strong>
            </div>
        `;
    });
}

function atualizarRankingInfo() {
    const meuXP = calcularMeuXP().xp;
    let lista = [...competidores, {xp: meuXP}];
    lista.sort((a, b) => b.xp - a.xp);
    const minhaPosicao = lista.findIndex(u => u.xp === meuXP) + 1;
    dashRankPos.innerText = `Você está em ${minhaPosicao}º lugar!`;
}

// --- MATÉRIAS E AULAS ---
function openSubject(id) {
    materiaAtualId = id;
    const materia = materias.find(m => m.id === id);
    subjectTitle.innerText = materia.nome;
    subjectTopic.innerText = materia.topico;
    subjectProgress.style.width = materia.progresso + '%';
    subjectProgress.style.backgroundColor = materia.cor;
    btnPlayVideo.onclick = () => window.open(materia.link, '_blank');
    
    if(materia.concluido) {
        btnMarkDone.innerText = "Concluído";
        btnMarkDone.classList.add('disabled');
    } else {
        btnMarkDone.innerText = "Concluir Módulo";
        btnMarkDone.classList.remove('disabled');
    }
    goToScreen('subject');
}

btnMarkDone.addEventListener('click', () => {
    const materia = materias.find(m => m.id === materiaAtualId);
    if (!materia.concluido) {
        materia.concluido = true; 
        materia.progresso = 100;
        alert(`Parabéns! +1000 XP adicionados ao Ranking.`);
        goToScreen('dashboard'); 
    }
});

// --- QUIZ ---
let currentQuizQuestions = [];
let qIndex = 0;

document.getElementById('btn-start-quiz').addEventListener('click', () => {
    currentQuizQuestions = questoes.generic;
    qIndex = 0;
    renderQuestion();
    goToScreen('quiz');
});

function renderQuestion() {
    const q = currentQuizQuestions[qIndex];
    quizQCurrent.innerText = qIndex + 1;
    quizQTotal.innerText = currentQuizQuestions.length;
    quizQuestion.innerText = q.p;
    quizOptions.innerHTML = '';
    btnQuizNext.style.display = 'none';

    q.opcoes.forEach((op, i) => {
        const btn = document.createElement('div');
        btn.className = 'option-btn';
        btn.innerText = op;
        btn.onclick = () => {
            const all = document.querySelectorAll('.option-btn');
            all.forEach(b => b.onclick = null);
            if(i === q.correta) btn.classList.add('correct');
            else {
                btn.classList.add('wrong');
                all[q.correta].classList.add('correct');
            }
            btnQuizNext.style.display = 'block';
            btnQuizNext.innerText = (qIndex === currentQuizQuestions.length - 1) ? "Finalizar" : "Próxima";
        };
        quizOptions.appendChild(btn);
    });
}

btnQuizNext.addEventListener('click', () => {
    if(qIndex < currentQuizQuestions.length - 1) {
        qIndex++; renderQuestion();
    } else {
        alert('Prova finalizada! Você ganhou XP extra.');
        goToScreen('subject');
    }
});

// --- RENDERIZAR CARDS (DASHBOARD) ---
function renderMaterias() {
    listaContainer.innerHTML = '';
    materias.forEach(m => {
        let status = m.concluido ? '<i class="fa-solid fa-circle-check" style="color: #2ecc71;"></i>' : '<i class="fa-solid fa-chevron-right" style="color:#ccc"></i>';
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="card-header">
                <div style="background:${m.cor}20; border:1px solid ${m.cor}; color:${m.cor};" class="card-icon">
                    <i class="fa-brands ${m.icon}"></i>
                </div>
                <div style="flex:1"><h4>${m.nome}</h4><span style="color:#999; font-size:12px;">${m.topico}</span></div>
                ${status}
            </div>
            <div class="progress-bg"><div class="progress-fill" style="width: ${m.progresso}%; background-color: ${m.cor}"></div></div>
        `;
        div.addEventListener('click', () => openSubject(m.id));
        listaContainer.appendChild(div);
    });
}

// --- EVENTOS (LISTENERS) ---
document.getElementById('btn-login').addEventListener('click', () => goToScreen('dashboard'));
document.getElementById('link-go-signup').addEventListener('click', () => goToScreen('signup'));
document.getElementById('link-back-login').addEventListener('click', () => goToScreen('login'));
document.getElementById('btn-register').addEventListener('click', () => { alert('Matrícula realizada!'); goToScreen('dashboard'); });
document.getElementById('btn-go-ranking').addEventListener('click', () => goToScreen('ranking'));
document.getElementById('btn-back-dashboard').addEventListener('click', () => goToScreen('dashboard'));
document.getElementById('btn-close-subject').addEventListener('click', () => goToScreen('dashboard'));

document.getElementById('btn-open-menu').addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('open'); });
overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });

function navegarMenu(d) { goToScreen(d); }
function fazerLogout() { goToScreen('login'); }