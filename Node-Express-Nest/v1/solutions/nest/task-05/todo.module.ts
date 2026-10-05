import { Module } from "@nestjs/common";
import { TodoController } from "./todo.controller";
import { TodoService } from "./todo.service";
import { TodoRepository } from "./todo.repository";
import { PrismaService } from "./prisma.service";
import { PrismaTodoRepository } from "./prisma-todo.repository";
import { PrismaTodoController } from "./prisma-todo.controller";
import { PrismaTodoService } from "./prisma-todo.service";

/**
 * TodoModule
 *
 * TODO: register `TodoController` in `controllers`, and both
 * `TodoService` and `TodoRepository` in `providers`.
 *
 * If/when you swap `TodoRepository` for a real TypeORM repository,
 * this is also where you would add
 * `imports: [TypeOrmModule.forFeature([TodoEntity])]`.
 */
@Module({
  controllers: [TodoController, PrismaTodoController],
  providers: [TodoService, TodoRepository, PrismaService, PrismaTodoRepository, PrismaTodoService],
})
export class TodoModule {}
