import { NavLink } from 'react-router-dom';
import styles from '../styles/sidebar.module.css';
import { FaChartLine, FaWallet, FaMoneyBill, FaRegChartBar, FaBars, FaTimes } from 'react-icons/fa';
import logoDark from '../assets/logoMoneyFlowDark.png';
import logoLight from '../assets/logoMoneyFlowBlanco.png';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

// ...
type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
};

const Sidebar = ({ isOpen, onClose, onToggle }: SidebarProps) => {
  const { darkMode } = useTheme();

  return (
    <>
      <button className={styles.hamburger} onClick={onToggle}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logoContainer}>
          <img
            src={darkMode ? logoLight : logoDark}
            alt="MoneyFlow logo"
            className={styles.logo}
          />
        </div>

        <nav className={styles.nav}>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={onClose}>
            <FaChartLine /> Dashboard
          </NavLink>
          <NavLink to="/ingresos" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={onClose}>
            <FaMoneyBill /> Ingresos
          </NavLink>
          <NavLink to="/gastos" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={onClose}>
            <FaWallet /> Gastos
          </NavLink>
          <NavLink to="/reportes" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={onClose}>
            <FaRegChartBar /> Reportes
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
