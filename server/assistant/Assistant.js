const OpenAI = require('openai');
const {toFile} = require('openai');
const Inbox = require('../models/Inbox');
const Log = require('../utilities/Log');
const config = require('../config');
const { executeFunctionTool } = require('./utils/executeFunctionTool');
const { getFile } = require('../middleware/aws_s3');
const axios = require('axios');
// const openai = require('./utils/openaiInstance');
const fs = require("fs")
const openai = new OpenAI({
    apiKey: config.openAI.key
}).beta;

fs.createReadStream

class Assistant {
    openAI = openai;
    assistantID;
    userID;
    threadID;
    runID;
    inbox;
    notSignedIn;
    assistantName;
    static async uploadFile(tempPath){
        
        const cl = new OpenAI({
            apiKey: config.openAI.key
        })
        const file = fs.createReadStream(tempPath)
        const openaiFile = await cl.files.create({
            file: file,
            purpose: 'assistants',

        });

        return openaiFile;
        
    }
    static async createThread(userID) {
        // Check if userID is an object (not logged in) or a string (logged in)
        const metadata = typeof userID === 'object' ? userID : { userID };
    
        const thread = await openai.threads.create({
            metadata
        });
    
        Log.info('Thread created: ' + thread.id);
        return thread;
    }
     
    static async getMessages(threadID) {
        return await openai.threads.messages.list(threadID);
    }

    static async getThreadMetadata() {
        if (!this.threadID) {
            throw new Error('Thread ID is not set');
        }

        try {
            const thread = await this.openAI.threads.retrieve(this.threadID);
            return thread.metadata;
        } catch (error) {
            Log.error('Error retrieving thread metadata:', error);
            throw new Error('Failed to retrieve thread metadata');
        }
    }

    static async createAssistantMessage(messageContent, threadId) {

        Log.info(`Creating assistant message: "${messageContent}"`);

        return await openai.threads.messages.create(threadId, {
            role: 'assistant',
            content: messageContent
        });
    }


    constructor(
        userID,
        assistantID,
        threadID,
        runID,
        inbox,
        notSignedIn = false
    ) {
        this.notSignedIn = notSignedIn;

        if (!notSignedIn) {
            if (!userID || !assistantID)
                throw new Error('userID and assistantID are required');

            this.userID = userID;
            this.inbox = inbox;
        }
        this.assistantID = assistantID;
        this.threadID = threadID;
        this.runID = runID;

        if (!notSignedIn) {
            Log.info(
                `Assistant Object Created for userID: ${this.userID}, assistantID: ${this.assistantID}, threadID: ${this.threadID}, runID: ${this.runID}, inbox: ${this.inbox}`
            );
        } else {
            Log.info(`Assistant initialized without user sign-in.`);
        }
    }

    async createThread() {
        const thread = await Assistant.createThread(this.userID);
        this.threadID = thread.id;

        if (!this.notSignedIn) {
            this.inbox = await Inbox.create({
                userId: this.userID,
                assistantId: this.assistantID,
                threadId: this.threadID
            });
        }

        return this.threadID;
    }

    async createRun() {
        if (!this.threadID) await this.createThread();
        const run = await this.openAI.threads.runs.create(this.threadID, {
            assistant_id: this.assistantID,
            additional_instructions: `Here are the details related to the user ${this.notSignedIn ? 'User id is: ' + this.userID : 'This is an employee'}`
        });

        this.runID = run.id;

        try {
            const assistantDetails = await this.openAI.assistants.retrieve(this.assistantID);
            this.assistantName = assistantDetails.name;
            Log.info(`Assistant name retrieved: ${this.assistantName}`);
        } catch (error) {
            Log.error('Error retrieving assistant details:', error);
            // Set a default name or leave it undefined based on your preference
            this.assistantName = 'Unknown Assistant';
        }

        if (!this.notSignedIn) {
            this.inbox.lastRunId = run.id;
            await this.inbox.save();
        }
        
        Log.info('Run created: ' + run.id);

        return run.id;
    }

