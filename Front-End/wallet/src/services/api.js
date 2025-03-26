import axios from "axios";

const api = axios.create({
  baseURL: "https://skillwallettest.onrender.com/",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Não autenticado ou sessão expirada. Redirecionando para login...");
    }
    return Promise.reject(error);
  }
);

export default api;
