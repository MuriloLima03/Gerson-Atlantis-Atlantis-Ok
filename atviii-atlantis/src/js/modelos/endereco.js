"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Endereco {
    constructor(rua, bairro, cidade, estado, pais, codigoPostal) {
        this.rua = rua;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.pais = pais;
        this.codigoPostal = codigoPostal;
    }
    get Rua() { return this.rua; }
    get Bairro() { return this.bairro; }
    get Cidade() { return this.cidade; }
    get Estado() { return this.estado; }
    get Pais() { return this.pais; }
    get CodigoPostal() { return this.codigoPostal; }
    clonar() {
        let endereco = new Endereco(this.rua, this.bairro, this.cidade, this.estado, this.pais, this.codigoPostal);
        return endereco;
    }
}
exports.default = Endereco;
