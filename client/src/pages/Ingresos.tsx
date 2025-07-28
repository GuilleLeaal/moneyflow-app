import { useState, useEffect } from 'react';
import { crearIngreso, obtenerIngresos, eliminarIngreso } from '../../api';
import styles from '../styles/ingresos.module.css';

interface Ingreso {
  _id: string;
  descripcion: string;
  monto: number;
  fecha: string;
}

const Ingresos = () => {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);

  const fetchIngresos = async () => {
    try {
      const data = await obtenerIngresos();
      setIngresos(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchIngresos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await crearIngreso({
        descripcion,
        monto: parseFloat(monto),
        fecha: fecha ? new Date(`${fecha}T12:00:00`).toISOString() : undefined
      });
      setMensaje('Ingreso registrado correctamente');
      setDescripcion('');
      setMonto('');
      setFecha('');
      fetchIngresos();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id: string) => {
    const confirmar = confirm('¿Estás seguro de que querés eliminar este ingreso?');
    if (!confirmar) return;

    try {
      await eliminarIngreso(id);
      setIngresos((prev) => prev.filter((i) => i._id !== id));
      setMensaje('Ingreso eliminado correctamente');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrar Ingreso</h2>
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
        />
        <button type="submit">Guardar</button>
        {mensaje && <p className={styles.success}>{mensaje}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>

      <h3 className={styles.subTitle}>Historial de Ingresos</h3>
      <div className={styles.list}>
        {ingresos.map((ingreso) => (
          <div key={ingreso._id} className={styles.item}>
            <div className={styles.leftSection}>
              <strong>{ingreso.descripcion}</strong>
              <p className={styles.fecha}>
                {new Date(ingreso.fecha).toLocaleDateString()}
              </p>
            </div>
            <div className={styles.rightSection}>
              <span className={styles.monto}>+ ${ingreso.monto.toFixed(2)}</span>
              <button
                className={styles.deleteButton}
                onClick={() => handleEliminar(ingreso._id)}
                title="Eliminar ingreso"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {ingresos.length === 0 && <p className={styles.empty}>No hay ingresos aún.</p>}
      </div>
    </div>
  );
};

export default Ingresos;
