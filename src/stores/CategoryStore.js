import { create } from 'zustand';
import { api, routes } from "./axios.js";
import useEventCategoryStore from './EventCategory.js';

const useCategoryStore = create((set) => ({
    categories: [],
    loading: false,
    error: null,

    // Добавление новой категории
    addCategory: async (name) => {
        try {
            set({ loading: true, error: null });
            const response = await api.post(routes.categories, { name });
            set((state) => ({
                categories: [...state.categories, response.data],
                loading: false,
                error: null
            }));
            return response.data;
        } catch (error) {
            console.error("Error adding category:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при добавлении категории', 
                loading: false 
            });
            throw error;
        }
    },

    // Получение списка категорий
    fetchCategories: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get(routes.categories);
            set({ 
                categories: response.data,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error("Error fetching categories:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при получении категорий', 
                loading: false 
            });
        }
    },

    // Обновление категории по ID
    updateCategory: async (id, newName) => {
        try {
            set({ loading: true, error: null });
            const response = await api.put(`${routes.categories}/${id}`, { name: newName });
            set((state) => ({
                categories: state.categories.map((category) =>
                    category.id === id ? { ...category, name: response.data.name } : category
                ),
                loading: false,
                error: null
            }));
            return response.data;
        } catch (error) {
            console.error("Error updating category:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при обновлении категории', 
                loading: false 
            });
            throw error;
        }
    },

    // Удаление категории по ID
    deleteCategory: async (id) => {
        try {
            set({ loading: true, error: null });
            
            // Используем обновленный бэкенд, который сам удаляет связанные EventCategory записи
            await api.delete(`${routes.categories}/${id}`);
            
            set((state) => ({
                categories: state.categories.filter((category) => category.id !== id),
                loading: false,
                error: null
            }));
            return true;
        } catch (error) {
            console.error("Error deleting category:", error);
            
            // Если произошла ошибка с внешним ключом, пробуем сначала удалить связи
            if (error.message && error.message.includes('foreign key constraint')) {
                try {
                    // Получаем доступ к EventCategoryStore
                    const eventCategoryStore = useEventCategoryStore.getState();
                    
                    // Удаляем все связи EventCategory для этой категории
                    await eventCategoryStore.deleteEventCategoriesByCategoryId(id);
                    
                    // Затем пробуем снова удалить категорию
                    await api.delete(`${routes.categories}/${id}`);
                    
                    set((state) => ({
                        categories: state.categories.filter((category) => category.id !== id),
                        loading: false,
                        error: null
                    }));
                    return true;
                } catch (retryError) {
                    console.error("Error on retry deleting category:", retryError);
                    set({ 
                        error: retryError.response?.data?.error || 'Ошибка при удалении категории после повторной попытки', 
                        loading: false 
                    });
                    throw retryError;
                }
            }
            
            set({ 
                error: error.response?.data?.error || 'Ошибка при удалении категории', 
                loading: false 
            });
            throw error;
        }
    }
}));

export default useCategoryStore;
