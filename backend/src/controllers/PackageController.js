const Package = require('../models/Package');
const crypto = require('crypto'); // O 'crypto' é um módulo nativo do Node.js que usado para gerar códigos de rastreio únicos

module.exports = {
// Função para CADASTRAR um novo pacote (Vai responder ao POST)
async create(req, res) {
    try {
        //Pega os dados que o usuário enviou no corpo da requisição (req.body)
        const {description, type, sender, recipient, specs } = req.body;

        // Gera um código de rastreio único (ex: BR-1A2B3C)
        const generatedCode = 'BR-' + crypto.randomBytes(3).toString('hex').toUpperCase();

        const newPackage = await Package.create({
            trackingCode: generatedCode,
            description,
            type,
            sender,
            recipient,
            specs,  // 'specs' pode ser qualquer coisa. Se for eletrônico, pode ter voltagem. Se for perecível, temperatura.
            history: [{
                status: 'Postado',
                location: 'Agência Central - Origem'
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
},

// Função para BUSCAR UM PACOTE pelo código de rastreio (Vai responder ao GET /:trackingCode)
async getOne(req, res) {
try {
    // Extraímos o código da URL (ex: /packages/BR-1A2B3C)
    const { trackingCode } = req.params;

    const packageData = await Package.findOne({ trackingCode });

    if (!packageData) {
    return res.status(404).json({ error: 'Pacote não encontrado. Verifique o código de rastreio.' });
    }
    return res.status(200).json(packageData);

} catch (error) {
    return res.status(500).json({ error: 'Erro interno ao buscar o pacote' });
}
},

// Função para ATUALIZAR o status de um pacote (Vai responder ao PATCH)
async updateStatus(req, res) {
    try {
        // Pega o código de rastreio pela URL (ex: /packages/BR-ELE-001/status)
        const { trackingCode } = req.params; 
        
        // Pega os novos dados enviados pela requisição (ex: { "status": "Em Trânsito", "location": "Centro de Distribuição - SP" })
        const { status, location } = req.body;

        const updatedPackage = await Package.findOneAndUpdate(
        { trackingCode }, // 1. Encontra o pacote por este código
        { 
            $set: { status: status }, // 2a. Atualiza o status principal
            $push: {                  // 2b. Empurra o novo evento para dentro do array history
            history: { status, location } 
            } 
        },
        { new: true } // Retorna o documento já atualizado
        );

        if (!updatedPackage) {
        return res.status(404).json({ error: 'Pacote não encontrado' });
        }

        return res.status(200).json(updatedPackage);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao atualizar o status' });
    }
    }



};

