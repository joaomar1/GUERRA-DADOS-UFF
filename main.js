const canvas = document.getElementById("tabuleiroJogo");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tamanhoQuadrado = 60;

const somSelecao = new Audio("sounds/select.wav");
const somAtaque = new Audio("sounds/attack.wav");
const somVitoria = new Audio("sounds/victory.wav");

function tocarSom(som) {
    som.currentTime = 0;
    som.play();
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
    ctx.fillText(texto, x + tamanhoQuadrado / 2 - 10, y + tamanhoQuadrado / 2 + 5);
}

function desenharIndicadorTurno() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText(`Turno: Jogador ${jogo.jogadorAtual + 1}`, canvas.width - 150, 30);
}

function desenharMapa() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharIndicadorTurno();
    jogo.areas.forEach((area, indice) => {
        const linha = Math.floor(indice / 5);
        const coluna = indice % 5;
        const x = coluna * tamanhoQuadrado + 50;
        const y = linha * tamanhoQuadrado + 50;
        const cor = area.dono === 0 ? "lightblue" : "lightcoral";
        const selecionado = (indice === jogo.selecionadoDe || indice === jogo.selecionadoPara);
        desenharQuadrado(x, y, cor, area.dados, selecionado);
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
        if (jogo.selecionadoDe === null) {
            jogo.selecionadoDe = indice;
            tocarSom(somSelecao);
        } else if (jogo.selecionadoPara === null) {
            jogo.selecionadoPara = indice;
            tocarSom(somSelecao);
            jogo.atacar();
        } else {
            jogo.selecionadoDe = indice;
            jogo.selecionadoPara = null;
            tocarSom(somSelecao);
        }
        desenharMapa();
    }
});

desenharMapa();
