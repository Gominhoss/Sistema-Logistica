const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
// Código de rastreio único para cada pacote
trackingCode: { type: String, required: true, unique: true },

description: String,

// Categorias pré-definidas
type: { type: String, enum: ['Eletrônico', 'Perecível', 'Frágil', 'Comum'] },

status: { type: String, default: 'Postado' },

// O tipo 'Mixed' permite salvar qualquer estrutura JSON aqui dentro.
specs: mongoose.Schema.Types.Mixed, 

// HISTÓRICO EMBUTIDO:
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