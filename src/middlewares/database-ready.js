import { connectDatabase } from '../config/database.js';

export const databaseReady = async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
};
