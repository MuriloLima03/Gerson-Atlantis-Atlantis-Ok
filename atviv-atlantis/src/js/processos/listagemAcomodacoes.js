"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const impressorAcomodacao_1 = __importDefault(require("../impressores/impressorAcomodacao"));
class ListagemAcomodacoes extends processo_1.default {
    constructor() {
        super();
        this.acomodacoes = armazem_1.default.InstanciaUnica.Acomodacoes;
    }
    processar() {
        console.clear();
        console.log('Iniciando a listagem das acomodações ofertadas...');
        console.log(`-------------------------------------------------`);
        this.acomodacoes.forEach(acomodacao => {
            this.impressor = new impressorAcomodacao_1.default(acomodacao);
            console.log(this.impressor.imprimir());
            console.log(`-------------------------------------------------`);
        });
    }
}
exports.default = ListagemAcomodacoes;
