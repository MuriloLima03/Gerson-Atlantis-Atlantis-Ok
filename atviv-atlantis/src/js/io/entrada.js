"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
class Entrada {
    receberNumero(mensagem) {
        let prompt = (0, prompt_sync_1.default)();
        let valor = prompt(`${mensagem} `);
        let numero = new Number(valor);
        return numero.valueOf();
    }
    receberTexto(mensagem) {
        let prompt = (0, prompt_sync_1.default)();
        let texto = prompt(`${mensagem} `);
        return texto;
    }
    receberData(mensagem) {
        let prompt = (0, prompt_sync_1.default)();
        let texto = prompt(`${mensagem}, no padrão dd/MM/yyyy: `);
        let partes = texto.split('/');
        let ano = new Number(partes[2]);
        let mes = new Number(partes[1]);
        let dia = new Number(partes[0]);
        let data = new Date(ano.valueOf(), mes.valueOf() - 1, dia.valueOf());
        return data;
    }
}
exports.default = Entrada;
