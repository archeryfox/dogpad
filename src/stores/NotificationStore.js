import { create } from 'zustand';

const useNotificationStore = create((set) => ({
    notification: null,

    // Показать уведомление
    showNotification: (message, type = 'success') => {
        set({ notification: { message, type } });

        // Автоматически скрываем уведомление через 3 секунды
        setTimeout(() => {
            set({ notification: null });
        }, 3000);
    },

    // Скрыть уведомление
    hideNotification: () => {
        set({ notification: null });
    }
}));

export default useNotificationStore;
