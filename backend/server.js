require('dotenv').config(); // Carrega as variáveis do arquivo .env logo no início
const app = require('./src/app'); // Importa o app que configuramos acima
const { connectDB } = require('./src/config/database'); // Importa a lógica de conexão com o banco

const PORT = process.env.PORT || 3000;

// Função para iniciar o sistema
const startServer = async () => {
    try {
    // 1. Primeiro tenta conectar ao banco de dados
    await connectDB(); 
    
    // 2. Se o banco conectar com sucesso, liga o servidor web
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Teste no navegador: http://localhost:${PORT}`);
    });
    } catch (error) {
    console.error('Falha crítica ao iniciar o servidor:', error.message);
    process.exit(1); // Encerra o processo se der erro
    }
};

startServer();