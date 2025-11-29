import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import ImpressaorCliente from "../impressores/impressorCliente";
import Impressor from "../interfaces/impressor";
import Cliente from "../modelos/cliente";

export default class ListagemDependentes extends Processo {
    private clientes: Cliente[]
    private impressor!: Impressor
    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }
    processar(): void {
        console.clear()
        console.log('Iniciando a listagem dos dependentes de um titular específico')

        let titulares = this.clientes.filter(c => c.Tipo === 'titular')

        if (titulares.length === 0) {
            console.log('Não há titulares cadastrados.')
            return
        }

        console.log('Selecione o titular:')
        titulares.forEach((t, idx) => {
            console.log(`${idx + 1} - ${t.Nome}`)
        })

        let opcao = this.entrada.receberNumero('Qual o número do titular?')
        let pos = opcao - 1

        if (pos < 0 || pos >= titulares.length) {
            console.log('Opção inválida.')
            return
        }

        let titular = titulares[pos]

        if (!titular.Dependentes || titular.Dependentes.length === 0) {
            console.log('Este titular não possui dependentes.')
            return
        }

        console.log(`Dependentes do titular ${titular.Nome}:`)
        titular.Dependentes.forEach(dep => {
            this.impressor = new ImpressaorCliente(dep)
            console.log(this.impressor.imprimir())
        })
    }
}