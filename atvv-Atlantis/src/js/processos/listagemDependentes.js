"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const impressorCliente_1 = __importDefault(require("../impressores/impressorCliente"));
class ListagemDependentes extends processo_1.default {
    constructor() {
        super();
        this.clientes = armazem_1.default.InstanciaUnica.Clientes;
    }
    processar() {
        console.clear();
        console.log('Iniciando a listagem dos dependentes de um titular específico');
        let titulares = this.clientes.filter(c => c.Tipo === 'titular');
        if (titulares.length === 0) {
            console.log('Não há titulares cadastrados.');
            return;
        }
        console.log('Selecione o titular:');
        titulares.forEach((t, idx) => {
            console.log(`${idx + 1} - ${t.Nome}`);
        });
        let opcao = this.entrada.receberNumero('Qual o número do titular?');
        let pos = opcao - 1;
        if (pos < 0 || pos >= titulares.length) {
            console.log('Opção inválida.');
            return;
        }
        let titular = titulares[pos];
        if (!titular.Dependentes || titular.Dependentes.length === 0) {
            console.log('Este titular não possui dependentes.');
            return;
        }
        console.log(`Dependentes do titular ${titular.Nome}:`);
        titular.Dependentes.forEach(dep => {
            this.impressor = new impressorCliente_1.default(dep);
            console.log(this.impressor.imprimir());
        });
    }
}
exports.default = ListagemDependentes;
