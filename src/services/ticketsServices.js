const ticketsData = require('../persistence/data/ticketsData.js');
const { logger } = require('../utils/logger.js');


async function purchase(newPurchase){
    try {
        const purchaseSucefull = await ticketsData.purchase(newPurchase) 
        return purchaseSucefull;
    } catch (error) {
        logger.error("Hubo un problema en el TicketService");
        throw new Error("Hubo un problema en el TicketService");
    }
};


async function getTicketByUser(purchaser){
    try {
        return await ticketsData.getTicketByUser(purchaser);     
    } catch (error) {
        logger.error("Hubo un problema en el TicketService");
        throw new Error("Hubo un problema en el TicketService");
    }
};

async function getTicketByCode(code){
    try {
        return await ticketsData.getTicketByCode(code);
    } catch (error) {
        logger.error("Hubo un problema en el TicketService");
        throw new Error("Hubo un problema en el TicketService");
    }
};

async function getTickets() {
    try {
        return await ticketsData.getTickets();   
    } catch (error) {
        logger.error("Hubo un problema en el TicketService al traer todos los tickets");
        throw new Error("Hubo un problema en el TicketService al traer todos los tickets");
        
    }
};


module.exports = {
    purchase,
    getTicketByUser,
    getTicketByCode,
    getTickets
}