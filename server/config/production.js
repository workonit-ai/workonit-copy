const config = {
    env: 'production',
    server: {
        port: 8080,
        host: 'https://www.workonit.ai',
        corsOrigins: ['https://www.workonit.ai', 'https://test.workonit.ai', 'https://admin.workonit.ai']
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
