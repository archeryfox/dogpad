// stores/EventCategoryStore.js
import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useEventCategoryStore = create((set) => ({
    eventCategories: [],
    loading: false,
    error: null,

    addEventCategory: async (eventId, categoryId) => {
        try {
            set({ loading: true, error: null });
            const response = await api.post(routes.eventCategories, { eventId, categoryId });
            set((state) => ({
                eventCategories: [...state.eventCategories, response.data],
                loading: false,
                error: null
            }));
            return response.data;
        } catch (error) {
            console.error("Error adding event category:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при добавлении категории к мероприятию', 
                loading: false 
            });
            throw error;
        }
    },
    
    getEventCategories: () => set((state) => state.eventCategories),
    
    deleteEventCategory: async (id) => {
        try {
            set({ loading: true, error: null });
            await api.delete(`${routes.eventCategories}/${id}`);
            set((state) => ({
                eventCategories: state.eventCategories.filter(eventCategory => eventCategory.id !== id),
                loading: false,
                error: null
            }));
            return true;
        } catch (error) {
            console.error("Error deleting event category:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при удалении категории мероприятия', 
                loading: false 
            });
            throw error;
        }
    },
    
    // Удалить все связи EventCategory для указанной категории
    deleteEventCategoriesByCategoryId: async (categoryId) => {
        try {
            set({ loading: true, error: null });
            await api.delete(`${routes.categories}/${categoryId}/event-categories`);
            set((state) => ({
                eventCategories: state.eventCategories.filter(
                    eventCategory => eventCategory.categoryId !== categoryId
                ),
                loading: false,
                error: null
            }));
            return true;
        } catch (error) {
            console.error("Error deleting event categories by category ID:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при удалении связей категории с мероприятиями', 
                loading: false 
            });
            throw error;
        }
    },
    
    fetchEventCategories: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get(routes.eventCategories);
            set({ 
                eventCategories: response.data,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error("Error fetching event categories:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при получении категорий мероприятий', 
                loading: false 
            });
        }
    }
}));

export default useEventCategoryStore;
