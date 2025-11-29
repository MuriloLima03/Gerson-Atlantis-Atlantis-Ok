import Cliente from "./cliente";
import Acomodacao from "./acomodacao";

export default class Hospedagem {
    private cliente: Cliente
    private acomodacao: Acomodacao
    private dataEntrada: Date
    private dataSaida?: Date

    constructor(cliente: Cliente, acomodacao: Acomodacao, dataEntrada: Date) {
        this.cliente = cliente
        this.acomodacao = acomodacao
        this.dataEntrada = dataEntrada
    }

    public get Cliente() { return this.cliente }
    public get Acomodacao() { return this.acomodacao }
    public get DataEntrada() { return this.dataEntrada }
    public get DataSaida(): Date | undefined { return this.dataSaida }

    public set DataSaida(data: Date | undefined) { this.dataSaida = data }
}
