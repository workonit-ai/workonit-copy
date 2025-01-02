const express = require('express');
const path = require('path');
const { env } = require('../config');

function exposeProductionApp(app) {
    if (env !== 'production') return;

    app.use('/', express.static(path.join(__dirname, '..', 'dist')));
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
    });
}

module.exports = exposeProductionApp
