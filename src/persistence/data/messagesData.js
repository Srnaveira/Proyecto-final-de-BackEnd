const messagesModel = require('../models/messages.model.js');
const { logger } = require('../../utils/logger.js');

module.exports = {

    newMessage: async ( message ) =>{
        try {
             return await messagesModel.create( message );
        } catch (error) {
            logger.info("No se pudo crear el mensaje:");
            logger.error(error);
            throw new Error("hubo algun problema al crear el error en la base de datos :" + error)
        }
    },

    loadmessages: async () => {
        try {
            return await messagesModel.find();
        } catch (error) {
            logger.info("hubo algun problema con la carga de los mensajes contra la base de datos:");
            logger.error(error);
            throw new Error("el error registrado fue :" + error)
        }
    }
}