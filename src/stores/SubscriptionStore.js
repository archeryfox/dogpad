import { create } from 'zustand';
import { api, routes } from "./axios.js";
import useNotificationStore from './NotificationStore';
import useTransactionsStore from './TransactionStore.js';
import useAuthStore from './AuthStore';

const useSubscriptionStore = create((set, get) => ({
    subscriptions: [],

    // Добавление подписки на бесплатное мероприятие
    addSubscription: async (event) => {
        try {
            const response = await api.post(routes.subscriptions, event);
            set((state) => ({
                subscriptions: [...state.subscriptions, response.data]
            }));
            useNotificationStore.getState().showNotification("Вы успешно подписались на мероприятие!", "success");
        } catch (error) {
            console.error("Ошибка при подписке:", error);
            useNotificationStore.getState().showNotification("Ошибка при подписке на мероприятие", "error");
        }
    },

    // Добавление подписки на платное мероприятие с созданием транзакции
    addPaidSubscription: async (eventId, userId, eventPrice) => {
        try {
            console.log("Начинаем подписку на платное мероприятие:", { eventId, userId, eventPrice });
            
            // Проверяем баланс пользователя
            const { user } = useAuthStore.getState();
            
            if (!user) {
                console.error("Пользователь не найден");
                useNotificationStore.getState().showNotification("Пользователь не найден", "error");
                return false;
            }
            
            console.log("Пользователь:", user);
            console.log("Тип баланса пользователя:", typeof user.balance);
            console.log("Баланс пользователя:", user.balance, "Цена мероприятия:", eventPrice);
            
            if (user.balance < eventPrice) {
                console.error("Недостаточно средств на балансе");
                useNotificationStore.getState().showNotification("Недостаточно средств на балансе", "error");
                return false;
            }
            
            // Создаем транзакцию и обновляем баланс
            const transactionData = {
                amount: eventPrice,
                userId: userId,
                eventId: eventId
            };
            
            console.log("Создаем транзакцию:", transactionData);
            
            // Получаем экземпляр TransactionStore
            const transactionStore = useTransactionsStore.getState();
            
            if (!transactionStore || !transactionStore.createPayment) {
                console.error("Метод createPayment не найден в TransactionStore");
                useNotificationStore.getState().showNotification("Ошибка при создании платежа", "error");
                return false;
            }
            
            // Используем метод для создания платежа
            const result = await transactionStore.createPayment(transactionData);
            console.log("Результат создания платежа:", result);
            
            if (result) {
                // Транзакция успешно создана, теперь создаем подписку
                try {
                    // Создаем объект подписки
                    const subscriptionData = {
                        eventId: eventId,
                        userId: userId
                    };
                    
                    console.log("Создаем подписку:", subscriptionData);
                    
                    // Отправляем запрос на создание подписки
                    const subscriptionResponse = await api.post(routes.subscriptions, subscriptionData);
                    console.log("Результат создания подписки:", subscriptionResponse.data);
                    
                    // Добавляем подписку в локальное состояние
                    set((state) => ({
                        subscriptions: [...state.subscriptions, subscriptionResponse.data]
                    }));
                    
                    // Обновляем список подписок для уверенности
                    await get().fetchSubscriptions();
                    
                    useNotificationStore.getState().showNotification("Вы успешно подписались на мероприятие!", "success");
                    return true;
                } catch (subscriptionError) {
                    console.error("Ошибка при создании подписки после платежа:", subscriptionError);
                    useNotificationStore.getState().showNotification(
                        "Платеж прошел успешно, но возникла ошибка при подписке. Пожалуйста, обратитесь в поддержку.", 
                        "warning"
                    );
                    return false;
                }
            }
            
            return false;
        } catch (error) {
            console.error("Ошибка при подписке на платное мероприятие:", error);
            useNotificationStore.getState().showNotification(
                error.response?.data?.error || "Ошибка при подписке на мероприятие", 
                "error"
            );
            return false;
        }
    },

    // Получение списка подписок
    fetchSubscriptions: async () => {
        try {
            const response = await api.get(routes.subscriptions);
            set({ subscriptions: response.data });
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            useNotificationStore.getState().showNotification("Ошибка при загрузке подписок", "error");
        }
    },

    // Удаление подписки по ID
    deleteSubscription: async (id) => {
        try {
            await api.delete(`${routes.subscriptions}/${id}`);
            set((state) => ({
                subscriptions: state.subscriptions.filter(subscription => subscription.id !== id)
            }));
            useNotificationStore.getState().showNotification("Подписка успешно удалена", "info");
        } catch (error) {
            console.error("Error deleting subscription:", error);
            useNotificationStore.getState().showNotification("Ошибка при удалении подписки", "error");
        }
    }
}));

export default useSubscriptionStore;
