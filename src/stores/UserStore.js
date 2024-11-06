// stores/UserStore.js
import { create } from 'zustand';
import { api, routes } from "./axios.js"; // Предположим, что axios настроен корректно

const useUserStore = create((set) => ({
    users: [],

    // Получение списка пользователей
    fetchUsers: async () => {
        try {
            const response = await api.get(routes.users);  // В routes.users должно быть определено
            set({ users: response.data });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    },

    // Добавление нового пользователя
    addUser: async (user) => {
        try {
            const response = await api.post(routes.users, user);
            set((state) => ({
                users: [...state.users, response.data],
            }));
        } catch (error) {
            console.error("Error adding user:", error);
        }
    },

    // Обновление пользователя по ID
    updateUser: async (id, updatedData) => {
        try {
            const response = await api.put(`${routes.users}/${id}`, updatedData);
            set((state) => ({
                users: state.users.map((user) =>
                    user.id === id ? { ...user, ...response.data } : user
                ),
            }));
        } catch (error) {
            console.error("Error updating user:", error);
        }
    },

    // Удаление пользователя по ID
    deleteUser: async (id) => {
        try {
            await api.delete(`${routes.users}/${id}`);
            set((state) => ({
                users: state.users.filter((user) => user.id !== id),
            }));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    },
}));

export default useUserStore;
