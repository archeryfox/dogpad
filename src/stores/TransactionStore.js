import { create } from 'zustand';
import { api, routes } from "./axios.js";

export const useTransactionsStore = create((set) => ({
    transactions: [],

    // Получение списка транзакций
    fetchTransactions: async () => {
        try {
            const response = await api.get(routes.transactions);
            set({ transactions: response.data });
        } catch (error) {
            console.error("Ошибка при загрузке транзакций:", error);
        }
    },

    // Добавление новой транзакции
    addTransaction: async (transactionData) => {
        try {
            const response = await api.post(routes.transactions, transactionData);
            set((state) => ({
                transactions: [...state.transactions, response.data]
            }));
        } catch (error) {
            console.error("Ошибка при добавлении транзакции:", error);
        }
    }
}));

export default useTransactionsStore;
