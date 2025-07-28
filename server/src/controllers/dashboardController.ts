import { Request, Response } from 'express';
import Ingreso from '../models/Ingreso';
import Gasto from '../models/Gasto';

export const obtenerResumen = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const ingresos = await Ingreso.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$monto' } } }
    ]);

    const gastos = await Gasto.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$monto' } } }
    ]);

    const ingresosTotales = ingresos[0]?.total || 0;
    const gastosTotales = gastos[0]?.total || 0;

    res.json({
      ingresosTotales,
      gastosTotales,
      balance: ingresosTotales - gastosTotales
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el resumen' });
  }
};
