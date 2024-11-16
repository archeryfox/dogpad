import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import rehypeRaw from "rehype-raw";
import { useState } from 'react'; // Для работы с состоянием

const EventCard = ({ event, user, isSubscribed, onSubscribe, onUnsubscribe, inProfileFeed }) => {
    // Состояние для модального окна согласия
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false); // Состояние для подтверждения

    // Функция для открытия модального окна
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Функция для закрытия модального окна
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Функция для подтверждения подписки на платное мероприятие
    const handleSubscribe = () => {
        onSubscribe(event.id); // Подписка на событие
        closeModal(); // Закрыть модальное окно
    };

    return (
        <div className="event-card items-center bg-white shadow-md rounded-lg p-4 border border-gray-200">
            {/* Баннер с изображением мероприятия */}
            {event.image && (
                <div className="event-banner mb-4 w-[20em] relative rounded-lg overflow-hidden">
                    {!inProfileFeed &&
                        <div className="relative" style={{ paddingTop: '75%' }}>
                            <img
                                src={event?.image}
                                alt={event?.name}
                                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    }
                </div>
            )}

            <div className="justify-center">
                {/* Название мероприятия */}
                <h3 className="text-xl font-semibold text-blue-600">
                    <Link to={`/event/${event.id}`} className="hover:text-blue-800">
                        {event?.name}
                    </Link>
                </h3>
                {/* Дата и место */}
                <p className="text-gray-600">Дата: {format(new Date(event.date), 'dd.MM.yyyy HH:mm')}</p>
                <p className="text-gray-600">Место: {event?.venue?.name ?? "Онлайн"}</p>

                {/* Дополнительная информация о мероприятии */}
                <div className="mt-4">
                    {event.isPaid && event.price && (
                        <p className="text-gray-800">Стоимость: {event.price}₽</p>
                    )}
                    {!event.isPaid && <p className="text-gray-800">Бесплатное мероприятие</p>}

                    {/* Организатор мероприятия */}
                    <div className="mt-4">
                        <h4 className="font-semibold text-gray-700">Организатор:</h4>
                        <div className="flex items-center mt-2">
                            <img
                                src={event.organizer?.avatar}
                                alt={event.organizer?.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-3">
                                <p className="text-gray-600">{event.organizer?.name}</p>
                                <p className="text-gray-500">{event.organizer?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Категории мероприятия */}
                    {event.categories?.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-gray-700">Категории:</h4>
                            <ul className="list-disc pl-5 text-gray-600">
                                {event.categories.map((category, index) => (
                                    <li key={index}>{category.category.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Спикеры */}
                    {event.speakers?.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-gray-700">Спикеры:</h4>
                            <ul className="list-disc pl-5 text-gray-600">
                                {event.speakers.map((speaker, index) => (
                                    <li key={index}>{speaker.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Кнопка подписки или отписки */}
                <div className="mt-4">
                    {!isSubscribed ? (
                        <button
                            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={event.isPaid ? openModal : () => onSubscribe(event.id)}>
                            Подписаться
                        </button>
                    ) : (
                        <button
                            onClick={() => onUnsubscribe(event.id)}
                            className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600">
                            Отписаться
                        </button>
                    )}
                </div>

                {/* Модальное окно согласия */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h3 className="text-xl font-semibold mb-4">Подтвердите оплату</h3>
                            <p className="text-gray-600">Это платное мероприятие. Вы подтверждаете, что хотите подписаться и оплатить участие?</p>
                            <div className="mt-4 flex justify-between">
                                <button
                                    className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                    onClick={closeModal}>
                                    Отменить
                                </button>
                                <button
                                    className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={handleSubscribe}>
                                    Подтвердить
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;
