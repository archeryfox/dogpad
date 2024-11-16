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
    const [filteredEvents, setFilteredEvents] = useState(events);  // Состояние для отфильтрованных мероприятий
    const [searchQuery, setSearchQuery] = useState('');  // Состояние для поискового запроса
    const [sortBy, setSortBy] = useState('date');  // Состояние для выбора параметра сортировки (по умолчанию по дате)

    // Загружаем мероприятия и подписки при монтировании компонента
    useEffect(() => {
        fetchEvents();
        fetchSubscriptions();
    }, []);

    // Обновляем отфильтрованные мероприятия при изменении списка событий, категории, поискового запроса или параметра сортировки
    useEffect(() => {
        let filtered = events;

        if (selectedCategory) {
            filtered = filtered.filter(event =>
                event.categories.some(cat => cat.category.id === selectedCategory)
            );
        }

        if (searchQuery) {
            filtered = filtered.filter(event =>
                event.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Сортировка мероприятий
        if (sortBy === 'date') {
            filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); // По убыванию (новые сначала)
        } else if (sortBy === 'name') {
            filtered = filtered.sort((a, b) => a.name.localeCompare(b.name)); // По алфавиту
        }

        setFilteredEvents(filtered);
    }, [events, selectedCategory, searchQuery, sortBy]);

    // Функция фильтрации мероприятий по категории
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    // Функция для обработки изменения поискового запроса
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Функция для обработки изменения параметра сортировки
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
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
        <div className="event-feed-container">
            <h2 className="text-3xl font-bold text-center">Лента мероприятий</h2>

            {/* Поле поиска */}
            <div className="search-container mt-4">
                <input
                    type="text"
                    placeholder="Поиск по названию"
                    className="p-2 border rounded w-full"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Компонент выбора категории */}
            <div className="sort-container mx-4 flex gap-x-4 items-center">
            <CategoryList onCategoryChange={handleCategoryChange} />

            {/* Выбор сортировки */}
                <label htmlFor="sort-by" className="mr-2">Сортировать по:</label>
                <select
                    id="sort-by"
                    className="p-2 border rounded"
                    value={sortBy}
                    onChange={handleSortChange}
                >
                    <option value="date">По дате</option>
                    <option value="name">По названию</option>
                </select>
            </div>

            <div className="event-list mt-3 space-y-6">
                {filteredEvents?.map((event) => {
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
