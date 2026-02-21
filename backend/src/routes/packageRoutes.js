const express = require('express');
const router = express.Router();

// Importa o Controller
const PackageController = require('../controllers/PackageController');

// Quando houver uma requisição POST, chama a função 'create'
router.post('/', PackageController.create);

// Quando houver uma requisição GET, chama a função 'index'
router.get('/', PackageController.index);

// Quando houver uma requisição GET para um código específico, chama a função 'getOne'
router.get('/:trackingCode', PackageController.getOne);

// Quando houver uma requisição PATCH, chama a função 'updateStatus'
router.patch('/:trackingCode/status', PackageController.updateStatus);


module.exports = router;