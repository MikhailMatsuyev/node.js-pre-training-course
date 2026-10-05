import "dotenv/config";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { PrismaService } from "./prisma.service";
import { TodoModule } from "./todo.module";

describe("Task 05 - Prisma HTTP", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TodoModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.todo.deleteMany();
    await app.close();
  });

  it("performs full Todo CRUD through HTTP", async () => {
    // CREATE
    const createResponse = await request(app.getHttpServer())
      .post("/prisma-todos")
      .send({
        title: "HTTP Prisma Todo",
        description: "Created through HTTP",
      })
      .expect(201);

    const created = createResponse.body;

    expect(created.id).toBeGreaterThan(0);
    expect(created.title).toBe("HTTP Prisma Todo");
    expect(created.completed).toBe(false);

    // READ
    const getResponse = await request(app.getHttpServer())
      .get(`/prisma-todos/${created.id}`)
      .expect(200);

    expect(getResponse.body.id).toBe(created.id);
    expect(getResponse.body.title).toBe("HTTP Prisma Todo");

    // UPDATE
    const updateResponse = await request(app.getHttpServer())
      .put(`/prisma-todos/${created.id}`)
      .send({
        title: "Updated Prisma Todo",
        completed: true,
      })
      .expect(200);

    expect(updateResponse.body.id).toBe(created.id);
    expect(updateResponse.body.title).toBe("Updated Prisma Todo");
    expect(updateResponse.body.completed).toBe(true);

    // DELETE
    await request(app.getHttpServer())
      .delete(`/prisma-todos/${created.id}`)
      .expect(200);

    // VERIFY DELETE
    await request(app.getHttpServer())
      .get(`/prisma-todos/${created.id}`)
      .expect(404);
  });
});
