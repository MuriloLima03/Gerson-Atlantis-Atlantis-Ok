# Atlantis Water Park - Backend com MongoDB

## 🚀 Quick Start

### Pré-requisitos
- Node.js 14+ instalado
- MongoDB 4.0+ (local ou Atlas)

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```bash
# Copie do arquivo .env.example
cp .env.example .env
```

Edite `.env` com suas configurações:
```env
MONGO_URI=mongodb://127.0.0.1:27017/atlantis
PORT=3000
API_MODE=http
API_BASE_URL=
```

### 3. Iniciar servidor
```bash
# Desenvolvimento
node src/server/server.js

# Ou com porta customizada
PORT=3001 node src/server/server.js
```

O servidor iniciará em `http://localhost:3000` (ou porta configurada).

### 4. Acessar a UI
Abra no navegador:
```
http://localhost:3000/index.html?mode=http
```

**Nota:** O `?mode=http` ativa o modo API (conecta ao backend). Sem este parâmetro, a UI usa localStorage.

---

## 📊 Estrutura de Dados

### Collections MongoDB

#### Clients
```json
{
  "_id": ObjectId,
  "Nome": "string",
  "NomeSocial": "string",
  "DataNascimento": Date,
  "DataCadastro": Date,
  "Pais": "string",
  "email": "string",
  "Telefones": [
    { "Ddd": "string", "Numero": "string" }
  ],
  "Endereco": {
    "Rua": "string",
    "Numero": "string",
    "Cidade": "string",
    "Estado": "string",
    "Pais": "string"
  },
  "Documentos": [
    { "tipo": "string", "numero": "string", "dataExpedicao": Date }
  ],
  "Tipo": "titular|dependente",
  "Titular": ObjectId,
  "Dependentes": [ObjectId]
}
```

#### Accommodations
```json
{
  "_id": ObjectId,
  "name": "string",
  "type": "string",
  "CamaSolteiro": Number,
  "CamaCasal": Number,
  "Climatizacao": Boolean,
  "Garagem": Number,
  "Suite": Number,
  "rate": Number
}
```

#### Bookings
```json
{
  "_id": ObjectId,
  "client": ObjectId,
  "accommodation": ObjectId,
  "from": Date,
  "to": Date,
  "notes": "string"
}
```

---

## 🔌 Endpoints API

### Health Check
- **GET** `/api/health` → Verifica status do servidor

### Accommodations
- **GET** `/api/v1/accommodations` → Lista todas as acomodações
- **GET** `/api/v1/accommodation-types` → Lista tipos de acomodações
- **GET** `/api/v1/accommodation-types-specs` → Especificações de cada tipo
- **POST** `/api/v1/accommodations` → Cria nova acomodação
- **PUT** `/api/v1/accommodations/:id` → Atualiza acomodação
- **DELETE** `/api/v1/accommodations/:id` → Deleta acomodação

### Clients
- **GET** `/api/v1/clients` → Lista todos os clientes
- **GET** `/api/v1/clients/:id` → Obtém detalhes de um cliente
- **POST** `/api/v1/clients` → Cria novo cliente
- **PUT** `/api/v1/clients/:id` → Atualiza cliente
- **DELETE** `/api/v1/clients/:id` → Deleta cliente

#### Clients - Documentos
- **POST** `/api/v1/clients/:id/documents` → Adiciona documento ao cliente

#### Clients - Dependentes
- **GET** `/api/v1/clients/:id/dependents` → Lista dependentes
- **POST** `/api/v1/clients/:id/dependents` → Adiciona dependente

### Bookings
- **GET** `/api/v1/bookings` → Lista todas as hospedagens
- **POST** `/api/v1/bookings` → Cria nova hospedagem
- **PUT** `/api/v1/bookings/:id` → Atualiza hospedagem
- **DELETE** `/api/v1/bookings/:id` → Deleta hospedagem

### Bulk Operations
- **PUT** `/api/v1/_bulk/clients` → Replace all clients
- **PUT** `/api/v1/_bulk/accommodations` → Replace all accommodations
- **PUT** `/api/v1/_bulk/bookings` → Replace all bookings

---

## 💾 Persistência

### Modos de Funcionamento

#### 1. HTTP Mode (com MongoDB)
- Servidor Express conectado ao MongoDB
- Dados persistem entre reinícios
- UI acessa via `/api/v1/*` endpoints
- **Ativar:** URL com `?mode=http`

#### 2. Local Mode (localStorage)
- Servidor Express desconectado de MongoDB
- Dados armazenados apenas em localStorage do navegador
- Dados perdidos ao limpar cache do navegador
- **Ativar:** URL com `?mode=local` ou sem servidor rodando

---

## 🔧 Troubleshooting

### MongoDB Connection Failed
```
MongoDB connect failed, falling back to in-memory store
```
**Solução:** Verifique se o MongoDB está rodando e se `MONGO_URI` está correto em `.env`.

### Port Already in Use
```
listen EADDRINUSE: address already in use :::3000
```
**Solução:** Use uma porta diferente:
```bash
PORT=3001 node src/server/server.js
```

### UI não carrega dados
1. Verifique modo: `?mode=http` na URL
2. Verifique console do navegador (F12) para erros
3. Confirme que servidor está rodando: `curl http://localhost:3000/api/health`

---

## 📝 Exemplos de Uso

### Criar Acomodação
```bash
curl -X POST http://localhost:3000/api/v1/accommodations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Quarto Solteiro",
    "type": "SolteiroSimples",
    "rate": 150
  }'
```

### Criar Cliente
```bash
curl -X POST http://localhost:3000/api/v1/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phoneDdd": "11",
    "phoneNumber": "99999-0001",
    "country": "Brasil"
  }'
```

### Criar Hospedagem
```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "OBJECTID_DO_CLIENTE",
    "accommodationId": "OBJECTID_DA_ACOMODACAO",
    "from": "2025-12-01",
    "to": "2025-12-05",
    "notes": "Lua de mel"
  }'
```

---

## 📦 Deployment

### Heroku
```bash
# Instale Heroku CLI
heroku login
heroku create seu-app-name
heroku config:set MONGO_URI='mongodb+srv://usuario:senha@cluster.mongodb.net/atlantis'
git push heroku main
heroku open
```

### DigitalOcean / AWS
1. Configure MongoDB Atlas (nuvem) ou instale MongoDB no servidor
2. Defina variáveis de ambiente
3. Execute `npm install && node src/server/server.js`

---

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
src/
├── js/              # Código JavaScript (classes de domínio)
├── ts/              # Código TypeScript (mirrors de js/)
├── server/          # Backend Node.js/Express
│   ├── server.js    # Routes e middlewares
│   └── db.js        # Modelos Mongoose
└── ui/              # Frontend SPA
    ├── api.js       # Adapter HTTP/localStorage
    ├── app.js       # Lógica da aplicação
    ├── index.html   # HTML principal
    └── styles.css   # Estilos
```

---

## 📄 Licença

Desenvolvido para demonstração acadêmica.

---

## 🆘 Suporte

Para problemas ou dúvidas, verifique:
1. Console do navegador (F12)
2. Logs do servidor (stdout)
3. Status do MongoDB: `mongosh` e conecte manualmente
