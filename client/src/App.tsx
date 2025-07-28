import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Ingresos from './pages/Ingresos';
import Gastos from './pages/Gastos';
import Reportes from './pages/Reportes';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoutes = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  return isAuthenticated ? <Layout><Outlet /></Layout> : <Navigate to="/" replace />;
};

const PublicRoutes = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};


const AppRoutes = () => (
  <Routes>
    <Route element={<PublicRoutes />}>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    <Route element={<PrivateRoutes />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ingresos" element={<Ingresos />} />
      <Route path="/gastos" element={<Gastos />} />
      <Route path="/reportes" element={<Reportes />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
);

export default App;
