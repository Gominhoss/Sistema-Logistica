const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({

trackingCode: { type: String, required: true, unique: true }, // Código de rastreio único para cada pacote
description: String,
type: { type: String, enum: ['Eletrônico', 'Perecível', 'Frágil', 'Comum'] },
status: { type: String, default: 'Postado' },

sender: {
    name: { type: String, required: true },
    document: String // Pode ser NIF, CPF ou CNPJ
},

recipient: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: String,
    state: String,
    zipCode: String
},

// O tipo 'Mixed' permite salvar qualquer estrutura JSON aqui dentro.
specs: mongoose.Schema.Types.Mixed, 

history: [{
status: String,
location: String,
timestamp: { type: Date, default: Date.now }
}]

}, { 
// Cria automaticamente os campos createdAt e updatedAt
timestamps: true 
});

module.exports = mongoose.model('Package', PackageSchema);