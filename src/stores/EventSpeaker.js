// stores/EventSpeakerStore.js
import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useEventSpeakerStore = create((set) => ({
    eventSpeakers: [],
    addEventSpeaker: async (eventId, speakerId) => {
        try {
            const response = await api.post(routes.eventSpeakers, { eventId, speakerId });
            set((state) => ({
                eventSpeakers: [...state.eventSpeakers, response.data]
            }));
        } catch (error) {
            console.error("Error adding event speaker:", error);
        }
    },
    getEventSpeakers: () => set((state) => state.eventSpeakers),
    deleteEventSpeaker: async (id) => {
        try {
            await api.delete(`${routes.eventSpeakers}/${id}`);
            set((state) => ({
                eventSpeakers: state.eventSpeakers.filter(eventSpeaker => eventSpeaker.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting event speaker:", error);
        }
    },
    fetchEventSpeakers: async () => {
        try {
            const response = await api.get(routes.eventSpeakers);
            set({ eventSpeakers: response.data });
        } catch (error) {
            console.error("Error fetching event speakers:", error);
        }
    }
}));

export default useEventSpeakerStore;
