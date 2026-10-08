const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // CREATE
    const createdTodo = await prisma.todo.create({
        data: {
            title: 'Task 08 Todo',
            description: 'Todo created with Prisma ORM',
            status: 'active',
            user_id: 4,
        },
    });

    console.log('CREATE:');
    console.log(createdTodo);

    // READ
    const readTodo = await prisma.todo.findUnique({
        where: {
            id: createdTodo.id,
        },
    });

    console.log('\nREAD:');
    console.log(readTodo);

    // UPDATE
    const updatedTodo = await prisma.todo.update({
        where: {
            id: createdTodo.id,
        },
        data: {
            status: 'completed',
        },
    });

    console.log('\nUPDATE:');
    console.log(updatedTodo);

    // DELETE
    await prisma.todo.delete({
        where: {
            id: createdTodo.id,
        },
    });

    console.log('\nDELETE:');
    console.log(`Todo ${createdTodo.id} deleted`);

    // READ AFTER DELETE
    const deletedTodo = await prisma.todo.findUnique({
        where: {
            id: createdTodo.id,
        },
    });

    console.log('\nREAD AFTER DELETE:');
    console.log(deletedTodo);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
