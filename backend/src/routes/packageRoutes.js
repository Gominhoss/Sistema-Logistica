const express = require('express');
const router = express.Router();

// Importa o Controller
const PackageController = require('../controllers/PackageController');

// Quando houver uma requisição POST, chama a função 'create'
router.post('/', PackageController.create);

// Quando houver uma requisição GET, chama a função 'index'
router.get('/', PackageController.index);

module.exports = router;