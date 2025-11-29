import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import ImpressaorCliente from "../impressores/impressorCliente";
import Cliente from "../modelos/cliente";

export default class ListagemTitularDeDependente extends Processo {
    private clientes: Cliente[]
    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }

    processar(): void {
        console.clear()
        console.log('Iniciando busca do titular a partir de um dependente específico')

        let dependentes = this.clientes.filter(c => c.Tipo === 'dependente')

        if (dependentes.length === 0) {
            console.log('Não há dependentes cadastrados.')
            return
        }

        console.log('Selecione o dependente:')
        dependentes.forEach((d, idx) => {
            console.log(`${idx + 1} - ${d.Nome}`)
        })

        let opcao = this.entrada.receberNumero('Qual o número do dependente?')
        let pos = opcao - 1

        if (pos < 0 || pos >= dependentes.length) {
            console.log('Opção inválida.')
            return
        }

        let dependente = dependentes[pos]

        if (!dependente.Titular) {
            console.log('Titular não encontrado para este dependente.')
            return
        }

        let titular = dependente.Titular
        let impressor = new ImpressaorCliente(titular)
        console.log('Titular do dependente selecionado:')
        console.log(impressor.imprimir())
    }
}