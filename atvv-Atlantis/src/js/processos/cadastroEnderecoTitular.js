"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const endereco_1 = __importDefault(require("../modelos/endereco"));
class CadastroEnderecoTitular extends processo_1.default {
    constructor(cliente) {
        super();
        this.cliente = cliente;
    }
    processar() {
        console.log('Coletando os dados de endereço...');
        let rua = this.entrada.receberTexto('Qual a rua?');
        let bairro = this.entrada.receberTexto('Qual o bairro?');
        let cidade = this.entrada.receberTexto('Qual a cidade?');
        let estado = this.entrada.receberTexto('Qual o estado?');
        let pais = this.entrada.receberTexto('Qual o país?');
        let codigoPostal = this.entrada.receberTexto('Qual o código postal?');
        let endereco = new endereco_1.default(rua, bairro, cidade, estado, pais, codigoPostal);
        this.cliente.Endereco = endereco;
    }
}
exports.default = CadastroEnderecoTitular;
