"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hospedagem {
    constructor(cliente, acomodacao, dataEntrada) {
        this.cliente = cliente;
        this.acomodacao = acomodacao;
        this.dataEntrada = dataEntrada;
    }
    get Cliente() { return this.cliente; }
    get Acomodacao() { return this.acomodacao; }
    get DataEntrada() { return this.dataEntrada; }
    get DataSaida() { return this.dataSaida; }
    set DataSaida(data) { this.dataSaida = data; }
}
exports.default = Hospedagem;
