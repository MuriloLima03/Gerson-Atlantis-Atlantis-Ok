import Documento from "./documento"
import Endereco from "./endereco"
import Telefone from "./telefone"

export default class Cliente {
    private nome: string
    private nomeSocial: string
    private dataNascimento: Date
    private dataCadastro: Date
    private telefones: Telefone[] = []
    private endereco!: Endereco
    private pais!: string
    private documentos: Documento[] = []
    private dependentes: Cliente[] = []
    private titular!: Cliente
    private tipo: 'titular' | 'dependente' = 'titular'

    constructor(nome: string, nomeSocial: string, dataNascimento: Date) {
        this.nome = nome
        this.nomeSocial = nomeSocial
        this.dataNascimento = dataNascimento
        this.dataCadastro = new Date()
    }

    public get Tipo() {return this.tipo}
    public get Nome() { return this.nome }
    public get NomeSocial() { return this.nomeSocial }
    public get DataNascimento() { return this.dataNascimento }
    public get DataCadastro() { return this.dataCadastro }
    public get Telefones() { return this.telefones }
    public get Endereco() { return this.endereco }
    public get Pais() { return this.pais }
    public get Documentos() { return this.documentos }
    public get Dependentes() { return this.dependentes }
    public get Titular() { return this.titular }

    public set Tipo(tipo: 'titular' | 'dependente') {this.tipo = tipo}
    public set Endereco(endereco: Endereco) { this.endereco = endereco }
    public set Pais(pais: string) { this.pais = pais }

    // novo setter para vincular um titular ao cliente (dependente)
    public set Titular(titular: Cliente) {
        this.titular = titular
    }
}