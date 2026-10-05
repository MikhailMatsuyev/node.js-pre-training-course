import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoResponseDto } from "./dto/todo-response.dto";
import { PrismaTodoService } from "./prisma-todo.service";

@Controller("prisma-todos")
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
export class PrismaTodoController {
  constructor(
    private readonly todoService: PrismaTodoService,
  ) {}

  @Post()
  create(@Body() dto: CreateTodoDto): Promise<TodoResponseDto> {
    return this.todoService.create(dto);
  }

  @Get()
  findAll(): Promise<TodoResponseDto[]> {
    return this.todoService.findAll();
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<TodoResponseDto> {
    return this.todoService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoResponseDto> {
    return this.todoService.update(id, dto);
  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    return this.todoService.remove(id);
  }
}
