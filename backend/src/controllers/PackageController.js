// Importamos o Model
const Package = require('../models/Package');

module.exports = {
// Função para CADASTRAR um novo pacote (Vai responder ao POST)
async create(req, res) {
    try {
        // 1. Pegamos os dados que o usuário enviou no corpo da requisição (req.body)
        const { trackingCode, description, type, specs } = req.body;

        // 2. Pedimos ao banco para criar um novo documento
        const newPackage = await Package.create({
            trackingCode,
            description,
            type,
            // 'specs' pode ser qualquer coisa! 
            // Se for eletrônico, pode ter voltagem. Se for perecível, temperatura.
            specs, 
        
            // Já iniciamos o pacote com o primeiro item no histórico (Embutido)
            history: [{
                status: 'Postado',
                location: 'Agência Central - Origem'
                // O timestamp (data/hora) o próprio banco vai colocar sozinho
            }]
        });

    // 3. Devolvemos o pacote recém-criado com status 201 (Created)
    return res.status(201).json(newPackage);

    } catch (error) {
        return res.status(400).json({ 
        error: 'Erro ao cadastrar o pacote', 
        details: error.message 
        });
    }
},

// Função para LISTAR todos os pacotes (Vai responder ao GET)
async index(req, res) {
    try {
        // O método .find() sem filtros traz todos os documentos da coleção
        const packages = await Package.find();

        // Devolve a lista com status 200 (OK)
        return res.status(200).json(packages);
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno ao buscar pacotes' });
    }
}
};