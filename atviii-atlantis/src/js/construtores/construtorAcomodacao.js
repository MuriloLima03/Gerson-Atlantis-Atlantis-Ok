"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NomeAcomadacao_1 = require("../enumeracoes/NomeAcomadacao");
const acomodacao_1 = __importDefault(require("../modelos/acomodacao"));
class ConstrutorAcomodacao {
    constructor() {
        this.nomeAcomodacao = NomeAcomadacao_1.NomeAcomadacao.SolteiroSimples;
        this.camaSolteiro = 0;
        this.camaCasal = 0;
        this.suite = 0;
        this.climatizacao = false;
        this.garagem = 0;
    }
    set NomeAcomodacao(nomeAcomodacao) { this.nomeAcomodacao = nomeAcomodacao; }
    set CamaSolteiro(camaSolteiro) { this.camaSolteiro = camaSolteiro; }
    set CamaCasal(camaCasal) { this.camaCasal = camaCasal; }
    set Suite(suite) { this.suite = suite; }
    set Climatizacao(climatizacao) { this.climatizacao = climatizacao; }
    set Garagem(garagem) { this.garagem = garagem; }
    construir() {
        let acomodacao = new acomodacao_1.default(this.nomeAcomodacao, this.camaSolteiro, this.camaCasal, this.suite, this.climatizacao, this.garagem);
        return acomodacao;
    }
}
exports.default = ConstrutorAcomodacao;
