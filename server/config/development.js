const config = {
    env: 'development',
    server: {
        port: 3000,
        host: 'http://localhost:3000',
        corsOrigins: ['http://localhost:5173', 'http://localhost:4173']
    },
    jwt: {
        expiresIn: '1d',
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false
        }
    },
}

module.exports = config
