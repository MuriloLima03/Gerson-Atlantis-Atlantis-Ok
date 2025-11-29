"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const cliente_1 = __importDefault(require("../modelos/cliente"));
const cadastrarDocumentosCliente_1 = __importDefault(require("./cadastrarDocumentosCliente"));
const cadastroEnderecoTitular_1 = __importDefault(require("./cadastroEnderecoTitular"));
class CadastroClienteDependente extends processo_1.default {
    processar() {
        console.log('Iniciando o cadastro de um novo dependente...');
        let nome = this.entrada.receberTexto('Qual o nome do novo dependente?');
        let nomeSocial = this.entrada.receberTexto('Qual o nome social do novo dependente?');
        let dataNascimento = this.entrada.receberData('Qual a data de nascimento?');
        let cliente = new cliente_1.default(nome, nomeSocial, dataNascimento);
        // cadastro de documentos do dependente
        this.processo = new cadastrarDocumentosCliente_1.default(cliente);
        this.processo.processar();
        this.processo = new cadastroEnderecoTitular_1.default(cliente);
        this.processo.processar();
        let armazem = armazem_1.default.InstanciaUnica;
        let titulares = armazem.Clientes.filter(c => c.Tipo === 'titular');
        if (titulares.length === 0) {
            console.log('Não há titulares cadastrados. Cadastre um titular antes de adicionar dependentes.');
            return;
        }
        console.log('Selecione o titular para este dependente:');
        titulares.forEach((t, index) => {
            console.log(`${index + 1} - ${t.Nome}`);
        });
        let indice = this.entrada.receberNumero('Escolha o número do titular:');
        let pos = indice - 1;
        if (pos < 0 || pos >= titulares.length) {
            console.log('Opção inválida. Cancelando cadastro do dependente.');
            return;
        }
        let titularSelecionado = titulares[pos];
        // vincula dependente ao titular
        cliente.Tipo = 'dependente';
        cliente.Titular = titularSelecionado;
        titularSelecionado.Dependentes.push(cliente);
        // salva no repositório geral
        armazem.Clientes.push(cliente);
        console.log('Finalizando o cadastro do dependente...');
    }
}
exports.default = CadastroClienteDependente;
