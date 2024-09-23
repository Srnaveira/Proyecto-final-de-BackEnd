const productsServices = require('../services/productsServices.js');
const transport = require('../config/email.js');

async function addProduct (req, res) {
    try {
        const newProduct = req.body;
        req.logger.info("A revisar funcion de addproduct")
        
        req.logger.info("Rol de usuario: " + req.user.role)
        // Verificar si el usuario es premium
        if (req.user.role === 'premium') {
            newProduct.owner = req.user.email; 
            
        } else {
            newProduct.owner = 'admin';
        }
        
        req.logger.info("Contenido del producto a agregar: " + newProduct)

        await productsServices.addProduct(newProduct);
        res.status(201).json({message: "Product Agregado Correctamente", product: newProduct});
    } catch (error) {
        req.logger.error("Error al agregar el producto: ", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message});
    }
}

async function getAllProducts (req, res) {
    try {
        const allProducts = productsServices.getAllProducts();
        return res.status(200).render('home', { payload: allProducts });
    } catch (error) {
        req.logger.error("Error al traer los producto: ", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message});
    }
}

async function getProductById (req, res) {
    try {
        const idProduct = req.params.pid;
        const productIsValid = await productsServices.getProductById(idProduct); 

        if(productIsValid){
            res.status(200).json(productIsValid); 
        } else {
            res.status(404).json({message: "El producto Solicitado No existe"});
        }
    } catch (error) {
        req.logger.error("hubo algun problema: ", error)
        res.status(404).json({ error: "Error interno del servidor" })
    }
}

async function updateProduct (req, res) {
    try {
        const idProduct = req.params.pid;
        const productUpdate = req.body;
        await productsServices.updateProduct(idProduct, productUpdate);
        res.status(200).json({message: "Producto Actualizado"});
    } catch (error) {
        req.logger.error('Error al actualizar el producto:', error);
        res.status(500).json({  message: "Error interno del servidor", error: error.message}); 
    }
}

async function deleteProduct (req, res) {
    try {
        const idProduct = req.params.pid;
        const product = await productsServices.getProductById(idProduct);
        req.logger.info("Entramos a la funcion DELTEPRODUCT")
        req.logger.info("rol del usuario"  + req.user.role)
        
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (req.user.role === 'admin') {
            // Verificar si el propietario del producto no es admin
            if (product.owner !== req.user.email) {
                // Enviar correo al propietario del producto indicando que su producto fue eliminado
                const ownerUser = product.owner;

                // Construcción del correo para el propietario del producto eliminado
                const mailOptions = {
                    from: process.env.MAIL,
                    to: ownerUser, 
                    subject: `Tu producto "${product.name}" ha sido eliminado`,
                    text: `Estimado usuario, tu producto "${product.name}" ha sido eliminado por un administrador.`,
                    html: `
                    <div>
                        <h1>Producto eliminado</h1>
                        <p>Estimado usuario,</p>
                        <p>Te informamos que tu producto <strong>${product.name}</strong> ha sido eliminado por un administrador.</p>
                        <p>Si tienes alguna duda, por favor contacta con el soporte.</p>
                        <br>
                        <p>Saludos,</p>
                        <p>Equipo de Soporte</p>
                    </div>
                    `
                };
                // Enviar el correo al propietario
                transport.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        req.logger.error('Error al enviar el correo: ', error);
                    } else {
                        req.logger.info('Correo enviado: ' + info.response);
                    }
                });
                await productsServices.deleteProduct(idProduct);
                return res.status(200).json({ message: "Producto eliminado correctamente por el administrador" });
            }
        }
        
        if (req.user.role === 'premium' && product.owner !== req.user.email) {
            return res.status(403).json({ message: "No tienes permisos para eliminar este producto" });
        }
        
        await productsServices.deleteProduct(idProduct);
        res.status(200).json({message: "Producto Eliminado Correctamente"})
    } catch (error) {
        req.logger.error("Error al borrar el Producto", error)
        res.status(404).json({message: "Error interno del servidor", error: error.message})
    }
}

async function getProductByFilter (req, res) {
    let {limit = 10, page= 1, sort, query } = req.query
    limit = parseInt(limit);
    page = parseInt(page);
    try {
        let filter = {};
        if(query){
            filter = {
                $or: [
                    { category: query },
                    { status: query.toLowerCase() === 'true' }
                ]
            };
        }

        if (req.user && req.user.role === 'premium') {
            filter.owner = { $ne: req.user.email };
        }

        let sortOptions = {};
        if (sort) {
           sortOptions.price = sort === 'asc' ? 1 : -1;
        }
        const totalProducts = await productsServices.totalProducts()

        const totalPages = Math.ceil(totalProducts / limit);
        const offset = (page - 1) * limit;

        const products = await productsServices.getProductByFilter(filter, limit, offset, sortOptions)

        const user = req.session.user || null;

        const response = {
            status: "success",
            isUser: !!user,
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort || ''}&query=${query || ''}` : null
        };
        return res.status(200).render('products', response)
    } catch (error) { 
        req.logger.error("error al leer el archivo", error)
        res.status(500).json({ error: "Error interno del servidor" })
    }
}

async function realTimeProducts (req, res) {
    try {
        res.render('realtimeproducts', {} );
    } catch (error) {
        req.logger.error("Error al renderizar realtimeproducts", error);
        res.status(500).json({message: "Error interno del servidor", error: error.message});
    }
}

async function productsUsersPremium (req, res) {
    try {
        res.render('productsUsersPremium', {} );
    } catch (error) {
        req.logger.error("Error al renderizar realtimeproducts", error);
        res.status(500).json({message: "Error interno del servidor", error: error.message});
    }
}

module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductByFilter,
    realTimeProducts,
    productsUsersPremium
}