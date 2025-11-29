"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const menuTipoCadastroCliente_1 = __importDefault(require("../menus/menuTipoCadastroCliente"));
const cadastroClienteTitular_1 = __importDefault(require("./cadastroClienteTitular"));
class TipoCadastroCliente extends processo_1.default {
    constructor() {
        super();
        this.menu = new menuTipoCadastroCliente_1.default();
    }
    processar() {
        this.menu.mostrar();
        this.opcao = this.entrada.receberNumero('Qual opção desejada?');
        switch (this.opcao) {
            case 1:
                this.processo = new cadastroClienteTitular_1.default();
                this.processo.processar();
                break;
            default:
                console.log('Opção não entendida :(');
        }
    }
}
exports.default = TipoCadastroCliente;
