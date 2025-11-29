//export default class Telefone {
  //  private ddd: string
    //private numero: string
//    constructor(ddd: string, numero: string) {
//        this.ddd = ddd
//        this.numero = numero
  //  }
    //public get Ddd() { return this.ddd }
    //public get Numero() { return this.numero }
//}

import Processo from "../abstracoes/processo";
import Cliente from "../modelos/cliente";
import Telefone from "../modelos/telefone";

export default class CadastroTelefone extends Processo {
    private cliente: Cliente
    constructor(cliente: Cliente) {
        super()
        this.cliente = cliente
    }

    processar(): void {
        console.log('Coletando os dados do telefone...')
        let numero = this.entrada.receberTexto('Qual o número do telefone?')
        let ddd = this.entrada.receberTexto('Qual o DDD do telefone?')
        let telefone = new Telefone(ddd, numero)
        this.cliente.Telefones.push(telefone)
    }
}