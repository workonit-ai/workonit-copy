
const config = require('../config')
const {Indexer} = require('./Indexer')
require('../db')
const locationIndexer = new Indexer({name:"location", explain: "location or places near by" })

const locationIndexerJob = async ()=>{
    console.log("running")
    const { MongoClient, ObjectId } = require('mongodb');
    const client = new MongoClient(config.db.uri);
    const database = client.db(config.db.database);
    const collection = database.collection("jobs")
    const res = await collection.find({
        ["indexer-location"]: { $exists: false }
      }).toArray()
    console.log("res", res)
    res.map((item)=>locationIndexer.Jobevent( item, "jobs"))
    
    // const parseIndexer = await locationIndexer.parseToTags("i want to work in pardes hana")
    // console.log("parseIndexer", parseIndexer)
}

module.exports = {

    locationIndexer
}