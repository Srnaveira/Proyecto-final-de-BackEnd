const cartsModel = require('../models/carts.model.js')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { logger } = require('../../utils/logger.js')


module.exports = {
    addCart: async (newCart) => { 
        try {
            const createCart = await cartsModel.create(newCart);
            return createCart     
        } catch (error) {
            logger.error("Error al crear el carrito:", error)
            //console.error("Error al crear el carrito:", error);
            throw error;
        }
    },

    getAllCarts: async () => {
        try {
            return await cartsModel.find();
        } catch (error) {
            logger.error("Error Al traer el los Carts");
            throw Error;
        }
    },

    getCartById: async (idCart) =>{
        try {
            return await cartsModel.findOne({_id: idCart }).populate('product.idP').lean();
        } catch (error) {
            logger.error(`Error al Buscar el Cart: ${idCart}`);
            throw Error;            
            
        }

    },

    deleteCart: async (idCart) =>{
        try {
            await cartsModel.deleteOne({_id: idCart});
        } catch (error) {
            logger.error(`Error al Eliminar el Cart: ${idCart}`);
            throw Error;            
        }
    },

    addProductToCart: async (idCart, idProduct, quantity) =>{
        try {
            const cart = await cartsModel.findOne({ _id: idCart });
    
            if (!cart) {
                logger.error(`Carrito con id ${idCart} no encontrado`)
                throw Error;
            }
            const productIndex = cart.product.findIndex((item) => item.idP.toString() === idProduct);
    
            if (productIndex !== -1) {
                // Actualizar cantidad si el producto ya existe
                cart.product[productIndex].quantity += quantity;
            } else {
                // Agregar nuevo producto si no existe
                cart.product.push({ idP: idProduct, quantity });
            }
    
            // Guardar los cambios en la base de datos
            await cart.save();
        } catch (error) {
            logger.error("Error al actualizar el carrito:", error);
            throw error;
        }
        
    },
    
    deletProductToCart: async (idCart, idProduct) =>{
        try {
            const cart = await cartsModel.findOne({ _id: idCart });
              
            if (!cart) {
                logger.error(`Carrito con id ${idCart} no encontrado`)
                throw Error;
            }
    
            // Convertir idProduct a ObjectId si no lo es ya
            if (!ObjectId.isValid(idProduct)) {
                logger.error(`El id del producto ${idProduct} no es válido`)
                throw Error;
            }
    
            const productObjectId = new ObjectId(idProduct);
            const productObjectIdString = productObjectId.toString();
   
            const productIndex = cart.product.findIndex((item) => item.idP.toString() === productObjectIdString);

    
            if (productIndex !== -1) {
                // Eliminar el producto del carrito
                cart.product.splice(productIndex, 1);
                // Guardar los cambios en la base de datos
                await cart.save();
                logger.info("Producto eliminado y cambios guardados");
            } else {
                logger.error(`Producto con id ${idProduct} no encontrado en el carrito`)
                throw Error;
            }
        } catch (error) {
            logger.error(`Error al eliminar el producto del carrito con id: ${idCart} e id del producto: ${idProduct}`);
            logger.error(error);
            throw error;        
        }
    }
}

