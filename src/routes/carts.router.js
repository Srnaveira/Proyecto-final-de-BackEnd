const express = require('express');
const cartsController = require('../controllers/cartsControllers.js');
const ticketsController = require('../controllers/ticketsController.js');

const router = express.Router();

router.post('/', cartsController.addCart);

router.get('/', cartsController.getAllCarts);

router.get('/:cid',cartsController.getCartById);

router.post('/:cid/product/:pid', cartsController.addProductToCart);

router.delete('/:cid/product/:pid', cartsController.deletProductToCart);

router.put('/:cid/product/:pid', cartsController.addProductToCart);

router.delete('/:cid', cartsController.deleteCart);

router.post('/:cid/purchase', ticketsController.purchase);

router.get('/:cid/purchase/:code', ticketsController.emailSend);

module.exports = router;