import Processo from "../abstracoes/processo";
import * as Diretores from "../diretores";
import Armazem from "../dominio/armazem";
import Acomodacao from "../modelos/acomodacao";

export default class CadastroAcomodacoes extends Processo {
    private acomodacoes: Acomodacao[]
    constructor() {
        super()
        this.acomodacoes = Armazem.InstanciaUnica.Acomodacoes
    }
    processar(): void {
        // Instancia cada diretor exportado e constrói sua acomodação
        Object.values(Diretores).forEach((DiretorClass: any) => {
            try {
                const diretor = new DiretorClass()
                const acomodacao: Acomodacao = diretor.construir()
                this.acomodacoes.push(acomodacao)
            } catch (e) {
                // ignore exports que não sejam classes construtoras
            }
        })
        console.log('Todas as acomodações foram geradas e adicionadas ao armazém.')
    }
}