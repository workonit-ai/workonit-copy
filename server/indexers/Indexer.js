const OpenAI = require('openai');
const config = require('../config');
const openai = new OpenAI({apiKey:config.openAI.key});
const mongoose = require("mongoose");
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(config.db.uri);
const database = client.db(config.db.database);
const Log = require('../utilities/Log')
// response format for GPT 
const parsing_response_format = {
    type: "json_schema",
    json_schema: {
        name:"indexerResponse",
        schema:{
            type:"object",
            properties:{
                exisitingtags:{
                    type:"array",
                    items:{
                        type:"object",
                        properties:{
                        text:{
                            type:"string",
                            description: "tags from the list",
                        },
                        relevancy:{
                            type:"number",
                            enum:[1,2,3,4,5]
                        }
                    }
                    }
                },
                newRelevantTags:{
                    type:"array",
                    items:{
                        type:"object",
                        properties:{
                        text:{
                            type:"string",
                            description: "tags that dont apear on the list  and has defferent meaning but only if can be useful many times",
                        },
                        relevancy:{
                            type:"number",
                            enum:[1,2,3,4,5]
                        }
                    }
                    }
                }
            }
        }
    }
}

const query_response_format = {
    type: "json_schema",
    json_schema: {
        name:"indexerQueryResponse",
        schema:{
            type:"object",
            properties:{
                exisitingtags:{
                    type:"array",
                    items:{
                        type:"object",
                        properties:{
                        text:{
                            type:"string",
                            description: "relevant tags from the list",
                        },
                        relevancy:{
                            type:"number",
                            enum:[1,2,3,4,5]
                        }
                    }
                    }
                }
                
            }
        }
    }
}

const mongoIndexerSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    

    
});

//an indexer class that contains its model and operating functions for query and parsing
class Indexer {
    name;
    explain;
    

    DBmongoseObject;
    constructor(input){
        this.name = input.name
        this.explain = input.explain
        this.DBmongoseObject = mongoose.model("indexer-"+this.name, mongoIndexerSchema)

    }
    
    
    //function to turn a text of a property to it's indexers
    async parseToTags(text, list){
        
        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
              { role: "system", content: `you are indexing query tags for ${this.name} for job hiring system  choose the right tags from the list  or suggest relevant tags that aqurate describe ${this.explain} that the client wrote 
                  the list: ${list}` },
              { role: "user", content: text }
            ],
            response_format: parsing_response_format,
            });
          const resault = completion.choices[0].message.parsed
          
          return resault
          
          
    }
    //function to turn a text of a property in a query to already existing indexers 
    async parseToQuery(text, list){
        console.log("parseToQuery", text, list)
        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
              { role: "system", content: `you are indexing query tags for ${this.name}, choose the right tags from the list, give only if they acuurate to ${this.explain} for what the client wrote 
                  the list: ${list}` },
              { role: "user", content: text }
            ],
            response_format: query_response_format,
            });
        console.log("completion ", text,  completion.choices[0].message.parsed)
        const resault = completion.choices[0].message.parsed
        
        return resault     
    } 
    async Jobevent(event, collection){
        const tags = await this.parseToTags(event[this.name])
        console.log("tags", tags)
        await database.collection(collection).updateOne({_id:event._id},{$set:{["indexer-"+this.name]:tags}}) 
        Log.server(`indexer ${this.name} updated for object ${event._id} from cllection ${collection} with tags ${tags}`)
    }  
}
module.exports = Indexer
