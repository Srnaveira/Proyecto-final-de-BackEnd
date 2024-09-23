const messagesService = require('../services/messagesServices.js');

async function newMessage ( req, res ) {
    try {
        const { user, message } = req.body;
        const newMessage = { user, message };
        
        await messagesService.newMessage(newMessage);
        return res.status(201).json({ message: 'Mensaje enviado con éxito' });
    } catch (error) {
        logger.error('Error al crear un nuevo mensaje:', error);
        return res.status(500).json({ error: 'Error al crear un nuevo mensaje' });
    }
}

async function loadMessages(req, res) {
    try {
        const messages = await messagesService.loadMessages();
        return res.status(200).render('chat', { messages });
    } catch (error) {
        logger.error('Error al cargar los mensajes:', error);
        return res.status(500).json({ error: 'Error al cargar los mensajes' });
    }
}


module.exports = {
    newMessage,
    loadMessages
}
