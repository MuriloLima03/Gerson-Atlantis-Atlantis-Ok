"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const principal_1 = __importDefault(require("../processos/principal"));
console.clear();
console.log(`Bem-vindo(a) ao melhor sistema de gestão de clubes, hotéis e resorts do mundo, o Atlantis :)`);
let processo;
let execucao = true;
while (execucao) {
    processo = new principal_1.default();
    processo.processar();
    execucao = processo.Execucao;
}
