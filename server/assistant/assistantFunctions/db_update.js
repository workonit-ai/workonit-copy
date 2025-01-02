const config = require('../../config')
const { MongoClient, ObjectId } = require('mongodb');
const Log = require('../../utilities/Log');
const {extractDbNameFromUri} = require('../utils/extractDbName')

const uri = `${config.db.uri}`
const dbName = extractDbNameFromUri(uri);
const client = new MongoClient(uri);

async function executeUpdate(inputJson) {
    try {
        // Validate inputJson
        if (!inputJson || typeof inputJson !== 'object') {
            throw new Error("Invalid input: JSON object is required.");
        }

        const {
            document = {},
            collection_name,
            documentId
        } = inputJson;

        // Ensure required fields are provided
        if (!collection_name || !documentId) {
            throw new Error("Invalid input: 'collection_name' and 'documentId' are required.");
        }

        // Log the invocation
        Log.info(`Updating document: ${JSON.stringify(document)}`);

        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collection_name);

        // add metadata
        const documentWithMetadata = {
            ...document,
            updated_at: new Date(),
            updated_on_behalf_of_user: inputJson.userID,
            updated_by_assistant: inputJson.assistantName
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(documentId) },
            { $set: documentWithMetadata }
        );

        // Log the result
        Log.info(`Document updated with _id: ${documentId}, modified count: ${result.modifiedCount}`);

        return result;
    } catch (error) {
        Log.error(`Error executing update: ${error.message}`);
        return { error: error.message };
    } finally {
        try {
            await client.close();
        } catch (closeError) {
            Log.error(`Error closing database connection: ${closeError.message}`);
        }
    }
}

exports.db_update = async (args) => {
    Log.info('Setting to update document in database');

    const result = await executeUpdate(args);

    if (result.error) {
        Log.error('Update failed:', result.error);
        return {
            status: 'error',
            message: 'Update failed',
            error: result.error
        };
    }

    Log.info('Update executed successfully:', JSON.stringify(result).substring(0, 100));

    return {
        status: 'success',
        message: 'Update executed successfully',
        data: result
    };
};

// Standalone script execution
if (require.main === module) {
    const inputJson = {
        document: {
            name: "John Doe Updated",
            phone: "987-654-3210",
            short_description: "Senior Software Developer with 7 years of experience.",
        },
        collection_name: "cvs",
        documentId: "60d5ecb8b392d4c6d8f1c9e5", // replace with an actual document ID
        userID: "user123"
    };

    executeUpdate(inputJson)
        .then(result => Log.info(result))
        .catch(error => Log.error(error));
}