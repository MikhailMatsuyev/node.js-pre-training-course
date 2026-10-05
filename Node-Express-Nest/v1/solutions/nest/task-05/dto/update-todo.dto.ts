/**
 * UpdateTodoDto - external request shape for `PUT /todos/:id`.
 *
 * TODO: same fields as `CreateTodoDto`, all optional.
 */

import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
