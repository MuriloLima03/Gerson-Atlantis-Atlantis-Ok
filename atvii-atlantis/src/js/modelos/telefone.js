"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Telefone {
    constructor(ddd, numero) {
        this.ddd = ddd;
        this.numero = numero;
    }
    get Ddd() { return this.ddd; }
    get Numero() { return this.numero; }
}
exports.default = Telefone;
