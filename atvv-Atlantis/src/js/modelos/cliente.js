"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cliente {
    constructor(nome, nomeSocial, dataNascimento) {
        this.telefones = [];
        this.documentos = [];
        this.dependentes = [];
        this.tipo = 'titular';
        this.nome = nome;
        this.nomeSocial = nomeSocial;
        this.dataNascimento = dataNascimento;
        this.dataCadastro = new Date();
    }
    get Tipo() { return this.tipo; }
    get Nome() { return this.nome; }
    get NomeSocial() { return this.nomeSocial; }
    get DataNascimento() { return this.dataNascimento; }
    get DataCadastro() { return this.dataCadastro; }
    get Telefones() { return this.telefones; }
    get Endereco() { return this.endereco; }
    get Pais() { return this.pais; }
    get Documentos() { return this.documentos; }
    get Dependentes() { return this.dependentes; }
    get Titular() { return this.titular; }
    set Tipo(tipo) { this.tipo = tipo; }
    set Endereco(endereco) { this.endereco = endereco; }
    set Pais(pais) { this.pais = pais; }
    // novo setter para vincular um titular ao cliente (dependente)
    set Titular(titular) {
        this.titular = titular;
    }
}
exports.default = Cliente;
