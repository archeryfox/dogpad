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
    addTransaction: async (transactionData, user) => {
        try {
            // Проверим, если мероприятие и сумма правильные
            if (!transactionData.amount || !transactionData.userId || !transactionData.eventId) {
                console.error("Ошибка: Не все данные для транзакции предоставлены.");
                return;
            }

            // Отправка данных на сервер для создания транзакции
            const response = await api.post(routes.transactions, {
                amount: transactionData.amount, // Сумма из мероприятия
                userId: transactionData.userId, // ID текущего пользователя
                eventId: transactionData.eventId, // ID мероприятия
            });

            set((state) => ({
                transactions: [...state.transactions, response.data], // Обновляем список транзакций
            }));

            // После успешного создания транзакции, отнимаем сумму от баланса пользователя
            const updatedUserBalance = user.balance - transactionData.amount;

            // Обновим баланс пользователя через API или в store
            // Допустим, у вас есть метод для обновления баланса
            await api.put(`${routes.users}/${transactionData.userId}`, {
                balance: updatedUserBalance
            });

        } catch (error) {
            console.error("Ошибка при добавлении транзакции:", error);
        }
    }
}));

export default useTransactionsStore;
