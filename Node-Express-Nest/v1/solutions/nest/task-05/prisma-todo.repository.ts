import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { TodoEntity } from "./todo.entity";

@Injectable()
export class PrismaTodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<TodoEntity, "id" | "createdAt" | "updatedAt">) {
    return this.prisma.todo.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.todo.findMany({
      orderBy: { id: "asc" },
    });
  }

  async findOneBy(id: number) {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<TodoEntity>) {
    return this.prisma.todo.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
