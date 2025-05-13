import { create } from 'zustand';
import { api, routes } from "./axios.js";
import useNotificationStore from './NotificationStore.js';
import useAuthStore from './AuthStore.js'; // Добавлено импортирование AuthStore

/**
 * Хранилище для управления транзакциями
 *
 * API эндпоинты для транзакций:
 * - GET /transactions - получить все транзакции
 * - GET /transactions/:id - получить транзакцию по ID
 * - POST /transactions - создать новую транзакцию (используется для создания платежей)
 * - PUT /transactions/:id - обновить транзакцию
 * - DELETE /transactions/:id - удалить транзакцию
 */
const useTransactionsStore = create((set) => ({
    transactions: [],

    // Получение списка транзакций
    fetchTransactions: async () => {
        try {
            const response = await api.get(routes.transactions);
            set({ transactions: response.data });
        } catch (error) {
            console.error("Ошибка при загрузке транзакций:", error);
            useNotificationStore.getState().showNotification('Не удалось загрузить транзакции', 'error');
        }
    },

    // Добавление новой транзакции (старый метод)
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
            useNotificationStore.getState().showNotification('Не удалось создать транзакцию', 'error');
            throw error;
        }
    },

    /**
     * Создание транзакции и обновление баланса в одной операции
     * Использует эндпоинт POST /transactions/
     *
     * @param {Object} transactionData - данные для создания транзакции
     * @param {number} transactionData.amount - сумма транзакции
     * @param {string} transactionData.userId - ID пользователя
     * @param {string} transactionData.eventId - ID мероприятия
     * @returns {Promise<Object>} - результат операции, содержащий созданную транзакцию и обновленного пользователя
     */
    createPayment: async (transactionData) => {
        try {
            console.log("TransactionStore.createPayment вызван с данными:", transactionData);

            // Проверим, если мероприятие и сумма правильные
            if (!transactionData.amount || !transactionData.userId || !transactionData.eventId) {
                console.error("Ошибка: Не все данные для транзакции предоставлены.");
                useNotificationStore.getState().showNotification('Не все данные для транзакции предоставлены', 'error');
                return null;
            }

            // Отправка данных на сервер для создания транзакции, обновления баланса и создания подписки
            // Используем стандартный эндпоинт /transactions/ для создания транзакции
            console.log("Отправляем запрос на создание платежа:", `${routes.transactions}`, transactionData);
            const response = await api.post(`${routes.transactions}/`, transactionData);
            console.log("Ответ от сервера:", response.data);
            console.log("Структура ответа:", JSON.stringify(response.data));

            // Обновляем список транзакций
            if (response.data) {
                set((state) => ({
                    transactions: [...state.transactions, response.data],
                }));
            }

            // Обновляем баланс пользователя в AuthStore, используя UserStore для обновления данных на сервере
            const authStore = useAuthStore.getState();
            const { user } = authStore;
            
            if (user && user.balance !== undefined) {
                const newBalance = user.balance - transactionData.amount;
                console.log("Обновляем баланс пользователя:", user.balance, "->", newBalance);
                await authStore.updateUserBalance(newBalance, transactionData.userId);
            } else {
                console.error("Не удалось обновить баланс: пользователь или его баланс не найден");
            }

            return response.data;
        } catch (error) {
            console.error("Ошибка при создании платежа:", error);

            // Показываем соответствующее сообщение об ошибке
            if (error.response) {
                const errorMessage = error.response.data.error || 'Не удалось создать платеж';
                useNotificationStore.getState().showNotification(errorMessage, 'error');
            } else {
                useNotificationStore.getState().showNotification('Не удалось создать платеж', 'error');
            }

            throw error;
        }
    }
}));

export default useTransactionsStore;
