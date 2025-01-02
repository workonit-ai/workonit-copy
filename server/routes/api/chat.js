let router = require('express').Router();
let auth = require('../auth');
const { createApplication, createMessage, getThread, getNewThread, getNewShiftsThread, createExternalMessage } = require('../../controllers/assistantController');

/** base route: /api/chat */

router
    /**
     * send a message for an assistant
     * @param {string} threadId - id of the thread, optional
     * @param {string} assistantId - id of the assistant
     * @param {string} messageContent - content of the message
     */
    .post('/message', auth.appendUser, createMessage)

    /**
     * generate a new thread
     */
    .get('/thread/new/:assistantId', auth.appendUser, getNewThread)

    /**
     * get a thread with messages
     * @param {string} threadId - can be either a thread id or a db id
     */
    .get('/thread/:threadId', auth.appendUser, getThread)

    /**
     * create a thread without for the user that is not signed in.
     * @param {string} assistantId - id of the assistant
     */
    .get('/assistants/:assistantId/threads/new', getNewShiftsThread)

    /**
     * Endpoint to serve the user that is not logged in
     */
    .post('/external', createExternalMessage)

    .post('/createApplication', auth.appendUser, createApplication);

module.exports = router;
