// src/components/Layout.tsx
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from '../styles/layout.module.css';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
