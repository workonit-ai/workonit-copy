const Log = require('../../utilities/Log');
const Inbox = require('../../models/Inbox');

exports.get_context = async (args) => {
    try {
        const { threadId } = args;

        if (!threadId) {
            throw new Error("threadId is required");
        }

        Log.info(`Retrieving system context for thread: ${threadId}`);

        // Find the Inbox document for this thread
        const inbox = await Inbox.findOne({ threadId });

        if (!inbox) {
            return {
                status: 'error',
                message: 'Inbox not found for the given threadId'
            };
        }

        // Return the metadata along with other context information
        return {
            status: 'success',
            message: 'System context retrieved successfully',
            data: {
                ...inbox.metadata,
                threadId: inbox.threadId,
                assistantId: inbox.assistantId
            }
        };
    } catch (error) {
        Log.error(`Error retrieving system context: ${error.message}`);
        return {
            status: 'error',
            message: 'Failed to retrieve system context',
            error: error.message
        };
    }
};