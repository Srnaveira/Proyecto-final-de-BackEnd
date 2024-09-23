const transport = require('../config/email.js');
const usersServices = require('../services/usersServices.js');
const jwt = require('jsonwebtoken');
const { createHash, isValidPassword } = require('../config/bcrypt.js')

async function login (req, res) {
    try {
        if (!req.user) {
            return res.status(401).send({ status: 'error', message: "Invalid credentials" })
        } 
                
        req.session.user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            documentsUploaded: req.user.documentsUploaded,
            rol: req.user.rol,
            cartId: req.user.cartId
        }
       
        switch (req.session.user.rol) {
            case 'user':
                res.status(200).redirect('/api/products/');
                break;
            case 'admin':
                res.status(200).redirect('/api/admin/realtimeproducts');
                break;
            case 'premium':
                res.status(200).render('userPremium');
                break;
            default:
                res.status(200).redirect('/api/products/');
        }
        
    } catch (error) {
        req.logger.info("Error al iniciar sesión" + error)
        res.status(500).send({message: 'Error al iniciar sesión'});
    }
}

async function faillogin (req, res) {
    res.send({ error: "Falied login" })
}


async function register (req, res) {
    try {
        req.logger.info({ status: "success", message: "Usuario registrado" })
        req.logger.info("Redirigiendo a /login...");
        res.status(200).redirect('/login');
    } catch (error) {
        req.logger.error("Error al registrar usuario" + error);
        res.status(500).send('Error al registrar usuario');           
    }
}

async function failregister (req, res) {
    req.logger.info("Failed Strategy")
    res.send({ error: "Failed" })
}


async function logout (req, res) {
    req.session.destroy((err) => {
        if (err) {
            req.logger.info('Error al cerrar sesión')
            return res.status(500).send('Error al cerrar sesión');
        } else {
            res.clearCookie('connect.sid').redirect('/login');
        }                 
    });  
}

async function requestPasswordReset(req, res) {
    req.logger.info("Entrando en recuperacion de cuenta")
    const { email } = req.body;
    req.logger.info("Emmain de cuenta a recuperar" + email)
    try {
        const user = await usersServices.login(email);
        req.logger.info("Informacion del usuario" + user)

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        const token = jwt.sign({ email }, process.env.SECRETJWT, { expiresIn: process.env.EXPIRATION_TIME });

        const resetLink = `http://localhost:8080/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: `MAIL DE RECUPERACION DE CUENTA: ${email}`,
            text: `
                Ingrese en el siguiente link para recuperar la cuenta este link estara activo por 1 hs:
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
                        <h1>Link de recuperacion:</h1>
                        <div class="details">
                            <p><strong>Link:</strong> ${resetLink}</p>
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

        res.send('Correo de restablecimiento enviado');

    } catch (error) {
        
    }
}

async function resetPassword(req, res) {    
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.SECRETJWT);
        req.logger.info(`Token recibido: ${token}`);
        req.logger.info(`Información decodificada: ${JSON.stringify(decoded)}`);
        req.logger.info(process.env.SECRETJWT)
        const user = await usersServices.login(decoded.email);
        req.logger.info(user)
        // Comparar la nueva contraseña con la actual
        const isSamePassword = isValidPassword(user, newPassword);
        req.logger.info(isSamePassword)
        if (isSamePassword) {
            return res.status(400).send('No puedes usar la misma contraseña');
        }

        const hashedPassword = createHash(newPassword);

        req.logger.info(`Password hasheada: ${hashedPassword}`);
        req.logger.info(`Email: ${user.email}`);

        await usersServices.updatePassword(user.email, hashedPassword);

        res.send('Contraseña actualizada con éxito');
    } catch (error) {
        // Si el token expiró o es inválido
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('El enlace de restablecimiento ha expirado. Solicita uno nuevo.');
        }
        res.status(400).send('Enlace de restablecimiento inválido');
    }  
}

async function updateRollUser(req, res) {
    try {
        const { uid } = req.params;
        const { newRole } = req.body;
        req.logger.info(`UID: ${uid}, newRole: ${newRole}`);

        if (!newRole) {
            req.logger.error('newRole no se recibió correctamente');
            return res.status(400).json({ error: 'No se recibió el rol' });
        }

        const validRoles = ['user', 'premium', 'admin'];

        if (!validRoles.includes(newRole)) {
            req.logger.error(`Rol inválido: ${newRole}`);
            return res.status(400).json({ error: 'Rol inválido' });
        }

        await usersServices.updateRollUser(uid, newRole);
        req.logger.info(`Rol actualizado correctamente para el usuario con ID ${uid} a ${newRole}`);
        res.status(200).json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
        req.logger.error('Error al actualizar el rol del usuario', error);
        res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
    }
}

