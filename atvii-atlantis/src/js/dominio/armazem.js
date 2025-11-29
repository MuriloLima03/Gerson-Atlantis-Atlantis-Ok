"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Armazem {
    constructor() {
        this.clientes = [];
    }
    static get InstanciaUnica() {
        return this.instanciaUnica;
    }
    get Clientes() {
        return this.clientes;
    }
}
Armazem.instanciaUnica = new Armazem();
exports.default = Armazem;
