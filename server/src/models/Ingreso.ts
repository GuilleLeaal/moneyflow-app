import mongoose from 'mongoose';

const ingresoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    descripcion: { type: String, required: true },
    monto: { type: Number, required: true },
    fecha: { type: Date, default: Date.now, },
  },
  { timestamps: true }
);

export default mongoose.model('Ingreso', ingresoSchema);
