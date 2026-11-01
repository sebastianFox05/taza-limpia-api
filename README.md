# Taza Limpia API

API REST de Taza Limpia, una guía de cafés de especialidad. Express, Mongoose y MongoDB Atlas.

## Puesta en marcha

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

Sin Atlas, `npm run db:local` levanta un MongoDB en memoria con la URI que trae `.env.example`. Sus datos se pierden al cerrarlo.

## Variables de entorno

| Variable | Para qué sirve |
| --- | --- |
| `PORT` | Puerto en local |
| `MONGODB_URI` | Conexión a MongoDB. Las transacciones necesitan un replica set, Atlas ya lo es |
| `JWT_SECRET` | Firma de los tokens |
| `JWT_EXPIRES_IN` | Duración de la sesión |
| `CLIENT_URLS` | Orígenes permitidos por CORS, separados por comas |
| `SEED_PASSWORD` | Contraseña de los tres usuarios que crea `npm run seed` |

## Rutas

| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/auth/login` | Público |
| GET | `/auth/me` | Con token |
| GET | `/coffees` (`q`, `country`, `process`, `roast`, `minScore`, `isFeatured`, `sort`) | Público |
| GET | `/coffees/:id` | Público |
| POST, PUT, DELETE | `/coffees`, `/coffees/:id` | Con token |
| GET | `/stats` | Público |
| GET | `/stats/activity` | Con token |

Las peticiones de prueba están en `requests/` (`.http` y colección de Postman) y la copia de los datos en `data/`.

## Despliegue

Se despliega en Vercel tal cual: `api/index.js` exporta la app y `vercel.json` le manda todas las rutas. Hay que configurar las variables de entorno en el proyecto y permitir el acceso de red a Atlas.
