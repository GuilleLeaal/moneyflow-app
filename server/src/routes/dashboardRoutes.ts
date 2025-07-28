import { Router } from 'express';
import { obtenerResumen } from '../controllers/dashboardController';
import auth from '../middleware/authMiddleware';

const router = Router();

router.get('/resumen', auth, obtenerResumen);

export default router;
