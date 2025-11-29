"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MenuTipoListagemClientes {
    mostrar() {
        console.clear();
        console.log(`****************************`);
        console.log(`| Qual o tipo de listagem desejada? `);
        console.log(`----------------------`);
        console.log(`| 1 - Todos os titulares`);
        console.log(`| 2 - Todos os dependentes de um titular específico`);
        console.log(`| 3 - Titular de um dependente específico`);
        console.log(`----------------------`);
    }
}
exports.default = MenuTipoListagemClientes;
