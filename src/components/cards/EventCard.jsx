import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown"; // Для отображения разметки Markdown

const EventCard = ({ event, user, isSubscribed, onSubscribe, onUnsubscribe, inFeed }) => {

    return (
        <div className="event-card items-center bg-white shadow-md rounded-lg p-6 border border-gray-200">
            {/* Баннер с изображением мероприятия */}
            {event.image && (
                <div className="event-banner mb-4 w-[20em] relative rounded-lg overflow-hidden">
                    <div className="relative" style={{ paddingTop: '75%' }}>
                        <img
                            src={event.image}
                            alt={event.name}
                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                        />
                    </div>
                </div>
            )}

            <div className="justify-center">
                {/* Название мероприятия */}
                <h3 className="text-xl font-semibold text-blue-600">
                    <Link to={`/event/${event.id}`} className="hover:text-blue-800">
                        {event.name}
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
                                src={event.organizer.avatar}
                                alt={event.organizer.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-3">
                                <p className="text-gray-600">{event.organizer.name}</p>
                                <p className="text-gray-500">{event.organizer.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Категории мероприятия */}
                    {event.categories.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-gray-700">Категории:</h4>
                            <ul className="list-disc pl-5 text-gray-600">
                                {event.categories.map((category, index) => (
                                    <li  key={index}>{category.category.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Спикеры */}
                    {event.speakers.length > 0 && (
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
                            onClick={() => onSubscribe(event.id)}>
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
            </div>
        </div>
    );
};

export default EventCard;
