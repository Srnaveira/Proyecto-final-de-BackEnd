const express = require('express');
const { isPremium } = require('../middleware/auth.js');
const productsController = require('../controllers/productsController.js'); 

const router = express.Router();

router.get('/', productsController.getProductByFilter);

router.get('/productsUsersPremium', isPremium, productsController.productsUsersPremium);

module.exports = router;
