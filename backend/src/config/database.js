const { MongoClient } = require('mongodb');

// Variável para guardar a conexão ativa
let dbConnection;

const connectDB = async () => {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();

        // Pega o banco específico (logistica_db) a partir da URI
        dbConnection = client.db(); 

        console.log('MongoDB conectado nativamente');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1);
    }
};

// Função para entregar o banco de dados para os Controllers usarem
const getDb = () => {
    if (!dbConnection) {
        throw new Error('O Banco de dados não foi inicializado!');
    }
    return dbConnection;
};

module.exports = { connectDB, getDb };