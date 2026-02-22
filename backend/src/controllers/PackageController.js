const { getDb } = require('../config/database');
const crypto = require('crypto'); // O 'crypto' é um módulo nativo do Node.js que usado para gerar códigos de rastreio únicos

module.exports = {
// Função para CADASTRAR um novo pacote (Vai responder ao POST)
async create(req, res) {
    try {
        const {description, type, sender, recipient, specs } = req.body;
        const generatedCode = 'BR-' + crypto.randomBytes(3).toString('hex').toUpperCase();

        const newPackage = {
            trackingCode: generatedCode,
            description,
            type,
            status: 'Postado',
            sender,
            recipient,
            specs,  // 'specs' pode ser qualquer coisa. Se for eletrônico, pode ter voltagem. Se for perecível, temperatura.
            history: [{
                status: 'Postado',
                location: 'Agência Central - Origem',
                timestamp: new Date()
            }],
            createdAt: new Date(),
            updatedAt: new Date()
        };
    
    const db = getDb();
    const result = await db.collection('packages').insertOne(newPackage);
    newPackage._id = result.insertedId;    

    return res.status(201).json(newPackage);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao cadastrar pacote', details: error.message });
    }
},

// Função para LISTAR todos os pacotes (Vai responder ao GET)
async index(req, res) {
    try {
        const db = getDb();
        const packages = await db.collection('packages').find().toArray();
        return res.status(200).json(packages);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar pacotes' });
    }
},

// Função para BUSCAR UM PACOTE pelo código de rastreio (Vai responder ao GET /:trackingCode)
async getOne(req, res) {
    try {
        const { trackingCode } = req.params;
        const db = getDb();
        const packageData = await db.collection('packages').findOne({ trackingCode });

        if (!packageData) return res.status(404).json({ error: 'Pacote não encontrado.' });

        return res.status(200).json(packageData);
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno ao buscar o pacote' });
    }
},

// Função para ATUALIZAR o status de um pacote (Vai responder ao PATCH)
async updateStatus(req, res) {
    try {
        const { trackingCode } = req.params;
        const { status, location } = req.body;
        const db = getDb();
        
        // Atualiza e retorna o documento já atualizado ('returnDocument: after')
        const updatedPackage = await db.collection('packages').findOneAndUpdate(
            { trackingCode },
            { 
            $set: { status: status, updatedAt: new Date() },
            $push: { history: { status, location, timestamp: new Date() } }
            },
            { returnDocument: 'after' } 
        );

        if (!updatedPackage) return res.status(404).json({ error: 'Pacote não encontrado' });

        return res.status(200).json(updatedPackage);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao atualizar o status' });
    }
}


};

