const { MongoClient, ObjectId } = require('mongodb');
const Log = require('../../utilities/Log');
const {extractDbNameFromUri} = require('../utils/extractDbName');
const readline = require('readline');
const {db_read_modification} = require('../../indexers')
let config, uri, dbName, client;

// Function to prompt for MongoDB URI
async function promptForMongoUri() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Please enter the MongoDB URI: ', (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

// Set up URI and dbName based on execution context
async function setupConnection() {
    if (require.main !== module) {
        // Not running as standalone script
        config = require('../../config');
        uri = `${config.db.uri}`;
    } else {
        // Standalone execution - prompt for URI
        uri = await promptForMongoUri();
    }
    dbName = extractDbNameFromUri(uri);
    if (!client) {
        client = new MongoClient(uri);
    }
}

// ConstructQueryOfString function to handle MongoDB operators
const constructQueryOfString = (query) => {
    for (const key in query) {
        if (query.hasOwnProperty(key)) {
            if (typeof query[key] === 'object' && query[key] !== null) {
                // Check for $in operator
                if (query[key].$in && typeof query[key].$in === 'string') {
                    query[key].$in = query[key].$in.split(',').map(item => item.trim());
                }

                // Check for $gte, $lte, etc.
                if (query[key].$gte || query[key].$lte) {
                    if (query[key].$gte && typeof query[key].$gte === 'string') {
                        query[key].$gte = isNaN(query[key].$gte) ? new Date(query[key].$gte) : Number(query[key].$gte);
                    }
                    if (query[key].$lte && typeof query[key].$lte === 'string') {
                        query[key].$lte = isNaN(query[key].$lte) ? new Date(query[key].$lte) : Number(query[key].$lte);
                    }
                }

                // Check for $regex operator and leave $options untouched
                if (query[key].$regex && typeof query[key].$regex === 'string') {
                    query[key].$regex = new RegExp(query[key].$regex);
                    // $options can remain as it is (MongoDB handles it natively)
                }
                
                // Recursively process nested objects
                constructQueryOfString(query[key]);
            } else if (key === '_id' && typeof query[key] === 'string') {
                try {
                    query[key] = ObjectId.createFromHexString(query[key]);
                } catch (error) {
                    console.error(`Invalid ObjectId format: ${query[key]}`);
                }
            }
        }
    }
    return query;
};

