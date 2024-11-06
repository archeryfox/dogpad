// stores/EventCategoryStore.js
import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useEventCategoryStore = create((set) => ({
    eventCategories: [],
    addEventCategory: async (eventId, categoryId) => {
        try {
            const response = await api.post(routes.eventCategories, { eventId, categoryId });
            set((state) => ({
                eventCategories: [...state.eventCategories, response.data]
            }));
        } catch (error) {
            console.error("Error adding event category:", error);
        }
    },
    getEventCategories: () => set((state) => state.eventCategories),
    deleteEventCategory: async (id) => {
        try {
            await api.delete(`${routes.eventCategories}/${id}`);
            set((state) => ({
                eventCategories: state.eventCategories.filter(eventCategory => eventCategory.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting event category:", error);
        }
    },
    fetchEventCategories: async () => {
        try {
            const response = await api.get(routes.eventCategories);
            set({ eventCategories: response.data });
        } catch (error) {
            console.error("Error fetching event categories:", error);
        }
    }
}));

export default useEventCategoryStore;
