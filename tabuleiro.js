// Referente a múltiplas instâncias de classe
class Tabuleiro {
    constructor(numLinhas, numColunas, numJogadores) {
        this.numLinhas = numLinhas;
        this.numColunas = numColunas;
        this.areas = Area.criarAreas(numLinhas * numColunas, numJogadores); // Criação das "Áreas" do tabuleiro
        this.adjacencias = this.criarAdjacencias(); // Criação dos vizinhos de cada "Área"
    }
    // Criação de uma matriz para determinar quais áreas são vizinhas entre si
    criarAdjacencias() {
        const adjacencias = Array(this.numLinhas * this.numColunas).fill().map(() => []);
        for (let linha = 0; linha < this.numLinhas; linha++) {
            for (let coluna = 0; coluna < this.numColunas; coluna++) {
                const indice = linha * this.numColunas + coluna;
                if (coluna > 0) adjacencias[indice].push(indice - 1); // Esquerda
                if (coluna < this.numColunas - 1) adjacencias[indice].push(indice + 1); // Direita
                if (linha > 0) adjacencias[indice].push(indice - this.numColunas); // Acima
                if (linha < this.numLinhas - 1) adjacencias[indice].push(indice + this.numColunas); // Abaixo
            }
        }
        return adjacencias;
    }
}