import { useState, useEffect } from 'react';
import { obtenerIngresos, obtenerGastos } from '../../api';
import styles from '../styles/reporte.module.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type Movimiento = {
    _id: string;
    descripcion: string;
    monto: number;
    fecha: string;
};

const Reportes = () => {
    const [ingresos, setIngresos] = useState<Movimiento[]>([]);
    const [gastos, setGastos] = useState<Movimiento[]>([]);
    const [tipo, setTipo] = useState<'todos' | 'ingresos' | 'gastos'>('todos');
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ingresosData = await obtenerIngresos();
                const gastosData = await obtenerGastos();
                setIngresos(ingresosData);
                setGastos(gastosData);
            } catch (err) {
                console.error('Error al cargar los datos de reportes');
            }
        };
        fetchData();
    }, []);

    const movimientosFiltrados = () => {
        let movimientos: Movimiento[] = [];
        if (tipo === 'ingresos') movimientos = ingresos;
        else if (tipo === 'gastos') movimientos = gastos;
        else movimientos = [...ingresos, ...gastos];

        // Filtro por fecha
        if (desde) {
            movimientos = movimientos.filter(
                m => new Date(m.fecha) >= new Date(desde)
            );
        }
        if (hasta) {
            movimientos = movimientos.filter(
                m => new Date(m.fecha) <= new Date(hasta)
            );
        }

        return movimientos;
    };

    const movimientos = movimientosFiltrados().sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    const fechas = Array.from(
        new Set(movimientos.map(m => new Date(m.fecha).toLocaleDateString('es-ES')))
    );

    const dataPorFecha = fechas.map(fecha => {
        const total = movimientos
            .filter(m => new Date(m.fecha).toLocaleDateString('es-ES') === fecha)
            .reduce((sum, m) => sum + m.monto, 0);
        return total;
    });

    const chartData = {
        labels: fechas,
        datasets: [
            {
                label:
                    tipo === 'ingresos'
                        ? 'Ingresos'
                        : tipo === 'gastos'
                            ? 'Gastos'
                            : 'Ingresos + Gastos',
                data: dataPorFecha,
                borderColor: tipo === 'gastos' ? '#e74c3c' : '#2ecc71',
                backgroundColor:
                    tipo === 'gastos'
                        ? 'rgba(231, 76, 60, 0.1)'
                        : 'rgba(46, 204, 113, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#333',
                },
            },
        },
        scales: {
            x: {
                ticks: { color: '#555' },
            },
            y: {
                ticks: { color: '#555' },
            },
        },
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>📑 Reportes Financieros</h2>

            <div className={styles.filtros}>
                <button
                    onClick={() => setTipo('todos')}
                    className={tipo === 'todos' ? styles.active : ''}
                >
                    Todos
                </button>
                <button
                    onClick={() => setTipo('ingresos')}
                    className={tipo === 'ingresos' ? styles.active : ''}
                >
                    Ingresos
                </button>
                <button
                    onClick={() => setTipo('gastos')}
                    className={tipo === 'gastos' ? styles.active : ''}
                >
                    Gastos
                </button>
            </div>

            <div className={styles.fechas}>
                <label>
                    Desde:{' '}
                    <input
                        type="date"
                        value={desde}
                        onChange={e => setDesde(e.target.value)}
                    />
                </label>
                <label>
                    Hasta:{' '}
                    <input
                        type="date"
                        value={hasta}
                        onChange={e => setHasta(e.target.value)}
                    />
                </label>
            </div>

            <div className={styles.chartContainer}>
                <Line data={chartData} options={chartOptions} />
            </div>

            {movimientos.length > 0 ? (
                <div className={styles.tablaContainer}>
                    <h3 className={styles.subtitulo}>📋 Detalle de movimientos</h3>
                    <table className={styles.tabla}>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.map(m => (
                                <tr key={m._id}>
                                    <td>{new Date(m.fecha).toLocaleDateString('es-ES')}</td>
                                    <td>{m.descripcion}</td>
                                    <td
                                        className={
                                            tipo === 'gastos' || (tipo === 'todos' && gastos.find(g => g._id === m._id))
                                                ? styles.gasto
                                                : styles.ingreso
                                        }
                                    >
                                        ${m.monto.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className={styles.sinDatos}>No hay movimientos en este rango de fechas.</p>
            )}


        </div>
    );
};

export default Reportes;
