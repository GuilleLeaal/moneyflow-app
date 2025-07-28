// routes/ingresoRoutes.ts
import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import {
  crearIngreso,
  obtenerIngresos,
  eliminarIngreso,
} from '../controllers/ingresosController';

const router = Router();

router.use(authMiddleware);

router.post('/', crearIngreso);
router.get('/', obtenerIngresos);
router.delete('/:id', eliminarIngreso);

export default router;
