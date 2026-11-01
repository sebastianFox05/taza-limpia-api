import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env.js';

export const requireAuth = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Necesitas iniciar sesión' });
  }

  try {
    const { sub, name } = jwt.verify(token, JWT_SECRET);
    req.user = { id: sub, name };
    return next();
  } catch {
    return res.status(401).json({ message: 'Tu sesión ha caducado, vuelve a entrar' });
  }
};
