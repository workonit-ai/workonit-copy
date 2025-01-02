const { MongoClient, ObjectId } = require('mongodb');
const config = require('../config');
const client = new MongoClient(config.db.uri);
const database = client.db(config.db.database);
const Log = require('../utilities/Log')
class IndexerConnection{
    connectedCollectionName;
    indexer;
    collection;
    attribute
    scalar 
    constructor(collection, indexer, collectionattribute, scalar=1){
        this.indexer = indexer;
        this.attribute = collectionattribute
        this.connectedCollectionName = collection;
        this.collection = database.collection(`${indexer.name}-${collection}_indexer`);
        this.scalar = scalar

    }
    async getTags(){
        const tags = await this.collection.find({}).toArray()
        return tags.map((tag)=>{return tag.text})
    }
    async addIndex(text, tag){
        const newTag = await this.collection.insertOne({text:text, objects:[tag]})
        console.log(`new tag added to indexer ${this.indexer.name}-${this.connectedCollectionName}_indexer} : ${newTag}`)

    }
    async insertId(text, id){
        const list = await this.getTags();
        const {newRelevantTags, exisitingtags} = await this.indexer.parseToTags(text, list)
        
        newRelevantTags.forEach(tag => {
            this.addIndex(tag.text, {id, relevancy:tag.relevancy})
        } )
        exisitingtags.forEach(async (tag)=>{
            await this.collection.updateOne({text:tag.text}, {$push:{objects:{id, relevancy:tag.relevancy}}})
        })
        


    }
    removeDuplicates(array) {
        // Create a Map to store unique items using ObjectId string as key
        const uniqueMap = new Map();
        
        // Iterate through array and keep items with highest relevancy
        array.forEach(item => {
            const idString = item.id.toString();
            
            if (!uniqueMap.has(idString) || uniqueMap.get(idString).relevancy < item.relevancy) {
                uniqueMap.set(idString, item);
            }
        });
        
        // Convert Map values back to array
        return Array.from(uniqueMap.values());
    }
    async search(text, limit=10){
        const list = await this.getTags();
        const relevantTags = await this.indexer.parseToQuery(text, list)
        var ans = []
        await Promise.all(relevantTags.exisitingtags.map(async (tag)=>{
            const result = await this.collection.find({text:tag.text}).toArray()
                if(result[0].objects){
                    result[0].objects.map((res)=>{
                        console.log("res", tag, res) 
                           ans.push({id: res.id, relevancy:(tag.relevancy*res.relevancy)*this.scalar})

                        
                    })
                }
            
            
           

        }))
        ans.sort((a, b)=>{
            if(a.relevancy>b.relevancy) return 1
            if(a.relevancy<b.relevancy) return -1
            return 0
        }).splice(limit)
        ans = this.removeDuplicates(ans)
        console.log("ans", text, this.attribute ,ans)

        return ans
    }
    async Job(){
        try{
            const coll = await database.collection(this.connectedCollectionName)
            const res = await coll.find({[this.attribute+"indexer"]:{$exists:false}}).toArray()
            res.map(async(item)=>{
            try{
                await this.insertId(item[this.attribute], item._id)
                coll.updateOne({_id:item._id},{$set:{[this.attribute+"indexer"]:new Date()}})
            }catch(e){
                console.log(this.attribute, item, e)
            }
            

        })

        }catch(e){
            console.log(e)
        }
        
    }
    

    
}
module.exports = IndexerConnection
