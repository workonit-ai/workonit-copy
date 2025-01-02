const Log = require('../../utilities/Log');
const User = require('../../models/User');
const TwitterConection = require('../../models/TwitterConection')
const Notification = require('../../models/Notification')
const Assistant = require('../../models/Assistant');

async function getSystemContext(inputJson) {
    try {
        // Validate inputJson
        if (!inputJson || typeof inputJson !== 'object') {
            throw new Error("Invalid input: JSON object is required.");
        }
        console.log(JSON.stringify(inputJson))
        const requiredFields = ['userID'];
        const missingFields = requiredFields.filter(field => !inputJson.hasOwnProperty(field));

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields in system context: ${missingFields.join(', ')}`);
        }

        // Log the invocation
        Log.info(`Retrieving system context`);

        // For now, we're just returning userID, but this can be expanded in the future
        // return { userID: inputJson.userID };
        // Expanded
        const user = await User.findById(inputJson.userID).exec();
        
        if (!user) {
            return { userID: inputJson.userID };
        }
        const samisid = (await Assistant.findOne({name:'SAMI'}).exec()).assistant_id
        console.log("samis", samisid)
        const twitterConnection = await TwitterConection.findOne({userId:user._id, code: { $ne: "" }})
       
        const usersNotification = await Notification.find({userId:user._id, assistantId:samisid})

         return {user, usersNotification, twitterConnection};
        
    } catch (error) {
        Log.error(`Error retrieving system context: ${error.message}`);
        return { error: error.message };
    }
}

exports.SAMI_get_context = async (args) => {
    Log.info('Attempting to retrieve system context');

    const result = await getSystemContext(args);

    if (result.error) {
        Log.error('Failed to retrieve system context:', result.error);
        return {
            status: 'error',
            message: 'Failed to retrieve system context',
            error: result.error
        };
    }

    Log.info('System context retrieved successfully:', JSON.stringify(result));

    return {
        status: 'success',
        message: 'System context retrieved successfully',
        date_now:new Date(),
        data: result
    };
};

// Standalone script execution
if (require.main === module) {
    const inputJson = {
        userID: "66785a7c623fd9fe5c2b6e95"
        // Add more fields here in the future as needed
    };

    getSystemContext(inputJson)
        .then(result => Log.info(result))
        .catch(error => Log.error(error));
}