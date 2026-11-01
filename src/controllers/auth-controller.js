import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
import { User } from '../models/user-model.js';

const toPublicUser = ({ _id, name, email }) => ({ id: _id, name, email });

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ message: 'Escribe tu correo y tu contraseña' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    const isValid = user && (await bcrypt.compare(password, user.passwordHash));

    // Mismo mensaje en los dos casos para no revelar que correos existen
    if (!isValid) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign({ sub: user.id, name: user.name }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(200).json({ token, user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: 'Tu sesión ya no es válida' });
    }

    return res.status(200).json({ user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
};
