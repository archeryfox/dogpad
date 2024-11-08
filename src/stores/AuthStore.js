import { create } from 'zustand';
import { api, routes } from './axios'; // Путь к вашему axios.js

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null, // Загружаем пользователя из localStorage
    token: localStorage.getItem('token') || null, // Загружаем токен из localStorage
    error: null,
    loading: false,

    login: async (name, password) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post(routes.login, { name, password });
            set({
                user: response.data.user,
                token: response.data.token, // Предположим, что токен возвращается в ответе
                error: null,
                loading: false
            });
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Сохраняем данные пользователя
            localStorage.setItem('token', response.data.token); // Сохраняем токен
        } catch (error) {
            set({ error: 'Ошибка при авторизации', loading: false });
        }
    },

    register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post(routes.register, { name, email, password });
            set({ user: response.data.user, error: null, loading: false });
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token); // Сохраняем токен
        } catch (error) {
            set({ error: 'Ошибка при регистрации', loading: false });
        }
    },

    logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
}));

export default useAuthStore;
