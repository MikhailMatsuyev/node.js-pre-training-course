const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            email: {
                in: [
                    'alice.seed@example.com',
                    'bob.seed@example.com',
                ],
            },
        },
        include: {
            todos: true,
        },
        orderBy: {
            id: 'asc',
        },
    });

    console.dir(users, { depth: null });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
