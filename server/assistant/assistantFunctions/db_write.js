const config = require('../../config')
const { MongoClient } = require('mongodb');
const Log = require('../../utilities/Log');
const {extractDbNameFromUri} = require('../utils/extractDbName')
const {collectionNametoModel} = require('../../models/modelHandler')
const uri = `${config.db.uri}`
const dbName = extractDbNameFromUri(uri);
const client = new MongoClient(uri);

async function executeWrite(inputJson) {
    try {
        // Validate inputJson
        if (!inputJson || typeof inputJson !== 'object') {
            throw new Error("Invalid input: JSON object is required.");
        }

        const {
            document = {},
            collection_name
        } = inputJson;

        // Ensure required fields are provided
        if (!collection_name) {
            throw new Error("Invalid input: 'collection_name' is required.");
        }

        // Log the invocation
        Log.info(`Inserting document: ${JSON.stringify(document)}`);

        await client.connect();
        const database = client.db(dbName);
        
        const collection = database.collection(collection_name);
        var result = {}
        // add metadata
        var documentWithMetadata = {
        ...document,
        created_at: new Date(),
        created_by_assistant: inputJson.assistantName,
        created_on_behalf_of_user: inputJson.userID
        };
        if(collection_name=='applications'){
            documentWithMetadata = {
                ...documentWithMetadata,
                    seen:false
                };
            const mongomodel  = collectionNametoModel(collection_name)

            const modelobject = new mongomodel(documentWithMetadata)
            result = await modelobject.save()
    
        }else{
            result = await collection.insertOne(documentWithMetadata)
        }
        
        // Log the result
        Log.info(`Document inserted with _id: ${result._id}`);

        return result;
    } catch (error) {
        Log.error(`Error executing write: ${error.message}`);
        return `didn't managed to write pls fix those error and try again ${error.message }`
    } finally {
        try {
            await client.close();
        } catch (closeError) {
            Log.error(`Error closing database connection: ${closeError.message}`);
        }
    }
}

exports.db_write = async (args) => {
    Log.info('Setting to write document to database');

    const result = await executeWrite(args);

    if (result.error) {
        Log.error('Write failed:', result.error);
        return {
            status: 'error',
            message: 'Write failed',
            error: result.error
        };
    }

    Log.info('Write executed successfully:', JSON.stringify(result).substring(0, 100));

    return {
        status: 'success',
        message: 'Write executed successfully',
        data: result
    };
};

// Standalone script execution
if (require.main === module) {
    const inputJson = {
        document: {
            name: "John Doe",
            phone: "123-456-7890",
            short_description: "Software Developer with 5 years of experience.",
            email: "john.doe@example.com",
            education: "B.Sc. in Computer Science",
            experience: "Worked at XYZ Corp for 3 years as a backend developer.",
            languages: ["English", "Spanish"],
            looking_for: "Looking for a challenging role in a dynamic company.",
            availability: "Immediately",
            location: "New York, USA",
            attachment: "URL_to_CV"
        },
        collection_name: "cvs"
    };

    executeWrite(inputJson)
        .then(result => Log.info(result))
        .catch(error => Log.error(error));
}