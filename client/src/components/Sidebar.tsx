import { NavLink } from 'react-router-dom';
import styles from '../styles/sidebar.module.css';
import { FaChartLine, FaWallet, FaMoneyBill, FaRegChartBar } from 'react-icons/fa';
import logoDark from '../assets/logoMoneyFlowDark.png';
import logoLight from '../assets/logoMoneyFlowBlanco.png';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { darkMode } = useTheme();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img
          src={darkMode ? logoLight : logoDark}
          alt="MoneyFlow logo"
          className={styles.logo}
        />
      </div>

      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          <FaChartLine /> Dashboard
        </NavLink>
        <NavLink to="/ingresos" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          <FaMoneyBill /> Ingresos
        </NavLink>
        <NavLink to="/gastos" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          <FaWallet /> Gastos
        </NavLink>
        <NavLink to="/reportes" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          <FaRegChartBar /> Reportes
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
