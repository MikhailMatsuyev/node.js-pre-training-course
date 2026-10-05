import "dotenv/config";

import { PrismaTodoRepository } from "./prisma-todo.repository";
import { PrismaService } from "./prisma.service";

describe("Task 05 - Prisma + PostgreSQL", () => {
  let prisma: PrismaService;
  let repository: PrismaTodoRepository;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();

    repository = new PrismaTodoRepository(prisma);
  });

  afterAll(async () => {
    await prisma.todo.deleteMany();
    await prisma.$disconnect();
  });

  it("creates and reads a Todo from PostgreSQL", async () => {
    const created = await repository.create({
      title: "Prisma Todo",
      description: "Stored in PostgreSQL",
      completed: false,
    });

    expect(created.id).toBeGreaterThan(0);
    expect(created.title).toBe("Prisma Todo");

    const found = await repository.findOneBy(created.id);

    expect(found).not.toBeNull();
    expect(found?.title).toBe("Prisma Todo");
    expect(found?.description).toBe("Stored in PostgreSQL");
  });

  it("updates a Todo in PostgreSQL", async () => {
    const created = await repository.create({
      title: "Before update",
      description: "Test",
      completed: false,
    });

    const updated = await repository.update(created.id, {
      title: "After update",
      completed: true,
    });

    expect(updated.title).toBe("After update");
    expect(updated.completed).toBe(true);
  });

  it("deletes a Todo from PostgreSQL", async () => {
    const created = await repository.create({
      title: "To delete",
      completed: false,
    });

    await repository.delete(created.id);

    const found = await repository.findOneBy(created.id);

    expect(found).toBeNull();
  });
});
