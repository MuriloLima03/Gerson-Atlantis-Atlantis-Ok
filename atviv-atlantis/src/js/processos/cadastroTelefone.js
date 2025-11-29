"use strict";
//export default class Telefone {
//  private ddd: string
//private numero: string
//    constructor(ddd: string, numero: string) {
//        this.ddd = ddd
//        this.numero = numero
//  }
//public get Ddd() { return this.ddd }
//public get Numero() { return this.numero }
//}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const telefone_1 = __importDefault(require("../modelos/telefone"));
class CadastroTelefone extends processo_1.default {
    constructor(cliente) {
        super();
        this.cliente = cliente;
    }
    processar() {
        console.log('Coletando os dados do telefone...');
        let numero = this.entrada.receberTexto('Qual o número do telefone?');
        let ddd = this.entrada.receberTexto('Qual o DDD do telefone?');
        let telefone = new telefone_1.default(ddd, numero);
        this.cliente.Telefones.push(telefone);
    }
}
exports.default = CadastroTelefone;
