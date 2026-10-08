const { createClient } = require('redis');

const redisClient = createClient({
    url: 'redis://localhost:6379',
});

redisClient.on('error', (error) => {
    console.error('Redis Client Error:', error);
});

async function main() {
    await redisClient.connect();

    console.log('Redis connected');

    await redisClient.set('test:key', 'Hello Redis');

    const value = await redisClient.get('test:key');

    console.log('Value from Redis:', value);

    await redisClient.del('test:key');

    await redisClient.quit();
}

main().catch(console.error);
