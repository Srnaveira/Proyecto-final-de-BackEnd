const { Server } = require('socket.io');
const productsServices = require('./services/productsServices.js');
const cartsServices = require('./services/cartsServices.js');
const messagesServices = require('./services/messagesServices.js');
const { logger } = require('./utils/logger.js');

module.exports = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on('connection', socket => {
        socket.on('message', data => {
            logger.info(data);
        });

        productsServices.getAllProducts()
            .then((products) => {
                socket.emit('listProducts', products);
            });

        socket.broadcast.emit('message_user_conect', "Ha Ingresado un nuevo USUARIO");
        socketServer.emit('event_for_all', "Este evento lo veran todos los usuarios");

        // Lógica para agregar un producto
        socket.on('productAdd', async (product) => {
            try {
                console.log("Datos recibidos para agregar al carrito:", product); // <-- Verifica los datos recibidos
                const addIsValid = await productsServices.addProduct(product);
                if (addIsValid) {
                    await productsServices.getAllProducts()
                        .then((products) => {
                            socket.emit('listProducts', products);
                            socket.emit('message_add', "Producto Agregado");
                        });
                } else {
                    socket.emit('message_add', "No se pudo agregar el producto");
                }
            } catch (error) {
                socket.emit('message_add', "Error al agregar el producto: " + error.message);
            }
        });

        socket.on('productDelete', async ({ pid, owner }) => {
            try {
                const product = await productsServices.getProductById(pid);
                const ownerUser = product.owner;

                if (product) {
                    if (product.owner === ownerUser || owner === 'admin') {
                        await productsServices.deleteProduct(pid);
                        const products = await productsServices.getAllProducts();
        
                        socket.emit('listProducts', products);
                        socket.emit('message_delete', "Producto Eliminado");
                    } else {
                        socket.emit('message_delete', "No tienes permiso para eliminar este producto.");                
                    }
                } else {
                    socket.emit('message_delete', "Producto no encontrado.");
                }
            } catch (error) {
                socket.emit('message_delete', "Error al Eliminar el producto: " + error.message);
            }
        });

        socket.on('add_Product_cart', async (productoInfo) => {
            try {
                const quantity = 1;
                await cartsServices.addProductToCart(productoInfo.cartId, productoInfo._id, quantity);
                socket.emit('productAdded', { message: "El producto se agrego correctamente" });
            } catch (error) {
                socket.emit('productAdded', "Error al agregar el producto al cart selecionado: " + error.message);
            }
        });

        messagesServices.loadMessages()
        .then(messages => {
            socket.emit('messageLogs', messages);
        });


        socket.on('newMessage', async (message) => {
            try {
                await messagesServices.newMessage( message );
                const mensages= await messagesServices.loadMessages();
                socket.emit('newMessage', message);
                socket.broadcast.emit('messageLogs', mensages);
            } catch (error) {
                socket.broadcast.emit('newMessage', 'Error al agregar el mensaje');
            }
        })
    
        socket.on('messageLogs', async () => {
            try {
                let messages = await messageModel.find({}) 
                socket.emit('messageLogs', messages)
            } catch (error) {
                socket.emit('messageLogs', 'Error al agregar el mensaje');
            }
        })




    });
};