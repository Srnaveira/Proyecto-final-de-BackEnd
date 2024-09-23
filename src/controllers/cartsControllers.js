const cartsServices = require('../services/cartsServices.js');

async function addCart (req, res) {
    try {
        const newCart = {
            product: []
        }
        await cartsServices.addCart(newCart)
        res.status(201).json({message:'Se a creado correctamente el nuevo cart', cart: newCart});
    } catch (error) {
        req.logger.error("Se produjo algun error al generar el Cart", error);
        res.status(500).json({message: "Error interno del servidor", error: error}); 
    }
}

async function getAllCarts (req, res) {
    try {
        const carts = await cartsServices.getAllCarts()
        res.status(200).json({message: "Se envio el contenido de todos los carritos", cart: carts});
    } catch (error) {
        req.logger.error("Se produjo algun error al traer el contenido del Cart", error);
        res.status(500).json({message: "Error interno del servidor", error: error});       
    }       
}

async function getCartById (req, res) {
   try {
        const idCart = req.params.cid;  
        const CartIsValid = await cartsServices.getCartById(idCart)
        if(CartIsValid){
            res.status(200).render('cart', CartIsValid);
        } else {
            res.status(404).json({message: "No existe ese producto"});
        }
    } catch (error) {
        req.logger.error("Se produjo algun error al traer el contenido del Cart", error);
        res.status(500).json({message: "Error interno del servidor", error: error});
    }
}

async function deleteCart (req, res) {
    try {
        const idCart = req.params.cid;
        const cartIsValid = await cartsServices.deleteCart(idCart);
        if(cartIsValid){
            res.status(200).json({message: `El cart: ${idCart} Se elimino correctamente`})
        } else {
            res.status(404).json({message: `El cart: ${idCart} No existe`})
        }
    } catch (error) {
        req.logger.error("Se produjo algun error al Eliminar el Cart", error);
        res.status(500).json({message: "Error interno del servidor", error: error});
    }       
}

async function addProductToCart (req, res) {
    try {
        const idCart = req.params.cid;
        const idProduct = req.params.pid;
        let quantity = 1;
        
        await cartsServices.addProductToCart(idCart, idProduct, quantity);
        res.status(200).json({ message: "Producto agregado o actualizado correctamente" });
    } catch (error) {
        req.logger.error("Hubo un problema al agregar el producto al carrito", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
}      

async function deletProductToCart (req, res) {
    try {
        const idCart = req.params.cid;
        const idProduct = req.params.pId;

        await cartsServices.deletProductToCart(idCart, idProduct);
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        req.logger.error("Hubo un problema al eliminar el producto del carrito", error);
        res.status(500).json({ message: "Error interno del servidor", error });
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