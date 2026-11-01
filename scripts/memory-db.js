// MongoDB en memoria para trabajar sin Atlas. Es un replica set porque las transacciones lo necesitan.
// Al cerrar el proceso se pierde todo, hay que volver a lanzar npm run seed.
import { MongoMemoryReplSet } from 'mongodb-memory-server';

const server = await MongoMemoryReplSet.create({
  replSet: { name: 'local', count: 1 },
  instanceOpts: [{ port: 27027 }],
});

process.stdout.write(`MongoDB local en ${server.getUri('taza-limpia')}\n`);

process.on('SIGINT', async () => {
  await server.stop();
  process.exit(0);
});
