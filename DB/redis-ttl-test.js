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

    await redisClient.set('ttl:test', 'Hello TTL', {
        EX: 10,
    });

    console.log('Value:', await redisClient.get('ttl:test'));
    console.log('TTL:', await redisClient.ttl('ttl:test'));

    await new Promise((resolve) => setTimeout(resolve, 12000));

    console.log('Value after TTL:', await redisClient.get('ttl:test'));

    await redisClient.quit();
}

main().catch(console.error);