    async retrieveRun() {
        if (!this.runID || !this.threadID) return;

        return this.openAI.threads.runs.retrieve(this.threadID, this.runID);
    }

    async getRunStatus() {
        const run = await this.retrieveRun();

        if (!run) return 'not_set';

        return run.status;
    }

    async isRunActive() {
        const runStatus = await this.getRunStatus();
        return (
            runStatus === 'queued' ||
            runStatus === 'in_progress' ||
            runStatus === 'requires_action'
        );
    }

    async handleRunProgress() {
        if (!(await this.isRunActive())) {
            await this.createRun();
        }

        Log.info('Run in progress...');

        while (true) {
            try {
                let run = await this.retrieveRun();

                switch (run.status) {
                    case 'queued':
                    case 'in_progress':
                        // Wait and continue checking
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );
                        break;
                    case 'requires_action':
                        Log.info(`Run requires action. Processing tools...`);
                        const output = await this.processTools(
                            run.required_action.submit_tool_outputs.tool_calls
                        );
                        Log.info(
                            `Submitting tool outputs. Run status is ${run.status}`
                        );
                        await this.openAI.threads.runs.submitToolOutputs(
                            this.threadID,
                            this.runID,
                            {
                                tool_outputs: output
                            }
                        );
                        // After submitting, wait a bit before next check
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );
                        break;
                    case 'completed':
                        Log.info(`Run completed successfully.`);
                        return run;
                    case 'failed':
                    case 'cancelled':
                    case 'expired':
                        Log.error(`Run ended with status: ${run.status}`);
                        return null;
                    default:
                        Log.warn(`Unhandled run status: ${run.status}`);
                        return null;
                }
            } catch (error) {
                Log.error('Error in run progress:', error);
                await this.cancelRun();
                throw new Error(
                    'Failed to handle run progress. Please contact admin.'
                );
            }
        }
    }

    async cancelRun() {
        const runStatus = await this.getRunStatus();
        if (
            runStatus === 'completed' ||
            runStatus === 'cancelled' ||
            runStatus === 'cancelling' ||
            runStatus === 'expired' ||
            runStatus === 'not_set'
        )
            return;

        const run = await this.openAI.threads.runs.cancel(
            this.threadID,
            this.runID
        );

        Log.info('Run cancelled: ' + run.id);

        return run.id;
    }

    async createMessage(messageContent, files=[]) {
        if (!this.threadID) await this.createThread();

        Log.info(`Creating message: "${messageContent}"`);
        const attach = files.map((file) => {
            return {
                file_id: file,
                tools: [{ type: 'file_search' }]
            };
        });
        const ans =await this.openAI.threads.messages.create(this.threadID, {
            role: 'user',
            content: messageContent,
            attachments: attach.length>0?attach:null
        });
        console.log(ans)
        return ans;
    }



    async createSystemMessage(instructions, role){
        if (!this.threadID) await this.createThread();

        Log.info(`Creating system message: "${instructions}"`);

        return await this.openAI.threads.messages.create(this.threadID, {
            role: role,
            content: instructions
        });
    }

    async processTools(toolCalls) {
        const tool_outputs = [];

        for (const tool_call of toolCalls) {
            const { function: fn, id } = tool_call;

            Log.info(`Assistant name retrieved: ${this.assistantName}`);
            
            Log.info("Arguments for the tool: ", JSON.parse(fn.arguments));
            const args = {
                userID: this.userID,
                assistantName: this.assistantName,
                threadID: this.threadID,
                ...JSON.parse(fn.arguments)
            };

            Log.info(
                `executing tool named ${fn.name} with args ${JSON.stringify(args)}`
            );

            await executeFunctionTool(fn.name, args, id, tool_outputs);
        }

        return tool_outputs;
    }

    async getMessages() {
        return await Assistant.getMessages(this.threadID);
    }

    async getResponse() {
        const messages = await this.getMessages();
        return messages.data[0];
    }
}

module.exports = Assistant;
