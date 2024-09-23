const usersController = require('../../controllers/usersController.js')
const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), usersController.register);

router.get('/failregister', usersController.failregister)

router.post('/login', passport.authenticate('login', { failureRedirect: 'faillogin' }), usersController.login );

router.get('/faillogin', usersController.faillogin)

router.post('/logout', usersController.logout);

module.exports = router;
