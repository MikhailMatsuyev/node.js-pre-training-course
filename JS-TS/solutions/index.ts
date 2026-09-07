#!/usr/bin/env ts-node

import { ToDoManager } from './todo-manager';

async function main(): Promise<void> {
  const manager = new ToDoManager();
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case 'init':
      await manager.init();
      console.log('Demo data initialized');
      break;

    case 'add':
      await manager.add(args[0], args[1]);
      console.log('Todo added');
      break;

    case 'complete':
      await manager.complete(Number(args[0]));
      console.log('Todo completed');
      break;

    case 'list': {
      const todos = await manager.list();
      console.log(todos);
      break;
    }

    default:
      console.log('Usage: init | add <title> [description] | complete <id> | list');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
