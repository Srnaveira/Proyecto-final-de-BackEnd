const mongoose  = require('mongoose');
const dotenv = require('dotenv');
const { logger } = require('../utils/logger.js')

dotenv.config()


class MongoSingleton {

    static #instance

    constructor(){ 
        mongoose.connect(process.env.MONGO_URL)
            .then(() => {
                logger.info("Conectado a la base de datos");
            })
            .catch((error) => {
                logger.fatal("Error al conectar a la base de datos", error);
            });
    }
    
    static getInstance() {
        if(this.#instance){
            logger.info("Ya estamos conectados a la base de datos")
            return this.#instance;
        }
        //Como no tenemos Instancia conectada Crea una llamando al 
        //Metodo 
        this.#instance = new MongoSingleton();
        //Devuelve la instancia Creada:
        return this.#instance;
    }
}


module.exports =  MongoSingleton;
