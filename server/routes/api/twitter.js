let router = require('express').Router();
let auth = require('../auth');

const {checkTwitterConnection, updatecode, tweet} = require('../../OauthConnections/TwiterConn')
/** base route: /api/chat */

router
    /**
     * send a message for an assistant
     * @param {string} threadId - id of the thread, optional
     * @param {string} assistantId - id of the assistant
     * @param {string} messageContent - content of the message
     */
    .get('/request-token', auth.appendUser, checkTwitterConnection)

    /**
     * generate a new thread
     */
    .post('/sendcode', auth.appendUser, updatecode)
    .post('/tweet', auth.appendUser, tweet)

module.exports = router;