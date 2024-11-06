import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useCategoryStore = create((set) => ({
    categories: [],

    // Добавление новой категории
    addCategory: async (name) => {
        try {
            const response = await api.post(routes.categories, { name });
            set((state) => ({
                categories: [...state.categories, response.data]
            }));
        } catch (error) {
            console.error("Error adding category:", error);
        }
    },

    // Получение списка категорий
    fetchCategories: async () => {
        try {
            const response = await api.get(routes.categories);
            set({ categories: response.data });
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    },

    // Обновление категории по ID
    updateCategory: async (id, newName) => {
        try {
            const response = await api.put(`${routes.categories}/${id}`, { name: newName });
            set((state) => ({
                categories: state.categories.map((category) =>
                    category.id === id ? { ...category, name: response.data.name } : category
                )
            }));
        } catch (error) {
            console.error("Error updating category:", error);
        }
    },

    // Удаление категории по ID
    deleteCategory: async (id) => {
        try {
            await api.delete(`${routes.categories}/${id}`);
            set((state) => ({
                categories: state.categories.filter((category) => category.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    }
}));

export default useCategoryStore;
