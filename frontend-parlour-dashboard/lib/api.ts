import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export { api };

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; name: string; role: string }) =>
    api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (employee: any) => api.post('/employees', employee),
  update: (id: string, employee: any) => api.put(`/employees/${id}`, employee),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

// Task API
export const taskAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id: string) => api.get(`/tasks/${id}`),
  create: (task: any) => api.post('/tasks', task),
  update: (id: string, task: any) => api.put(`/tasks/${id}`, task),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Attendance API
export const attendanceAPI = {
  getAll: (params?: any) => api.get('/attendance', { params }),
  getToday: () => api.get('/attendance/today'),
  getEmployeeStatus: () => api.get('/attendance/employee-status'),
  punchInOut: (data: { employeeId: string; action: string; location?: string; notes?: string }) =>
    api.post('/attendance/punch', data),
};
