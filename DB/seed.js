const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const seedEmails = [
        'alice.seed@example.com',
        'bob.seed@example.com',
    ];

    await prisma.todo.deleteMany({
        where: {
            user: {
                email: {
                    in: seedEmails,
                },
            },
        },
    });

    await prisma.user.deleteMany({
        where: {
            email: {
                in: seedEmails,
            },
        },
    });

    const users = [
        {
            name: 'Alice',
            email: 'alice.seed@example.com',
        },
        {
            name: 'Bob',
            email: 'bob.seed@example.com',
        },
    ];

    for (const userData of users) {
        const user = await prisma.user.create({
            data: userData,
        });

        await prisma.todo.createMany({
            data: [
                {
                    title: `${user.name} task 1`,
                    description: 'First seed task',
                    status: 'active',
                    user_id: user.id,
                },
                {
                    title: `${user.name} task 2`,
                    description: 'Second seed task',
                    status: 'active',
                    user_id: user.id,
                },
                {
                    title: `${user.name} task 3`,
                    description: 'Third seed task',
                    status: 'completed',
                    user_id: user.id,
                },
            ],
        });
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
