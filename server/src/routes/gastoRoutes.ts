import express from 'express';
import { crearGasto, obtenerGastos, eliminarGasto } from '../controllers/gastoController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, crearGasto);
router.get('/', authMiddleware, obtenerGastos);
router.delete('/:id', authMiddleware, eliminarGasto);

export default router;
