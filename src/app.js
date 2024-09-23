const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const passport = require('passport');
const usersServices = require('./services/usersServices.js')
const initializePassport = require('./config/passport.config.js');
const socketServer = require('./socket.js');
const MongoSingleton = require('./database/config.js');
const { addLogger , logger , errorHandlingMiddleware} = require ('./utils/logger.js');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');

// Routes
const cartsRoutes = require('./routes/carts.router.js');
const productsRouter = require('./routes/products.router.js');
const adminRoutes = require('./routes/admin.router.js');
const usersRoutes = require('./routes/users.router.js');
const premiumRoutes = require('./routes/premium.route.js');
const seccionsRoutes = require('./routes/api/sessions.router.js');
const ticketsRoutes = require('./routes/tickets.route.js');
const loggerRoutes = require('./routes/logger.router.js');

dotenv.config();

// Inicializo App
const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentacion",
            description: "Api ecomerse del proyecto de CoderHouse"
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Define el motor de plantillas
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
}));


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

initializePassport();
app.use(usersServices.sessionConfig());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views'); 
app.use(express.static(__dirname + '/public')); 

app.use(addLogger);

// Middleware para manejar datos de usuario en las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// EndPoints
app.use('/', usersRoutes)
app.use('/api/premium', premiumRoutes)
app.use('/api/sessions', seccionsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/loggerTest', loggerRoutes);

app.use(errorHandlingMiddleware);


const httpServer = app.listen(process.env.PORT, () => {
    logger.info(`Aplicación funcionando en el puerto: ${process.env.PORT}`);
    console.log("App corriendo")
});

MongoSingleton.getInstance();

socketServer(httpServer);