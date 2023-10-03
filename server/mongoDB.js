const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI; // Use the same URI for both databases

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToKatalogObatDB() {
  try {
    await client.connect();
    console.log('MongoDB (katalog_obat) connected successfully');

    return client.db("katalog_obat");
  } catch (err) {
    console.error("Error connecting to MongoDB (katalog_obat):", err);
    throw err;
  }
}

async function connectToKasbonDB() {
  try {
    await client.connect();
    console.log('MongoDB (kasbon) connected successfully');

    return client.db("kasbon");
  } catch (err) {
    console.error("Error connecting to MongoDB (kasbon):", err);
    throw err;
  }
}

module.exports = { connectToKatalogObatDB, connectToKasbonDB, client };
