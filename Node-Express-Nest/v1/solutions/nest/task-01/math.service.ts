import { Injectable } from "@nestjs/common";
import { LoggerService } from "./logger.service";

/**
 * MathService
 *
 * A plain (non-controller) provider that performs the actual math
 * and also depends on `LoggerService`. This proves DI works the same
 * way for services as it does for controllers - both simply declare
 * the dependency in their constructor and Nest resolves it from the
 * module graph.
 */
@Injectable()
export class MathService {
  constructor(private readonly logger: LoggerService) {}

  /**
   * Add two numbers.
   *
   * 1. Log the operation via `this.logger.log('MathService', ...)`.
   * 2. Return the sum.
   */
  add(a: number, b: number): number {
    const result = a + b;
    this.logger.log("MathService", `add: ${a} + ${b} = ${result}`);
    return result;
  }

  /**
   * Subtract b from a.
   *
   * 1. Log the operation.
   * 2. Return the difference.
   */
  subtract(a: number, b: number): number {
    const result = a - b;
    this.logger.log("MathService", `subtract: ${a} - ${b} = ${result}`);
    return result;
  }

  /**
   * Multiply two numbers.
   *
   * 1. Log the operation.
   * 2. Return the product.
   */
  multiply(a: number, b: number): number {
    const result = a * b;
    this.logger.log("MathService", `multiply: ${a} * ${b} = ${result}`);
    return result;
  }

  /**
   * Divide a by b.
   *
   * 1. If `b === 0`, log an error via `this.logger.error(...)` and
   *    throw an error (e.g. `new Error('Division by zero')`).
   * 2. Otherwise log the operation and return the quotient.
   */
  divide(a: number, b: number): number {
    if (b === 0) {
      this.logger.error("MathService", "Division by zero");
      throw new Error("Cannot divide by zero");
    }

    const result = a / b;
    this.logger.log("MathService", `divide: ${a} / ${b} = ${result}`);
    return result;
  }
}
