import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import ingresosRoutes from './routes/ingresosRoutes';
import gastoRoutes from './routes/gastoRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ingresos', ingresosRoutes);
app.use('/api/gastos', gastoRoutes);
app.use('/api/dashboard', dashboardRoutes);

mongoose
  .connect('mongodb://127.0.0.1:27017/moneyflow')
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch((err) => console.error('Error al conectar con MongoDB:', err));
