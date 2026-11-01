// Carga los cafes y usuarios de /data. Hace upsert, asi que no borra nada de lo que ya exista.
// Hecho con ayuda de IA: los textos de las fichas en data/coffees.json
import { readFile } from 'node:fs/promises';

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import { connectDatabase } from '../src/config/database.js';
import { SEED_PASSWORD } from '../src/config/env.js';
import { Coffee } from '../src/models/coffee-model.js';
import { User } from '../src/models/user-model.js';
import { logger } from '../src/utils/logger.js';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));

const seed = async () => {
  if (!SEED_PASSWORD) {
    throw new Error('Define SEED_PASSWORD en el .env antes de cargar los usuarios');
  }

  await connectDatabase();

  const coffees = await readJson('../data/coffees.json');
  const users = await readJson('../data/users.json');
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  await Coffee.bulkWrite(
    coffees.map((coffee) => ({
      updateOne: { filter: { name: coffee.name }, update: { $set: coffee }, upsert: true },
    })),
  );
  await User.bulkWrite(
    users.map((user) => ({
      updateOne: { filter: { email: user.email }, update: { $set: { ...user, passwordHash } }, upsert: true },
    })),
  );

  logger.info(`Listo: ${coffees.length} cafes y ${users.length} usuarios`);
};

seed()
  .catch((error) => {
    logger.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
