// stores/SpeakerStore.js
import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useSpeakerStore = create((set) => ({
    speakers: [],
    loading: false,
    error: null,

    addSpeaker: async (name, biography, userId, avatar) => {
        try {
            set({ loading: true, error: null });
            const response = await api.post(routes.speakers, { name, biography, userId, avatar });
            set((state) => ({
                speakers: [...state.speakers, response.data],
                loading: false,
                error: null
            }));
            return response.data;
        } catch (error) {
            console.error("Error adding speaker:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при добавлении спикера', 
                loading: false 
            });
            throw error;
        }
    },
    
    getSpeakers: () => set((state) => state.speakers),
    
    updateSpeaker: async (id, updatedData) => {
        try {
            set({ loading: true, error: null });
            const response = await api.put(`${routes.speakers}/${id}`, updatedData);
            set((state) => ({
                speakers: state.speakers.map(speaker =>
                    speaker.id === id ? { ...speaker, ...response.data } : speaker
                ),
                loading: false,
                error: null
            }));
            return response.data;
        } catch (error) {
            console.error("Error updating speaker:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при обновлении спикера', 
                loading: false 
            });
            throw error;
        }
    },
    
    deleteSpeaker: async (id) => {
        try {
            set({ loading: true, error: null });
            await api.delete(`${routes.speakers}/${id}`);
            set((state) => ({
                speakers: state.speakers.filter(speaker => speaker.id !== id),
                loading: false,
                error: null
            }));
            return true;
        } catch (error) {
            console.error("Error deleting speaker:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при удалении спикера', 
                loading: false 
            });
            throw error;
        }
    },
    
    fetchSpeakers: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get(routes.speakers);
            set({ 
                speakers: response.data,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error("Error fetching speakers:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при получении спикеров', 
                loading: false 
            });
        }
    }
}));

export default useSpeakerStore;
