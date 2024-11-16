// stores/VenueStore.js
import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useVenueStore = create((set) => ({
    venues: [],
    addVenue: async ({name, address, capacity}) => {
        try {
            const response = await api.post(routes.venues, { name, address, capacity });
            set((state) => ({
                venues: [...state.venues, response.data]
            }));
        } catch (error) {
            console.error("Error adding venue:", error);
        }
    },
    getVenues: () => set((state) => state.venues),
    updateVenue: async (id, updatedData) => {
        try {
            const response = await api.put(`${routes.venues}/${id}`, updatedData);
            set((state) => ({
                venues: state.venues.map(venue =>
                    venue.id === id ? { ...venue, ...response.data } : venue
                )
            }));
        } catch (error) {
            console.error("Error updating venue:", error);
        }
    },
    deleteVenue: async (id) => {
        try {
            await api.delete(`${routes.venues}/${id}`);
            set((state) => ({
                venues: state.venues.filter(venue => venue.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting venue:", error);
        }
    },
    fetchVenues: async () => {
        try {
            const response = await api.get(routes.venues);
            set({ venues: response.data });
        } catch (error) {
            console.error("Error fetching venues:", error);
        }
    }
}));

export default useVenueStore;
