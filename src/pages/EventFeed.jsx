// src/pages/EventFeed.jsx
import { useEffect, useState } from 'react';
import useEventStore from '../stores/EventStore';
import useSubscriptionStore from '../stores/SubscriptionStore';
import EventCard from '../components/cards/EventCard.jsx';
import useAuthStore from '../stores/AuthStore';
import CategoryList from '../components/CategoryList'; // Импорт компонента выбора категорий

const EventFeed = () => {
    const { events, fetchEvents, fetchEventsByCategory } = useEventStore();  // Доступ к мероприятиям и функциям
    const { user } = useAuthStore();  // Доступ к текущему пользователю
    const { subscriptions, fetchSubscriptions, addSubscription, deleteSubscription } = useSubscriptionStore();  // Подписки на мероприятия
    const [selectedCategory, setSelectedCategory] = useState(null);  // Состояние выбранной категории

    // Загружаем мероприятия и подписки при монтировании компонента
    useEffect(() => {
        fetchEvents();
        fetchSubscriptions();
    }, []);

    // Функция фильтрации мероприятий по категории
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId) {
            fetchEventsByCategory(categoryId);
        } else {
            fetchEvents();
        }
    };

    // Функция для подписки на мероприятие
    const handleSubscribe = (eventId) => {
        if (!user) {
            alert("Пожалуйста, войдите в систему для подписки!");
            return;
        }
        addSubscription({ eventId: eventId, userId: user.id });
    };
    const handleDeleteSubscription = (eventId) => {
        const subscriptionToDelete = subscriptions.find(sub => sub.eventId === eventId && sub.userId === user?.id);
        if (subscriptionToDelete) {
            deleteSubscription(subscriptionToDelete.id);
        }
    };

    return (
        <div className="event-feed-container ">
            <h2 className="text-3xl font-bold text-center">Лента мероприятий</h2>

            {/* Компонент выбора категории */}
            <CategoryList onCategoryChange={handleCategoryChange} />

            <div className="event-list mt-8 space-y-6">
                {events?.map((event) => {
                    const isSubscribed = subscriptions.some(sub => sub.eventId === event.id && sub.userId === user?.id);
                    return (
                        <EventCard
                            key={event.id}
                            event={event}
                            user={user}
                            isSubscribed={isSubscribed}
                            onSubscribe={handleSubscribe}
                            onUnsubscribe={handleDeleteSubscription}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default EventFeed;
