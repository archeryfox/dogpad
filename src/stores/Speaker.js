// stores/SpeakerStore.js
import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useSpeakerStore = create((set) => ({
    speakers: [],
    addSpeaker: async (name, biography, userId) => {
        try {
            const response = await api.post(routes.speakers, { name, biography, userId });
            set((state) => ({
                speakers: [...state.speakers, response.data]
            }));
        } catch (error) {
            console.error("Error adding speaker:", error);
        }
    },
    getSpeakers: () => set((state) => state.speakers),
    updateSpeaker: async (id, updatedData) => {
        try {
            const response = await api.put(`${routes.speakers}/${id}`, updatedData);
            set((state) => ({
                speakers: state.speakers.map(speaker =>
                    speaker.id === id ? { ...speaker, ...response.data } : speaker
                )
            }));
        } catch (error) {
            console.error("Error updating speaker:", error);
        }
    },
    deleteSpeaker: async (id) => {
        try {
            await api.delete(`${routes.speakers}/${id}`);
            set((state) => ({
                speakers: state.speakers.filter(speaker => speaker.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting speaker:", error);
        }
    },
    fetchSpeakers: async () => {
        try {
            const response = await api.get(routes.speakers);
            set({ speakers: response.data });
        } catch (error) {
            console.error("Error fetching speakers:", error);
        }
    }
}));

export default useSpeakerStore;
