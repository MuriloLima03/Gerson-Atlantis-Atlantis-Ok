"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const menuTipoDocumento_1 = __importDefault(require("../menus/menuTipoDocumento"));
const cadastroRg_1 = __importDefault(require("./cadastroRg"));
const cadastroCpf_1 = __importDefault(require("./cadastroCpf"));
const cadastroPassaporte_1 = __importDefault(require("./cadastroPassaporte"));
class CadastrarDocumentosCliente extends processo_1.default {
    constructor(cliente) {
        super();
        this.cliente = cliente;
        this.menu = new menuTipoDocumento_1.default();
        this.execucao = true;
    }
    processar() {
        console.log('Inciando o cadastro de documentos...');
        while (this.execucao) {
            this.menu.mostrar();
            this.opcao = this.entrada.receberNumero('Qual opção desejada?');
            switch (this.opcao) {
                case 2:
                    this.processo = new cadastroRg_1.default(this.cliente);
                    this.processo.processar();
                    break;
                case 1:
                    this.processo = new cadastroCpf_1.default(this.cliente);
                    this.processo.processar();
                case 3:
                    this.processo = new cadastroPassaporte_1.default(this.cliente);
                    this.processo.processar();
                    break;
                case 0:
                    this.execucao = false;
                    break;
                default:
                    console.log('Opção não entendida :(');
            }
        }
    }
}
exports.default = CadastrarDocumentosCliente;
