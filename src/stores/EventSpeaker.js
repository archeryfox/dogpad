// stores/EventSpeakerStore.js
import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useEventSpeakerStore = create((set) => ({
    eventSpeakers: [],
    loading: false,
    error: null,

    addEventSpeaker: async (eventId, speakerId) => {
        try {
            set({ loading: true, error: null });
            const response = await api.post(routes.eventSpeakers, { eventId, speakerId });
            set((state) => ({
                eventSpeakers: [...state.eventSpeakers, response.data],
                loading: false,
                error: null
            }));
            return response.data;
        } catch (error) {
            console.error("Error adding event speaker:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при добавлении спикера к мероприятию', 
                loading: false 
            });
            throw error;
        }
    },
    
    getEventSpeakers: () => set((state) => state.eventSpeakers),
    
    deleteEventSpeaker: async (id) => {
        try {
            set({ loading: true, error: null });
            await api.delete(`${routes.eventSpeakers}/${id}`);
            set((state) => ({
                eventSpeakers: state.eventSpeakers.filter(eventSpeaker => eventSpeaker.id !== id),
                loading: false,
                error: null
            }));
            return true;
        } catch (error) {
            console.error("Error deleting event speaker:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при удалении спикера мероприятия', 
                loading: false 
            });
            throw error;
        }
    },
    
    fetchEventSpeakers: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get(routes.eventSpeakers);
            set({ 
                eventSpeakers: response.data,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error("Error fetching event speakers:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при получении спикеров мероприятий', 
                loading: false 
            });
        }
    }
}));

export default useEventSpeakerStore;
