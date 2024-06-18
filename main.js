let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const tamanhoQuadrado = 60;

// Sons do jogo
const somSelecao = new Audio("sound/select.wav");
const somAtaque = new Audio("sound/attack.wav");
const somVitoria = new Audio("sound/victory.wav");

function tocarSom(som) {
    som.currentTime = 0;
    som.play();
}

let jogo;

function iniciarJogo(numJogadores) {
    // Esconde o menu e mostra a interface do jogo
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "flex";
    document.getElementById("gameControls").style.display = "block";
    document.getElementById("turnIndicator").style.display = "block";
    jogo = new Jogo(numJogadores);
    desenharMapa();
}

function desenharQuadrado(x, y, cor, texto, selecionado = false) {
    ctx.fillStyle = cor;
    ctx.fillRect(x, y, tamanhoQuadrado, tamanhoQuadrado);
    if (selecionado) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "gold";
    } else {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
    }
    ctx.strokeRect(x, y, tamanhoQuadrado, tamanhoQuadrado);
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText(texto, x + 10, y + tamanhoQuadrado / 2 + 5);
}

function desenharIndicadorTurno() {
    const turnIndicator = document.getElementById("turnIndicator");
    turnIndicator.textContent = `Turno: Jogador ${jogo.jogadorAtual + 1}`;
}

function desenharMapa() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharIndicadorTurno();
    jogo.tabuleiro.areas.forEach((area, indice) => {
        const linha = Math.floor(indice / 5);
        const coluna = indice % 5;
        const x = coluna * tamanhoQuadrado + 50;
        const y = linha * tamanhoQuadrado + 50;
        const cor = area.dono === 0 ? "lightblue" : area.dono === 1 ? "lightcoral" : area.dono === 2 ? "lightgreen" : "lightyellow";
        const selecionado = (indice === jogo.selecionadoOrigem || indice === jogo.selecionadoDestino);
        const quantidadeDados = area.dados.length;
        desenharQuadrado(x, y, cor, `${quantidadeDados} (J${area.dono + 1})`, selecionado);
    });
}

// Gerencia os cliques no tabuleiro
canvas.addEventListener("click", (evento) => {
    const rect = canvas.getBoundingClientRect();
    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;
    const coluna = Math.floor((x - 50) / tamanhoQuadrado);
    const linha = Math.floor((y - 50) / tamanhoQuadrado);
    const indice = linha * 5 + coluna;

    if (indice >= 0 && indice < jogo.tabuleiro.areas.length) {
        if (jogo.selecionadoOrigem === null) {
            if (jogo.tabuleiro.areas[indice].dono === jogo.jogadorAtual) {
                jogo.selecionadoOrigem = indice;
                tocarSom(somSelecao);
            }
        } else {
            if (jogo.selecionadoOrigem === indice) {
                jogo.selecionadoOrigem = null;
                tocarSom(somSelecao);
            } else if (jogo.selecionadoDestino === null) {
                if (jogo.tabuleiro.areas[indice].dono !== jogo.jogadorAtual && jogo.tabuleiro.adjacencias[jogo.selecionadoOrigem].includes(indice)) {
                    jogo.selecionadoDestino = indice;
                    tocarSom(somSelecao);
                    jogo.ataque();
                }
            }
        }
        desenharMapa();
    }
});

// Finaliza o turno do jogador atual
function finalizarTurno() {
    jogo.finalizarTurno();
    desenharIndicadorTurno();
}

// Declara o outro jogador como vencedor se o jogador atual desistir
function desistir() {
    const jogadorDesistente = jogo.jogadorAtual;
    const jogadorVencedor = (jogadorDesistente + 1) % jogo.numJogadores;

    alert(`Jogador ${jogadorVencedor + 1} venceu!`);
    tocarSom(somVitoria);
    setTimeout(() => {
        jogo.reiniciarJogo();
    }, 100);
}

// Retorna ao menu principal
function voltarParaMenu() {
    document.getElementById("menu").style.display = "flex";
    document.getElementById("game").style.display = "none";
    document.getElementById("gameControls").style.display = "none";
    document.getElementById("turnIndicator").style.display = "none";
}

// Mostra a quantidade de dados de cada jogador
function mostrarDadosJogadores() {
    const dadosJogador1 = jogo.tabuleiro.areas.filter(area => area.dono === 0).reduce((acc, area) => acc + area.dados.length, 0);
    const dadosJogador2 = jogo.tabuleiro.areas.filter(area => area.dono === 1).reduce((acc, area) => acc + area.dados.length, 0);
    const dadosTexto = `Jogador 1: ${dadosJogador1} dados, Jogador 2: ${dadosJogador2} dados`;

    const dadosDiv = document.createElement("div");
    dadosDiv.textContent = dadosTexto;
    dadosDiv.style.position = "absolute";
    dadosDiv.style.bottom = "20px";
    dadosDiv.style.width = "100%";
    dadosDiv.style.textAlign = "center";
    dadosDiv.style.color = "white";
    dadosDiv.style.textShadow = "2px 2px #000";
    document.body.appendChild(dadosDiv);

    // Define o tempo necessário de exibição do resultado do ataque em caso de vitória do atacante
    setTimeout(() => {
        document.body.removeChild(dadosDiv);
    }, 1000);
}
