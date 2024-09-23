const cartsData = require('../persistence/data/cartsData.js');
const { logger } = require('../utils/logger.js');

async function addCart (newCart) {
    try {
        const createCart = await cartsData.addCart(newCart);  
        return createCart  
    } catch (error) {
        logger.error("Error al crear el carrito:", error);
        throw error;
    }
}

async function getAllCarts () {
    try {
        return await cartsData.getAllCarts();
    } catch (error) {
        logger.error("Error Al traer los Carts");
        throw Error;
    }       
}

async function getCartById (idCart) {
    try {
        return await cartsData.getCartById(idCart); 
    } catch (error) {
        logger.error(`Error al Buscar el Cart: ${idCart}`);
        throw Error;            
    }
}

async function deleteCart (idCart) {
    try {
        await cartsData.deleteCart(idCart);
    } catch (error) {
        logger.error(`Error al Eliminar el Cart: ${idCart}`);
        throw Error;      
    }
}

async function addProductToCart (idCart, idProduct, quantity) {
    try {
        await cartsData.addProductToCart(idCart, idProduct, quantity);
    } catch (error) {
        logger.error(`Error al Actualizar el Contenido del Cart: ${idCart}`);
        throw Error;   
    }
}

async function deletProductToCart (idCart, idProduct) {
    try {
        await cartsData.deletProductToCart(idCart, idProduct);
    } catch (error) {
        logger.error(`Error al Eliminar el producto del Cart: ${idCart} indicado ${idProduct} `);
        throw Error; 
    }
}


module.exports = {
        addCart,
        getAllCarts,
        getCartById,
        deleteCart,
        addProductToCart,
        deletProductToCart
}