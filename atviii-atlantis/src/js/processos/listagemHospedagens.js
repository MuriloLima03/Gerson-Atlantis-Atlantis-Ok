"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processo_1 = __importDefault(require("../abstracoes/processo"));
const armazem_1 = __importDefault(require("../dominio/armazem"));
class ListagemHospedagens extends processo_1.default {
    processar() {
        console.clear();
        console.log('Listando hospedagens registradas...');
        let armazem = armazem_1.default.InstanciaUnica;
        if (armazem.Hospedagens.length === 0) {
            console.log('Nenhuma hospedagem registrada.');
            return;
        }
        armazem.Hospedagens.forEach((h, i) => {
            console.log(`---------------- Hospedagem ${i} ----------------`);
            console.log(`Cliente: ${h.Cliente.Nome}`);
            console.log(`Acomodação: ${h.Acomodacao.NomeAcomadacao}`);
            console.log(`Data entrada: ${h.DataEntrada.toLocaleDateString()}`);
            if (h.DataSaida)
                console.log(`Data saída: ${h.DataSaida.toLocaleDateString()}`);
            console.log('------------------------------------------------');
        });
    }
}
exports.default = ListagemHospedagens;
