import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Hospedagem from "../modelos/hospedagem";

export default class CadastroHospedagem extends Processo {
    processar(): void {
        console.clear()
        console.log('Iniciando o cadastro de hospedagem...')
        let armazem = Armazem.InstanciaUnica

        if (armazem.Clientes.length === 0) {
            console.log('Não há clientes cadastrados. Cadastre um cliente primeiro.')
            return
        }
        if (armazem.Acomodacoes.length === 0) {
            console.log('Não há acomodações cadastradas. Cadastre acomodações primeiro.')
            return
        }

        console.log('Clientes disponíveis:')
        armazem.Clientes.forEach((c, i) => console.log(`${i} - ${c.Nome}`))
        let idxCliente = this.entrada.receberNumero('Escolha o índice do cliente:')
        let cliente = armazem.Clientes[idxCliente]
        if (!cliente) { console.log('Cliente inválido.'); return }

        console.log('Acomodações disponíveis:')
        armazem.Acomodacoes.forEach((a, i) => console.log(`${i} - ${a.NomeAcomadacao}`))
        let idxAcomod = this.entrada.receberNumero('Escolha o índice da acomodação:')
        let acomodacao = armazem.Acomodacoes[idxAcomod]
        if (!acomodacao) { console.log('Acomodação inválida.'); return }

        let dataEntrada = this.entrada.receberData('Data de entrada (dd/MM/yyyy):')
        let dataSaida = this.entrada.receberData('Data de saída (dd/MM/yyyy):')
        if (dataSaida <= dataEntrada) { console.log('Data de saída deve ser posterior à data de entrada.'); return }

        // verificar disponibilidade: não deve existir hospedagem para a mesma acomodação com overlap
        const conflito = armazem.Hospedagens.some(h => {
            if (h.Acomodacao !== acomodacao) return false
            const entradaExist = h.DataEntrada
            const saidaExist = h.DataSaida
            // se a hospedagem existente não tem data de saída, considera conflito
            if (!saidaExist) return true
            // verifica overlap: entrada1 < saida2 && entrada2 < saida1
            return (dataEntrada < saidaExist) && (entradaExist < dataSaida)
        })
        if (conflito) { console.log('Acomodação indisponível nesse período.'); return }

        let hospedagem = new Hospedagem(cliente, acomodacao, dataEntrada)
        hospedagem.DataSaida = dataSaida
        armazem.Hospedagens.push(hospedagem)
        console.log('Hospedagem registrada com sucesso!')
    }
}
