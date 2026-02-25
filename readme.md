# 📦 Logística Express: Monitoramento NoSQL em Tempo Real

Um sistema completo de gestão e rastreamento logístico de alta performance, focado na flexibilidade de dados e agilidade operacional. O projeto utiliza uma arquitetura moderna com **Next.js** no Frontend e **Node.js com MongoDB** no Backend.

## 🚀 O Problema e o Cenário

Empresas de logística enfrentam um desafio clássico: **a heterogeneidade dos dados.** Tentar rastrear produtos de naturezas completamente diferentes em um banco de dados relacional (SQL) tradicional gera problemas graves:

*   **Esquemas Rígidos:** Um pacote de eletrônicos precisa de campos como "voltagem" e "garantia". Uma carga perecível precisa de "temperatura" e "validade". Um móvel precisa de "dimensões" e "peso".
*   **Colunas Nulas:** No SQL, isso resultaria em tabelas com dezenas de colunas vazias para a maioria dos registros ou tabelas de "detalhes" extremamente lentas com muitos `JOINs`.
*   **Evolução Lenta:** Adicionar um novo tipo de mercadoria exigiria alterações estruturais no banco (`ALTER TABLE`), causando downtime e riscos.

## 💡 A Solução: Por que NoSQL (MongoDB)?

O **Logística Express** foi construído sobre um banco **NoSQL Orientado a Documentos** para garantir:

1.  **Esquema Flexível (Schemaless):** O campo `specs` (especificações) de cada pacote é dinâmico. Podemos salvar qualquer par de chave-valor para diferentes tipos de produtos sem mudar uma linha de código no banco.
2.  **Documentos Embutidos:** Informações de remetente, destinatário e o histórico completo de movimentações são salvos dentro de um único documento. Isso elimina a necessidade de `JOINs` complexos, tornando a leitura de um pacote instantânea.
3.  **Performance de Escrita:** O uso do operador `$push` do MongoDB permite adicionar novos eventos ao histórico de um pacote de forma atômica e extremamente rápida, ideal para sistemas com milhares de atualizações por segundo.
4.  **Escalabilidade:** Pronto para lidar com grandes volumes de dados típicos de operações logísticas globais.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
*   **Framework:** Next.js 14+ (App Router)
*   **Linguagem:** TypeScript
*   **Estilização:** Tailwind CSS (Moderno, Responsivo e Limpo)
*   **Componentes:** React Hooks (useState, useEffect) para gestão de estado em tempo real.

### **Backend**
*   **Ambiente:** Node.js
*   **Framework:** Express.js
*   **Banco de Dados:** MongoDB (Driver Nativo)
*   **Segurança/CORS:** Middleware `cors` para integração segura com o frontend.

---

## 📋 Funcionalidades Principais

1.  **🔎 Rastreamento Inteligente:** Busca instantânea por código de rastreio com visualização de Timeline dinâmica.
2.  **🔄 Atualização de Status:** Interface simplificada para atualizar a localização e o status do pacote, com atualização imediata do histórico.
3.  **📊 Gestão de Pacotes:** Aba dedicada ("Todos Pacotes") com visual em Grid de Cards para visualizar toda a operação.
4.  **📄 Detalhes Expandidos:** Uso de Modais para exibir especificações técnicas e históricos sem poluir a visão principal.
5.  **📝 Cadastro Dinâmico:** Rota para criação de pacotes com geração automática de códigos únicos (Padrão BR-XXXXXX).

---

## ⚙️ Como Executar o Projeto

### 1. Pré-requisitos
*   Node.js instalado.
*   MongoDB rodando localmente ou via Atlas.

### 2. Configuração do Backend
1.  Acesse a pasta `backend/`.
2.  Instale as dependências: `npm install`.
3.  Crie um arquivo `.env`:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/logistica_db
    ```
4.  Inicie o servidor: `npm run dev`.

### 3. Configuração do Frontend
1.  Acesse a pasta `frontend/logistica-front/`.
2.  Instale as dependências: `npm install`.
3.  Crie um arquivo `.env.local`:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```
4.  Inicie a aplicação: `npm run dev`.
5.  Acesse: `http://localhost:5000`.

---

## 🔌 Documentação da API (Principais Rotas)

*   `POST /packages`: Cadastra um novo pacote.
*   `GET /packages`: Lista todos os pacotes do sistema.
*   `GET /packages/:trackingCode`: Busca detalhes de um pacote específico.
*   `PATCH /packages/:trackingCode/status`: Atualiza status e insere novo evento no histórico.

---
**Projeto desenvolvido para demonstrar o poder do NoSQL em cenários de dados heterogêneos e alta performance.**

*Desenvolvido por Vitor Gomes, Rian Vaz e Luís Gustavo - 2026*"
