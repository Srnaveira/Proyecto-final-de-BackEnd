const ticketsServices = require('../services/ticketsServices.js');
const cartsServices = require('../services/cartsServices.js');
const usersServices = require('../services/usersServices.js');
const productsServices  = require('../services/productsServices.js');
const transport = require('../config/email.js');
const dotenv = require('dotenv')


dotenv.config()

async function purchase(req, res) {
    try {
        const cartId = req.params.cid;
        const user = await usersServices.findByCartId(cartId);
        const cartContent = await cartsServices.getCartById(cartId);

        let total = 0;
        let arrayProducts = [];
        let outOfStockProducts = [];        

        for (let i = 0; i < cartContent.product.length; i++) {

            const product = await productsServices.getProductById(cartContent.product[i].idP._id);

            if (cartContent.product[i].quantity > product.stock) {
                req.logger.info(`No hay suficiente stock para el producto con ID ${product._id}`);
                outOfStockProducts.push(product.title);
            } else {
                const semitotal = cartContent.product[i].quantity * product.price;
                total += semitotal;
                const newStock = product.stock - cartContent.product[i].quantity;
                await productsServices.updateProduct(cartContent.product[i].idP, { stock: newStock });
                
                await cartsServices.deletProductToCart(cartContent._id, cartContent.product[i].idP._id);

                const productAdd = {
                    idP: cartContent.product[i]._id,
                    quantity: cartContent.product[i].quantity,
                    price: product.price,
                };
                arrayProducts.push(productAdd);
            }
        }

        if (arrayProducts.length > 0) {
            const newPurchase = {
                purchase_datetime: Date.now() + Math.floor(Math.random() * 10000 + 1),
                amount: total,
                products: arrayProducts,
                purchaser: user.email,
            };

            const purchaseSucefull = await ticketsServices.purchase(newPurchase);
            if(outOfStockProducts > 0){
                console.log("Productos sin stock Se dejaron en el carrito hasta que se pueda realizar la comprar:", outOfStockProducts.join(", "));
            }
            req.logger.info(purchaseSucefull);
            res.status(201).render('purchase', purchaseSucefull);
        } else {
            console.log("No se generó el ticket porque no se agregaron productos válidos.");
            console.log("Productos sin stock:", outOfStockProducts.join(", "));
            res.status(400).json({ message: "No se pudo realizar la compra debido a productos sin stock." });
        }
    } catch (error) {
        req.logger.error("Error al realizar la compra: ", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

async function getTicketByUser(req, res) {
    try {
        const email = req.params.email
        const tickets = await ticketsServices.getTicketByUser(email)
        res.status(200).render('ticketsUser', { tickets: tickets });
    } catch (error) {
        req.logger.error("Error al mostrar los tickets del usuario", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message});
    }
}

async function getTicketByCode(req, res) {
    try {
        const code = req.params.code
        const ticket = await ticketsServices.getTicketByCode(code)
        res.status(200).render('purchase', { tickets: ticket });
    } catch (error) {
        req.logger.error("Error al mostrar los tickets del usuario por code", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message});
    }
}

async function getTickets(req, res) {
    try {
        const allTickets = await ticketsServices.getTickets()
        res.status(200).render('tickets', { tickets: allTickets });
    } catch (error) {
        req.logger.error("Error al mostrar los tickets: ", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message});
    }
}

async function emailSend(req, res) {
    try {
        const code = req.params.code;
        const ticket = await ticketsServices.getTicketByCode(code)
        
        const mailOptions = {
            from: process.env.MAIL,
            to: ticket.purchaser,
            subject: `Compra Exitosa ${ticket._id}`,
            text: `
                La compra fue Completada: el ticket es el ${ticket._id}
                La fecha de la compra fue: ${ticket.purchase_datetime}
                El código de la compra es: ${ticket.code}
                El monto de la compra es: ${ticket.amount}
                El comprador es: ${ticket.purchaser}
            `,
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Detalles de la Compra</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            padding: 20px;
                            border: 1px solid #ddd;
                            background-color: #f9f9f9;
                        }
                        .container {
                            max-width: 600px;
                            margin: auto;
                        }
                        h1 {
                            text-align: center;
                            color: #333;
                        }
                        p {
                            line-height: 1.6;
                        }
                        .details {
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Detalles de la Compra</h1>
                        <div class="details">
                            <p><strong>Compra Completada:</strong> ${ticket._id}</p>
                            <p><strong>Fecha de la Compra:</strong> ${ticket.purchase_datetime}</p>
                            <p><strong>Código de la Compra:</strong> ${ticket.code}</p>
                            <p><strong>Monto de la Compra:</strong> $${ticket.amount}</p>
                            <p><strong>Comprador:</strong> ${ticket.purchaser}</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                req.logger.error(error)
                return ;
            }
            req.logger.info('Message sent: %s', info.messageId);
            res.status(201).send('¡Correo enviado correctamente!');
        });
        
    } catch (error) {
        req.logger.error("Error al enviar el correo: ", error);
        res.status(500).json({ message: "Error enviar el correo", error: error.message});
    }

}


module.exports = {
        purchase,
        getTicketByUser,
        getTicketByCode,
        getTickets,
        emailSend
}