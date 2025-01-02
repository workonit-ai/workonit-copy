const express = require('express')
const Log = require('./utilities/Log')


require('dotenv').config({
    path: `.env${process.env.NODE_ENV === 'production' ? '' : `.${process.env.NODE_ENV}.local`}`
})
const app = express()

require('./middleware')(app)
const config = require('./config')
const cronJob = require('./utilities/cronJob')

const server =
    app.listen(config.server.port || 3000, () => {
        Log.server(`server is running on port ${server.address().port}`)
    })

process.on('unhandledRejection', (reason, p) => {
    Log.error('Unhandled Rejection at: Promise', { promise: p, reason })
    Log.server('Shutting down due to an error...')
    server.close(() => {
        process.exit(1)
    })
})

process.on('uncaughtException', (err) => {
    Log.error(`Uncaught Exception thrown`, err)
    Log.server('Shutting down due to an error...')
    server.close(() => {
        process.exit(1)
    })
})

process.on('SIGTERM', () => {
    Log.server('SIGTERM received. Shutting down...')
    server.close(() => {
        Log.server('Process terminated!')
    })
})
const {runJobs} = require('./processJobs')
runJobs()
const {db_read} = require('./assistant/assistantFunctions/db_read')

    db_read({
        name: "db_read",
        description: "Query for a specific job by _id",
        query: { location: "ramat gan", title: "software engineer" }, // Replace with an actual _id from your database
        collection_name: "jobs",
        projection: { role: 1, created_at: 1},
    })



