// stores/UserStore.js
import { create } from 'zustand';
import { api, routes } from "./axios.js"; // Предположим, что axios настроен корректно

const useUserStore = create((set) => ({
    users: [],
    loading: false,
    error: null,

    // Получение списка пользователей
    fetchUsers: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get(routes.users);  // В routes.users должно быть определено
            set({ users: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching users:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при получении пользователей', 
                loading: false 
            });
        }
    },

    // Добавление нового пользователя
    addUser: async (user) => {
        try {
            set({ loading: true, error: null });
            const response = await api.post(routes.users, user);
            set((state) => ({
                users: [...state.users, response.data],
                loading: false,
                error: null
            }));
            return response.data;
        } catch (error) {
            console.error("Error adding user:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при добавлении пользователя', 
                loading: false 
            });
            throw error;
        }
    },

    // Обновление пользователя по ID
    updateUser: async (id, updatedData) => {
        try {
            set({ loading: true, error: null });
            const response = await api.put(`${routes.users}/${id}`, updatedData);
            set((state) => ({
                users: state.users.map((user) =>
                    user.id === id ? { ...user, ...response.data } : user
                ),
                loading: false,
                error: null
            }));
            return response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при обновлении пользователя', 
                loading: false 
            });
            throw error;
        }
    },

    // Удаление пользователя по ID
    deleteUser: async (id) => {
        try {
            set({ loading: true, error: null });
            await api.delete(`${routes.users}/${id}`);
            set((state) => ({
                users: state.users.filter((user) => user.id !== id),
                loading: false,
                error: null
            }));
            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при удалении пользователя', 
                loading: false 
            });
            throw error;
        }
    },
}));

export default useUserStore;
