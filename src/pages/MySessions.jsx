import React, { useEffect, useState } from "react";
import { api } from "../stores/axios.js";
import EventCard from "../components/cards/EventCard.jsx";
 // Импортируем компонент EventCard

const MySessions = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]); // Состояние для подписок

    // Получение данных о событиях, привязанных к текущему спикеру
    const fetchSpeakerEvents = async () => {
        try {
            const response = await api.get("/speakers"); // Здесь замените на правильный путь к API
            const speakerData = response.data;

            // Извлекаем события из данных спикера
            const eventsList = speakerData.map(speaker => speaker.events).flat();
            setEvents(eventsList); // Устанавливаем список событий
        } catch (err) {
            setError("Не удалось загрузить события");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = (eventId) => {
        // Логика для подписки на мероприятие
        setSubscriptions((prevSubscriptions) => [...prevSubscriptions, eventId]);
    };

    const handleUnsubscribe = (eventId) => {
        // Логика для отписки от мероприятия
        setSubscriptions((prevSubscriptions) => prevSubscriptions.filter(id => id !== eventId));
    };

    useEffect(() => {
        fetchSpeakerEvents();
    }, []); // Пустой массив, чтобы запрос выполнялся один раз при монтировании

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="my-sessions">
            <h2>Мои Сессии</h2>
            <div className="events-list pt-5">
                {events.length > 0 ? (
                    events.map((eventData) => {
                        const isSubscribed = subscriptions.includes(eventData.event.id);
                        return (
                            <EventCard
                                key={eventData.event.id}
                                event={eventData.event}
                                inSession={true}
                                user={user} // Передаем информацию о пользователе
                                isSubscribed={isSubscribed}
                                onSubscribe={handleSubscribe}
                                onUnsubscribe={handleUnsubscribe}
                                inProfileFeed={false} // Можно сделать этот пропс на основе контекста
                            />
                        );
                    })
                ) : (
                    <p>У вас нет привязанных событий.</p>
                )}
            </div>
        </div>
    );
};

export default MySessions;
