const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const createLocaleMiddleware = require('express-locale');
const compression = require('compression');
const httpResponse = require('express-http-response');
const loggerMiddleware = require('./logger');
const config = require('../config');
require('../db');
const errorResponse = require('./errorHandler');
const notFound = require('./notFound');
const exposeProductionApp = require('./exposeProductionApp');
const { env } = require('../config');

module.exports = (app) => {
    // app.use(cors({
    //     origin: config.server.corsOrigins,
    //     credentials: true
    // }));

    app.use(cors())

    app.use(compression());
    app.use(require('morgan')('dev'));
    app.use(bodyParser.urlencoded({ extended: false, limit: '500mb' }));
    app.use(express.json({ limit: '500mb' }));

    app.use(loggerMiddleware);

    // Get the user's locale, and set a default in case there's none
    app.use(
        createLocaleMiddleware({
            priority: ['accept-language', 'default'],
            default: 'en_US'
        })
    );

    app.use(require('method-override')());
    app.use(express.static(path.join(__dirname, '/public')));

    // app.use(session({ secret, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

    if (env !== 'production')
        app.use(errorhandler());

    require('../models/Otp');

    app.use(require('../routes'));

    exposeProductionApp(app);

    app.use('/api/logs', express.static(path.join(__dirname, '..', 'logs')));

    app.use(notFound);
    app.use(httpResponse.Middleware);
    app.use(errorResponse);
};
