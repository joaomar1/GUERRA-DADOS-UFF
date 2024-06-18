// Representa o jogador do jogo, verificando quais territorios o jogador tem e quais ele tem ao seu redor
class Jogador {
    constructor(id) {
        this.id = id; // Identificador do jogador
        this.territoriosConquistados = [];
        this.territoriosEnvolvidos = new Set();
    }
    // Adiciona o territorio a lista de territorios conquistador por um determinado jogador
    adicionarTerritorioConquistado(indice) {
        this.territoriosConquistados.push(indice);
    }
    // Adiciona territorios ao redor para duelos
    adicionarTerritorioEnvolvido(indice) {
        this.territoriosEnvolvidos.add(indice);
    }
    // Limpa a lista de territorios conquistados ao final de cada turno
    limparTerritorios() {
        this.territoriosConquistados = [];
        this.territoriosEnvolvidos.clear();
    }
}