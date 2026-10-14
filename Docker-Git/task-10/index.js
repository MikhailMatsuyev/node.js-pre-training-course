const { MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://mongodb:27017';
const client = new MongoClient(MONGO_URL);

async function start() {
    try {
        await client.connect();

        console.log('Connected to MongoDB');

        const db = client.db('task10');
        await db.command({ ping: 1 });

        console.log('MongoDB ping successful');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
}

start();
