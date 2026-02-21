# 📦 LogiTrack NoSQL: Monitoramento em Tempo Real

Um sistema de monitoramento logístico de alta performance focado na flexibilidade de dados, utilizando o poder de bancos de dados orientados a documentos para gerenciar cargas heterogêneas.

## 🚀 O Problema

Empresas de logística enfrentam um desafio clássico: **a variedade de dados.** Tentar rastrear um pacote de eletrônicos (voltagem, garantia), uma carga perecível (temperatura, validade) e um móvel (peso, dimensões) em um banco SQL tradicional resulta em:

* Inúmeras colunas nulas.
* Tabelas de "detalhes" extremamente complexas.
* Dificuldade de escala em cenários de alto volume de escrita.

## 💡 A Solução

O **LogiTrack** utiliza uma arquitetura **NoSQL Orientada a Documentos** (MongoDB). Cada rastreio é tratado como um objeto independente, permitindo que cada pacote carregue seus próprios atributos específicos sem comprometer a estrutura do banco.

### Por que NoSQL neste projeto?

* **Esquema Flexível (Schemaless):** Adicionamos novos tipos de produtos e metadados instantaneamente (`specs`), sem a necessidade de migrações complexas (`ALTER TABLE`).
* **Histórico Embutido:** O rastreamento de status é salvo dentro do próprio documento do pacote (arrays embutidos), eliminando a necessidade de `JOINs` pesados.
* **Alta Performance de Escrita:** Otimizado para o fluxo constante de atualizações de status.

---

## 🛠️ Tecnologias e Dependências

**Linguagem & Ambiente:**
* Node.js
* Express.js (Framework Web)

**Banco de Dados:**
* MongoDB (Armazenamento NoSQL)
* Mongoose (ODM para modelagem dos dados)

**Ferramentas Auxiliares:**
* **dotenv**: Gerenciamento de variáveis de ambiente.
* **cors**: Permissão de acesso para integrações com o Frontend.
* **crypto**: (Nativo do Node) Para geração automática de códigos de rastreio únicos.
* **nodemon**: (Dependência de Desenvolvimento) Auto-reload do servidor.

---

## 📋 Como executar

### 1. Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
* **Node.js** (versão LTS recomendada)
* **MongoDB Community Server** (ou uma conta no MongoDB Atlas)
* **MongoDB Compass** (para visualização dos dados)

### 2. Instalação e Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/Gominhoss/Sistema-Logistica.git
   cd Sistema-Logistica
   ```

2. Acesse a pasta do backend e instale as dependências:
   ```bash
   cd backend
   npm install
   ```

3. Configure as variáveis de ambiente:
   * Crie um arquivo `.env` dentro da pasta `backend/`.
   * Adicione a sua string de conexão e a porta (exemplo):
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/logistica_db
   ```

### 3. Execução do Servidor

Ainda dentro da pasta `backend/`, inicie a aplicação:

* **Modo Desenvolvimento (com auto-reload):**
  ```bash
  npm run dev
  ```
* **Modo Produção:**
  ```bash
  npm start
  ```

O servidor estará rodando em `http://localhost:3000`. Você verá no terminal a confirmação da conexão com o banco de dados.

---

## ⚙️ Backend: Documentação da API

Abaixo estão listados os endpoints disponíveis para interagir com o sistema. Utilize ferramentas como **Postman** ou **Insomnia** para realizar os testes.

### 1. Cadastrar Novo Pacote
* **Rota:** `POST /packages`
* **Descrição:** Cria um novo registro logístico. O código de rastreio (`trackingCode`) é gerado automaticamente pelo sistema. O campo `specs` é flexível (NoSQL).
* **Corpo da Requisição (JSON):**

  ```json
  {
    "description": "Monitor Ultrawide 34 Polegadas",
    "type": "Eletrônico",
    "specs": {
      "pesoKg": 7.5,
      "fragilidade": "Alta",
      "seguroAtivo": true
    }
  }
  ```

### 2. Listar Todos os Pacotes
* **Rota:** `GET /packages`
* **Descrição:** Retorna um array com todos os pacotes cadastrados no banco de dados, incluindo seus históricos de movimentação.

### 3. Buscar Pacote Específico (getOne)
* **Rota:** `GET /packages/:trackingCode`
* **Descrição:** Retorna os detalhes completos e o histórico de um único pacote utilizando o seu código de rastreio.
* **Exemplo de URL:** `GET /packages/BR-A1B2C3`

### 4. Atualizar Status e Histórico
* **Rota:** `PATCH /packages/:trackingCode/status`
* **Descrição:** Atualiza o status atual da encomenda e injeta automaticamente (via operador `$push` do MongoDB) o novo evento de movimentação dentro do array de histórico do documento.
* **Corpo da Requisição (JSON):**

  ```json
  {
    "status": "Em Trânsito",
    "location": "Centro de Distribuição - Filial Sudeste"
  }
  ```

---
Desenvolvido por Vitor Gomes, Rian Vaz e Luiz Gustavo - 2026