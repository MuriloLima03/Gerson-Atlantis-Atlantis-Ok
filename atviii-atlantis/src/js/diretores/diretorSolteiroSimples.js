"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const construtorAcomodacao_1 = __importDefault(require("../construtores/construtorAcomodacao"));
const NomeAcomadacao_1 = require("../enumeracoes/NomeAcomadacao");
const diretor_1 = __importDefault(require("../abstracoes/diretor"));
class DiretorSolteiroSimples extends diretor_1.default {
    constructor() {
        super();
        this.construtor = new construtorAcomodacao_1.default();
    }
    construir() {
        let objetoConstrutor = this.construtor;
        objetoConstrutor.NomeAcomodacao = NomeAcomadacao_1.NomeAcomadacao.SolteiroSimples;
        objetoConstrutor.CamaCasal = 0;
        objetoConstrutor.CamaSolteiro = 1;
        objetoConstrutor.Climatizacao = true;
        objetoConstrutor.Garagem = 0;
        objetoConstrutor.Suite = 1;
        return objetoConstrutor.construir();
    }
}
exports.default = DiretorSolteiroSimples;
