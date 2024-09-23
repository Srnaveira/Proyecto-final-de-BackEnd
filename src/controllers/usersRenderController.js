const usersServices = require('../services/usersServices.js');

async function renderLogin (req, res) {
    try {

        res.status(200).render('login');
    } catch (error) {
        req.logger.error("Problemas renderizando login")
        res.statu(404).json({message: "Problemas renderizando login"})
    }
}

async function renderRegister (req, res) {
    try {
        res.status(200).render('register');
    } catch (error) {
        req.logger.error("Problemas renderizando register")
        res.statu(404).json({message: "Problemas renderizando register"})
    }
}

async function renderProfile (req, res) {
    try {
        res.status(200).render('current', { user: req.session.user });;
    } catch (error) {
        req.logger.error("Problemas renderizando register")
        res.statu(404).json({message: "Problemas renderizando register"})
    }
}

async function renderUser (req, res) {
    try {
        res.status(200).json(req.session.user || null);
    } catch (error) {
        req.logger.error("Problemas renderizando user")
        res.statu(404).json({message: "Problemas renderizando user"})
    }
}

async function renderRecuperarPassword (req, res) {
    try {
        req.logger.info('Rendering requestpassword view');
        res.status(200).render('requestpassword');
    } catch (error) {
        req.logger.error("Problemas renderizando register")
        res.statu(404).json({message: "Problemas renderizando register"})
    }
}

async function renderResetPassword(req, res) {
    try {
        const { token } = req.query;
        res.status(200).render('resetpassword', { token });
    } catch (error) {
        req.logger.error("Problemas renderizando resetpassword");
        res.status(404).json({ message: "Problemas renderizando resetpassword" });
    }
}

async function renderUploadDocuments (req, res) {
    try {
        res.status(200).render('uploaddocuments')
    } catch (error) {
        req.logger.error("Problemas para renderizar la pagina de carga de documentos " + error);
        res.status(404).json({message: "Problemas para renderizar la pagina de carga de documentos" })
    }
}

async function listUsers(req, res) {
    try {
        const usersList = await usersServices.listUsers();
        req.logger.info("ESTOY DENTRO DEL USERSCONTROLLER PARA TRAER LA LISTA DE USUARIOS");
        req.logger.info("Contenido de la lista de usuarios: " + usersList);
        res.status(200).render('listUsers', { users: usersList });
    } catch (error) {
        req.logger.error('Error al listar usuarios', error);
        res.status(500).send('Error al listar usuarios');
    } 
}

async function findInactiveUsers (req, res) {
    try {
        const threshold = new Date(Date.now() - (10 * 24 * 60 * 60 * 1000)); // 10 días
        const inactiveUsers = await usersServices.findInactiveUsers(threshold);
        return res.status(200).render('inactiveUsers', { inactiveUsers });
    } catch (error) {
        logger.error('Error al obtener usuarios inactivos:', error);
        return res.status(500).json({ message: 'Error al obtener usuarios inactivos' }); 
    }
}

module.exports = {
    renderLogin,
    renderProfile,
    renderRegister,
    renderUser,
    renderRecuperarPassword,
    renderResetPassword,
    renderUploadDocuments,
    listUsers,
    findInactiveUsers
}