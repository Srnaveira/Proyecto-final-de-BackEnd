const ticketsModel = require('../models/tickets.model.js');
const { logger } = require('../../utils/logger.js');

module.exports = {
    purchase: async (newPurchase) => {
        try {
            const purchaseSucefull = await ticketsModel.create(newPurchase);
            logger.info("Compra realizada Correctamente");
            return purchaseSucefull;
        } catch (error) {
            logger.error("Hubo un problema al generar el ticket de la compra")
            throw error
        }
    },

    getTicketByUser: async (purchaser)  =>{
        try {
            return await ticketsModel.find({ purchaser: purchaser })
        } catch (error) {
            logger.error("hubo un prolema al buscar las compras de ese cliente")
            throw error;
        }
    },  

    getTicketByCode: async (code) =>{
        try {
            return await ticketsModel.findOne({code: code})       
        } catch (error) {
            logger.error("hubo un prolema al buscar las compra segun ese code")
            throw error;     
        }
    },

    getTickets: async () =>{
        try {
            return await ticketsModel.find()
        } catch (error) {
            logger.error("hubo un prolema al mostrar todos los tickets")
            throw error;
        }
    }
}
