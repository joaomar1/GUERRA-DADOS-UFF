class Jogo {
    constructor(numJogadores) {
        this.numJogadores = numJogadores;
        this.tabuleiro = new Tabuleiro(6, 5, numJogadores);
        this.jogadores = Array(numJogadores).fill().map((_, i) => new Jogador(i));
        this.jogadorAtual = 0;
        this.jogadoresEliminados = new Set();
        this.selecionadoOrigem = null;
        this.selecionadoDestino = null;
    }

    // Regras de ataque entre as "Áreas" selecionadas pelo jogador
    ataque() {
        if (this.selecionadoOrigem !== null && this.selecionadoDestino !== null) {
            const origem = this.tabuleiro.areas[this.selecionadoOrigem];
            const destino = this.tabuleiro.areas[this.selecionadoDestino];
            if (origem.dados.length > 1 && origem.dono !== destino.dono && this.tabuleiro.adjacencias[this.selecionadoOrigem].includes(this.selecionadoDestino)) {
                tocarSom(somAtaque); // Condição que verifica vizinhança e previne erros de jogabilidade

                // Rolagem de dados para ataque e defesa com somas
                const rolagemAtaque = this.rolarDados(origem.dados);
                const rolagemDefesa = this.rolarDados(destino.dados);

                console.log(`Rolagem Ataque: ${rolagemAtaque}`);
                console.log(`Rolagem Defesa: ${rolagemDefesa}`);

                if (rolagemAtaque > rolagemDefesa) {
                    destino.dono = origem.dono;
                    destino.dados = Array(origem.dados.length - 1).fill().map(() => new Dado());
                    origem.dados = [new Dado()];
                    this.jogadores[this.jogadorAtual].adicionarTerritorioConquistado(this.selecionadoDestino);
                    this.jogadores[this.jogadorAtual].adicionarTerritorioEnvolvido(this.selecionadoOrigem);
                    this.jogadores[this.jogadorAtual].adicionarTerritorioEnvolvido(this.selecionadoDestino);
                    mostrarDadosJogadores();

                    // Verificar se o jogador defensor foi eliminado
                    this.verificarEliminacao(destino.dono);

                    if (this.verificarVitoria()) {
                        tocarSom(somVitoria);
                        setTimeout(() => {
                            alert(`Jogador ${this.jogadorAtual + 1} venceu!`);
                            this.reiniciarJogo();
                        }, 100);
                    }
                } else {
                    origem.dados = [new Dado()];
                }
                this.selecionadoOrigem = null;
                this.selecionadoDestino = null;
                desenharMapa();
            }
        }
    }

    // Rolagem dos dados de uma "Área"
    rolarDados(dados) {
        return dados.reduce((soma, dado) => soma + dado.rolar(), 0);
    }

    // Final do turno do jogador atual
    finalizarTurno() {
        const jogadorAtual = this.jogadores[this.jogadorAtual];
        if (jogadorAtual.territoriosConquistados.length > 1) {
            this.tabuleiro.areas.forEach(area => {
                if (area.dono === this.jogadorAtual) {
                    area.dados.push(new Dado()); // Adiciona dados extras para cada território conquistado durante a rodada
                }
            });
        } else {
            jogadorAtual.territoriosConquistados.forEach(indice => {
                this.tabuleiro.areas[indice].dados.push(new Dado(), new Dado(), new Dado());
            });
            jogadorAtual.territoriosEnvolvidos.forEach(indice => {
                if (!jogadorAtual.territoriosConquistados.includes(indice)) {
                    this.tabuleiro.areas[indice].dados.push(new Dado(), new Dado());
                }
            });
        }

        jogadorAtual.limparTerritorios();
        this.selecionadoOrigem = null;
        this.selecionadoDestino = null;

        // Verificar se o jogador atual foi eliminado
        this.verificarEliminacao(jogadorAtual.id);

        // Mudar para o próximo jogador que não esteja eliminado
        do {
            this.jogadorAtual = (this.jogadorAtual + 1) % this.numJogadores;
        } while (this.jogadoresEliminados.has(this.jogadorAtual));

        desenharMapa();
    }

    // Verifica se um jogador foi eliminado (não possui mais territórios)
    verificarEliminacao(jogadorId) {
        const jogadorEliminado = !this.tabuleiro.areas.some(area => area.dono === jogadorId);
        if (jogadorEliminado) {
            this.jogadoresEliminados.add(jogadorId);
        }
        return jogadorEliminado;
    }

    // Reinicia o jogo
    reiniciarJogo() {
        this.tabuleiro = new Tabuleiro(6, 5, this.numJogadores);
        this.jogadorAtual = 0;
        this.jogadoresEliminados.clear();
        this.selecionadoOrigem = null;
        this.selecionadoDestino = null;
        this.jogadores.forEach(jogador => jogador.limparTerritorios());
        desenharMapa();
    }

    // Verifica se algum jogador conquistou todas as "Áreas" do tabuleiro
    verificarVitoria() {
        const donos = this.tabuleiro.areas.map(area => area.dono);
        return new Set(donos).size === 1;
    }
}
