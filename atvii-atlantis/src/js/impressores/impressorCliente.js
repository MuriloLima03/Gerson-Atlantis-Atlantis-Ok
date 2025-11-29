"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const impressorDocumentos_1 = __importDefault(require("./impressorDocumentos"));
const impressorEndereco_1 = __importDefault(require("./impressorEndereco"));
class ImpressaorCliente {
    constructor(cliente) {
        this.cliente = cliente;
    }
    imprimir() {
        let impressao = `****************************\n`
            + `| Nome: ${this.cliente.Nome}\n`
            + `| Nome social: ${this.cliente.NomeSocial}\n`
            + `| Data de nascimento: ${this.cliente.DataNascimento.toLocaleDateString()}\n`
            + `| Data de cadastro: ${this.cliente.DataCadastro.toLocaleDateString()}`;
        this.impressor = new impressorEndereco_1.default(this.cliente.Endereco);
        impressao = impressao + `\n${this.impressor.imprimir()}`;
        this.impressor = new impressorDocumentos_1.default(this.cliente.Documentos);
        impressao = impressao + `\n${this.impressor.imprimir()}`;
        impressao = impressao + `\n****************************`;
        return impressao;
    }
}
exports.default = ImpressaorCliente;