async function executeQuery(inputJson) {
    if (!client) {
        await setupConnection();
    }

    let connection;
    try {
        // Validate inputJson
        if (!inputJson || typeof inputJson !== 'object') {
            throw new Error("Invalid input: JSON object is required.");
        }
        Log.info(`getting query parameters: ${JSON.stringify(inputJson)}`);
        var {
            query = {},
            collection_name,
            sort,
            limit,
            projection,
            skip,
            collation
        } = inputJson;
        
        Log.info(`got query parameters successfully`);
        // Ensure required fields are provided
        if (!collection_name) {
            throw new Error("Invalid input: 'collection_name' is required.");
        }
        const r = await db_read_modification(query,collection_name )
        const {idsGrade} =r;
        query = r.query

        // Construct query using the helper function
        const constructedQuery = constructQueryOfString(query);
        
        // Log the invocation
        Log.info(`Running query: ${JSON.stringify(constructedQuery)}`);

        connection = await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collection_name);

        let cursor = collection.find(constructedQuery);

        if (sort) {
            cursor = cursor.sort(sort);
        }

        if (limit) {
            cursor = cursor.limit(limit);
        }

        if (projection) {
            cursor = cursor.project(projection);
        }

        if (skip) {
            cursor = cursor.skip(skip);
        }

        if (collation) {
            cursor = cursor.collation(collation);
        }

        const result = await cursor.toArray();
        
        // Log the number of documents retrieved and their IDs
        const documentCount = result.length;
        const documentIds = result.map(doc => doc._id).join(', ');
        Log.info(`Documents retrieved: ${documentCount}`);
        Log.info(`Document IDs: ${documentIds}`);
        // Log the first few characters of the response
        const responsePreview = JSON.stringify(result).substring(0, 100);
        Log.info(`Query result preview: ${responsePreview}`);
        const sortedResult = result.sort((a, b) => {
            const gradeA = idsGrade.find(grade => grade.id.toString() === a._id.toString())?.relevancy || 0;
            const gradeB = idsGrade.find(grade => grade.id.toString() === b._id.toString())?.relevancy || 0;
            return gradeB - gradeA;  // Sort descending (high to low)
        });
        
        return {result: sortedResult, idsGrade};
    } catch (error) {
        Log.error(`Error executing query: ${error.message}`);
        return { error: error.message };
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


exports.db_read = async (args) => {
    Log.info('Setting to run query in database');
    
    const result = await executeQuery(args);

    if (result.error) {
        Log.error('Query failed:', result.error);
        return {
            status: 'error',
            message: 'Query failed',
            error: result.error
        };
    }

    Log.info('Query executed successfully:', JSON.stringify(result).substring(0, 100));

    return {
        status: 'success',
        message: 'Query executed successfully',
        data: result
    };
};

// Standalone script execution
if (require.main === module) {
    (async () => {
        await setupConnection();

        // Example 1: Current input JSON
        const inputJson1 = {
            name: "db_read",
            description: "Query for jobs created after May 2024",
            query: { created_at: { $gte: new Date("2024-06-01") } },
            collection_name: "jobs",
            sort: { created_at: -1 },
            limit: 5,
            projection: { role: 1, created_at: 1 },
        };

        // Example 2: Query using _id
        const inputJson2 = {
            name: "db_read",
            description: "Query for a specific job by _id",
            query: { _id: "66b0b7396d33acd06a589e03" }, // Replace with an actual _id from your database
            collection_name: "jobs",
            projection: { role: 1, created_at: 1},
        };

        
        // Example 3: Query a list
        const inputJson3 = {
            name: "db_read",
            description: "Query for a specific job by _id",
            query: { "location": {
            "$in": "תל אביב,רמת-גן"
        } }, // Replace with an actual _id from your database
            collection_name: "jobs",
            projection: { role: 1, created_at: 1 },
        };

        
        // Example 4: Query a regex
        const inputJson4 = {
            name: "db_read",
            description: "Query for a specific job by _id",
            query: {  "location": {
            "$regex": "(^תל[- ]?אביב|^ת\\\"א|^רמת[- ]?גן)",
            "$options": "i"
        } }, // Replace with an actual _id from your database
            collection_name: "jobs",
            projection: { role: 1, created_at: 1 },
        };

        // Example 5: Query 2 fields regex #1
        const inputJson5 ={
            name: "db_read",
            description: "Query for relevant programmer jobs",
            query: {
                location: {
                    $regex: "(^תל[- ]?אביב|^ת\\\"א|^רמת[- ]?גן)",
                    $options: "i"
                },
                title: {
                    $regex: "(תכניתן|מתכנת(ת)?(ים)?|JAVA|Python|Backend|Fullstack|Node\\.js|C\\+\\+|C#)",
                    $options: "i"
                }
            },
            collection_name: "jobs",
            projection: { role: 1, created_at: 1, title: 1 }
        };
        // Example 6: Query 2 fields regex #2
        const inputJson6 = {
            name: "db_read",
            description: "Query for relevant sales and marketing jobs",
            query: {
                location: {
                    $regex: "(^תל[- ]?אביב|^ת\\\"א|^רמת[- ]?גן)",
                    $options: "i"
                },
                title: {
                    $regex: "(מכיר(ות)?|מוכר(ת)?|שיווק|שווק|שיווק(ית)?|מנהל(ת)? שיווק|מנהל(ת)? מכירות)",
                    $options: "i"
                }
            },
            collection_name: "jobs",
            projection: { role: 1, created_at: 1, title: 1 }
        };
        

        try {
            console.log("Example 1: Query for recent jobs");
            const result1 = await executeQuery(inputJson1);
            console.log(result1);

            console.log("\nExample 2: Query for a specific job by _id");
            const result2 = await executeQuery(inputJson2);
            console.log(result2);

            console.log("\nExample 3: Query for a list");
            const result3 = await executeQuery(inputJson3);
            console.log(result3);

            console.log("\nExample 4: Query for a regex");
            const result4 = await executeQuery(inputJson4);
            console.log(result4);

            console.log("\nExample 5: Query 2 fields regex");
            const result5 = await executeQuery(inputJson5);
            console.log(result5);

            console.log("\nExample 6: Query 2 fields regex #2");
            const result6 = await executeQuery(inputJson6);
            console.log(result6);

        } catch (error) {
            console.error(error);
        } finally {
            // Close the client connection after both queries
            if (client) {
                await client.close();
            }
        }
    })();
}