const messagesData = require('../persistence/data/messagesData.js');
const { logger } = require('../utils/logger.js');


async function newMessage (message) {
    try {
        return await messagesData.newMessage( message );     
    } catch (error) {
        logger.info("Parece que hubo algun problemas en la funcion del MessageService al crear el mensaje");
        logger.error(error);
        throw error;
    }
}

async function loadMessages () {
    try {
        return await messagesData.loadmessages();
    } catch (error) {
        logger.info("Parece que hubo algun problemas en la funcion del MessageService al cargar los mensajes");
        logger.error(error);
        throw error;
    }

}

module.exports = {
    newMessage,
    loadMessages
}