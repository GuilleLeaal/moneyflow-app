import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from '../styles/layout.module.css';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />

      {sidebarOpen && <div className={styles.overlay} onClick={closeSidebar} />}

      <div className={styles.contentArea}>
        <Topbar onMenuClick={toggleSidebar} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
