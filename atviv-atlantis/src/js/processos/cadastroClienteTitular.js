"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
const cliente_1 = __importDefault(require("../modelos/cliente"));
const cadastroDocumentosCliente_1 = __importDefault(require("./cadastroDocumentosCliente"));
const cadastroEnderecoTitular_1 = __importDefault(require("./cadastroEnderecoTitular"));
const cadastroTelefone_1 = __importDefault(require("./cadastroTelefone"));
class CadastroClienteTitular extends processo_1.default {
    processar() {
        console.log('Iniciando o cadastro de um novo cliente...');
        let nome = this.entrada.receberTexto('Qual o nome do novo cliente?');
        let nomeSocial = this.entrada.receberTexto('Qual o nome social do novo cliente?');
        let dataNascimento = this.entrada.receberData('Qual a data de nascimento?');
        let cliente = new cliente_1.default(nome, nomeSocial, dataNascimento);
        this.processo = new cadastroTelefone_1.default(cliente);
        this.processo.processar();
        this.processo = new cadastroEnderecoTitular_1.default(cliente);
        this.processo.processar();
        this.processo = new cadastroDocumentosCliente_1.default(cliente);
        this.processo.processar();
        let armazem = armazem_1.default.InstanciaUnica;
        armazem.Clientes.push(cliente);
        console.log('Finalizando o cadastro do cliente...');
    }
}
exports.default = CadastroClienteTitular;
