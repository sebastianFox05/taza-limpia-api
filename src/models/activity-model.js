import mongoose from 'mongoose';

// Historial del panel: se escribe en la misma transaccion que el cambio del cafe
const activitySchema = new mongoose.Schema(
  {
    action: { type: String, required: true, enum: ['creado', 'editado', 'eliminado'] },
    coffeeName: { type: String, required: true },
    userName: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Activity = mongoose.model('Activity', activitySchema);
