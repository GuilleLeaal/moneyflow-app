import { Request, Response } from 'express';
import Gasto from '../models/Gasto';

export const crearGasto = async (req: Request, res: Response) => {
  try {
    const { descripcion, monto, fecha } = req.body;
    const gasto = await Gasto.create({
      user: (req as any).user.id,
      descripcion,
      monto,
      fecha: fecha ? new Date(fecha) : new Date(),
    });
    res.status(201).json(gasto);
  } catch {
    res.status(500).json({ error: 'Error al crear gasto' });
  }
};

export const obtenerGastos = async (req: Request, res: Response) => {
  try {
    const gastos = await Gasto.find({ user: (req as any).user.id }).sort({ fecha: -1 });
    res.json(gastos);
  } catch {
    res.status(500).json({ error: 'Error al obtener gastos' });
  }
};

export const eliminarGasto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Gasto.findByIdAndDelete(id);
    res.json({ mensaje: 'Gasto eliminado' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar gasto' });
  }
};
