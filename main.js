let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = 600; // Define uma largura fixa para o tabuleiro
canvas.height = 600; // Define uma altura fixa para o tabuleiro

const tamanhoQuadrado = 60;

const somSelecao = new Audio("sounds/select.wav");
const somAtaque = new Audio("sounds/attack.wav");
const somVitoria = new Audio("sounds/victory.wav");

function tocarSom(som) {
    som.currentTime = 0;
    som.play();
}

let jogo;

function iniciarJogo(numJogadores) {
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
    jogo.areas.forEach((area, indice) => {
        const linha = Math.floor(indice / 5);
        const coluna = indice % 5;
        const x = coluna * tamanhoQuadrado + 50;
        const y = linha * tamanhoQuadrado + 50;
        const cor = area.dono === 0 ? "lightblue" : area.dono === 1 ? "lightcoral" : area.dono === 2 ? "lightgreen" : "lightyellow";
        const selecionado = (indice === jogo.selecionadoOrigem || indice === jogo.selecionadoDestino);
        desenharQuadrado(x, y, cor, `${area.dados} (J${area.dono + 1})`, selecionado);
    });
}

canvas.addEventListener("click", (evento) => {
    const rect = canvas.getBoundingClientRect();
    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;
    const coluna = Math.floor((x - 50) / tamanhoQuadrado);
    const linha = Math.floor((y - 50) / tamanhoQuadrado);
    const indice = linha * 5 + coluna;

    if (indice >= 0 && indice < jogo.areas.length) {
        if (jogo.selecionadoOrigem === null) {
            if (jogo.areas[indice].dono === jogo.jogadorAtual) {
                jogo.selecionadoOrigem = indice;
                tocarSom(somSelecao);
            }
        } else {
            // Verifica se o território clicado já está selecionado como origem para desmarcar
            if (jogo.selecionadoOrigem === indice) {
                jogo.selecionadoOrigem = null;
                tocarSom(somSelecao); // Você pode optar por usar um som diferente para a desseleção
            } else if (jogo.selecionadoDestino === null) {
                if (jogo.areas[indice].dono !== jogo.jogadorAtual && jogo.adjacencias[jogo.selecionadoOrigem].includes(indice)) {
                    jogo.selecionadoDestino = indice;
                    tocarSom(somSelecao);
                    jogo.ataque();
                }
            }
        }
        desenharMapa();
    }
});

function finalizarTurno() {
    jogo.finalizarTurno();
    desenharIndicadorTurno();
}

function mostrarDadosJogadores() {
    const dadosJogador1 = jogo.areas.filter(area => area.dono === 0).reduce((acc, area) => acc + area.dados, 0);
    const dadosJogador2 = jogo.areas.filter(area => area.dono === 1).reduce((acc, area) => acc + area.dados, 0);
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

    setTimeout(() => {
        document.body.removeChild(dadosDiv);
    }, 1000); // Remove a exibição após 5 segundos
}