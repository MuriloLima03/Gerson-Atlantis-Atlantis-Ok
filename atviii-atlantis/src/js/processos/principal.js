"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const menuPricipal_1 = __importDefault(require("../menus/menuPricipal"));
const listagemAcomodacoes_1 = __importDefault(require("./listagemAcomodacoes"));
const tipoCadastroCliente_1 = __importDefault(require("./tipoCadastroCliente"));
const tipoListagemClientes_1 = __importDefault(require("./tipoListagemClientes"));
class Principal extends processo_1.default {
    constructor() {
        super();
        this.execucao = true;
        this.menu = new menuPricipal_1.default();
    }
    processar() {
        this.menu.mostrar();
        this.opcao = this.entrada.receberNumero('Qual opção desejada?');
        switch (this.opcao) {
            case 1:
                this.processo = new tipoCadastroCliente_1.default();
                this.processo.processar();
                break;
            case 3:
                this.processo = new tipoListagemClientes_1.default();
                this.processo.processar();
                break;
            case 5:
                this.processo = new listagemAcomodacoes_1.default();
                this.processo.processar();
                break;
            case 6:
                const CadastroHospedagem = require('./cadastroHospedagem').default;
                this.processo = new CadastroHospedagem();
                this.processo.processar();
                break;
            case 7:
                const ListagemHospedagens = require('./listagemHospedagens').default;
                this.processo = new ListagemHospedagens();
                this.processo.processar();
                break;
            case 0:
                this.execucao = false;
                console.log('Até logo!');
                console.clear();
                break;
            default:
                console.log('Opção não entendida :(');
        }
    }
}
exports.default = Principal;
