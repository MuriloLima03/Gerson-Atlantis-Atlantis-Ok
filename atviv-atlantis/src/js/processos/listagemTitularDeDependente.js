"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const impressorCliente_1 = __importDefault(require("../impressores/impressorCliente"));
class ListagemTitularDeDependente extends processo_1.default {
    constructor() {
        super();
        this.clientes = armazem_1.default.InstanciaUnica.Clientes;
    }
    processar() {
        console.clear();
        console.log('Iniciando busca do titular a partir de um dependente específico');
        let dependentes = this.clientes.filter(c => c.Tipo === 'dependente');
        if (dependentes.length === 0) {
            console.log('Não há dependentes cadastrados.');
            return;
        }
        console.log('Selecione o dependente:');
        dependentes.forEach((d, idx) => {
            console.log(`${idx + 1} - ${d.Nome}`);
        });
        let opcao = this.entrada.receberNumero('Qual o número do dependente?');
        let pos = opcao - 1;
        if (pos < 0 || pos >= dependentes.length) {
            console.log('Opção inválida.');
            return;
        }
        let dependente = dependentes[pos];
        if (!dependente.Titular) {
            console.log('Titular não encontrado para este dependente.');
            return;
        }
        let titular = dependente.Titular;
        let impressor = new impressorCliente_1.default(titular);
        console.log('Titular do dependente selecionado:');
        console.log(impressor.imprimir());
    }
}
exports.default = ListagemTitularDeDependente;
