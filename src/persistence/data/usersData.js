const usersModel = require('../models/users.model.js');
const mongoStore = require('connect-mongo');
const session = require('express-session');
const { logger } = require('../../utils/logger.js');

module.exports = {
    login: async (username) => {
        try {      
            return await usersModel.findOne({email: username}); 
        } catch (error) {  
            logger.info("User doesn't exists")
            throw new Error("User doesn't exists", error)   
        }
    },

    register: async (newUser) => {
        try {
            logger.info('Conectado al UserData.js para crear el usuario...');
            logger.info(newUser)
            const createUser = await usersModel.create(newUser)
            logger.info("Usuario Creado" + createUser)
            logger.info("Cuena Creada")
            return createUser;
        } catch (error) {
            logger.error("Hubo un problema al crear la cuentra")
            throw error;
        }
    },

    findByID: async (id) =>{
        try {
            return await usersModel.findById(id)    
        } catch (error) {
            logger.error("no se encontro ese ID")
            throw error;
        } 
    },

    findByCartId: async (cartId) =>{
        try {
            return await usersModel.findOne({cartId: cartId})    
        } catch (error) {
            logger.error("no se encontro ese ID")
            throw error;
        }
    },

    updatePassword: async(email, password) => {
        try {
            logger.info("DENTRO DE LA FUNCION QUE HACE UPDATE EN LA BASE DE DATOS");
            logger.info("email: " + email);
            logger.info("password:" + password);
            
            const result = await usersModel.updateOne(
                { email: email },            
                { $set: { password: password } }
            );
            
            logger.info("Resultado de la actualización:", result);
    
            if (result.modifiedCount > 0) {
                logger.info("Se cambió la password para el usuario: " + email);
            } else {
                logger.warn("No se encontró al usuario o la contraseña ya es la misma: " + email);
            }
        } catch (error) {
            logger.error(`No se pudo cambiar la password: ${password} para el usuario: ${email}`);
            throw error; 
        }
    },

    listUsers: async () => {
        try {
            logger.info("DENTRO DE LA FUNCION QUE TRAE UN LISTADO COMPLETO DE LOS USUARIOS");
            const usersList = await usersModel.find();
            logger.info("Lista de usuarios" + JSON.stringify(usersList, null, 2));
            return usersList;
        } catch (error) {
            logger.error(`No se pudo obtener ni enviar la lista de usuarios:  ${error}`);
            throw error; 
        }
    },

    updateRollUser: async (uid, newRole) => {
        try {
            logger.info("DENTRO DE LA FUNCION QUE HACE UPDATE EN LA BASE DE DATOS PARA CAMBIAR EL ROLL");
            logger.info("_id: " + uid);
            logger.info("Rol Usuario: " + newRole);
            
            const result = await usersModel.updateOne(
                { _id: uid },            
                { $set: { rol: newRole } }
            );

            logger.info("Resultado de la actualización:", result);

            if (result.modifiedCount > 0) {
                logger.info("Se cambió la roll para el usuario: " + uid);
            } else {
                logger.warning("No se cambio al roll del usuario: " + uid);
            }
        } catch (error) {
            logger.error(`No se pudo cambiar el roll: ${newRole} para el usuario: ${uid}`);
            throw error; 
        }
    },

    updateLastConnection: async ( userId ) => {
        try {
            logger.info("DENTRO DE LA FUNCION QUE HACE UPDATE DE LAST CONECTION");
            logger.info("el user ID: " + userId)

            const now = new Date();
            await usersModel.findByIdAndUpdate(userId, { last_connection: now });

        } catch (error) {
            logger.error(`No se pudo actualizar el LastConection: ${now} para el usuario: ${userId}`);
            throw error; 
        }
    },

    deleteUser: async ( userId ) =>{
        try {
            await usersModel.deleteOne({ _id: userId })
        } catch (error) {
            logger.error(`No se pudo Eliminar el Usuario: ${userId}`);
            throw error; 
        }
    },

    findInactiveUsers: async ( threshold ) => {
        try {
            return await usersModel.find({ last_connection: { $lt: threshold } })
        } catch (error) {
            logger.info("No se pudo traer la lista de usuarios Inactivos")
            throw new Error("No se pudo traer la lista de usuarios Inactivos: ", error)   
        }

    },

    sessionConfig: () => {
        return session({
            store: mongoStore.create({ mongoUrl: process.env.MONGO_URL }),
            secret: process.env.SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                path: '/',
                expires: new Date(Date.now() + 60 * 60 * 1000), // 60 minutos
                maxAge: 60 * 60 * 1000 // 60 minutos
            }
        })
    }
    
}
