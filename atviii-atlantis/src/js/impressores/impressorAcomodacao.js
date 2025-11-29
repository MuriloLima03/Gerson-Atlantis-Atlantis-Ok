"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ImpressorAcomodacao {
    constructor(acomodacao) {
        this.acomodacao = acomodacao;
    }
    imprimir() {
        let descricao = `Nomenclatura: ${this.acomodacao.NomeAcomadacao.toString()}\n`
            + `-- Quantidade de leitos para solteiros: ${this.acomodacao.CamaSolteiro}\n`
            + `-- Quantidade de leitos para casais: ${this.acomodacao.CamaCasal}\n`
            + `-- Climatização: ${this.converterBooleano(this.acomodacao.Climatizacao)}\n`
            + `-- Quantidade de garagens disponíveis: ${this.acomodacao.Garagem}\n`
            + `-- Quantidade de suites: ${this.acomodacao.Suite}\n`;
        return descricao;
    }
    converterBooleano(valor) {
        if (valor) {
            return `sim`;
        }
        else {
            return `não`;
        }
    }
}
exports.default = ImpressorAcomodacao;
