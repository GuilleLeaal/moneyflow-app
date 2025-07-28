import { useState, useEffect } from 'react';
import { crearGasto, obtenerGastos, eliminarGasto } from '../../api';
import styles from '../styles/ingresos.module.css';

interface Gasto {
  _id: string;
  descripcion: string;
  monto: number;
  fecha: string;
}

const Gastos = () => {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [gastos, setGastos] = useState<Gasto[]>([]);

  const fetchGastos = async () => {
    try {
      const data = await obtenerGastos();
      setGastos(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await crearGasto({
        descripcion,
        monto: parseFloat(monto),
        fecha: fecha ? new Date(`${fecha}T12:00:00`).toISOString() : undefined
      });
      setMensaje('Gasto registrado correctamente');
      setDescripcion('');
      setMonto('');
      setFecha('');
      fetchGastos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id: string) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este gasto?');

    if (!confirmar) return;

    try {
      await eliminarGasto(id);
      setGastos((prev) => prev.filter((gasto) => gasto._id !== id));
    } catch (err: any) {
      setError('Error al eliminar el gasto');
    }
  };


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrar Gasto</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className={!fecha ? styles.placeholderDate : ''}
          required
        />
        <button type="submit">Guardar</button>
        {mensaje && <p className={styles.success}>{mensaje}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>

      <h3 className={styles.subTitle}>Historial de Gastos</h3>
      <div className={styles.list}>
        {gastos.map((gasto) => (
          <div key={gasto._id} className={styles.item}>
            <div className={styles.itemLeft}>
              <strong>{gasto.descripcion}</strong>
              <p className={styles.fecha}>
                {new Date(gasto.fecha).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div className={styles.itemRight}>
              <span className={styles.monto} style={{ color: '#ff6b6b' }}>
                - ${gasto.monto.toFixed(2)}
              </span>
              <button
                onClick={() => handleEliminar(gasto._id)}
                className={styles.deleteBtn}
                title="Eliminar gasto"
              >
                ✕
              </button>
            </div>
          </div>

        ))}
        {gastos.length === 0 && <p className={styles.empty}>No hay gastos aún.</p>}
      </div>
    </div>
  );
};

export default Gastos;
