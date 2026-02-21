const mongoose = require('mongoose');

const connectDB = async () => {
    try {
    // Tenta estabelecer a ligação usando a URI do ficheiro .env
        const conn = await mongoose.connect(process.env.MONGODB_URI);
    
        console.log(`MongoDB conectado com sucesso ao host: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
        // O process.exit(1) encerra a aplicação imediatamente se o banco de dados falhar
        process.exit(1);
    }
};

module.exports = connectDB;