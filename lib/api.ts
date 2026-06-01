import axios from 'axios';

const API_BASE_URL = 'https://uklkuliner-production-f8f2.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor untuk token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk retry jika timeout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, message } = error;
    if (message === 'timeout of 30000ms exceeded' && !config._retry) {
      config._retry = true;
      console.log('Retrying request...');
      return api(config);
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ============ AUTH ============
export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// ============ RESTAURANT ============
export const getRestaurants = async () => {
  const response = await api.get('/restaurants');
  return response.data;
};

export const getRestaurantById = async (id: number) => {
  const response = await api.get(`/restaurants/${id}`);
  return response.data;
};

export const createRestaurant = async (data: any) => {
  const isFormData = data instanceof FormData;
  const response = await api.post('/restaurants', data, {
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data',
    } : undefined,
  });
  return response.data;
};

export const updateRestaurant = async (id: number, data: any) => {
  const isFormData = data instanceof FormData;
  const response = await api.put(`/restaurants/${id}`, data, {
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data',
    } : {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const deleteRestaurant = async (id: number) => {
  const response = await api.delete(`/restaurants/${id}`);
  return response.data;
};

// ============ TABLES ============
export const getTables = async () => {
  const response = await api.get('/tables');
  return response.data;
};

export const getAvailableTables = async () => {
  const response = await api.get('/tables/available');
  return response.data;
};

export const getTablesByRestaurant = async (restaurantId: number) => {
  const response = await api.get(`/tables/restaurant/${restaurantId}`);
  return response.data;
};

export const createTable = async (data: any) => {
  const response = await api.post('/tables', data);
  return response.data;
};

export const updateTable = async (id: number, data: any) => {
  const response = await api.put(`/tables/${id}`, data);
  return response.data;
};

export const deleteTable = async (id: number) => {
  const response = await api.delete(`/tables/${id}`);
  return response.data;
};

// ============ RESERVATIONS ============
export const createReservation = async (data: any) => {
  const response = await api.post('/reservations', data);
  return response.data;
};

export const getMyReservations = async () => {
  const response = await api.get('/reservations/me');
  return response.data;
};

export const getAllReservations = async () => {
  const response = await api.get('/reservations');
  return response.data;
};

export const getReservationById = async (id: number) => {
  const response = await api.get(`/reservations/${id}`);
  return response.data;
};

export const cancelReservation = async (id: number) => {
  const response = await api.patch(`/reservations/cancel/${id}`);
  return response.data;
};

export const confirmReservation = async (id: number) => {
  const response = await api.patch(`/reservations/confirm/${id}`);
  return response.data;
};

export const rejectReservation = async (id: number) => {
  const response = await api.patch(`/reservations/reject/${id}`);
  return response.data;
};

// ============ UPLOAD BUKTI PEMBAYARAN ============
export const uploadPaymentProof = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/reservations/upload-payment/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getPaymentProof = async (id: number) => {
  const response = await api.get(`/reservations/payment-proof/${id}`);
  return response.data;
};

// ============ ADMIN - USERS ============
export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Gagal fetch users:', error);
    return [];
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Gagal fetch user:', error);
    return null;
  }
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const updateUserRole = async (id: number, role: string) => {
  const response = await api.patch(`/admin/users/${id}/role`, { role });
  return response.data;
};

// ============ DASHBOARD ============
export const getDashboardData = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export default api;