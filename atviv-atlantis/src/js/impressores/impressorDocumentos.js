"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const impressorDocumento_1 = __importDefault(require("./impressorDocumento"));
class ImpressorDocumentos {
    constructor(documentos) {
        this.documentos = documentos;
    }
    imprimir() {
        let impressao = ``;
        for (let index = 0; index < this.documentos.length; index++) {
            this.impressor = new impressorDocumento_1.default(this.documentos[index]);
            if (index == 0) {
                impressao = impressao + `${this.impressor.imprimir()}`;
            }
            else {
                impressao = impressao + `\n${this.impressor.imprimir()}`;
            }
        }
        return impressao;
    }
}
exports.default = ImpressorDocumentos;
