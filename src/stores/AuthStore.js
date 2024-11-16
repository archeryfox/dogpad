import { create } from 'zustand';
import { api, routes } from './axios'; // Путь к вашему axios.js

const roles = ['user', 'admin', 'speaker', 'organizer', 'db_admin'];

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    error: null,
    loading: false,

    // Функция для авторизации
    login: async (name, password) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post(routes.login, { name: name, password: password });
            const user = response.data.user;
            // Корректное обращение к функции getApprovedRole
            const role = await useAuthStore.getState().getApprovedRole(user);
            set({ user: { ...user, role }, token: response.data.token, error: null, loading: false });
            localStorage.setItem('user', JSON.stringify({ ...user, role }));
            localStorage.setItem('token', response.data.token);
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

    // Метод для получения одобренной роли
    getApprovedRole: async (user) => {
        console.log(user)
        const approvedRequest = user.RoleChangeRequest
            .filter(request => request.status === 'approved')
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]; // Последний одобренный запрос

        return approvedRequest ? roles[approvedRequest.requestedRoleId - 1] : roles[user.roleId - 1];
    },

    // Обновление профиля
    updateUser: async (newData, id) => {
        set({ loading: true, error: null });
        try {
            newData.roleId -= 0;
            const response = await api.put(`${routes.users}/${id - 0}`, newData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const user = { ...response.data, role: await getApprovedRole(response.data) };
            set({ user, error: null, loading: false });
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            set({ error: 'Ошибка при обновлении профиля', loading: false });
        }
    },

    // Метод для запроса смены роли
    requestRoleChange: async (userId, requestedRoleId) => {
        set({ loading: true, error: null });
        try {
            await api.post(`${routes.requestRoleChange}`, { userId: userId - 0, requestedRoleId: requestedRoleId - 0 }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            set({ error: null, loading: false });
            alert('Запрос на смену роли отправлен администратору.');
        } catch (error) {
            set({ error: 'Ошибка при отправке запроса на смену роли', loading: false });
        }
    },
    // Функция для обновления баланса пользователя
    updateUserBalance: async (newBalance, id) => {
        try {
            // Обновляем баланс пользователя на фронтенде
            set((state) => {
                const updatedUser = { ...state.user, balance: newBalance-0 };
                return { user: updatedUser };
            });
            console
            // Отправляем запрос на сервер для обновления данных о балансе
            await api.put(`${routes.users}/${id}`, { balance: newBalance-0 });
        } catch (error) {
            console.error("Ошибка при обновлении баланса пользователя:", error);
        }
    },
    // Функция для выхода из системы
    logout: () => {
        set({user: null, token: null});
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
}));

export default useAuthStore;
