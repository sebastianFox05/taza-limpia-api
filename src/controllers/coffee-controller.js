import mongoose from 'mongoose';

import { Activity } from '../models/activity-model.js';
import { Coffee, COFFEE_PROCESSES, COFFEE_ROASTS } from '../models/coffee-model.js';
import { runTransaction } from '../utils/run-transaction.js';

const EDITABLE_FIELDS = [
  'name', 'country', 'region', 'variety', 'process', 'roast', 'altitude',
  'score', 'notes', 'description', 'brewMethod', 'imageUrl', 'isFeatured', 'isDecaf',
];

const SORT_OPTIONS = {
  score: { score: -1, name: 1 },
  altitude: { altitude: -1, name: 1 },
  name: { name: 1 },
  recent: { createdAt: -1 },
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Solo paso los campos permitidos, asi nadie cuela _id o timestamps desde el body
const pickEditableFields = (body = {}) =>
  Object.fromEntries(EDITABLE_FIELDS.filter((field) => field in body).map((field) => [field, body[field]]));

// ?q=a&q=b llega como array y romperia el regex, asi que me quedo solo con los textos
const readTextParams = (query) =>
  Object.fromEntries(Object.entries(query).filter(([, value]) => typeof value === 'string'));

const buildFilters = (query) => {
  const { q, country, process, roast, minScore, isFeatured } = readTextParams(query);
  const filters = {};

  if (q) {
    const text = new RegExp(escapeRegex(q), 'i');
    filters.$or = [{ name: text }, { country: text }, { region: text }, { notes: text }];
  }
  if (country) filters.country = country;
  if (process) filters.process = { $in: process.split(',').filter((item) => COFFEE_PROCESSES.includes(item)) };
  if (roast) filters.roast = { $in: roast.split(',').filter((item) => COFFEE_ROASTS.includes(item)) };
  if (Number(minScore)) filters.score = { $gte: Number(minScore) };
  if (isFeatured === 'true') filters.isFeatured = true;

  return filters;
};

const isValidId = (id) => mongoose.isValidObjectId(id);

export const getCoffees = async (req, res, next) => {
  try {
    const sort = Object.hasOwn(SORT_OPTIONS, String(req.query.sort))
      ? SORT_OPTIONS[req.query.sort]
      : SORT_OPTIONS.score;
    const coffees = await Coffee.find(buildFilters(req.query)).sort(sort).limit(100);

    return res.status(200).json({ total: coffees.length, coffees });
  } catch (error) {
    return next(error);
  }
};

export const getCoffeeById = async (req, res, next) => {
  try {
    const coffee = isValidId(req.params.id) ? await Coffee.findById(req.params.id) : null;

    if (!coffee) {
      return res.status(404).json({ message: 'No encontramos ese café' });
    }

    return res.status(200).json({ coffee });
  } catch (error) {
    return next(error);
  }
};

export const createCoffee = async (req, res, next) => {
  try {
    const coffee = await runTransaction(async (session) => {
      const [created] = await Coffee.create([pickEditableFields(req.body)], { session });
      await Activity.create(
        [{ action: 'creado', coffeeName: created.name, userName: req.user.name }],
        { session },
      );
      return created;
    });

    return res.status(201).json({ coffee });
  } catch (error) {
    return next(error);
  }
};

export const updateCoffee = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'No encontramos ese café' });
    }

    const changes = pickEditableFields(req.body);

    if (Object.keys(changes).length === 0) {
      return res.status(400).json({ message: 'No has enviado ningún dato para cambiar' });
    }

    const coffee = await runTransaction(async (session) => {
      const updated = await Coffee.findByIdAndUpdate(req.params.id, changes, {
        returnDocument: 'after',
        runValidators: true,
        session,
      });

      if (updated) {
        await Activity.create(
          [{ action: 'editado', coffeeName: updated.name, userName: req.user.name }],
          { session },
        );
      }
      return updated;
    });

    if (!coffee) {
      return res.status(404).json({ message: 'No encontramos ese café' });
    }

    return res.status(200).json({ coffee });
  } catch (error) {
    return next(error);
  }
};

export const deleteCoffee = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: 'No encontramos ese café' });
    }

    const coffee = await runTransaction(async (session) => {
      const deleted = await Coffee.findByIdAndDelete(req.params.id, { session });

      if (deleted) {
        await Activity.create(
          [{ action: 'eliminado', coffeeName: deleted.name, userName: req.user.name }],
          { session },
        );
      }
      return deleted;
    });

    if (!coffee) {
      return res.status(404).json({ message: 'No encontramos ese café' });
    }

    return res.status(200).json({ message: `${coffee.name} se eliminó de la guía` });
  } catch (error) {
    return next(error);
  }
};
