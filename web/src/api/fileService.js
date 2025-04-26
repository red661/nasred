import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 添加请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // 用户认证
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  info: () => api.get('/info'),

  logout: () => { localStorage.removeItem('token'); },
  
  // 文件操作
  uploadFile: (formData) => api.post('/upload', formData),
  listPublicFiles: (currentdir) => api.get(`/public/files?currentdir=${currentdir}`),
  listFiles: (currentdir) => api.get(`/files?currentdir=${currentdir}`),
  downloadFile: (relpath) => api.get(`/download?relpath=${relpath}`, { responseType: 'blob' }),
  downloadPublicFile: (relpath) => api.get(`/public/download?relpath=${relpath}`, { responseType: 'blob' }),
  mkdir: (rootDir, curDir, name) => api.post(`/mkdir`, {rootDir, curDir, name}),
  listTypeFiles: (filetype) => api.get(`/typefiles?type=${filetype}`)
};