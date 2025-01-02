const assistantFunctions = require('../assistantFunctions');
const { validateParameters } = require('./validateParams');
const Log = require('../../utilities/Log');

exports.functionToolController = async (functionName, args) => {
    try {
    Log.info(`searching for function ${functionName}`);
    const { function: fn , required} = assistantFunctions[functionName];
    if (!fn)
        throw new Error('Function not found: ' + functionName);

    Log.info(`validating required parameters for function ${functionName}`);
    
        const { isValid, missingParams } = validateParameters(args, required);

        if (!isValid)
            throw new Error('Missing required parameters: ' + missingParams.join(', '));

        Log.info(`executing function ${functionName} the parameters are: ${JSON.stringify(args)}`);
        return await fn(args);
    } catch (err) {
        Log.error(`Error running tool for function ${functionName}. error: ${err}`);

        return {
            status: 'error',
            message: 'There was a problem running the function, please contact admin'
            
        };
    }
};
