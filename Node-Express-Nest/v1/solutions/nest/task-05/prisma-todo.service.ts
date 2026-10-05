import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoResponseDto } from "./dto/todo-response.dto";
import { PrismaTodoRepository } from "./prisma-todo.repository";

@Injectable()
export class PrismaTodoService {
  constructor(
    private readonly todoRepository: PrismaTodoRepository,
  ) {}

  async create(dto: CreateTodoDto): Promise<TodoResponseDto> {
    const todo = await this.todoRepository.create({
      title: dto.title,
      description: dto.description,
      completed: dto.completed ?? false,
    });

    return this.toResponseDto(todo);
  }

  async findAll(): Promise<TodoResponseDto[]> {
    const todos = await this.todoRepository.findAll();

    return todos.map((todo) => this.toResponseDto(todo));
  }

  async findOne(id: number): Promise<TodoResponseDto> {
    const todo = await this.todoRepository.findOneBy(id);

    if (!todo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }

    return this.toResponseDto(todo);
  }

  async update(
    id: number,
    dto: UpdateTodoDto,
  ): Promise<TodoResponseDto> {
    const existing = await this.todoRepository.findOneBy(id);

    if (!existing) {
      throw new NotFoundException(`Todo ${id} not found`);
    }

    const updated = await this.todoRepository.update(id, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && {
        description: dto.description,
      }),
      ...(dto.completed !== undefined && {
        completed: dto.completed,
      }),
    });

    return this.toResponseDto(updated);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.todoRepository.findOneBy(id);

    if (!existing) {
      throw new NotFoundException(`Todo ${id} not found`);
    }

    await this.todoRepository.delete(id);
  }

  private toResponseDto(todo: {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): TodoResponseDto {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description ?? undefined,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    };
  }
}
