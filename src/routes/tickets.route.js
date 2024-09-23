const express = require('express');
const ticketsController = require('../controllers/ticketsController.js')

const route = express()

//route.get('/:code' , ticketsController.getTicketByCode);

route.get('/:email' , ticketsController.getTicketByUser);

route.get('/' , ticketsController.getTickets);

module.exports = route;