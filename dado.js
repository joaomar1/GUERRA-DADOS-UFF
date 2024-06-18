// Representa o dado, que funciona no jogo como uma tropa ou exército
class Dado {
    constructor() {
        this.valor = this.rolar(); // Inicia o dado com um valor aleatorio entre 1 e 6
    }

    rolar() {
        // Gera um valor aleatório entre 1 e 6
        this.valor = Math.floor(Math.random() * 6) + 1;
        return this.valor;
    }
}
