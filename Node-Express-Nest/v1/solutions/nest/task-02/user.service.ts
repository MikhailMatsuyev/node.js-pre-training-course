import { Injectable } from "@nestjs/common";
import { LoggerService } from "./logger.service";

export interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * UserService
 *
 * Middle link of the chain: depends on `LoggerService` via
 * constructor injection, and is itself depended on by
 * `AuditService`. Manages an in-memory list of users.
 */
@Injectable()
export class UserService {
  private readonly users: User[] = [];
  private nextId = 1;

  constructor(private readonly logger: LoggerService) {}

  /**
   * Create a new user.
   *
   * 1. Build a `User` object using `this.nextId++` as the id.
   * 2. Push it into `this.users`.
   * 3. Log the creation via `this.logger.log('UserService', ...)`.
   * 4. Return the created user.
   */
  createUser(name: string, email: string): User {
    const user: User = {
      id: this.nextId++,
      name,
      email,
    };

    this.users.push(user);
    this.logger.log("UserService", `Created user ${user.id}: ${user.name}`);

    return user;
  }

  /**
   * Find a user by id.
   *
   * 1. Search `this.users` for a matching `id`.
   * 2. Return the user, or `undefined` if not found.
   */
  findById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  /**
   * Return every user currently stored.
   */
  findAll(): User[] {
    return this.users;
  }
}
