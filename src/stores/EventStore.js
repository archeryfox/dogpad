import { create } from 'zustand';
import { api, routes } from "./axios.js";

const useEventStore = create((set) => ({
    events: [],
    loading: false,
    error: null,

    // Добавление нового события
    addEvent: async (eventData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post(routes.events, eventData);
            // Обновляем стор только при успешном ответе (20x)
            if (response.status >= 200 && response.status < 300) {
                set((state) => ({
                    events: [...state.events, response.data],
                    loading: false,
                    error: null
                }));
                return response.data;
            }
        } catch (error) {
            console.error("Error adding event:", error);
            const status = error.response?.status || 0;
            let errorMessage = 'Произошла ошибка при добавлении мероприятия';
            
            if (status >= 400 && status < 500) {
                errorMessage = `Ошибка клиента: ${error.response?.data?.message || 'Проверьте введенные данные'}`;
            } else if (status >= 500) {
                errorMessage = 'Ошибка сервера. Попробуйте позже.';
            }
            
            set({ loading: false, error: errorMessage });
            throw error; // Пробрасываем ошибку дальше для обработки в компоненте
        }
    },

    fetchEventsByCategory: async (categoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`${routes.events}?categoryId=${categoryId}`);
            if (response.status >= 200 && response.status < 300) {
                set({ events: response.data, loading: false, error: null });
            }
        } catch (error) {
            console.error("Error fetching events by category:", error);
            const status = error.response?.status || 0;
            let errorMessage = 'Произошла ошибка при загрузке мероприятий';
            
            if (status >= 400 && status < 500) {
                errorMessage = `Ошибка клиента: ${error.response?.data?.message || 'Проверьте параметры запроса'}`;
            } else if (status >= 500) {
                errorMessage = 'Ошибка сервера. Попробуйте позже.';
            }
            
            set({ loading: false, error: errorMessage });
        }
    },

    // Получение всех событий
    fetchEvents: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(routes.events);
            if (response.status >= 200 && response.status < 300) {
                set({ events: response.data, loading: false, error: null });
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            const status = error.response?.status || 0;
            let errorMessage = 'Произошла ошибка при загрузке мероприятий';
            
            if (status >= 400 && status < 500) {
                errorMessage = `Ошибка клиента: ${error.response?.data?.message || 'Проверьте параметры запроса'}`;
            } else if (status >= 500) {
                errorMessage = 'Ошибка сервера. Попробуйте позже.';
            }
            
            set({ loading: false, error: errorMessage });
        }
    },

    // Обновление события по ID
    updateEvent: async (id, updatedData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`${routes.events}/${id}`, updatedData);
            if (response.status >= 200 && response.status < 300) {
                set((state) => ({
                    events: state.events.map((event) =>
                        event.id === id ? response.data : event
                    ),
                    loading: false,
                    error: null
                }));
                return response.data;
            }
        } catch (error) {
            console.error("Error updating event:", error);
            const status = error.response?.status || 0;
            let errorMessage = 'Произошла ошибка при обновлении мероприятия';
            
            if (status >= 400 && status < 500) {
                errorMessage = `Ошибка клиента: ${error.response?.data?.message || 'Проверьте введенные данные'}`;
            } else if (status >= 500) {
                errorMessage = 'Ошибка сервера. Попробуйте позже.';
            }
            
            set({ loading: false, error: errorMessage });
            throw error;
        }
    },

    // Удаление события по ID
    deleteEvent: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await api.delete(`${routes.events}/${id}`);
            // Проверяем статус ответа (204 - успешное удаление без контента)
            if (response.status >= 200 && response.status < 300) {
                set((state) => ({
                    events: state.events.filter((event) => event.id !== id),
                    loading: false,
                    error: null
                }));
                return true;
            } else {
                throw new Error(`Неожиданный статус ответа: ${response.status}`);
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            const status = error.response?.status || 0;
            let errorMessage = 'Произошла ошибка при удалении мероприятия';
            
            if (status >= 400 && status < 500) {
                errorMessage = `Ошибка клиента: ${error.response?.data?.message || 'Проверьте параметры запроса'}`;
            } else if (status >= 500) {
                errorMessage = 'Ошибка сервера. Попробуйте позже.';
            }
            
            set({ loading: false, error: errorMessage });
            throw error;
        }
    },
}));

export default useEventStore;
