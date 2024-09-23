const passport = require('passport');
const local = require('passport-local');
const { createHash, isValidPassword } = require('../config/bcrypt.js');
const cartsServices = require('../services/cartsServices.js');
const usersServices = require('../services/usersServices.js');
const { logger } = require('../utils/logger.js');

const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" }, 
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body
            req.logger.info("Intentando registrar usuario...");
            req.logger.info(`Datos del usuario: ${JSON.stringify(req.body)}`);
            try {
                let user = await usersServices.login(username)
                logger.info("datos del usuario: " + user);
                if (user) {
                    logger.info("User already exists")
                    return done(null, false)
                }

                const newCart = {
                    product: []
                }

                let CartId = await cartsServices.addCart(newCart)

                logger.info("Info del cartID: " + CartId)

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cartId: CartId._id
                }
                logger.info("Info del nuevo usuario:" + newUser)
                logger.info('Intentando registrar usuario en la base de datos...');
                let result = await usersServices.register(newUser)

                if (!result || !result._id) {
                    logger.error("Usuario no creado correctamente, falta _id");
                    return done(null, false);  // O manejar el error adecuadamente
                }


                logger.info("Usuario Creado", result)
                logger.info(result);
                return done(null, result)
            } catch (error) {
                logger.warning("Error getting the user " + error)
                return done("Error getting the user" + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        logger.info ("serializeUser" + user);
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await usersServices.findByID(id);
        done(null, user)
    })

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await usersServices.login(username);
            if (!user) {
                logger.info("User doesn't exists")
                return done(null, false)
            }
            if (!isValidPassword(user, password)) {
                logger.info("Incorrect Password")
                return done(null, false)
            } 
            await usersServices.updateLastConnection(user._id);
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))
}

module.exports = initializePassport;