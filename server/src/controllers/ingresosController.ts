import { Request, Response } from 'express';
import Ingreso from '../models/Ingreso';

export const crearIngreso = async (req: Request, res: Response) => {
  try {
    const { descripcion, monto, fecha } = req.body;

    const ingreso = await Ingreso.create({
      user: req.user!.id,
      descripcion,
      monto,
      fecha: fecha ? new Date(fecha) : new Date(),
    });

    res.status(201).json(ingreso);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear ingreso' });
  }
};

export const obtenerIngresos = async (req: Request, res: Response) => {
  try {
    const ingresos = await Ingreso.find({ user: req.user!.id }).sort({ fecha: -1 });
    res.json(ingresos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ingresos' });
  }
};

export const eliminarIngreso = async (req: Request, res: Response) => {
  try {
    const ingreso = await Ingreso.findOneAndDelete({
      _id: req.params.id,
      user: req.user!.id,
    });

    if (!ingreso) {
      return res.status(404).json({ error: 'Ingreso no encontrado' });
    }

    res.json({ message: 'Ingreso eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar ingreso' });
  }
};
