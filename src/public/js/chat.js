const socket = io();

const btnAdd = document.getElementById('btn_add');


const user = document.getElementById('nameUser').textContent;

btnAdd.addEventListener('click', () => {
    console.log("entro al boton MENSAJE A ENVIAR")

    const message_add = {
        "user": user,  // Usar el email del usuario tomado de req.local.user
        "message": document.getElementById('UserMessage').value
    };

    console.log("Mensaje a enviar:", message_add);
    socket.emit('newMessage',  message_add);
    socket.emit('messageLogs',  message_add);
});


socket.on('messageLogs', (data) => {
    try {
        let logMessages = "";
        data.forEach(message => {
            logMessages += `<strong>${message.user}</strong><span style="color: #0000FF;"> dice:</span> <p style="white-space: pre;">${message.message}</p><br>`;
        });

        const log = document.getElementById('messageLogs');
        log.innerHTML = logMessages;

    } catch (error) {
        logger.error('Error al obtener los mensajes:', error);
    }
});
