const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    req.logger.fatal("Este es un mensaje de nivel fatal");
    req.logger.error("Este es un mensaje de nivel error");
    req.logger.warning("Este es un mensaje de nivel warning");
    req.logger.info("Este es un mensaje de nivel info");
    req.logger.http("Este es un mensaje de nivel http");
    req.logger.debug("Este es un mensaje de nivel debug");
    
    res.send("Logs generados correctamente.");
});

module.exports = router;