const express = require('express');
const productsController = require('../controllers/productsController.js'); 
const ticketsController = require('../controllers/ticketsController.js');
const usersController = require('../controllers/usersController.js')
const usersRenderController = require ('../controllers/usersRenderController.js');
const { isAdmin } = require('../middleware/auth.js');

const router = express.Router();

router.get('/realtimeproducts', isAdmin, productsController.realTimeProducts);

router.get('/inactiveusers', isAdmin, usersRenderController.findInactiveUsers);

router.post('/inactiveusers', isAdmin, usersController.deleteUser);

router.post('/inactiveusers/:uid', isAdmin, usersController.deleteInactiveUserById);

router.get('/tickets', isAdmin, ticketsController.getTickets)

router.get('/premium', isAdmin , usersRenderController.listUsers);

router.post('/premium/:uid', isAdmin, usersController.updateRollUser)

module.exports = router;