async function uploadDocuments(req, res) {
    try {
      const { uid } = req.params;
      const user = await usersServices.findByID(uid);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Verificar si se subieron documentos
      const uploadedDocuments = [];

      if (req.files) {
        if (req.files.dniFront) {
          uploadedDocuments.push({
            name: 'dniFront',   // Campo del formulario
            reference: req.files.dniFront[0].path  // Ruta del archivo
          });
        }

        if (req.files.dniBack) {
          uploadedDocuments.push({
            name: 'dniBack',   // Campo del formulario
            reference: req.files.dniBack[0].path  // Ruta del archivo
          });
        }

        if (req.files.selfie) {
          uploadedDocuments.push({
            name: 'selfie',   // Campo del formulario
            reference: req.files.selfie[0].path  // Ruta del archivo
          });
        }

        // Marcar que se han subido documentos
        if (uploadedDocuments.length > 0) {
          user.documentsUploaded = true;
          user.documents.push(...uploadedDocuments);
        }
      }

      await user.save();
      res.status(200).json({ message: 'Documentos subidos correctamente', user });
    } catch (error) {
      console.error('Error al subir documentos:', error);
      res.status(500).json({ message: 'Error al subir documentos', error });
    }
}

async function deleteUser (req, res) {
    try {
        const threshold = new Date(Date.now() - (10 * 24 * 60 * 60 * 1000)); // 2 días
        const inactiveUsers = await usersServices.findInactiveUsers( threshold );

        for (const user of inactiveUsers) {
            await usersServices.deleteUser( user._id );
            // Enviar email de notificación
            const mailOptions = {
                from: process.env.MAIL,
                to: user.email,
                subject: `Cuenta eliminada por inactividad`,
                text: `Tu cuenta ha sido eliminada debido a inactividad en los últimos 2 días.`,
                html: `
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Cuenta eliminada</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f9f9f9;
                                padding: 20px;
                            }
                            .container {
                                max-width: 600px;
                                margin: auto;
                                background-color: #fff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            h1 {
                                text-align: center;
                                color: #333;
                            }
                            p {
                                line-height: 1.6;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Cuenta eliminada por inactividad</h1>
                            <p>Estimado/a ${user.name},</p>
                            <p>Lamentamos informarte que tu cuenta ha sido eliminada debido a la falta de actividad en los últimos 2 días. Si tienes alguna duda, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
                            <p>Saludos cordiales,</p>
                            <p>Equipo de Soporte de E-commerce</p>
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
        }
        
        return res.status(200).json({ message: 'Usuarios inactivos eliminados y notificados' });
    } catch (error) {
        logger.error('Error al eliminar usuarios inactivos:', error);
        return res.status(500).json({ message: 'Error al eliminar usuarios inactivos' });
    }
}

async function deleteInactiveUserById(req, res) {
    const { uid } = req.params; 

    try {
        const user = await usersServices.findByID( uid );

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const threshold = new Date(Date.now() - (10 * 24 * 60 * 60 * 1000)); // Umbral de 2 días de inactividad
        if (user.last_connection > threshold) {
            return res.status(400).json({ message: 'El usuario no está inactivo' });
        }

        // Eliminar el usuario
        await usersServices.deleteUser(user._id);

        // Enviar correo de notificación al usuario eliminado
        const mailOptions = {
            from: process.env.MAIL,
            to: user.email,
            subject: 'Cuenta eliminada por inactividad',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Cuenta eliminada</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            text-align: center;
                            color: #333;
                        }
                        p {
                            line-height: 1.6;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Cuenta eliminada por inactividad</h1>
                        <p>Estimado/a ${user.name},</p>
                        <p>Lamentamos informarte que tu cuenta ha sido eliminada debido a la falta de actividad en los últimos 2 días. Si tienes alguna duda, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
                        <p>Saludos cordiales,</p>
                        <p>Equipo de Soporte de E-commerce</p>
                    </div>
                </body>
                </html>
            `
        };

        // Enviar el correo
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                req.logger.error('Error al enviar correo: ', error);
                return res.status(500).json({ message: 'Error al enviar correo de notificación' });
            }
            req.logger.info('Correo enviado: %s', info.messageId);
        });

        return res.status(200).json({ message: `Usuario ${user.name} eliminado y notificado` });

    } catch (error) {
        req.logger.error('Error al eliminar usuario:', error);
        return res.status(500).json({ message: 'Error al eliminar usuario inactivo' });
    }
}


module.exports = {
    login,
    register,
    faillogin,
    failregister,
    logout,
    requestPasswordReset,
    resetPassword,
    updateRollUser,
    uploadDocuments,
    deleteUser,
    deleteInactiveUserById
}
