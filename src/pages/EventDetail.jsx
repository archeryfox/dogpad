// src/pages/EventDetail.jsx
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import useEventStore from '../stores/EventStore.js';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";
import {format} from 'date-fns';
import useAuthStore from "../stores/AuthStore.js";
import useSubscriptionStore from "../stores/SubscriptionStore.js";
import YandexMap from "../components/YandexMap.jsx"
import {YMaps} from "react-yandex-maps";
import {Box} from "@mui/material";


const EventDetail = ({onSubscribe, onUnsubscribe}) => {
    const {id} = useParams();  // Получаем ID события из параметров маршрута
    const {events, fetchEvents} = useEventStore();
    const [event, setEvent] = useState(null);
    const {user} = useAuthStore();  // Доступ к текущему пользователю
    const {subscriptions, fetchSubscriptions, addSubscription, deleteSubscription} = useSubscriptionStore();  // Для подписки на мероприятия
    const eventLocation = {
        latitude: 55.7558,  // Пример широты (Москва)
        longitude: 37.6176, // Пример долготы (Москва)
    };
    useEffect(() => {
        fetchEvents();
        // Ищем событие по ID
        const foundEvent = events.find((e) => e.id === parseInt(id));
        setEvent(foundEvent);
        fetchSubscriptions();
    }, [id]);

    // Функция для подписки на мероприятие
    const handleSubscribe = (eventId) => {
        if (!user) {
            alert("Пожалуйста, войдите в систему для подписки!");
            return;
        }
        addSubscription({eventId: eventId, userId: user.id});
    };
    const handleDeleteSubscription = (eventId) => {
        const subscriptionToDelete = subscriptions.find(sub => sub.eventId === eventId && sub.userId === user?.id);
        if (subscriptionToDelete) {
            deleteSubscription(subscriptionToDelete.id);
        }
    };


    // Обработчик для добавления переносов строк и отступов
    const formatDescription = (text) => {
        return text.replace(/\\n/g, '\n'); // Преобразуем символы `\n` в настоящие переносы строк
    };

    if (!event) {
        return <div>Событие не найдено</div>;
    }

    let isSubscribed = subscriptions.some(sub => sub.eventId === event.id && sub.userId === user?.id);
    return (
        <div className="event-detail-container mx-auto max-w-4xl p-6">
            {/* Баннер с изображением мероприятия */}
            {event.image && (
                <div className="event-banner mb-6 w-full h-[30em] relative rounded-lg overflow-hidden">
                    <div style={{paddingTop: '75%'}}>
                        <img
                            src={event.image}
                            alt={event.name}
                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                        />
                    </div>
                </div>
            )}

            {/* Название события */}
            <h2 className="text-4xl font-bold text-center mb-4">{event.name}</h2>

            {/* Дата и место */}
            <div className="flex justify-between text-gray-600 mb-4">
                <p className="text-lg">Дата: {format(new Date(event.date), 'dd.MM.yyyy HH:mm')}</p>
                <p className="text-lg">Место: {event?.venue?.name ?? "Онлайн"}</p>
            </div>

            {/* Описание мероприятия */}
            <div className="event-description text-gray-800 mb-6">
                <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                    {formatDescription(event.description)}
                </Markdown>
            </div>

            {/* Организатор */}
            <div className="organizer-info bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-2xl font-semibold">Организатор</h3>
                <div className="flex items-center mt-2">
                    <img src={event.organizer.avatar} alt={event.organizer.name}
                         className="w-12 h-12 rounded-full mr-4"/>
                    <div>
                        <p className="font-bold">{event.organizer.name}</p>
                        <p className="text-gray-600">{event.organizer.email}</p>
                    </div>
                </div>
            </div>

            {/* Категории */}
            {event.categories.length > 0 && (
                <div className="categories-info bg-gray-100 p-4 rounded-lg mb-6">
                    <h3 className="text-2xl font-semibold">Категории</h3>
                    <ul className="list-disc pl-5 mt-2">
                        {event.categories.map((category, index) => (
                            <li key={index} className="text-gray-700">{category.category.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Спикеры */}
            {event.speakers.length > 0 && (
                <div className="speakers-info bg-gray-100 p-4 rounded-lg mb-6">
                    <h3 className="text-2xl font-semibold">Спикеры</h3>
                    <ul className="list-disc pl-5 mt-2">
                        {event.speakers.map((speaker, index) => (
                            <li key={index} className="text-gray-700">{speaker.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Подписчики */}
            {event.subscriptions.length > 0 && (
                <div className="subscriptions-info bg-gray-100 p-4 rounded-lg mb-6">
                    <h3 className="text-2xl font-semibold">Подписчики</h3>
                    <ul className="list-disc pl-5 mt-2">
                        {event.subscriptions.map((subscription, index) => (
                            <li key={index} className="text-gray-700">Пользователь {subscription.userId} подписан</li>
                        ))}
                    </ul>
                </div>
            )}

            <YandexMap />
            {/* Кнопка подписки/отписки */}
            <div className="text-center">
                {}
                {/* Добавьте свою логику для кнопок подписки/отписки здесь */}
                {!isSubscribed ? (
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => handleSubscribe(event.id)}>
                        Подписаться
                    </button>
                ) : (
                    <button
                        onClick={() => handleDeleteSubscription(event.id)}
                        className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600">
                        Отписаться
                    </button>
                )}
            </div>
        </div>
    );
};

export default EventDetail;
