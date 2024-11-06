// stores/RoleStore.js
import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useRoleStore = create((set) => ({
    roles: [],
    addRole: async (name) => {
        try {
            const response = await api.post(routes.roles, { name });
            set((state) => ({
                roles: [...state.roles, response.data]
            }));
        } catch (error) {
            console.error("Error adding role:", error);
        }
    },
    getRoles: () => set((state) => state.roles),
    updateRole: async (id, updatedData) => {
        try {
            const response = await api.put(`${routes.roles}/${id}`, updatedData);
            set((state) => ({
                roles: state.roles.map(role =>
                    role.id === id ? { ...role, ...response.data } : role
                )
            }));
        } catch (error) {
            console.error("Error updating role:", error);
        }
    },
    deleteRole: async (id) => {
        try {
            await api.delete(`${routes.roles}/${id}`);
            set((state) => ({
                roles: state.roles.filter(role => role.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting role:", error);
        }
    },
    fetchRoles: async () => {
        try {
            const response = await api.get(routes.roles);
            set({ roles: response.data });
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }
}));

export default useRoleStore;
