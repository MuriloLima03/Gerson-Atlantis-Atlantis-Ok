"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ImpressorEndereco {
    constructor(endereco) {
        this.endereco = endereco;
    }
    imprimir() {
        let impressao = `| Endereco:\n`
            + `| rua: ${this.endereco.Rua}\n`
            + `| bairro: ${this.endereco.Bairro}\n`
            + `| cidade: ${this.endereco.Cidade}\n`
            + `| estado: ${this.endereco.Estado}\n`
            + `| país: ${this.endereco.Pais}\n`
            + `| código postal: ${this.endereco.Pais}`;
        return impressao;
    }
}
exports.default = ImpressorEndereco;
