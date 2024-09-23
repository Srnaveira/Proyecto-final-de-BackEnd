const usersData = require('../persistence/data/usersData.js');
const { logger } = require('../utils/logger.js');

async function login(username) {
    try {
        return await usersData.login(username);
    } catch (error) {
        logger.error("Hubo un error en el userService al encontrar el usuario");
        throw error;
    }
}

async function register(newUser) {
    try {
        logger.info('Conectado al UserServices.js para crear el usuario...');
        const createUser = await usersData.register(newUser);
        return createUser;
    } catch (error) {
        logger.error("Hubo un error en el userService al crear el usuario");
        throw error;
    }
}

async function listUsers() {
    try {
        logger.info('Conectado al UserServices.js para traer la lista de usuarios...');
        return await usersData.listUsers()  
    } catch (error) {
        logger.error("Hubo un error en el userService al traer los usuarios");
        throw error;
    }
}

async function updateRollUser (uid, newRole){
    try {
        logger.info(`Actualizando el rol del usuario con ID ${uid} a ${newRole}`);
        await usersData.updateRollUser(uid, newRole)
    } catch (error) {
        logger.error("Hubo un error en el userService al actualizar el roll del usuarios");
        throw error;
    }
}

async function findByID (id) {
    try {
        return await usersData.findByID(id)
    } catch (error) {
        logger.error("Hubo un error en el userService al buscar el ID");
        throw error;
    }
}

async function findByCartId (cartId) {
    try {
        return await usersData.findByCartId(cartId)    
    } catch (error) {
        logger.error("no se encontro ese ID")
        throw error;
    }
}

async function updatePassword(email, password){
    try { 
        logger.info("DENTRO DEL SERVICE CONTROLLER :" + "email: " + email + " Password: "+ password);
        await usersData.updatePassword(email, password)
    } catch (error) {
        logger.error("No se pudo actualizar la Password")
        throw error;
    }
}

function sessionConfig () {
    try {
        return usersData.sessionConfig()
    } catch (error) {
        logger.error("Hubo un error en el userService al crear una seccion");
        throw error;   
    }
}

async function updateLastConnection ( userId ) {
    try {
        await usersData.updateLastConnection( userId );
    } catch (error) {
        logger.error("Hubo un error en el userService al updatear la seccion.");
        throw error;   
    }
}

async function deleteUser ( userId ) {
    try {
        await usersData.deleteUser( userId );
    } catch (error) {
        logger.error(`Hubo un error en el userService Al eliminar el usuario con userId: ${ userId }`);
        throw error;   
    }
}

async function findInactiveUsers ( threshold ) {
    try {
        return await usersData.findInactiveUsers( threshold );
    } catch (error) {
        logger.error(`Hubo un error en el userService al buscar los usuarios con este umbral ${ threshold }.`);
        throw error;   
    }
}


module.exports = {
    login,
    register,
    findByID,
    listUsers,
    updateRollUser,
    findByCartId,
    updatePassword,
    sessionConfig,
    updateLastConnection,
    deleteUser,
    findInactiveUsers
}