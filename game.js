class Jogo {
    constructor(numJogadores) {
        this.numJogadores = numJogadores;
        this.areas = Array(30).fill().map(() => ({
            dados: Math.floor(Math.random() * 6) + 1,
            dono: Math.floor(Math.random() * numJogadores)
        }));
        this.jogadorAtual = 0;
        this.selecionadoOrigem = null;
        this.selecionadoDestino = null;
        this.territoriosConquistados = [];
        this.adjacencias = this.criarAdjacencias();
        this.territoriosEnvolvidos = new Set();
    }

    criarAdjacencias() {
        const adjacencias = [];
        for (let i = 0; i < 30; i++) {
            adjacencias.push([]);
        }

        const numLinhas = 6;
        const numColunas = 5;
        for (let linha = 0; linha < numLinhas; linha++) {
            for (let coluna = 0; coluna < numColunas; coluna++) {
                const indice = linha * numColunas + coluna;
                if (coluna > 0) adjacencias[indice].push(indice - 1); // Esquerda
                if (coluna < numColunas - 1) adjacencias[indice].push(indice + 1); // Direita
                if (linha > 0) adjacencias[indice].push(indice - numColunas); // Acima
                if (linha < numLinhas - 1) adjacencias[indice].push(indice + numColunas); // Abaixo
            }
        }

        return adjacencias;
    }

    ataque() {
        if (this.selecionadoOrigem !== null && this.selecionadoDestino !== null) {
            const origem = this.areas[this.selecionadoOrigem];
            const destino = this.areas[this.selecionadoDestino];
            if (origem.dados > 1 && origem.dono !== destino.dono && this.adjacencias[this.selecionadoOrigem].includes(this.selecionadoDestino)) {
                tocarSom(somAtaque);
                
                // Rolagem de dados para ataque e defesa com somas
                let rolagemAtaque = 0, rolagemDefesa = 0;
                for (let i = 0; i < origem.dados; i++) {
                    rolagemAtaque += Math.floor(Math.random() * 6) + 1;
                }
                for (let i = 0; i < destino.dados; i++) {
                    rolagemDefesa += Math.floor(Math.random() * 6) + 1;
                }

                if (rolagemAtaque > rolagemDefesa) {
                    destino.dono = origem.dono;
                    destino.dados = origem.dados - 1;
                    origem.dados = 1;
                    this.territoriosConquistados.push(this.selecionadoDestino);
                    this.territoriosEnvolvidos.add(this.selecionadoOrigem);
                    this.territoriosEnvolvidos.add(this.selecionadoDestino);
                    mostrarDadosJogadores();
                    if (this.verificarVitoria()) {
                        tocarSom(somVitoria);
                        setTimeout(() => {
                            alert(`Jogador ${this.jogadorAtual + 1} venceu!`);
                            this.reiniciarJogo();
                        }, 100);
                    }
                } else if (rolagemAtaque <= rolagemDefesa) { // Em caso de empate ou defesa mais forte
                    origem.dados = 1;
                }
                this.selecionadoOrigem = null;
                this.selecionadoDestino = null;
                desenharMapa();
            }
        }
    }

    finalizarTurno() {
        if (this.territoriosConquistados.length > 1) {
            this.areas.forEach(area => {
                if (area.dono === this.jogadorAtual) {
                    area.dados += 1;
                }
            });
        } else {
            this.territoriosConquistados.forEach(indice => {
                this.areas[indice].dados += 3;
            });
            this.territoriosEnvolvidos.forEach(indice => {
                if (!this.territoriosConquistados.includes(indice)) {
                    this.areas[indice].dados += 2;
                }
            });
        }
    
        this.territoriosConquistados = [];
        this.territoriosEnvolvidos.clear();
        this.selecionadoOrigem = null;
        this.selecionadoDestino = null;
        this.jogadorAtual = (this.jogadorAtual + 1) % this.numJogadores;
        desenharMapa();
    }

    reiniciarJogo() {
        this.areas = Array(30).fill().map(() => ({
            dados: Math.floor(Math.random() * 6) + 1,
            dono: Math.floor(Math.random() * this.numJogadores)
        }));
        this.jogadorAtual = 0;
        this.selecionadoOrigem = null;
        this.selecionadoDestino = null;
        this.territoriosConquistados = [];
        this.territoriosEnvolvidos.clear();
        desenharMapa();
    }

    verificarVitoria() {
        const donos = this.areas.map(area => area.dono);
        return new Set(donos).size === 1;
    }
}