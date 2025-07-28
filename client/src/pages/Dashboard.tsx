import { useEffect, useState } from 'react';
import { obtenerIngresos, obtenerGastos } from '../../api';
import styles from '../styles/dashboard.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface Movimiento {
  monto: number;
  fecha: string;
  descripcion?: string;
}

const Dashboard = () => {
  const [ingresos, setIngresos] = useState<Movimiento[]>([]);
  const [gastos, setGastos] = useState<Movimiento[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ingresosData = await obtenerIngresos();
        const gastosData = await obtenerGastos();
        setIngresos(ingresosData);
        setGastos(gastosData);
      } catch (err) {
        setError('Error al cargar el dashboard');
      }
    };
    fetchData();
  }, []);

  const totalIngresos = ingresos.reduce((acc, i) => acc + i.monto, 0);
  const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);
  const balance = totalIngresos - totalGastos;

  const fechasOrdenadas = Array.from(
    new Set([...ingresos, ...gastos].map((mov) => new Date(mov.fecha)))
  ).sort((a, b) => a.getTime() - b.getTime());

  const fechasUnicas = fechasOrdenadas.map((fecha) =>
    fecha.toLocaleDateString('es-ES')
  );

  const ingresosPorFecha = fechasUnicas.map((fecha) =>
    ingresos.filter((i) => new Date(i.fecha).toLocaleDateString('es-ES') === fecha)
      .reduce((sum, i) => sum + i.monto, 0)
  );

  const gastosPorFecha = fechasUnicas.map((fecha) =>
    gastos.filter((g) => new Date(g.fecha).toLocaleDateString('es-ES') === fecha)
      .reduce((sum, g) => sum + g.monto, 0)
  );

  const chartData = {
    labels: fechasUnicas,
    datasets: [
      {
        label: 'Ingresos',
        data: ingresosPorFecha,
        fill: true,
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        borderColor: '#2ecc71',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Gastos',
        data: gastosPorFecha,
        fill: true,
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderColor: '#e74c3c',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: { size: 14 },
        },
      },
      tooltip: {
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#555',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#ccc' },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: {
          color: '#ccc',
          callback: (value: any) => `$${value}`,
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  const ultimosMovimientos = [...ingresos, ...gastos]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  const getEmoji = (mov: Movimiento) => (ingresos.includes(mov) ? '💰' : '💸');

  return (
    <div className={styles.container}>
      <h2 className={`${styles.title} ${styles.animateTitle}`}>📊 Dashboard Financiero</h2>
      <p className={styles.subtitle}>Resumen general de tus finanzas personales</p>

      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.cardIngresos} ${styles.fadeInUp}`}>
          <h3>💰 Ingresos</h3>
          <p className={styles.monto}>+ ${totalIngresos.toFixed(2)}</p>
        </div>
        <div
          className={`${styles.card} ${styles.cardGastos} ${styles.fadeInUp}`}
          style={{ animationDelay: '0.1s' }}
        >
          <h3>💸 Gastos</h3>
          <p className={styles.monto}>- ${totalGastos.toFixed(2)}</p>
        </div>
        <div
          className={`${styles.card} ${styles.cardBalance} ${styles.fadeInUp}`}
          style={{ animationDelay: '0.2s' }}
        >
          <h3>📈 Balance</h3>
          <p
            className={styles.monto}
            style={{ color: balance >= 0 ? '#2ecc71' : '#e74c3c' }}
          >
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className={`${styles.chartContainer} ${styles.fadeInChart}`}>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>🕓 Últimos movimientos</h3>
        <ul className={styles.movimientos}>
          {ultimosMovimientos.map((mov, idx) => (
            <li key={idx} className={styles.movimiento}>
              <span className={styles.movFecha}>
                {new Date(mov.fecha).toLocaleDateString('es-ES')}
              </span>
              <span
                className={styles.movMonto}
                style={{ color: ingresos.includes(mov) ? '#2ecc71' : '#e74c3c' }}
              >
                {getEmoji(mov)} {ingresos.includes(mov) ? '+' : '-'}${mov.monto}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
