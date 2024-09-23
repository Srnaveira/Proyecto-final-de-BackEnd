const socket = io();
const { logger } = require('../../utils/logger.js');
socket.emit('message', "hola, me estoy comunicando desde un webSocket");

socket.on('message', data =>{
    logger.info(data);
})

socket.on('message_user_conect', data =>{
    logger.info(data);
})

socket.on('event_for_all',data =>{
    logger.info(data);
})


