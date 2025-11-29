"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entrada_1 = __importDefault(require("../io/entrada"));
class Processo {
    constructor() {
        this.entrada = new entrada_1.default();
    }
    get Execucao() {
        return this.execucao;
    }
}
exports.default = Processo;
