import styles from '../styles/topbar.module.css';
import { FaMoon, FaSun, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type TopbarProps = {
  onMenuClick?: () => void;
};

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {/* Botón hamburguesa visible en mobile */}
        {onMenuClick && (
          <button
            className={styles.hamburger}
            onClick={onMenuClick}
            title="Abrir menú"
          >
            <FaBars />
          </button>
        )}
        <h2>
          Bienvenido, <span>{user?.username || 'Usuario'}</span>
        </h2>
      </div>
      <div className={styles.right}>
        <button
          className={styles.darkToggle}
          onClick={toggleDarkMode}
          title="Cambiar tema"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button
          className={styles.logout}
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
