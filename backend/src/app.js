const express = require('express');
const cors = require('cors');

const app = express();
// cors: Permite que o Frontend (que roda em outra porta) acesse este Backend
app.use(cors());
// express.json: Essencial para APIs REST. Faz o backend entender JSON no corpo das requisições.
app.use(express.json());

// --- Rotas ---
// Rota raiz apenas para teste de saúde da API
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API de Logística NoSQL está rodando!' });
});

const packageRoutes = require('./routes/packageRoutes');
app.use('/packages', packageRoutes);

// Exporta o app configurado para ser usado no server.js
module.exports = app;