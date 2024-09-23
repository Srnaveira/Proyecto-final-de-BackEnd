const express = require('express');
const productsController = require('../controllers/productsController.js');

const router = express.Router();


router.get('/', productsController.getProductByFilter);

router.get('/:pid', productsController.getProductById);

router.post('/', productsController.addProduct);

router.put('/:pid', productsController.updateProduct);

router.delete('/:pid', productsController.deleteProduct);

module.exports = router;