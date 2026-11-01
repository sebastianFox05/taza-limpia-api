import mongoose from 'mongoose';

export const COFFEE_PROCESSES = ['lavado', 'natural', 'honey', 'anaerobico', 'descascarado-humedo'];
export const COFFEE_ROASTS = ['claro', 'medio', 'oscuro'];

// altitude y score son enteros: Mongoose solo tiene Number, el validador hace el resto
const coffeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'El nombre es obligatorio'], trim: true, maxlength: 80 },
    country: { type: String, required: [true, 'El país es obligatorio'], trim: true, maxlength: 60 },
    region: { type: String, required: [true, 'La región es obligatoria'], trim: true, maxlength: 80 },
    variety: { type: String, required: [true, 'La variedad es obligatoria'], trim: true, maxlength: 60 },
    process: {
      type: String,
      required: [true, 'El proceso es obligatorio'],
      enum: { values: COFFEE_PROCESSES, message: 'Ese proceso no existe' },
    },
    roast: {
      type: String,
      required: [true, 'El tueste es obligatorio'],
      enum: { values: COFFEE_ROASTS, message: 'Ese tueste no existe' },
    },
    altitude: {
      type: Number,
      required: [true, 'La altitud es obligatoria'],
      min: [0, 'La altitud no puede ser negativa'],
      max: [3000, 'Ningún café crece tan alto'],
      validate: { validator: Number.isInteger, message: 'La altitud va en metros enteros' },
    },
    score: {
      type: Number,
      required: [true, 'La puntuación es obligatoria'],
      min: [80, 'Por debajo de 80 no se considera especialidad'],
      max: [100, 'La puntuación llega hasta 100'],
      validate: { validator: Number.isInteger, message: 'La puntuación va sin decimales' },
    },
    notes: {
      type: [{ type: String, trim: true, maxlength: 30 }],
      validate: { validator: (notes) => notes.length > 0, message: 'Añade al menos una nota de cata' },
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: 600,
    },
    brewMethod: { type: String, trim: true, maxlength: 60, default: '' },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (url) => url === '' || /^https?:\/\//i.test(url),
        message: 'La imagen debe ser una URL http o https',
      },
    },
    isFeatured: { type: Boolean, default: false },
    isDecaf: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Coffee = mongoose.model('Coffee', coffeeSchema);
