"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MenuPrincipal {
    mostrar() {
        console.log(`****************************`);
        console.log(`| Por favor, selecione uma opção...`);
        console.log(`----------------------`);
        console.log(`| Opções para cliente:`);
        console.log(`----------------------`);
        console.log(`| 1 - Cadastrar cliente`);
        console.log(`| 2 - Editar cliente`);
        console.log(`| 3 - Listar cliente(s)`);
        console.log(`| 4 - Excluir cliente`);
        console.log(`****************************`);
        console.log(`| 0 - Sair`);
        console.log(`----------------------`);
    }
}
exports.default = MenuPrincipal;
