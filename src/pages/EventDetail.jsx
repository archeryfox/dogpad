import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import useEventStore from '../stores/EventStore.js';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";
import {format} from 'date-fns';
import useAuthStore from "../stores/AuthStore.js";
import useSubscriptionStore from "../stores/SubscriptionStore.js";
import useVenueStore from "../stores/VenueStore.js";
import YandexMap from "../components/YandexMap.jsx"
import axios from "axios";
import useTransactionsStore from "../stores/TransactionStore.js";
import Modal from "../components/Modal.jsx";
import { motion } from "framer-motion";

import { Link } from 'react-router-dom'; // Импортируем Link для навигации

const EventDetail = ({onSubscribe, onUnsubscribe}) => {
    const {id} = useParams();  // Получаем ID события из параметров маршрута
    const {events, fetchEvents} = useEventStore();
    const [event, setEvent] = useState(null);
    const {venues, fetchVenues} = useVenueStore()
    const { addTransaction, createPayment } = useTransactionsStore(); // Для добавления транзакций и получения метода createPayment
    const {user, updateUserBalance } = useAuthStore();  // Доступ к текущему пользователю
    const {subscriptions, fetchSubscriptions, addSubscription, deleteSubscription} = useSubscriptionStore();  // Для подписки на мероприятия
    const [eventLocation, setEventLocation] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Состояния для модальных окон
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info'
    });

    const getGeoPos = async () => {
        if (event) {
            try {
                const data = axios.get(
                    `https://geocode-maps.yandex.ru/1.x/?apikey=7e3a7d16-eafb-487d-89fa-c51c36723612&format=json&geocode=${encodeURIComponent(event.venue.address)}`
                )
                    .then(response => {
                            console.log(response.data.response)
                            return response.data.response;
                        }
                    ).then((data) => {
                        const pos = data.GeoObjectCollection?.featureMember[0]?.GeoObject.Point.pos;
                        if (pos) {
                            const coordinates = pos.split(' ').map(Number).reverse();
                            setEventLocation(coordinates);
                            console.log(coordinates)
                        } else {
                            console.error('Не удалось получить координаты из ответа:', data);
                        }
                    })
                    .catch(e =>
                        console.log(e)
                    );
            } catch (error) {
                console.error('Ошибка при получении подсказок:', error);
            }
        } else {
            setEventLocation([]);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchVenues();
        fetchSubscriptions();
    }, []);

    useEffect(() => {
        if (events.length > 0 && subscriptions.length > 0) {
            const foundEvent = events.find((e) => e.id === parseInt(id));
            setEvent(foundEvent);
            setIsLoading(false);
        }
    }, [events, subscriptions, id]);

    useEffect(() => {
        if (event && event.venue?.address) {
            getGeoPos(); // Вызов только если событие и адрес существуют
        }
    }, [event]); // Добавляем event как зависимость

    // Функция для показа модального окна
    const showModal = (title, message, type = 'info') => {
        setModalConfig({ title, message, type });
        setModalOpen(true);
    };

    const handleSubscribe = async () => {
        if (!user) {
            showModal('Требуется авторизация', 'Пожалуйста, войдите в систему для подписки!', 'warning');
            return;
        }

        // Создаем данные для транзакции
        const transactionData = {
            amount: event.price, // Сумма, указанная в мероприятии
            userId: user.id,
            eventId: event.id,
        };

        try {
            // Используем новый метод для создания платежа, который обрабатывает все операции на бэкенде
            const result = await createPayment(transactionData);
            
            if (result) {
                console.log("Результат создания платежа:", result);
                
                // Проверяем структуру ответа и обновляем баланс пользователя
                if (result.user && result.user.balance) {
                    // Если в ответе есть информация о пользователе с балансом
                    await updateUserBalance(result.user.balance, user.id);
                } else {
                    // Если в ответе нет информации о пользователе, обновляем баланс вручную
                    const newBalance = user.balance - event.price;
                    await updateUserBalance(newBalance, user.id);
                }
                
                // Обновляем список подписок
                await fetchSubscriptions();
                
                // Показываем сообщение об успехе
                showModal('Успешная подписка', 'Вы успешно подписались на мероприятие!', 'success');
            }
        } catch (error) {
            // Ошибка уже обрабатывается в TransactionStore, здесь просто перехватываем исключение
            console.error("Ошибка при подписке:", error);
        }
    };

    const handleDeleteSubscription = async (eventId) => {
        const subscriptionToDelete = subscriptions.find(sub => sub.eventId === eventId && sub.userId === user?.id);
        if (subscriptionToDelete) {
            try {
                await deleteSubscription(subscriptionToDelete.id);
                showModal('Отписка', 'Вы успешно отписались от мероприятия.', 'info');
            } catch (error) {
                showModal('Ошибка', 'Произошла ошибка при отписке от мероприятия.', 'error');
            }
        }
    };

    // Обработчик для добавления переносов строк и отступов
    const formatDescription = (text) => {
        return text.replace(/\\n/g, '\n'); // Преобразуем символы `\n` в настоящие переносы строк
    };

    if (isLoading) {
        return <div>Загрузка...</div>;  // Здесь можно поставить индикатор загрузки
    }

    if (!event) {
        return <div>Событие не найдено</div>;
    }

    let isSubscribed = subscriptions.some(sub => sub.eventId === event.id && sub.userId === user?.id);

    return (
        <div className="event-detail-container mx-auto max-w-4xl p-6">
            {/* Модальное окно */}
            <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                title={modalConfig.title} 
                message={modalConfig.message} 
                type={modalConfig.type} 
            />

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
                <p className="text-lg">Место: {event?.venue?.address ?? "Онлайн"}</p>
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

            {/* Кнопка редактирования для организатора */}
            {event.organizer.id === user.id && (
                <div className="text-center mb-6">
                    <Link to={`/update-event/${event.id}`} className="text-blue-500 hover:text-blue-700">
                        <span className="inline-block p-2 border rounded-full">
                            🖊️ Редактировать
                        </span>
                    </Link>
                </div>
            )}

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
                            <li key={index} className="text-gray-700">{speaker.speaker.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Подписчики */}
            {event.subscriptions.length > 0 && (
                <div className="subscriptions-info bg-gray-100 p-4 rounded-lg mb-6">
                    <h3 className="text-2xl font-semibold">Подписчики {event.subscriptions.length}</h3>
                </div>
            )}
            {!event.subscriptions.length  && (
                <div className="subscriptions-info bg-gray-100 p-4 rounded-lg mb-6">
                    <h3 className="text-2xl font-semibold">Пока никто не записался</h3>
                </div>
            )}

            {event.venue && eventLocation &&
                <YandexMap initialCoordinates={eventLocation}/>
            }

            {/* Цена подписки */}
            {event.price > 0 && (
                <div className="text-center mb-4">
                    <span className="text-lg text-red-600">Цена подписки: {event.price} ₽</span>
                </div>
            )}

            {/* Кнопки подписки/отписки */}
            {user && !isSubscribed && event.price > 0 && (
                <div className="text-center">
                    <motion.button 
                        onClick={handleSubscribe} 
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Подписаться на мероприятие
                    </motion.button>
                </div>
            )}

            {user && isSubscribed && event.price > 0 && (
                <div className="text-center">
                    <motion.button 
                        onClick={() => handleDeleteSubscription(event.id)} 
                        className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Отписаться от мероприятия
                    </motion.button>
                </div>
            )}

            {!user && (
                <div className="text-center mb-4">
                    <motion.button 
                        onClick={handleSubscribe} 
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Войдите, чтобы подписаться
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default EventDetail;
