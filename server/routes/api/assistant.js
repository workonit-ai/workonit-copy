let router = require('express').Router();
const { getAssistants, deleteAssistant, getThreads, getAssistant,updateAssistant } = require('../../controllers/assistantController');
const auth = require('../auth');

router
    /**
     * get all assistant instances from the database
     */
    .get('/', getAssistants)

    .get('/get/:id', getAssistant)

    /**
     * get all threads for an assistant instance
     */
    .get('/:assistantId', auth.appendUser, getThreads)

    .put('/update/:id', updateAssistant)

    /**
     * deleting an assistant instance from the database
     * TODO: add admin auth
     */
    .delete('/delete/:id', deleteAssistant);

module.exports = router;
