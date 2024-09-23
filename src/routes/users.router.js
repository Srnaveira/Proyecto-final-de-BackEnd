const express = require('express');
const usersRenderController = require('../controllers/usersRenderController.js')
const userController = require('../controllers/usersController.js');
const messagesController = require('../controllers/messagesController.js');
const { isAuthenticated, isNotAuthenticated , isUserOrPremium } = require ('../middleware/auth.js');
const upload = require('../config/multer.config.js');

const router = express.Router();

router.get('/login', isNotAuthenticated, usersRenderController.renderLogin);

router.get('/register', isNotAuthenticated, usersRenderController.renderRegister);

router.get('/current/:uid', isAuthenticated, usersRenderController.renderProfile);

router.get('/api/users/premium/:uid', isAuthenticated, usersRenderController.renderUploadDocuments);

router.post('/api/users/premium/:uid', isAuthenticated, upload.fields([
    { name: 'dniFront', maxCount: 1 },
    { name: 'dniBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]), userController.uploadDocuments);

router.get('/chat', isUserOrPremium, messagesController.loadMessages);

router.get('/user', isAuthenticated, usersRenderController.renderUser);

router.get('/request-password', usersRenderController.renderRecuperarPassword)

router.post('/request-password-reset', userController.requestPasswordReset)

router.get('/reset-password', usersRenderController.renderResetPassword);

router.post('/reset-password', userController.resetPassword )

module.exports = router;
