import axios from 'axios';

const API_URL = 'http://26.63.41.255:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    });

    api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = Bearer ${token};
    }
    return config;
    });

    // Interceptor para manejar errores
    api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Endpoints para Idiomas
export const obtenerIdiomas = () => api.get('/languages');
export const crearIdioma = (idioma) => api.post('/languages', idioma);
export const actualizarIdioma = (id, idioma) => api.put(/languages/${id}, idioma);
export const eliminarIdioma = (id) => api.delete(/languages/${id});

// Endpoints para Estudiantes
export const obtenerEstudiantes = () => api.get('/students');
export const crearEstudiante = (estudiante) => api.post('/students', estudiante);
export const actualizarEstudiante = (id, estudiante) => api.put(/students/${id}, estudiante);
export const eliminarEstudiante = (id) => api.delete(/students/${id});

export default api;