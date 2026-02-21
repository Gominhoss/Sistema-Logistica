
---

# 📦 LogiTrack NoSQL: Monitoramento em Tempo Real

Um sistema de monitoramento logístico de alta performance focado na flexibilidade de dados, utilizando o poder de bancos de dados orientados a documentos para gerenciar cargas heterogêneas.

## 🚀 O Problema

Empresas de logística enfrentam um desafio clássico: **a variedade de dados.** Tentar rastrear um pacote de eletrônicos (voltagem, garantia), uma carga perecível (temperatura, validade) e um móvel (peso, dimensões) em um banco SQL tradicional resulta em:

* Inúmeras colunas nulas.
* Tabelas de "detalhes" extremamente complexas.
* Dificuldade de escala em cenários de alto volume de escrita.

## 💡 A Solução

O **LogiTrack** utiliza uma arquitetura **NoSQL Orientada a Documentos** (MongoDB/CouchDB). Cada rastreio é tratado como um objeto independente, permitindo que cada pacote carregue seus próprios atributos específicos sem comprometer a estrutura do banco.

### Por que NoSQL neste projeto?

* **Esquema Flexível (Schemaless):** Adicionamos novos tipos de produtos e metadados instantaneamente, sem a necessidade de migrações complexas (`ALTER TABLE`).
* **Alta Performance de Escrita:** Otimizado para o fluxo constante de atualizações de status (ex: "Saiu para entrega", "Processado no Centro de Distribuição").
* **Consistência de Dados:** Todos os detalhes de um pacote residem em um único documento, facilitando a recuperação da informação.

## 🛠️ Tecnologias Sugeridas

* **Banco de Dados:** MongoDB
* **Linguagem:** Node.js
* **Ferramentas:** 

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


2. Configure o Backend:
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

Ainda dentro da pasta `backend/`, você pode rodar o projeto de duas formas:

* **Modo Desenvolvimento (com auto-reload):**
```bash
npm run dev

```


* **Modo Produção:**
```bash
npm start

```



O servidor estará rodando em `http://localhost:3000`. Você poderá visualizar a conexão bem-sucedida com o banco no log do terminal.

---
Desenvolvido por Vitor Gomes, Rian Vaz e Luiz Gustavo - 2026

