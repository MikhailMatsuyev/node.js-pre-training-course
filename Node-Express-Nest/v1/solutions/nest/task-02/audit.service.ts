import { Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "./user.service";

export interface AuditEntry {
  id: number;
  userId: number;
  action: string;
  timestamp: Date;
}

/**
 * AuditService
 *
 * Top of the chain: AuditService -> UserService -> LoggerService.
 * Notice that `AuditService` never injects `LoggerService` directly -
 * it only knows about `UserService`. This is exactly what makes the
 * chain interesting to test: to unit-test `AuditService` in
 * isolation you only need to mock `UserService` (see task-02.spec.ts),
 * you never have to touch `LoggerService` at all.
 */
@Injectable()
export class AuditService {
  private readonly entries: AuditEntry[] = [];
  private nextId = 1;

  constructor(private readonly userService: UserService) {}

  /**
   * Record that `action` happened for `userId`.
   *
   * 1. Verify the user exists via `this.userService.findById(userId)`.
   *    If it does not, throw a `NotFoundException`.
   * 2. Build an `AuditEntry` (id, userId, action, timestamp = new Date()).
   * 3. Push it into `this.entries`.
   * 4. Return the created entry.
   */
  recordAction(userId: number, action: string): AuditEntry {
    const user = this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const entry: AuditEntry = {
      id: this.nextId++,
      userId,
      action,
      timestamp: new Date(),
    };

    this.entries.push(entry);

    return entry;
  }

  /**
   * Return all audit entries recorded for a given user.
   */
  getLogForUser(userId: number): AuditEntry[] {
    return this.entries.filter((entry) => entry.userId === userId);
  }

  /**
   * Return every audit entry recorded so far.
   */
  getAllLogs(): AuditEntry[] {
    return this.entries;
  }
}
