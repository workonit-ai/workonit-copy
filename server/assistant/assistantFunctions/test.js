const { MongoClient } = require('mongodb');

// Hardcoded URI and collection name
const uri = "mongodb+srv://admin:admin@work-on-it-cluster.pq6ff0t.mongodb.net/workonit-ai";
const dbName = "workonit-ai";
const collectionName = "Business";

async function testBusinessCollection() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbName);
    const businessCollection = database.collection(collectionName);

    // Count documents in the collection
    const count = await businessCollection.countDocuments();
    console.log(`Number of documents in ${collectionName} collection: ${count}`);

    // Find all businesses
    const businesses = await businessCollection.find({}).toArray();
    console.log('All businesses:');
    businesses.forEach((business, index) => {
      console.log(`${index + 1}. Name: ${business.name}, Email: ${business.email}, ID: ${business._id}`);
    });

    // Find a specific business by name (replace 'Example Business' with a name you expect to find)
    const specificBusiness = await businessCollection.findOne({ name: 'Example Business' });
    if (specificBusiness) {
      console.log('\nFound specific business:');
      console.log(`Name: ${specificBusiness.name}, Email: ${specificBusiness.email}, ID: ${specificBusiness._id}`);
    } else {
      console.log('\nSpecific business not found');
    }

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

testBusinessCollection().catch(console.error);