const Inbox = require('../../models/Inbox');
const config = require('../../config');
const simaAssistantId = config.sima.assistant_id;



exports.getUserInbox = async (userId)  => {
    const inbox = await Inbox.findOne({ userId, assistantId: simaAssistantId });
    return inbox;
}