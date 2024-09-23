const winston = require('winston');


const customLevelsOptions = {
    levels:{
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors:{
        fatal: 'red',
        error: 'orange',
        warning: 'yellow', 
        http: 'green',
        info: 'blue',
        debug: 'white'
    }
}


const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
       /* new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ 
                    colors: customLevelsOptions.colors
                }),
                winston.format.simple()
            )
        }),*/

        new winston.transports.File({
            filename: './errors.log',
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            )
        })
    ]

})

const addLogger = ( req, res, next) =>{
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    req.logger.error(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    req.logger.warning(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    req.logger.debug(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    req.logger.fatal(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}


const errorHandlingMiddleware = (err, req, res, next) => {
    req.logger.error(`Error en ${req.method} ${req.url} - ${err.message}`);
    res.status(500).send("Internal Server Error");
};

module.exports = { 
    addLogger,
    logger,
    errorHandlingMiddleware
}

