"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const impressorCliente_1 = __importDefault(require("../impressores/impressorCliente"));
class ListagemTitulares extends processo_1.default {
    constructor() {
        super();
        this.clientes = armazem_1.default.InstanciaUnica.Clientes;
    }
    processar() {
        console.clear();
        console.log('Iniciando a listagem dos clientes titulares...');
        this.clientes.forEach(cliente => {
            if (this.titular(cliente)) {
                this.impressor = new impressorCliente_1.default(cliente);
                console.log(this.impressor.imprimir());
            }
        });
    }
    titular(cliente) {
        let verificacao = false;
        if (cliente.Titular == undefined) {
            verificacao = true;
        }
        return verificacao;
    }
}
exports.default = ListagemTitulares;
