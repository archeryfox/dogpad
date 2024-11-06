import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useEventStore = create((set) => ({
    events: [],

    // Добавление нового события
    addEvent: async (eventData) => {
        try {
            const response = await api.post(routes.events, eventData);
            set((state) => ({
                events: [...state.events, response.data],
            }));
        } catch (error) {
            console.error("Error adding event:", error);
        }
    },

    // Получение всех событий
    fetchEvents: async () => {
        try {
            const response = await api.get(routes.events);
            set({ events: response.data });
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    },

    // Обновление события по ID
    updateEvent: async (id, updatedData) => {
        try {
            const response = await api.put(`${routes.events}/${id}`, updatedData);
            set((state) => ({
                events: state.events.map((event) =>
                    event.id === id ? response.data : event
                ),
            }));
        } catch (error) {
            console.error("Error updating event:", error);
        }
    },

    // Удаление события по ID
    deleteEvent: async (id) => {
        try {
            await api.delete(`${routes.events}/${id}`);
            set((state) => ({
                events: state.events.filter((event) => event.id !== id),
            }));
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    },
}));

export default useEventStore;
