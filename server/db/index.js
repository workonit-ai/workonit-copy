const mongoose = require('mongoose')
const config = require('../config')
const { env } = require('../config');
const Log = require('../utilities/Log');

// if (config.env === 'development')
//     mongoose.set('debug', true)

const db = mongoose
    .connect(`${config.db.uri}`)
    .then(() => {
        Log.server(`connected to db in ${env} environment`)
    })
    .catch((err) => {
        console.error(err)
    })

module.exports = db
