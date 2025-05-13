// stores/VenueStore.js
import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useVenueStore = create((set) => ({
    venues: [],
    loading: false,
    error: null,

    addVenue: async ({name, address, capacity, image}) => {
        try {
            set({ loading: true, error: null });
            const response = await api.post(routes.venues, { name, address, capacity, image });
            set((state) => ({
                venues: [...state.venues, response.data],
                loading: false,
                error: null
            }));
            return response.data;
        } catch (error) {
            console.error("Error adding venue:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при добавлении места', 
                loading: false 
            });
            throw error;
        }
    },
    
    getVenues: () => set((state) => state.venues),
    
    updateVenue: async (id, updatedData) => {
        try {
            set({ loading: true, error: null });
            const response = await api.put(`${routes.venues}/${id}`, updatedData);
            set((state) => ({
                venues: state.venues.map(venue =>
                    venue.id === id ? { ...venue, ...response.data } : venue
                ),
                loading: false,
                error: null
            }));
            return response.data;
        } catch (error) {
            console.error("Error updating venue:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при обновлении места', 
                loading: false 
            });
            throw error;
        }
    },
    
    deleteVenue: async (id) => {
        try {
            set({ loading: true, error: null });
            await api.delete(`${routes.venues}/${id}`);
            set((state) => ({
                venues: state.venues.filter(venue => venue.id !== id),
                loading: false,
                error: null
            }));
            return true;
        } catch (error) {
            console.error("Error deleting venue:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при удалении места', 
                loading: false 
            });
            throw error;
        }
    },
    
    fetchVenues: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get(routes.venues);
            set({ 
                venues: response.data, 
                loading: false,
                error: null
            });
        } catch (error) {
            console.error("Error fetching venues:", error);
            set({ 
                error: error.response?.data?.error || 'Ошибка при получении мест', 
                loading: false 
            });
        }
    }
}));

export default useVenueStore;
