import Processo from "../abstracoes/processo";
import Armazem from "../dominio/armazem";
import Impressor from "../interfaces/impressor";
import Acomodacao from "../modelos/acomodacao";

export default class ListagemHospedagens extends Processo {
    processar(): void {
        console.clear()
        console.log('Listando hospedagens registradas...')
        let armazem = Armazem.InstanciaUnica
        if (armazem.Hospedagens.length === 0) {
            console.log('Nenhuma hospedagem registrada.')
            return
        }

        armazem.Hospedagens.forEach((h: any, i: number) => {
            console.log(`---------------- Hospedagem ${i} ----------------`)
            console.log(`Cliente: ${h.Cliente.Nome}`)
            console.log(`Acomodação: ${h.Acomodacao.NomeAcomadacao}`)
            console.log(`Data entrada: ${h.DataEntrada.toLocaleDateString()}`)
            if (h.DataSaida) console.log(`Data saída: ${h.DataSaida.toLocaleDateString()}`)
            console.log('------------------------------------------------')
        })
    }
}
