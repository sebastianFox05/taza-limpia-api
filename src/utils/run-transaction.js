import mongoose from 'mongoose';

// Si algo falla dentro de work se deshace todo, cafe e historial
export const runTransaction = async (work) => {
  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      result = await work(session);
    });
  } finally {
    await session.endSession();
  }

  return result;
};
