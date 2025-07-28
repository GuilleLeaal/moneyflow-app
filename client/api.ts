const API_URL = 'http://localhost:3001/api';

export const registerUser = async (userData: { username: string; password: string }) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || error.message || 'Error al registrar');
  }

  return res.json();
};

export const loginUser = async (userData: { username: string; password: string }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Credenciales incorrectas');
  }

  return res.json();
};

//INGRESOS

interface IngresoPayload {
  descripcion: string;
  monto: number;
  fecha?: string;
}

export const crearIngreso = async (data: IngresoPayload) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/ingresos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear ingreso');
  }

  return res.json();
};

export const obtenerIngresos = async () => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/ingresos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al obtener ingresos');
  }

  return res.json();
};

export const eliminarIngreso = async (id: string) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/ingresos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al eliminar ingreso');
  }

  return res.json();
};


// GASTOS 
export const crearGasto = async (data: IngresoPayload) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/gastos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear gasto');
  }

  return res.json();
};


export const obtenerGastos = async () => {
  const res = await fetch(`${API_URL}/gastos`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) throw new Error('Error al obtener gastos');
  return res.json();
};

export const eliminarGasto = async (id: string) => {
  const res = await fetch(`${API_URL}/gastos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) throw new Error('Error al eliminar gasto');
  return res.json();
};
