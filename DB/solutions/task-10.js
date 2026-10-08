const { PrismaClient } = require('@prisma/client');
const { createClient } = require('redis');

const prisma = new PrismaClient();

const redisClient = createClient({
    url: 'redis://localhost:6379',
});

redisClient.on('error', (error) => {
    console.error('Redis Client Error:', error);
});

async function getUserTodos(userId) {
    const cacheKey = `todos:user:${userId}`;

    const cachedTodos = await redisClient.get(cacheKey);

    if (cachedTodos) {
        console.log('CACHE HIT');

        return JSON.parse(cachedTodos);
    }

    console.log('CACHE MISS');

    const todos = await prisma.todo.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            id: 'asc',
        },
    });

    await redisClient.set(cacheKey, JSON.stringify(todos), {
        EX: 300,
    });

    return todos;
}

async function invalidateUserTodosCache(userId) {
    const cacheKey = `todos:user:${userId}`;

    await redisClient.del(cacheKey);

    console.log('CACHE INVALIDATED');
}

async function createTodo(userId) {
    const todo = await prisma.todo.create({
        data: {
            title: 'Task 10 Created Todo',
            description: 'Todo created for cache invalidation test',
            status: 'active',
            user_id: userId,
        },
    });

    await invalidateUserTodosCache(userId);

    console.log('TODO CREATED:');
    console.log(todo);

    return todo;
}

async function updateTodo(todoId, userId) {
    const updatedTodo = await prisma.todo.update({
        where: {
            id: todoId,
        },
        data: {
            status: 'completed',
        },
    });

    await invalidateUserTodosCache(userId);

    console.log('TODO UPDATED:');
    console.log(updatedTodo);

    return updatedTodo;
}

async function deleteTodo(todoId, userId) {
    const deletedTodo = await prisma.todo.delete({
        where: {
            id: todoId,
        },
    });

    await invalidateUserTodosCache(userId);

    console.log('TODO DELETED:');
    console.log(deletedTodo);

    return deletedTodo;
}

async function main() {
    await redisClient.connect();

    console.log('\nFIRST GET:');
    const todos = await getUserTodos(4);
    console.log(todos);

    console.log('\nSECOND GET:');
    const cachedTodos = await getUserTodos(4);
    console.log(cachedTodos);

    console.log('\nCREATE:');
    const createdTodo = await createTodo(4);

    console.log('\nUPDATE:');
    await updateTodo(createdTodo.id, 4);

    console.log('\nDELETE:');
    await deleteTodo(createdTodo.id, 4);

    console.log('\nGET AFTER INVALIDATION:');
    const todosAfterInvalidation = await getUserTodos(4);
    console.log(todosAfterInvalidation);

    await redisClient.quit();
    await prisma.$disconnect();
}

main().catch(console.error);
