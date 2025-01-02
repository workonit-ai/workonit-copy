let router = require('express').Router();
const {create_employee_manual_call} = require('../../assistant/assistantFunctions/create_employee')

/** base route: /api/company */

router
    /**
     * send a message for an assistant
     * @param {string} userId - id of the thread, optional
     * @param {string} companyName - id of the assistant
     * @param {string} companyId - content of the message
     * @param {string} role - content of the message
     * @param {string} name - content of the message
     * @param {string} email - content of the message
     * 
     */
    .post('/join', create_employee_manual_call );

module.exports = router;
