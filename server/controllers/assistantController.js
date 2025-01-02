const Inbox = require('../models/Inbox');
const AssistantModel = require('../models/Assistant');
const Assistant = require('../assistant/Assistant');
const { OkResponse, BadRequestResponse } = require('express-http-response');
const { catchAsync } = require('../utilities/catchAsync');
const { formatMessages, formatMessage } = require('../utilities/formatMessages');
const Log = require('../utilities/Log');
const Notification = require('../models/Notification');
const User = require('../models/User');
const UserFIle = require('../models/UserFile');
const Application = require('../models/Application')
const createApplication = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { jobId, cvId, threadId  } = req.body;

    try {
        
        const App= new Application({job_id:jobId, cvId, created_on_behalf_of_user:userId, created_at: new Date() })
        await App.save()
        const d = await Assistant.createAssistantMessage("application submitted successfully", threadId)

        return next(new OkResponse({
            message:"application submitted successfully"
        }));
    }catch (error) {
        Log.error('Error creating new thread:', error);
        return next(new BadRequestResponse('There was an error processing your request. Please contact admin.'));
    }
});
const fetchThread = async (threadId, userId) => {
    if (!threadId)
        throw new BadRequestResponse('Thread ID is not provided');

    const isThreadId = threadId.includes('thread');

    // Find the inbox between userId and assistantId
    const query = isThreadId ?
        Inbox.findOne({
            threadId,
            userId
        }) :
        Inbox.findOne({
            _id: threadId,
            userId
        });

    return query.sort('-lastModified');
};
const addNotifications= async ( assistantId, userId) =>{

    try{


        const inbox = await Inbox.findOne({
            assistantId,
            userId
        }).sort('-lastModified').exec();
        
        const threadId = inbox?.threadId ?? null;
        
    const usr = await User.findById(userId)
    console.log("usr", usr)
    const Notifications =  await Notification.find({assistantId, userId:usr._id, seen:false})
    console.log(Notifications, {assistantId, userId, seen:false})
    if(Notifications.length > 0 && threadId){
    
    const d = await Promise.all(Notifications.map(async (notify)=>{
        const d = await Assistant.createAssistantMessage(notify.body, threadId)
        Log.info("created notification message for a thread",threadId, d)
        await Notification.findOneAndUpdate({_id:notify._id}, {seen:true})
    }))
    console.log(d)
    
    }
    }catch(e){
        console.log(e)
    }

}
const getThreadMessages = async (threadId) => {
    const {userId,assistantId } =await Inbox.findOne({threadId}).sort("lastModified")
    await addNotifications (assistantId, userId)
    const messages = await Assistant.getMessages(threadId);
    return formatMessages(messages.data)

};

const cancelRun = async(threadId, runId) => {
   

    const run = await this.openAI.threads.runs.cancel(
        threadId,
        runId
    );

    Log.info('Run cancelled: ' + run.id);

    return run.id;
}

const  generateResponse = async (files, userId, assistantId, thread, message, notSignedIn ) => {
    console.log('generateResponse', userId, assistantId, thread, message, notSignedIn);
    const assistant = new Assistant(
        userId,
        assistantId,
        thread?.threadId,
        thread?.lastRunId,
        thread,
        notSignedIn
    );

    try {
        const filesData = await UserFIle.find({ userId: userId, _id: { $in: files } });
        const fileIds = filesData.map(file => file.openAIData.id);
        console.log("fileIds",fileIds);
        message && await assistant.createMessage(message, fileIds);
        await Log.measure(
            async () => await assistant.handleRunProgress(),
            'Run finished in'
        )

        const responseMessage = await assistant.getResponse();

        return formatMessage(responseMessage);
    } catch (error) {
        await assistant.cancelRun();
        
        Log.error('Error generating response:', error);
        throw new Error('There was an error processing your request. Please contact admin.');
    }
};

const createMessage = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    let { threadId, assistantId, messageContent, files} = req.body;
    var thread ;

    try {
        // Check if inbox already exists between userId and assistantId
        thread = await fetchThread(threadId, userId);
        if((!thread.lastRunId)&&(assistantId=='asst_BnEVbXDYqnG5qs95XCSuQrEW')){
            messageContent = 'json '+ messageContent
        }
        const responseMessage = await generateResponse(
            files,
            userId,
            assistantId,
            thread,
            messageContent,

            
        );

        return next(new OkResponse({
            message: responseMessage
        }));
    } catch (error) {
        Log.error('Error creating message:', error);
        return next(new BadRequestResponse('There was an error processing your request. Please contact admin.'));
    }
});

const createExternalMessage = catchAsync(async (req, res, next) => {
    const { thread, assistantId, messageContent } = req.body;

    try {
        // Check if inbox already exists between userId and assistantId


        const responseMessage = await generateResponse(
            null,
            assistantId,
            thread,
            messageContent,
            notSignedIn = true
        );


        return next(new OkResponse({
            message: responseMessage
        }));
    } catch (error) {
        Log.error('Error creating message:', error);
        return next(new BadRequestResponse('There was an error processing your request. Please contact admin.'));
    }
});


