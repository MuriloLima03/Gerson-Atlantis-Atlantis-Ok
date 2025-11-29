# Protótipo SPA - Atlantis

Este diretório contém um protótipo navegável (SPA) que contempla as funcionalidades do sistema CLI atual: CRUD de clientes (hóspedes), cadastro de acomodações e registro de hospedagens.

Como usar

- Abrir `src/ui/index.html` diretamente no navegador (duplo-clique). Esse protótipo usa localStorage para persistência local.
- Se preferir servir por um servidor estático (recomendado para maior compatibilidade), você pode usar um simples servidor Node/Python. Exemplo (PowerShell):

```powershell
# com npm (instale http-server globalmente ou use npx)
npx http-server src/ui -p 8080; Start-Process "http://localhost:8080"

# ou com Python 3 (caso tenha)
python -m http.server 8080 --directory src/ui; Start-Process "http://localhost:8080"
```

O que está implementado

- Listar, criar, editar e excluir Clientes
- Listar, criar, editar e excluir Acomodações
- Registrar, editar e cancelar Hospedagens (associa cliente + acomodação)
- Dados persistidos em localStorage (chaves: atlantis_clients_v1, atlantis_accommodations_v1, atlantis_bookings_v1)
- Seed inicial com exemplos para testar os fluxos

Observações

- Este é um protótipo de interface para demonstrar o fluxo e usabilidade. Não está integrado ao backend/áreas de domínio do projeto (os módulos de Node/TS existentes). Integração pode ser adicionada expondo uma API ou reutilizando as camadas de domínio do repositório.

Próximos passos recomendados

- Integrar com as camadas de domínio (mover lógica para endpoints ou usar uma camada compartilhada)
- Adicionar validação e máscaras mais robustas (telefone, datas)
- Melhorar acessibilidade e testes automatizados de interface
