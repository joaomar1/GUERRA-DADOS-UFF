// Representa o territorio, que contem um numero x de dados e um dono em um determinado momento
// Optamos por chamar de área para não criar um conflito de identificadores
class Area {
    constructor(numDados, dono) {
        this.dados = Array(numDados).fill().map(() => new Dado()); // Inicializa a área com um numero aleatório de dados
        this.dono = dono; 
    }
    // Método para criar as "áreas" com dados e donos de forma aleatória
    static criarAreas(numAreas, numJogadores) {
        return Array(numAreas).fill().map(() => new Area(
            Math.floor(Math.random() * 6) + 1, // Criar o número de dados da área
            Math.floor(Math.random() * numJogadores) // Atribuir a "área" o seu dono
        ));
    }

    // Rola os dados da "Área" e retorna o resultado
    rolarTodosDados() {
        return this.dados.reduce((soma, dado) => soma + dado.rolar(), 0);
    }
}
