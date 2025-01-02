const IndexerConnection = require('./IndexerConnection')
const Indexer = require('./Indexer')

const locationIndexer = new Indexer({name:"location", explain: "location or places near by" })
const roleIndexer = new Indexer({name:"role", explain: "role or roles" })
const indexer_registry = [
    {
        collection: "jobs",
        indexers: [
            {
            indexer:locationIndexer,
            attribute:"location"
            },
            {
                indexer:roleIndexer,
                attribute:"title",
                importance:1.4
            }
        ]  
    },
]



indexer_registry.map((regis)=>{
    
        regis.indexers.map(async(indexer)=>{
            console.log(indexer)
            indexer.connection = await new IndexerConnection(regis.collection, indexer.indexer, indexer.attribute , indexer.importance)
            try{
                setInterval(()=>indexer.connection.Job(), 5000)
                
            }catch(e){
                console.log(e)
            }
            
        })
    
    
})
function mergeArrays(res, relevantIds) {
    // Create a map using ObjectId string representation for comparison
    const existingMap = new Map(relevantIds.map(item => [item.id.toString(), item]));
    
    // Process each item from res
    res.forEach(item => {
        const idString = item.id.toString();
        if (existingMap.has(idString)) {
            // If ID exists, add the relevancy values
            existingMap.get(idString).relevancy += item.relevancy;
        } else {
            // If ID doesn't exist, append the new item
            relevantIds.push(item);
        }
    });

    return relevantIds;
}
const db_read_modification = async (query, collection, limit=5)=>{
    try{
        if(Object.keys(query).length>0){
            
            const regis = indexer_registry.find((regis)=>regis.collection==collection)
            if(!regis){
                return query
            }
            let relevantIds=[]
            await Promise.all(Object.keys(query).map( async (element) => {
                const indexer = regis.indexers.find((indexer)=>indexer.attribute==element)
                console.log("query", element, indexer )
                if(indexer){
                    
                    const res = await indexer.connection.search(query[element])
                    mergeArrays(res, relevantIds)
                    
                 }

                 
            }))
            relevantIds.sort((a, b)=>{
                if(a.relevancy<b.relevancy) return 1
                if(a.relevancy>b.relevancy) return -1
                return 0
            }).splice(limit)
            query ={_id: {$in:relevantIds.map(r=>r.id)}}
            console.log(relevantIds)
            return {query, idsGrade: relevantIds}
            
        }
        return {query, idsGrade: relevantIds}

       
    
    }catch(e){
        console.log(e)
    }
}
module.exports = {
    
    db_read_modification
}
