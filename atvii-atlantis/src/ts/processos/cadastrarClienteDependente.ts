import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Cliente from "../modelos/cliente";
import CadastrarDocumentosCliente from "./cadastrarDocumentosCliente";
import CadastroEnderecoTitular from "./cadastroEnderecoTitular";


export default class CadastroClienteDependente extends Processo {
    processar(): void {
        console.log('Iniciando o cadastro de um novo dependente...')
        let nome = this.entrada.receberTexto('Qual o nome do novo dependente?')
        let nomeSocial = this.entrada.receberTexto('Qual o nome social do novo dependente?')
        let dataNascimento = this.entrada.receberData('Qual a data de nascimento?')
        let cliente = new Cliente(nome, nomeSocial, dataNascimento)

        // cadastro de documentos do dependente
        this.processo = new CadastrarDocumentosCliente(cliente)
        this.processo.processar()
        this.processo = new CadastroEnderecoTitular(cliente)
        this.processo.processar()

        let armazem = Armazem.InstanciaUnica
        let titulares = armazem.Clientes.filter(c => c.Tipo === 'titular')

        if (titulares.length === 0) {
            console.log('Não há titulares cadastrados. Cadastre um titular antes de adicionar dependentes.')
            return
        }

        console.log('Selecione o titular para este dependente:')
        titulares.forEach((t, index) => {
            console.log(`${index + 1} - ${t.Nome}`)
        })

        let indice = this.entrada.receberNumero('Escolha o número do titular:')
        let pos = indice - 1

        if (pos < 0 || pos >= titulares.length) {
            console.log('Opção inválida. Cancelando cadastro do dependente.')
            return
        }

        let titularSelecionado = titulares[pos]

        // vincula dependente ao titular
        cliente.Tipo = 'dependente'
        cliente.Titular = titularSelecionado
        titularSelecionado.Dependentes.push(cliente)

        // salva no repositório geral
        armazem.Clientes.push(cliente)

        console.log('Finalizando o cadastro do dependente...')
    }
}