const getNewThread = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { assistantId } = req.params;

    try {
        const thread = await Assistant.createThread(userId);

        const inbox = await Inbox.create({
            userId,
            assistantId: assistantId,
            threadId: thread.id
        });

        // Added comments to not generate response on the first message
        // const responseMessage = await generateResponse(
        //     userId,
        //     assistantId,
        //     inbox,
        //     null
        // );

        return next(new OkResponse({
            thread,
            // message: responseMessage
        }));
    } catch (error) {
        Log.error('Error creating new thread:', error);
        return next(new BadRequestResponse('There was an error processing your request. Please contact admin.'));
    }
});

const getNewShiftsThread = catchAsync(async (req, res, next) => {
    const { assistantId } = req.params;
    const queryParams = req.query;
    
    const params = new URLSearchParams(queryParams);

    const metadata = Array.from(params.entries()).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
    }, {});

    Log.info('New Shifts Thread:', assistantId, metadata);

    try {
        const thread = await Assistant.createThread(metadata);

        const responseMessage = await generateResponse(
            null,
            assistantId,
            null,
            null,
            notSignedIn = true
        );

        return next(new OkResponse({
            thread,
            message: responseMessage
        }));
    } catch (error) {
        Log.error('Error creating new thread:', error);
        return next(new BadRequestResponse('There was an error processing your request. Please contact admin.'));
    }
});

const getThread = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { threadId } = req.params;

    try {
        // Find the inbox between userId and assistantId
        const inbox = await fetchThread(threadId, userId);

        if (!inbox) {
            return res
                .status(404)
                .json({
                    message: `Inbox ${threadId} not found`
                });
        }
      
        // Find all the messages in the inbox
        const messages =
            await getThreadMessages(threadId);

        return next(new OkResponse({
            count: messages.length,
            messages
        }));
    } catch (error) {
        Log.error('Error fetching thread:', error);
        return next(new BadRequestResponse('There was an error processing your request. Please contact admin.'));
    }
});

const getThreads = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { assistantId } = req.params;

    try {
        const threads = await Inbox
            .find({
                userId,
                assistantId
            }).sort('-lastModified');

        return next(new OkResponse({
            count: threads.length,
            threads
        }));
    } catch (error) {
        Log.error('Error fetching threads:', error);
        return next(new BadRequestResponse('There was an error processing your request. Please contact admin.'));
    }
});

const getAssistants = catchAsync(async (req, res, next) => {
    try {
        const assistants =
            await AssistantModel.find();

        if (!assistants) {
            return next(new BadRequestResponse('Assistants not found'));
        }
        return next(new OkResponse({ assistants }));
    } catch (error) {
        Log.error('Error fetching assistants:', error);
        return next(new BadRequestResponse('There was an error processing your request. Please contact admin.'));
    }
});

const getAssistant = catchAsync(async (req, res, next) => {
    try {
        const assistant =
            await AssistantModel.findOne({
                _id: req.params.id
            });

        if (!assistant) {
            return next(new BadRequestResponse('Assistant not found'));
        }
        return next(new OkResponse({ assistant }));
    } catch (error) {
        Log.error('Error fetching assistant:', error);
        return next(new BadRequestResponse('There was an error processing your request. Please contact admin.'));
    }
});

const deleteAssistant = catchAsync(async (req, res, next) => {
    try {
        const assistant =
            await AssistantModel.findOneAndDelete({
                _id: req.params.id
            });

        if (!assistant) {
            return next(new BadRequestResponse('Assistant not found'));
        }
        return next(new OkResponse({
            message: 'Assistant deleted successfully'
        }));
    } catch (error) {
        Log.error('Error deleting assistant:', error);
        return next(new BadRequestResponse('There was an error processing your request. Please contact admin.'));
    }
});

const updateAssistant = catchAsync(async (req, res, next) => {
    try {
        const assistant =
            await AssistantModel.findOneAndUpdate({
                _id: req.params.id
            }, req.body, {
                new: true
            });

        if (!assistant) {
            return next(new BadRequestResponse('Assistant not found'));
        }
        return next(new OkResponse({
            message: 'Assistant updated successfully'
        }));
    } catch (error) {
        Log.error('Error updating assistant:', error);
        return next(new BadRequestResponse('There was an error processing your request. Please contact admin.'));
    }
});

module.exports = {
    createMessage,
    deleteAssistant,
    getAssistants,
    getThreads,
    getThread,
    getNewThread,
    getNewShiftsThread,
    createExternalMessage,
    addNotifications,
    getAssistant,
    updateAssistant, 
    createApplication
};
