"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Acomodacao {
    constructor(nomeAcomadacao, camaSolteiro, camaCasal, suite, climatizacao, garagem) {
        this.nomeAcomadacao = nomeAcomadacao;
        this.camaSolteiro = camaSolteiro;
        this.camaCasal = camaCasal;
        this.suite = suite;
        this.climatizacao = climatizacao;
        this.garagem = garagem;
    }
    get NomeAcomadacao() { return this.nomeAcomadacao; }
    get CamaSolteiro() { return this.camaSolteiro; }
    get CamaCasal() { return this.camaCasal; }
    get Suite() { return this.suite; }
    get Climatizacao() { return this.climatizacao; }
    get Garagem() { return this.garagem; }
}
exports.default = Acomodacao;
