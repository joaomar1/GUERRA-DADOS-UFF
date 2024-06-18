class Jogo {
    constructor() {
        this.areas = Array(30).fill().map(() => ({
            dados: Math.floor(Math.random() * 6) + 1,
            dono: Math.floor(Math.random() * 2)
        }));
        this.jogadorAtual = 0;
        this.selecionadoDe = null;
        this.selecionadoPara = null;
    }

    atacar() {
        if (this.selecionadoDe !== null && this.selecionadoPara !== null) {
            const deArea = this.areas[this.selecionadoDe];
            const paraArea = this.areas[this.selecionadoPara];
            if (deArea.dados > 1 && deArea.dono !== paraArea.dono) {
                tocarSom(somAtaque);
                const rolarAtaque = Math.floor(Math.random() * deArea.dados) + 1;
                const rolarDefesa = Math.floor(Math.random() * paraArea.dados) + 1;
                if (rolarAtaque > rolarDefesa) {
                    paraArea.dono = deArea.dono;
                    paraArea.dados = deArea.dados - 1;
                    deArea.dados = 1;
                    if (this.jogoTerminado()) {
                        tocarSom(somVitoria);
                        setTimeout(() => {
                            alert(`Jogador ${this.jogadorAtual + 1} venceu!`);
                            this.reiniciarJogo();
                        }, 100);
                    }
                } else {
                    deArea.dados = 1;
                }
                this.finalizarTurno();
            }
        }
    }

    finalizarTurno() {
        this.selecionadoDe = null;
        this.selecionadoPara = null;
        this.jogadorAtual = (this.jogadorAtual + 1) % 2;
        desenharMapa();
    }

    reiniciarJogo() {
        this.areas = Array(30).fill().map(() => ({
            dados: Math.floor(Math.random() * 6) + 1,
            dono: Math.floor(Math.random() * 2)
        }));
        this.jogadorAtual = 0;
        this.selecionadoDe = null;
        this.selecionadoPara = null;
        desenharMapa();
    }

    jogoTerminado() {
        const donos = this.areas.map(area => area.dono);
        return new Set(donos).size === 1;
    }
}

const jogo = new Jogo();
